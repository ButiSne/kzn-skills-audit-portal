# KZN Skills Audit Portal

This project contains the following deliverables for the KwaZulu-Natal Department of Transport skills audit solution:

- a live government-style questionnaire form
- an administrator dashboard UI
- a Dataverse schema definition file
- a PowerShell deployment script for core Dataverse tables

## 1. Run the React application

```bash
npm install
npm run dev
```

The deployment script provisions the core baseline tables described in `schema/dataverse-schema.json`.

### Prerequisites

- PowerShell 7+
- a Dataverse environment URL

### Run the script

```powershell
pwsh ./scripts/deploy-dataverse-schema.ps1 \
  -TenantId "<tenant-id>" \
  -ClientId "<client-id>" \
  -ClientSecret "<client-secret>" \
  -DataverseUrl "https://yourorg.crm11.dynamics.com"
```


## 3. Dataverse lookup relationships

This package now also includes a second deployment layer for lookup relationships.

### Relationship configuration

- `schema/dataverse-relationships.json`
- `scripts/deploy-dataverse-relationships.ps1`

### What the relationship script creates

- Skills Audit Submission -> Skills Audit Cycle lookup
- Skills Audit Submission -> Employee Profile lookup
- Education Record -> Skills Audit Submission lookup
- Work Experience Record -> Skills Audit Submission lookup
- Audit Log -> Skills Audit Submission lookup

### Run the relationship deployment

```powershell
pwsh ./scripts/deploy-dataverse-relationships.ps1   -TenantId "<tenant-id>"   -ClientId "<client-id>"   -ClientSecret "<client-secret>"   -DataverseUrl "https://yourorg.crm11.dynamics.com"
```

## 4. What the deployment script creates

Baseline custom tables:

- Skills Audit Cycle
- Employee Profile
- Skills Audit Submission
- Education Record
- Work Experience Record
- Audit Log

This baseline keeps the deployment script manageable. In the next iteration you can extend it with lookup relationships, managed global choices, alternate keys and solution packaging.

## 5. Technical notes

Microsoft documents that Dataverse table definitions are created through the `EntityDefinitions` entity set, and custom columns can be supplied in the `Attributes` array when creating the table or added afterwards through the `Attributes` navigation property.


## 6. Dataverse alternate keys and global choices

This package now includes deployment assets for alternate keys and reusable global choice columns.

### Files

- `schema/dataverse-alternate-keys.json`
- `schema/dataverse-choices.json`
- `scripts/deploy-dataverse-keys-and-choices.ps1`

### What is included

Alternate keys:

- Employee Profile by PERSAL Number
- Skills Audit Cycle by Cycle Name and Year
- Skills Audit Submission by Submission Reference Number
- Reference Value by Reference Type and Reference Code

Reusable global choices:

- Submission Status
- Employment Type
- ID Type
- Yes / No Response
- Age Category
- Field of Study

### Run the deployment

```powershell
pwsh ./scripts/deploy-dataverse-keys-and-choices.ps1   -TenantId "<tenant-id>"   -ClientId "<client-id>"   -ClientSecret "<client-secret>"   -DataverseUrl "https://yourorg.crm11.dynamics.com"
```

## 7. Solution packaging scaffold

This package also includes a Power Platform CLI based packaging scaffold to support dev, test and production promotion.

### Files

- `solution/skills-audit-solution-settings.json`
- `scripts/package-solution.ps1`

### What the packaging script does

- authenticates to the target Power Platform environment
- creates or reuses the configured publisher
- creates or reuses the solution shell
- attempts to add the configured table references
- exports the solution as managed or unmanaged

### Run the packaging scaffold

```powershell
pwsh ./scripts/package-solution.ps1   -EnvironmentUrl "https://yourorg.crm11.dynamics.com"   -TenantId "<tenant-id>"   -ClientId "<client-id>"   -ClientSecret "<client-secret>"
```

For a managed export:

```powershell
pwsh ./scripts/package-solution.ps1   -EnvironmentUrl "https://yourorg.crm11.dynamics.com"   -TenantId "<tenant-id>"   -ClientId "<client-id>"   -ClientSecret "<client-secret>"   -Managed
```

## 9. Implementation note

The packaging script is intentionally a practical scaffold. Power Platform CLI command behaviour can vary by installed version, so validate the `solution add-reference` step in your environment and adjust the component import pattern where needed.
