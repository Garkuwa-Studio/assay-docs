---
title: Run the circuit breaker
description: Deploy the guard and a testnet-only lending pool, then watch borrows succeed and get rejected on chain.
---

This demo shows the guard doing its job. A tiny lending pool asks the guard
before every borrow; the reserve reports change, and the borrows follow. It
takes about five minutes, most of it waiting for a report to go stale.

:::caution[TESTNET DEMO ONLY]
The demo pool is not a lending product: no interest, no liquidation, fixed
1:1 prices. It exists only to show the guard and must never be deployed to
mainnet. The figures are demo values.
:::

## Before you start

- The repo builds: see the [quickstart](/build/quickstart/).
- The identities `assay-admin`, `assay-issuer`, `assay-attestor-a`,
  `assay-witness` and `assay-borrower` exist and are funded: see
  [testnet identities](/build/testnet-setup/).

## Run it

```bash
pnpm --filter @garkuwa/assay-scripts demo:circuit-breaker
```

## Setup

The script deploys a fresh registry, the guard and the demo pool, and gets
everything ready:

1. Deploy the registry and the guard (pointed at that registry).
2. Use the `ADEMO` token contract as collateral, and deploy a demo stablecoin,
   `DUSD`, as the asset being lent.
3. Deploy the demo pool with the policy below and a 50% borrow limit.
4. Register `ADEMO` in the registry, add one attestor, set the supply
   witness, and post a supply of 1,000,000 `ADEMO`.
5. Give the borrower 1,000 `ADEMO`, fund the pool with 100,000 `DUSD`, and
   deposit the borrower's 1,000 `ADEMO` as collateral.

The demo policy (one `Policy` value the pool passes to the guard):

| Field | Value | Meaning |
|---|---|---|
| `min_coverage_bps` | 10000 | At least 100% coverage |
| `max_age_secs` | 90 | Reports older than 90 seconds don't count (short, so the stale step happens live) |
| `min_attestors` | 1 | One fresh attestor is enough |
| `max_disagreement_bps` | 500 | Attestors may differ by up to 5 points |
| `max_supply_mismatch_bps` | 50 | Supply may exceed stated liabilities by up to 0.5% |

## The story

Each step posts a report (except the last) and then borrows 100 `DUSD`:

| Step | Report | Guard says | Result |
|---|---|---|---|
| 1 | 101% | `(true, Ok)` | Borrow succeeds; DUSD is transferred |
| 2 | 92% | `(false, Undercovered)` | Rejected; nothing moves |
| 3 | 100.4% | `(true, Ok)` | Borrow succeeds |
| 4 | none for 90 s | `(false, Stale)` | Rejected; nothing moves |

A rejected borrow is still a **successful transaction**: the pool returns
`Rejected(reason)` and emits a `borrow_rejected` event with the reason. That
way every step has a transaction anyone can open.

Output from a run on 14 October 2026:

```text
✓ Borrower deposits 1,000 ADEMO as collateral
The story:
✓ 1. Fresh report at 101% → borrow succeeded
✓ 2. Attestor posts 92% → borrow rejected (UNDERCOVERED)
✓ 3. Fresh report at 100.4% → borrow succeeded
  waiting 74 s for the last report to pass the 90 s max age…
✓ 4. No new report past the 90-second max age → borrow rejected (STALE)
wrote docs/DEMO-RUN.md and docs/audit/e2e-receipts/circuit-breaker-2026-10-14.json
```

## Check it on chain

Open a rejected borrow on stellar.expert and expand its effects. In the
committed run, step 2 is
[`84d31e35…`](https://stellar.expert/explorer/testnet/tx/84d31e3575e94e9bad7d07d3462c2773f71c9d07e0cb7ec35b2cbf8621c09e3e)
and step 4 is
[`ec2c5847…`](https://stellar.expert/explorer/testnet/tx/ec2c58476bb4bb7a12f977dd97b6143b5fe3400b42231bd1d0ad0254c3cbfa15).
You'll see:

1. `borrow(borrower, 1000000000)` on the pool returns `["Rejected", ["Undercovered"]]`.
2. The pool's call to the guard: `is_healthy(ADEMO, policy)` → `[false, ["Undercovered"]]`.
3. The guard's call to the registry: `status_with(ADEMO, 90, 50)` with the
   coverage it found.
4. One event, `["testnet_demo", "borrow_rejected", borrower]`, with the
   amount and the reason.
5. **No token transfer.**

The successful borrows show a `DUSD` transfer instead. After the run, the
borrower's position is 1,000 `ADEMO` collateral and 200 `DUSD` debt.

## Ask the guard yourself

The guard from the committed run is
`CCVEIPYTY6RRVJZONFZL4WVGN66H5IU77H3HSSQJKH7I7WSDL6DIEKDV`. Ask it about
`ADEMO` with your own policy (here, a 35-day max age):

```bash
stellar contract invoke --network testnet --source-account assay-admin \
  --id CCVEIPYTY6RRVJZONFZL4WVGN66H5IU77H3HSSQJKH7I7WSDL6DIEKDV \
  -- is_healthy --asset CC22EDRUYLGMSF4YOP77GKP6O6SQQT6WY2VP6VHNHALTOBPGXNIKRWTB \
  --policy '{"min_coverage_bps":10000,"max_age_secs":3024000,"min_attestors":1,"max_disagreement_bps":500,"max_supply_mismatch_bps":50}'
```

On 14 October 2026 this returned `[true,"Ok"]`. Once the last report is
older than 35 days, the same call returns `[false,"Stale"]`.

The full run, with all 22 transactions, is in the [demo run](/evidence/demo-run/).
