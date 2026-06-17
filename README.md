# KZN Skills Audit Portal

This project contains the following deliverables for the KwaZulu-Natal Department of Transport skills audit solution:

- a live government-style questionnaire form
- an administrator dashboard UI
- a Dataverse schema definition file
- a PowerShell deployment script for core Dataverse tables

## 1. Run the React application

```bash
npm install
cp .env.example .env
npm run dev
```

The app expects the following environment values for Entra ID authentication:

- `VITE_ENTRA_CLIENT_ID`
- `VITE_ENTRA_TENANT_ID`
- `VITE_ENTRA_REDIRECT_URI`

## 2. Frontend authentication and deployment setup

The SPA now uses the Microsoft identity platform configuration in [src/authConfig.js](src/authConfig.js) and wraps the application with the MSAL provider from [src/main.jsx](src/main.jsx).

For CI/CD, the repository includes an Azure DevOps pipeline definition in [azure-pipelines.yml](azure-pipelines.yml) and a deployment guide in [docs/ado-powerplatform-deployment-plan.md](docs/ado-powerplatform-deployment-plan.md).

### Prerequisites

- PowerShell 7+
- a Dataverse environment URL
- Azure DevOps pipeline variables for the Entra app and deployment targets

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
