param(
    [Parameter(Mandatory = $true)][string]$EnvironmentUrl,
    [Parameter(Mandatory = $true)][string]$TenantId,
    [Parameter(Mandatory = $true)][string]$ClientId,
    [Parameter(Mandatory = $true)][string]$ClientSecret,
    [string]$SolutionSettingsPath = "./solution/skills-audit-solution-settings.json",
    [string]$OutputDirectory = "./out",
    [switch]$Managed
)

$ErrorActionPreference = "Stop"

function Assert-PacCli {
    if (-not (Get-Command pac -ErrorAction SilentlyContinue)) {
        throw "Power Platform CLI 'pac' was not found in PATH. Install the Power Platform CLI before running this script."
    }
}

function Invoke-Pac {
    param([string]$Arguments)
    Write-Host "pac $Arguments" -ForegroundColor DarkGray
    $null = Invoke-Expression "pac $Arguments"
}

Assert-PacCli

if (-not (Test-Path $OutputDirectory)) {
    New-Item -ItemType Directory -Path $OutputDirectory | Out-Null
}

$settings = Get-Content $SolutionSettingsPath -Raw | ConvertFrom-Json
$publisher = $settings.publisher
$solution = $settings.solution

Invoke-Pac "auth create --url $EnvironmentUrl --tenant $TenantId --applicationId $ClientId --clientSecret $ClientSecret --name KZNSkillsAuditConnection"

try {
    Invoke-Pac "publisher create --name `"$($publisher.friendlyName)`" --prefix $($publisher.prefix) --solutionPublisherName $($publisher.uniqueName)"
}
catch {
    Write-Host "Publisher may already exist. Continuing." -ForegroundColor Yellow
}

try {
    Invoke-Pac "solution create --publisher-name $($publisher.uniqueName) --name $($solution.uniqueName) --display-name `"$($solution.friendlyName)`" --version $($solution.version)"
}
catch {
    Write-Host "Solution may already exist. Continuing." -ForegroundColor Yellow
}

foreach ($table in $settings.components.tables) {
    try {
        Invoke-Pac "solution add-reference --path . --solution-name $($solution.uniqueName) --component-type Table --component-name $table"
    }
    catch {
        Write-Host "Could not automatically add table reference $table. Validate the component exists in the environment and adjust the command if your pac version differs." -ForegroundColor Yellow
    }
}

$zipPath = Join-Path $OutputDirectory ($solution.uniqueName + ($(if ($Managed) { '_managed.zip' } else { '_unmanaged.zip' })))

if ($Managed) {
    Invoke-Pac "solution export --name $($solution.uniqueName) --path `"$zipPath`" --managed true"
}
else {
    Invoke-Pac "solution export --name $($solution.uniqueName) --path `"$zipPath`" --managed false"
}

Write-Host "Solution package exported to $zipPath" -ForegroundColor Green
