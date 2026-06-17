# Azure DevOps and Power Platform deployment plan

## Repository mapping

| Repository area | Purpose | Deployment target |
| --- | --- | --- |
| [src](../src) | React SPA UI and role-based portal flow | Azure Static Web Apps or Azure App Service |
| [scripts](../scripts) | PowerShell automation for Dataverse schema and solution packaging | Azure DevOps pipeline / Power Platform environment |
| [schema](../schema) | Dataverse schema and relationship definitions | Dataverse / Power Platform |
| [solution](../solution) | Solution packaging metadata | Power Platform solution export/import |

## Azure DevOps pipeline flow

1. Build stage
   - `npm ci`
   - `npm run build`
   - Publish `dist` artifact
2. Frontend deployment stage
   - Deploy `dist` to Azure Static Web Apps using the `AzureStaticWebApp` task
3. Power Platform deployment stage
   - Run Dataverse schema deployment scripts using a secret variable group
   - Optional: package the solution after schema deployment

## Required pipeline variables

Create a variable group named `kzn-skills-audit-portal` with:

- `TenantId`
- `ClientId`
- `ClientSecret`
- `DataverseUrl`
- `DeployFrontend`
- `DeployPowerPlatform`
- `AZURE_STATIC_WEB_APPS_API_TOKEN`

## Power Platform deployment sequence

1. Provision base Dataverse tables from [schema/dataverse-schema.json](../schema/dataverse-schema.json)
2. Provision lookup relationships from [schema/dataverse-relationships.json](../schema/dataverse-relationships.json)
3. Provision alternate keys and global choices from the relevant JSON files
4. Package the solution using [scripts/package-solution.ps1](../scripts/package-solution.ps1)

## Environment strategy

- Development: validate schema deployment and frontend preview
- Test: run package/import flow and user acceptance testing
- Production: deploy only after Dataverse schema changes are approved
