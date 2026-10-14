---
title: Run the registry demo
description: Deploy a fresh reserve registry on testnet, post two attestors' reports and read the status.
---

The registry demo deploys its own registry contract on testnet, registers a
demo asset and walks through every write the registry accepts. It takes
about a minute and a half.

:::caution[Testnet only]
The script refuses any network but testnet. The figures are demo values, not
a real asset's reserves.
:::

## Before you start

- The repo builds: see the [quickstart](/build/quickstart/).
- The identities `assay-admin`, `assay-issuer`, `assay-attestor-a`,
  `assay-attestor-b` and `assay-witness` exist and are funded: see
  [testnet identities](/build/testnet-setup/).

## Run it

```bash
pnpm --filter @garkuwa/assay-scripts demo:registry
```

## What it does

| Step | Call | Signed by |
|---|---|---|
| 1 | Deploy the registry (`__constructor(admin)`) | `assay-admin` |
| 2 | Make sure the demo asset `ADEMO`'s token contract exists | `assay-issuer` |
| 3 | `register_asset(ADEMO, asset_admin, USD, 35 days, 50 bps)` | `assay-admin` |
| 4 | `add_attestor` for attestor A, then attestor B | `assay-issuer` (asset admin) |
| 5 | `set_supply_witness(ADEMO, witness)` | `assay-issuer` |
| 6 | `post_supply(ADEMO, 1,000,000, ledger)` | `assay-witness` |
| 7 | `post_report` from attestor A: reserves 1,010,000 USD (101.0%) | `assay-attestor-a` |
| 8 | `post_report` from attestor B: reserves 995,000 USD (99.5%) | `assay-attestor-b` |
| 9 | Read `status(ADEMO)` and compare it with the expected values | none (read-only) |

Each report's full JSON document is saved under `docs/testnet/reports/`,
and its SHA-256 goes on chain with the report, so anyone can check the file
matches what was posted.

## Output

From the run on 14 October 2026 (one transaction link per line, shortened
here):

```text
✓ deploy registry CBLRBN3PACEGC5565LBTDNBVPY65RUFDEBFHWJFEGUUQ2DEVPW2VBDGO
✓ ADEMO token contract already deployed: CC22EDRUYLGMSF4YOP77GKP6O6SQQT6WY2VP6VHNHALTOBPGXNIKRWTB
✓ register_asset ADEMO (unit USD, max age 35 days, tolerance 50 bps)
✓ add_attestor attestor A
✓ add_attestor attestor B
✓ set_supply_witness
✓ post_supply 1,000,000 ADEMO at ledger 5189812
✓ post_report attestor A (101.0%)
✓ post_report attestor B (99.5%)
status(ADEMO): {
  attestor_count: 2,
  coverage_bps: 9950,
  disagreement_bps: 150,
  newest_age_secs: 80,
  supply_age_secs: 20,
  supply_mismatch: false
}
```

## Reading the status

| Field | Value | Why |
|---|---|---|
| `coverage_bps` | 9950 (99.5%) | The **lowest** fresh coverage: attestor B's report |
| `attestor_count` | 2 | Both reports are inside the 35-day max age |
| `disagreement_bps` | 150 | 101.0% − 99.5% = 1.5 points |
| `supply_mismatch` | false | Witnessed supply (1,000,000) equals stated liabilities |
| `newest_age_secs` | 80 | Both reports are dated 60 seconds before posting starts; 80 seconds had passed by the read |

The rules behind each field are in [Status rules](/build/status-rules/).

## Read it yourself

Any registry can be read without signing anything. The registry from the
committed run (13 October 2026):

```bash
stellar contract invoke --network testnet --source-account assay-admin \
  --id CBUEGKQJNSJI2FXEIEK6B3RK52MZLNZECDEQPOFER32Z5UCSMCSJRRRF \
  -- status --asset CC22EDRUYLGMSF4YOP77GKP6O6SQQT6WY2VP6VHNHALTOBPGXNIKRWTB
```

The CLI simulates the call and prints the result without sending a
transaction. Report ages grow from the time you read them.

## Afterwards

The script writes a receipt to `docs/audit/e2e-receipts/registry-<date>.json`
with every transaction. The committed run is on the
[testnet page](/project/testnet/).
