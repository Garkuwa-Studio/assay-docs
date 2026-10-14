---
title: Guard contract
description: Functions, types and errors of Assay Guard (contracts/guard), version 0.
---

Source: [`contracts/guard/src/lib.rs`](https://github.com/Garkuwa-Studio/assay/blob/main/contracts/guard/src/lib.rs).
Interface version `0`. Testnet only.

`is_healthy(asset, policy)` reads the reserve registry and says whether a
protocol should accept more exposure to an asset, with the first rule that
failed. The guard is read-only: it never moves funds and holds no tokens.
Missing data is never healthy, and that is not configurable.

## Functions

| Function | Auth | Does |
|---|---|---|
| `__constructor(registry: Address)` | at deploy | Sets the registry the guard reads |
| `version() -> u32` | none | `0` |
| `registry() -> Address` | none | The registry it reads |
| `is_healthy(asset: Address, policy: Policy) -> Result<(bool, Reason), Error>` | none | `(true, Ok)` when every rule passes; otherwise `(false, reason)`. Writes nothing. |

`is_healthy` checks the policy, then calls the registry's
`status_with(asset, policy.max_age_secs, policy.max_supply_mismatch_bps)`
and applies the rules in [Status rules](/build/status-rules/#the-guards-reasons).

## Types

```rust
pub struct Policy {
    pub min_coverage_bps: u32,
    pub max_age_secs: u64,
    pub min_attestors: u32,
    pub max_disagreement_bps: u32,
    pub max_supply_mismatch_bps: u32,
}

pub enum Reason {
    Ok,               // every rule passed
    NoReport,         // no report at all, or the asset is not registered
    Stale,            // reports exist but none is inside the max age
    TooFewAttestors,  // fewer fresh attestors than the policy requires
    Undercovered,     // lowest fresh coverage below the policy minimum
    Disagreement,     // spread between attestors above the policy maximum
    SupplyMismatch,   // witnessed supply above stated liabilities beyond the tolerance
}
```

`Policy::standard()` (Rust only, not a contract function): 10,000 bps
coverage, 35 days, 1 attestor, 500 bps disagreement, 50 bps supply tolerance.

`RegistryStatus` mirrors the registry's `Status` so the guard's WASM doesn't
link the registry; the guard's tests run against the real registry, so a
drift fails them.

## Errors

| Error | Code | When |
|---|---|---|
| `InvalidPolicy` | 1 | `min_attestors`, `max_age_secs` or `min_coverage_bps` is 0, or `max_supply_mismatch_bps` is above 10,000 |

## Library functions

For a protocol that reads the registry itself, the crate `assay-guard`
exposes the same logic:

- `evaluate(status: &RegistryStatus, policy: &Policy) -> Reason`
- `check_policy(policy: &Policy) -> Result<(), Error>`

`status` must come from `status_with` under the same policy's max age and
supply tolerance.

## Calling it

From a contract: see [For lending protocols](/build/protocols/). From the
command line (read-only, no transaction sent):

```bash
stellar contract invoke --network testnet --source-account <any identity> \
  --id CCVEIPYTY6RRVJZONFZL4WVGN66H5IU77H3HSSQJKH7I7WSDL6DIEKDV \
  -- is_healthy --asset <token contract> \
  --policy '{"min_coverage_bps":10000,"max_age_secs":3024000,"min_attestors":1,"max_disagreement_bps":500,"max_supply_mismatch_bps":50}'
```
