param(
    [Parameter(Mandatory = $true)][string]$TenantId,
    [Parameter(Mandatory = $true)][string]$ClientId,
    [Parameter(Mandatory = $true)][string]$ClientSecret,
    [Parameter(Mandatory = $true)][string]$DataverseUrl,
    [string]$ChoicesConfigPath = "./schema/dataverse-choices.json",
    [string]$AlternateKeysConfigPath = "./schema/dataverse-alternate-keys.json"
)

$ErrorActionPreference = "Stop"

function Get-AccessToken {
    param(
        [string]$TenantId,
        [string]$ClientId,
        [string]$ClientSecret,
        [string]$DataverseUrl
    )

    $tokenEndpoint = "https://login.microsoftonline.com/$TenantId/oauth2/v2.0/token"
    $body = @{
        client_id     = $ClientId
        client_secret = $ClientSecret
        scope         = "$DataverseUrl/.default"
        grant_type    = "client_credentials"
    }

    $response = Invoke-RestMethod -Method Post -Uri $tokenEndpoint -Body $body -ContentType "application/x-www-form-urlencoded"
    return $response.access_token
}

function Get-Headers {
    param([string]$AccessToken)
    return @{
        Authorization     = "Bearer $AccessToken"
        "Content-Type"    = "application/json"
        Accept            = "application/json"
        "OData-MaxVersion" = "4.0"
        "OData-Version"    = "4.0"
    }
}

function New-GlobalChoice {
    param(
        [string]$DataverseUrl,
        [hashtable]$Headers,
        [object]$Choice
    )

    $uri = "$DataverseUrl/api/data/v9.2/GlobalOptionSetDefinitions"

    $options = @()
    foreach ($option in $Choice.options) {
        $options += @{
            Value = [int]$option.value
            Label = @{
                LocalizedLabels = @(
                    @{
                        Label = $option.label
                        LanguageCode = 1033
                    }
                )
            }
        }
    }

    $payload = @{
        "@odata.type" = "Microsoft.Dynamics.CRM.OptionSetMetadata"
        Name = $Choice.schemaName
        DisplayName = @{
            LocalizedLabels = @(
                @{
                    Label = $Choice.displayName
                    LanguageCode = 1033
                }
            )
        }
        Description = @{
            LocalizedLabels = @(
                @{
                    Label = $Choice.description
                    LanguageCode = 1033
                }
            )
        }
        OptionSetType = "Picklist"
        Options = $options
        IsGlobal = $true
    } | ConvertTo-Json -Depth 10

    try {
        Invoke-RestMethod -Method Post -Uri $uri -Headers $Headers -Body $payload | Out-Null
        Write-Host "Created global choice: $($Choice.schemaName)" -ForegroundColor Green
    }
    catch {
        if ($_.Exception.Message -match "already exists|duplicate|0x8004700D") {
            Write-Host "Global choice already exists: $($Choice.schemaName)" -ForegroundColor Yellow
        }
        else {
            throw
        }
    }
}

function New-AlternateKey {
    param(
        [string]$DataverseUrl,
        [hashtable]$Headers,
        [object]$AlternateKey
    )

    $uri = "$DataverseUrl/api/data/v9.2/EntityDefinitions(LogicalName='$($AlternateKey.tableLogicalName)')/Keys"

    $payload = @{
        KeyAttributes = $AlternateKey.keyAttributes
        SchemaName = $AlternateKey.schemaName
        DisplayName = @{
            LocalizedLabels = @(
                @{
                    Label = $AlternateKey.displayName
                    LanguageCode = 1033
                }
            )
        }
    } | ConvertTo-Json -Depth 10

    try {
        Invoke-RestMethod -Method Post -Uri $uri -Headers $Headers -Body $payload | Out-Null
        Write-Host "Created alternate key: $($AlternateKey.schemaName) on $($AlternateKey.tableLogicalName)" -ForegroundColor Green
    }
    catch {
        if ($_.Exception.Message -match "already exists|duplicate|0x8004700D") {
            Write-Host "Alternate key already exists: $($AlternateKey.schemaName)" -ForegroundColor Yellow
        }
        else {
            throw
        }
    }
}

$choicesConfig = Get-Content $ChoicesConfigPath -Raw | ConvertFrom-Json
$alternateKeysConfig = Get-Content $AlternateKeysConfigPath -Raw | ConvertFrom-Json
$accessToken = Get-AccessToken -TenantId $TenantId -ClientId $ClientId -ClientSecret $ClientSecret -DataverseUrl $DataverseUrl
$headers = Get-Headers -AccessToken $accessToken

foreach ($choice in $choicesConfig.globalChoices) {
    New-GlobalChoice -DataverseUrl $DataverseUrl -Headers $headers -Choice $choice
}

foreach ($alternateKey in $alternateKeysConfig.alternateKeys) {
    New-AlternateKey -DataverseUrl $DataverseUrl -Headers $headers -AlternateKey $alternateKey
}

Write-Host "Dataverse alternate key and global choice deployment completed." -ForegroundColor Cyan
