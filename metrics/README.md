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

Validation: mocked browser ingestion verifies payloads contain no codes/URL/content/amounts, and existing board footer and six viewport/theme smoke tests pass. Real collector acceptance and workbook query results must be verified separately once environment egress permits the collector and authenticated query API. Azure resource creation and website deployment alone do not establish ingestion.
