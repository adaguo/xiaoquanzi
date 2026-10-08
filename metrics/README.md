# Engagement metrics

The site and Qiao page load the committed `/assets/metrics.js` bundle. No build or server dependency is needed at deployment. To rebuild:

```sh
npm ci --prefix metrics
npm run build --prefix metrics
```

`connection.json` contains a public browser telemetry connection string, not an Azure authentication credential. It cannot read analytics or administer Azure resources. Do not put account credentials here.

Azure resources: subscription `4c5fdb2e-7ab2-4d69-bf4e-1bd85ca2786d`, resource group `ideas`, Application Insights and Log Analytics workspace `blackboard-metrics`. Shared workbook `aec97637-580c-45d2-b26a-a0b37f9b0455`; definition in `workbook.json`. Viewing requires Azure resource access. Workspace retention is 30 days; both workspace and Application Insights daily ingestion caps are 0.1 GB (caps are not a strict spending limit).

Events:

- `site_visit`: document load.
- `board_enter`: authenticated board entry, including remembered sessions; role owner/member.
- `board_created`: codes registered after board creation.
- `module_view`: visible section, once per module per board entry.
- `module_action`: enabled button interaction in a module; does not mean the operation succeeded.
- `module_success`: confirmed successful vote, wish/task publication, claim written to the board, or fund contribution. Claim success means board assignment saved; its separate wish update can still fail.

Modules: board, wish (including project tasks), vote, drink, fund. Only the event name, random anonymous device ID, board ID, verified role, module and fixed action enum are sent. No URL/query, codes, names, free text or contribution amounts. SDK automatic request, exception, route and page telemetry is disabled; unsupported event types and additional properties are discarded. Analytics does not grant any board permissions.

Anonymous devices approximate people. Data starts at installation; created and active board counts are not the database's total inventory. Ad blockers, offline clients, browser storage resets, ingestion caps and public endpoint spoofing can affect counts. This is product usage analytics, not an audit or payment ledger.

Validation: mocked browser ingestion verifies payloads contain no codes/URL/content/amounts, and existing board footer and six viewport/theme smoke tests pass. Real collector accepted an isolated customMetrics healthcheck (excluded from engagement counts), and all four workbook queries were executed successfully after fixing quoted Chinese column identifiers. Website activity will appear only when users load the instrumented pages.

## Standalone metrics view

`/metrics/` renders the mobile dashboard; `GET /api/metrics` returns aggregates only to the administrator. Repository `server.cjs` replaces the earlier staging-only static server and must be included in Azure deployments. Node 24 provides built-in fetch; there are no server packages.

The App Service system-assigned identity has Monitoring Reader on the Application Insights resource. `METRICS_APP_ID` selects that resource. No read token is shipped to the browser. Responses are private/no-store; internal aggregate caching lasts one minute; backend failures return 503 instead of invented zero counts.

Azure login is configured using a single-tenant Entra web app with callback `https://blackboard-club.azurewebsites.net/.auth/login/aad/callback`. App Service Easy Auth uses global AllowAnonymous so normal boards remain public; `METRICS_OWNER_ID` selects the administrator's verified object ID. Set `METRICS_AUTH_MODE=azure` only AFTER Easy Auth is enabled. Platform authentication must sanitize `x-ms-client-principal`; the application then checks the AAD provider and exact owner object ID. A board Owner code does not authorize global statistics. If login configuration is missing, the API denies every request and the page explains that access is not open yet. The client credential is stored only in Azure App Service settings (METRICS_AAD_SECRET) and expires one year after creation; renew it in Entra and replace that setting before expiry.

Local validation used mocked identity/query responses to check authorized owner, other user and anonymous access, fail-closed behavior before auth setup, mobile widths 320/390/430, empty states and rendering. Live checks confirm the Microsoft sign-in redirect, public board access, anonymous API rejection and rejection of forged identity headers. Actual administrator sign-in and the resulting managed-identity query remain to be verified by opening the dashboard with the administrator account.
