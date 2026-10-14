---
title: Status rules
description: Exactly how the registry computes an asset's status and how the guard turns it into a reason, including every boundary.
---

This page states the arithmetic in `contracts/registry/src/lib.rs` and
`contracts/guard/src/lib.rs` at version 0. Every rule leans the same way:
**missing or stale data never reads as healthy**.

## Units

- Amounts are integers with 7 decimals (the Stellar convention): 1 token =
  10,000,000 units.
- Percentages are basis points: 10,000 bps = 100%.
- Times are Unix seconds from the ledger timestamp.

## Which data counts

Status is computed **when you read it**, under a maximum age and a supply
tolerance:

- `status(asset)` uses the asset's own `max_age_secs` and
  `mismatch_tolerance_bps`, set at registration.
- `status_with(asset, max_age_secs, mismatch_tolerance_bps)` uses the
  caller's. The guard calls this with its policy.

Then:

1. **Supply.** The witness's latest post counts if
   `now − posted_at ≤ max_age_secs`. Older supply is treated as **missing**,
   never as zero. `supply_age_secs = now − posted_at`.
2. **Reports.** For each attestor currently on the asset, only its **latest**
   report is used. Its age is `now − as_of` (the date the figures are true
   for, not when it was posted).
3. A report is **fresh** if `age ≤ max_age_secs`. A report exactly at the
   max age still counts.
4. Reports from removed attestors are kept but never count.

## Coverage of one report

```text
denominator = max(stated liabilities, fresh witnessed supply)   (supply = 0 if missing)
coverage_bps = floor(reserves × 10,000 ÷ denominator)
```

- 0 when the denominator is 0 or less, or reserves are 0 or less: nothing
  to measure is not "covered".
- Rounded down, so 99.99…% never shows as 100%.
- Capped at `u32::MAX` if the result is too large to store.

Taking the larger of stated liabilities and witnessed supply means a report
can't look better by understating what's owed.

## The status fields

| Field | Rule |
|---|---|
| `attestor_count` | Number of attestors with a fresh latest report |
| `coverage_bps` | **Lowest** coverage among fresh reports; 0 when there are none |
| `disagreement_bps` | Highest minus lowest coverage among fresh reports; 0 when there are none |
| `newest_age_secs` | Age of the newest latest report, fresh or not; `u64::MAX` when there is no report at all |
| `supply_mismatch` | `true` if, for any fresh report, fresh witnessed supply exceeds its stated liabilities by more than the tolerance |
| `supply_age_secs` | Age of the witnessed supply; `u64::MAX` when there is none |

An unregistered asset reads as missing: coverage 0, no attestors,
`newest_age_secs` and `supply_age_secs` both `u64::MAX`.

### Supply mismatch

```text
mismatch = supply > liabilities  and  (supply − liabilities) × 10,000 > supply × tolerance_bps
```

A gap exactly at the tolerance is **not** a mismatch. If the multiplication
overflows, it counts as a mismatch.

## The guard's reasons

`is_healthy(asset, policy)` first checks the policy, then reads
`status_with(asset, policy.max_age_secs, policy.max_supply_mismatch_bps)` and
applies these rules in order. The first failure is the reason:

| # | Reason | Condition |
|---|---|---|
| 1 | `NoReport` | `newest_age_secs == u64::MAX` |
| 2 | `Stale` | `attestor_count == 0` |
| 3 | `TooFewAttestors` | `attestor_count < min_attestors` |
| 4 | `Undercovered` | `coverage_bps < min_coverage_bps` |
| 5 | `Disagreement` | `disagreement_bps > max_disagreement_bps` |
| 6 | `SupplyMismatch` | `supply_mismatch` |
| | `Ok` | none of the above |

Boundaries: coverage **exactly** at the minimum passes; disagreement
**exactly** at the maximum passes.

The policy is refused (error `InvalidPolicy`) if `min_attestors`,
`max_age_secs` or `min_coverage_bps` is 0, or `max_supply_mismatch_bps` is
above 10,000.

## What the registry refuses to store

| Error | Code | When |
|---|---|---|
| `AlreadyRegistered` | 1 | `register_asset` on a registered asset |
| `NotRegistered` | 2 | Any write for an unknown asset |
| `AlreadyAttestor` | 3 | Adding an attestor twice |
| `NotAttestor` | 4 | Removing a non-attestor, or a report from one |
| `TooManyAttestors` | 5 | More than 20 attestors on one asset |
| `NoWitness` | 6 | `post_supply` before a witness is set |
| `UnitMismatch` | 7 | Report's `reserves_unit` differs from the asset's unit |
| `FutureTimestamp` | 8 | Report `as_of` later than the ledger time |
| `FutureLedger` | 9 | Report or supply ledger later than the current ledger |
| `StaleLedger` | 10 | Supply at a ledger not after the previous post |
| `OutOfOrder` | 11 | Report `as_of` not later than the attestor's last report |
| `NegativeAmount` | 12 | Negative reserves, liabilities or supply |
| `InvalidPolicy` | 13 | `max_age_secs` of 0, or tolerance above 10,000 bps, at registration |

## Tests

The boundaries above are covered by the contract tests: exactly 100%, exactly
at the max age, one attestor, the disagreement threshold, the supply
tolerance, stale supply and removed attestors. Run them with
`cargo test -p assay-registry -p assay-guard`.
