---
title: Board data
description: The census files behind the board, their fields, and the compact census.json endpoint.
---

The board reads one file, the indexer's **board file** for a snapshot. It is
built by `assay-indexer` from Stellar mainnet data each week and published
with the indexer's weekly census release, together with the full snapshot.

:::note[Access]
The indexer repository, and so its releases, is private while Assay is
prepared for submission. The compact endpoint below is public now.
:::

## Compact endpoint: `/census.json`

```text
GET https://assay.wtf/census.json
```

```json
{
  "snapshot": "2026-10-12",
  "assets": [["ARST-GCSAZVWXZKWS4XS223M5F54H2B6XPIIXZZGP7KEAIU6YSL5HDRGCI3DG", "pubnet-sep.latamex.com", 1], …]
}
```

Each asset is `[id, issuer home domain, status index]`, sorted by holders.
The status index is into this list:

| Index | Status | Board label |
|---|---|---|
| 0 | `NO_REPORT_LINK` | No reserve link |
| 1 | `LINK_BROKEN` | Link did not load |
| 2 | `UNSTRUCTURED_REPORT` | Report to read |
| 3 | `STRUCTURED_REPORT` | Machine-readable report |

## Board file: `assay-board-v0`

Top level:

| Field | Meaning |
|---|---|
| `schema` | `"assay-board-v0"` |
| `snapshot` | Snapshot date, e.g. `2026-10-12` |
| `network` | `mainnet` |
| `computed_at` | When the indexer finished |
| `ledger_start`, `ledger_end`, `ledger` | Ledgers the snapshot was read across |
| `headline_rule` | The rule for which assets are checked, in words |
| `holders_source` | Where holder counts came from, when, and the minimum used |
| `summary` | The counts behind the board's summary line |
| `assets` | One object per checked asset |

`summary` in the 2026-10-12 snapshot:

```json
{
  "assets_with_toml_link": 274439,
  "assets_listed": 110754,
  "assets_invalid_home_domain": 656,
  "self_declared_anchored": 23162,
  "assets_checked": 270,
  "with_report_link": 41,
  "with_working_link": 33,
  "with_recent_report": 0,
  "by_status": { "NO_REPORT_LINK": 229, "LINK_BROKEN": 8, "UNSTRUCTURED_REPORT": 33, "STRUCTURED_REPORT": 0 },
  "coverage": { "method": "value-weighted", "value": null, "assets_with_figure": 0, "assets_total": 270,
                "note": "Aggregate coverage needs comparable units and published supply; null in v0." }
}
```

## One asset

| Field | Meaning |
|---|---|
| `id` | `CODE-ISSUER` |
| `code`, `issuer`, `home_domain` | From the ledger |
| `toml` | `stellar.toml` URL, HTTP status, and whether the currency is listed there |
| `sep1` | The currency's SEP-1 fields as published: `status`, `is_asset_anchored`, `anchor_asset_type`, `anchor_asset`, `attestation_of_reserve`, `redemption_instructions`, `collateral_addresses` |
| `status` | One of the four statuses above |
| `report_link` | The check of the reserve link: URL, `checked_at`, HTTP status, final URL, content type, size, `last_modified`, SHA-256 of what was received, error kind |
| `report_kind` | e.g. `pdf`, `html` |
| `report_date`, `report_date_source` | The report's date and where it came from (`structured`, `manual`, `pdf_metadata`) |
| `report_age_days` | Days since the report date when it counts; `null` when unknown |
| `stated` | Figures as stated in a structured or manually transcribed report, or `null` |
| `coverage_as_stated`, `coverage_basis` | Coverage from stated figures, or `null` |
| `manually_transcribed` | `true` when figures were copied by hand (the board labels these) |
| `collateral` | Checks of SEP-1 `collateral_addresses`, when published |
| `supply` | `null` in v0: shown as unknown until the indexer publishes supply |
| `holders` | `{ total, funded }` from stellar.expert, or `null` |
| `headline` | Why the asset is checked: `holders`, `reserve_link` or both |
| `reserve_link_on_issuer_domain` | Whether the reserve link is on the issuer's own domain |

Missing values are `null`. The board shows them as **unknown**; it never
estimates one.

How each field is decided is on the board's
[method page](https://assay.wtf/board/method/).
