function New-GlobalChoice {
    param(
        [string]$DataverseUrl,
        [hashtable]$Headers,
        [object]$Choice
    )

    $uri = "$DataverseUrl/api/data/v9.2/GlobalOptionSetDefinitions"

    # ✅ CHECK FIRST (IMPORTANT FIX)
    $checkUri = "$($DataverseUrl)/api/data/v9.2/GlobalOptionSetDefinitions?`$filter=Name eq '$($Choice.schemaName)'"
    
    try {
        $existing = Invoke-RestMethod -Method Get -Uri $checkUri -Headers $Headers

        if ($existing.value.Count -gt 0) {
            Write-Host "Global choice already exists: $($Choice.schemaName)" -ForegroundColor Yellow
            return
        }
    }
    catch {
        Write-Host "Warning: Could not check existing OptionSet, proceeding..." -ForegroundColor Yellow
    }

    # ✅ Build options
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

    # ✅ Payload
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

    # ✅ Create ONLY if not found
    try {
        Invoke-RestMethod -Method Post -Uri $uri -Headers $Headers -Body $payload | Out-Null
        Write-Host "Created global choice: $($Choice.schemaName)" -ForegroundColor Green
    }
    catch {
        if ($_.Exception.Message -match "already exists|duplicate|0x8004700D") {
            Write-Host "Global choice already exists (race condition): $($Choice.schemaName)" -ForegroundColor Yellow
        }
        else {
            throw
        }
    }
}
