param(
  [Parameter(Mandatory = $true)][string]$TenantId,
  [Parameter(Mandatory = $true)][string]$ClientId,
  [Parameter(Mandatory = $true)][string]$ClientSecret,
  [Parameter(Mandatory = $true)][string]$DataverseUrl,
  [string]$ConfigPath = "./schema/dataverse-relationships.json"
)

$ErrorActionPreference = "Stop"

function Get-AccessToken {
  param(
    [string]$TenantId,
    [string]$ClientId,
    [string]$ClientSecret,
    [string]$ResourceUrl
  )

  $tokenEndpoint = "https://login.microsoftonline.com/$TenantId/oauth2/v2.0/token"
  $body = @{
    client_id     = $ClientId
    client_secret = $ClientSecret
    scope         = "$ResourceUrl/.default"
    grant_type    = "client_credentials"
  }

  $response = Invoke-RestMethod -Method Post -Uri $tokenEndpoint -Body $body -ContentType "application/x-www-form-urlencoded"
  return $response.access_token
}

function New-Headers {
  param([string]$AccessToken)

  return @{
    Authorization     = "Bearer $AccessToken"
    "Content-Type"    = "application/json; charset=utf-8"
    Accept            = "application/json"
    "OData-MaxVersion" = "4.0"
    "OData-Version"    = "4.0"
  }
}

function Get-TableMetadataId {
  param(
    [string]$BaseUrl,
    [hashtable]$Headers,
    [string]$LogicalName
  )

  $uri = "$BaseUrl/api/data/v9.2/EntityDefinitions(LogicalName='$LogicalName')?4select=MetadataId,LogicalName"
  $response = Invoke-RestMethod -Method Get -Uri $uri -Headers $Headers
  return $response.MetadataId
}

function New-LookupRelationship {
  param(
    [string]$BaseUrl,
    [hashtable]$Headers,
    [string]$ReferencedMetadataId,
    [hashtable]$Relationship
  )

  $attributeRequiredLevel = @{
    Value = $Relationship.requiredLevel
    CanBeChanged = $true
    ManagedPropertyLogicalName = "canmodifyrequirementlevelsettings"
  }

  $body = @{
    '@odata.type' = 'Microsoft.Dynamics.CRM.OneToManyRelationshipMetadata'
    SchemaName = $Relationship.schemaName
    ReferencedEntity = $Relationship.referencedTableLogicalName
    ReferencingEntity = $Relationship.referencingTableLogicalName
    Lookup = @{
      '@odata.type' = 'Microsoft.Dynamics.CRM.LookupAttributeMetadata'
      SchemaName = ($Relationship.lookupColumnLogicalName -replace '^kzn_', 'kzn_')
      LogicalName = $Relationship.lookupColumnLogicalName
      AttributeType = 'Lookup'
      AttributeTypeName = @{ Value = 'LookupType' }
      DisplayName = @{ LocalizedLabels = @(@{ Label = $Relationship.lookupDisplayName; LanguageCode = 1033 }) }
      Description = @{ LocalizedLabels = @(@{ Label = $Relationship.description; LanguageCode = 1033 }) }
      RequiredLevel = $attributeRequiredLevel
    }
    AssociatedMenuConfiguration = @{ Behavior = 'UseCollectionName'; Group = 'Details'; Label = @{ LocalizedLabels = @(@{ Label = $Relationship.lookupDisplayName; LanguageCode = 1033 }) }; Order = 10000 }
    CascadeConfiguration = @{ Assign = 'NoCascade'; Delete = 'RemoveLink'; Merge = 'NoCascade'; Reparent = 'NoCascade'; Share = 'NoCascade'; Unshare = 'NoCascade' }
  } | ConvertTo-Json -Depth 12

  $uri = "$BaseUrl/api/data/v9.2/EntityDefinitions($ReferencedMetadataId)/OneToManyRelationships"
  Invoke-RestMethod -Method Post -Uri $uri -Headers $Headers -Body $body | Out-Null
}

if (-not (Test-Path $ConfigPath)) {
  throw "Relationship configuration file not found at $ConfigPath"
}

$config = Get-Content $ConfigPath -Raw | ConvertFrom-Json
$accessToken = Get-AccessToken -TenantId $TenantId -ClientId $ClientId -ClientSecret $ClientSecret -ResourceUrl $DataverseUrl
$headers = New-Headers -AccessToken $accessToken

Write-Host "Deploying Dataverse lookup relationships from $ConfigPath" -ForegroundColor Cyan

foreach ($relationship in $config.relationships) {
  try {
    $referencedMetadataId = Get-TableMetadataId -BaseUrl $DataverseUrl -Headers $headers -LogicalName $relationship.referencedTableLogicalName
    New-LookupRelationship -BaseUrl $DataverseUrl -Headers $headers -ReferencedMetadataId $referencedMetadataId -Relationship $relationship
    Write-Host "Created relationship $($relationship.schemaName)" -ForegroundColor Green
  }
  catch {
    Write-Warning "Could not create relationship $($relationship.schemaName): $($_.Exception.Message)"
  }
}

Write-Host "Relationship deployment completed." -ForegroundColor Green
Write-Host "Note: The React application no longer requires Microsoft Entra ID authentication." -ForegroundColor Yellow
