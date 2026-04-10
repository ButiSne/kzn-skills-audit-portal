param(
    [Parameter(Mandatory = $true)][string]$TenantId,
    [Parameter(Mandatory = $true)][string]$ClientId,
    [Parameter(Mandatory = $true)][string]$ClientSecret,
    [Parameter(Mandatory = $true)][string]$DataverseUrl,
    [string]$SchemaFile = "./schema/dataverse-schema.json"
)

$ErrorActionPreference = 'Stop'

function Get-AccessToken {
    param(
        [string]$TenantId,
        [string]$ClientId,
        [string]$ClientSecret,
        [string]$DataverseUrl
    )

    $tokenResponse = Invoke-RestMethod -Method Post `
        -Uri "https://login.microsoftonline.com/$TenantId/oauth2/v2.0/token" `
        -ContentType "application/x-www-form-urlencoded" `
        -Body @{
            client_id     = $ClientId
            client_secret = $ClientSecret
            scope         = "$DataverseUrl/.default"
            grant_type    = 'client_credentials'
        }

    return $tokenResponse.access_token
}

function New-DisplayLabel {
    param([string]$Label)
    return @{ LocalizedLabels = @(@{ Label = $Label; LanguageCode = 1033 }) }
}

function Invoke-Dataverse {
    param(
        [string]$Method,
        [string]$Path,
        $Body,
        [hashtable]$Headers
    )

    $uri = "$DataverseUrl/api/data/v9.2/$Path"
    if ($null -ne $Body) {
        return Invoke-RestMethod -Method $Method -Uri $uri -Headers $Headers -Body ($Body | ConvertTo-Json -Depth 20) -ContentType 'application/json'
    }

    return Invoke-RestMethod -Method $Method -Uri $uri -Headers $Headers
}

function Get-ExistingTable {
    param([string]$LogicalName, [hashtable]$Headers)
    try {
        return Invoke-Dataverse -Method Get -Path "EntityDefinitions(LogicalName='$LogicalName')?`$select=LogicalName,MetadataId" -Headers $Headers
    }
    catch {
        return $null
    }
}

function New-TablePayload {
    param($Table)

    $payload = @{
        '@odata.type'             = 'Microsoft.Dynamics.CRM.EntityMetadata'
        SchemaName                = $Table.schemaName
        LogicalName               = $Table.logicalName
        DisplayName               = (New-DisplayLabel -Label $Table.displayName)
        DisplayCollectionName     = (New-DisplayLabel -Label $Table.pluralName)
        Description               = (New-DisplayLabel -Label "Provisioned for the KZN Skills Audit solution")
        OwnershipType             = 'UserOwned'
        HasActivities             = $false
        HasNotes                  = $false
        IsActivity                = $false
        Attributes                = @(
            @{
                '@odata.type'  = 'Microsoft.Dynamics.CRM.StringAttributeMetadata'
                SchemaName     = "$($Table.schemaName)Name"
                LogicalName    = "$($Table.logicalName)name"
                DisplayName    = (New-DisplayLabel -Label $Table.primaryName)
                RequiredLevel  = @{ Value = 'ApplicationRequired' }
                MaxLength      = 200
                FormatName     = @{ Value = 'Text' }
                IsPrimaryName  = $true
            }
        )
    }

    return $payload
}

function New-ColumnPayload {
    param($Column)

    switch ($Column.type) {
        'String' {
            return @{
                '@odata.type' = 'Microsoft.Dynamics.CRM.StringAttributeMetadata'
                SchemaName    = $Column.schemaName
                LogicalName   = $Column.logicalName
                DisplayName   = (New-DisplayLabel -Label $Column.displayName)
                RequiredLevel = @{ Value = 'None' }
                MaxLength     = $Column.maxLength
                FormatName    = @{ Value = 'Text' }
            }
        }
        'Memo' {
            return @{
                '@odata.type' = 'Microsoft.Dynamics.CRM.MemoAttributeMetadata'
                SchemaName    = $Column.schemaName
                LogicalName   = $Column.logicalName
                DisplayName   = (New-DisplayLabel -Label $Column.displayName)
                RequiredLevel = @{ Value = 'None' }
                MaxLength     = $Column.maxLength
                Format        = 'TextArea'
            }
        }
        'Integer' {
            return @{
                '@odata.type' = 'Microsoft.Dynamics.CRM.IntegerAttributeMetadata'
                SchemaName    = $Column.schemaName
                LogicalName   = $Column.logicalName
                DisplayName   = (New-DisplayLabel -Label $Column.displayName)
                RequiredLevel = @{ Value = 'None' }
                MinValue      = 0
                MaxValue      = 999999
            }
        }
        'DateTime' {
            return @{
                '@odata.type' = 'Microsoft.Dynamics.CRM.DateTimeAttributeMetadata'
                SchemaName    = $Column.schemaName
                LogicalName   = $Column.logicalName
                DisplayName   = (New-DisplayLabel -Label $Column.displayName)
                RequiredLevel = @{ Value = 'None' }
                Format        = 'DateAndTime'
                ImeMode       = 'Auto'
            }
        }
        'Boolean' {
            return @{
                '@odata.type' = 'Microsoft.Dynamics.CRM.BooleanAttributeMetadata'
                SchemaName    = $Column.schemaName
                LogicalName   = $Column.logicalName
                DisplayName   = (New-DisplayLabel -Label $Column.displayName)
                RequiredLevel = @{ Value = 'None' }
                OptionSet     = @{
                    TrueOption  = @{ Value = 1; Label = (New-DisplayLabel -Label 'Yes') }
                    FalseOption = @{ Value = 0; Label = (New-DisplayLabel -Label 'No') }
                }
            }
        }
        default {
            throw "Unsupported column type: $($Column.type)"
        }
    }
}

$schema = Get-Content $SchemaFile -Raw | ConvertFrom-Json
$token = Get-AccessToken -TenantId $TenantId -ClientId $ClientId -ClientSecret $ClientSecret -DataverseUrl $DataverseUrl
$headers = @{
    Authorization     = "Bearer $token"
    Accept            = 'application/json'
    'OData-Version'   = '4.0'
    'OData-MaxVersion'= '4.0'
    Prefer            = 'return=representation'
}

foreach ($table in $schema.tables) {
    Write-Host "Checking table $($table.logicalName)..."
    $existing = Get-ExistingTable -LogicalName $table.logicalName -Headers $headers

    if (-not $existing) {
        Write-Host "Creating table $($table.logicalName)..."
        $tablePayload = New-TablePayload -Table $table
        Invoke-Dataverse -Method Post -Path 'EntityDefinitions' -Body $tablePayload -Headers $headers | Out-Null
        Start-Sleep -Seconds 3
    }
    else {
        Write-Host "Table already exists: $($table.logicalName)"
    }

    foreach ($column in $table.columns) {
        Write-Host "Ensuring column $($column.logicalName) on $($table.logicalName)..."
        try {
            Invoke-Dataverse -Method Get -Path "EntityDefinitions(LogicalName='$($table.logicalName)')/Attributes(LogicalName='$($column.logicalName)')?`$select=LogicalName" -Headers $headers | Out-Null
            Write-Host "Column exists: $($column.logicalName)"
        }
        catch {
            $columnPayload = New-ColumnPayload -Column $column
            Invoke-Dataverse -Method Post -Path "EntityDefinitions(LogicalName='$($table.logicalName)')/Attributes" -Body $columnPayload -Headers $headers | Out-Null
            Write-Host "Created column: $($column.logicalName)"
        }
    }
}

Write-Host 'Dataverse schema deployment completed.'
