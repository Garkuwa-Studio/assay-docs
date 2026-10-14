---
title: For lending protocols
description: Add one is_healthy call to stop new exposure to an RWA when its reserve reports go missing, stale or short.
---

**What you get:** a way to stop new exposure to a real-world asset
automatically when its reserve reports go missing, go stale or show a
shortfall, with a readable reason. The guard is read-only: it never moves
funds or touches your contracts.

## The call

Declare the guard's types and a client in your Soroban contract:

```rust
use soroban_sdk::{contractclient, contracttype, Address, Env};

#[contracttype]
pub struct Policy {
    pub min_coverage_bps: u32,        // 10_000 = 100%
    pub max_age_secs: u64,            // e.g. 35 days
    pub min_attestors: u32,           // at least 1
    pub max_disagreement_bps: u32,    // e.g. 500 = 5 points
    pub max_supply_mismatch_bps: u32, // e.g. 50 = 0.5%
}

#[contracttype]
#[derive(Clone, Copy, PartialEq)]
pub enum Reason { Ok, NoReport, Stale, TooFewAttestors, Undercovered, Disagreement, SupplyMismatch }

#[contractclient(name = "GuardClient")]
pub trait Guard {
    fn is_healthy(env: Env, asset: Address, policy: Policy) -> (bool, Reason);
}
```

Then, in `borrow()` or `supply_collateral()`, before accepting the asset:

```rust
let (healthy, reason) = GuardClient::new(&env, &guard_id).is_healthy(&rwa_token, &policy);
if !healthy {
    // Your choice: revert with your own error, or record the rejection.
}
```

The types must use the guard's field and variant names exactly: Soroban
encodes structs by field name and enum variants by name. With an invalid
policy the guard returns an error and the call above fails; use the
generated `try_is_healthy` if you want to handle that yourself. A full working example is
[`contracts/demo-pool`](https://github.com/Garkuwa-Studio/assay/tree/main/contracts/demo-pool)
(testnet demo only); see it run in the [circuit breaker](/build/circuit-breaker-demo/).

## Choosing a policy

The guard has a standard policy in its code (`Policy::standard()`): 100%
coverage, reports under 35 days, one attestor, 5 points of disagreement,
0.5% supply tolerance. Start there and tighten as attestors join.

The guard **refuses** a policy that could let missing data through. It
returns error `InvalidPolicy` (1) when:

- `min_attestors` is 0,
- `max_age_secs` is 0,
- `min_coverage_bps` is 0, or
- `max_supply_mismatch_bps` is above 10,000.

## What the reasons mean

| Reason | When |
|---|---|
| `NoReport` | No report has ever been posted, or the asset isn't registered. |
| `Stale` | Reports exist, but none is newer than `max_age_secs`. |
| `TooFewAttestors` | Fewer fresh attestors than `min_attestors`. |
| `Undercovered` | The lowest fresh coverage is below `min_coverage_bps`. |
| `Disagreement` | Attestors' coverage figures differ by more than `max_disagreement_bps`. |
| `SupplyMismatch` | On-chain supply is above what a report says is owed, beyond the tolerance. |

Planned for T2: `UNKNOWN_ASSET` (today an unregistered asset returns
`NoReport`), `NO_INDEPENDENT_ATTESTOR` with a `min_independent` policy field,
`false` on a failed registry call (today the call fails), and strict and
lenient policy profiles. See the [roadmap](/project/roadmap/).

Rules are checked in this order and the first failure is returned. Missing
data is always unhealthy; there is no setting to change that. The exact
arithmetic is in [Status rules](/build/status-rules/).

## Calling it without a client

You can also evaluate the rules inline: read the registry's
`status_with(asset, max_age_secs, max_supply_mismatch_bps)` and apply the
same checks. The guard's `evaluate` function in
[`contracts/guard/src/lib.rs`](https://github.com/Garkuwa-Studio/assay/blob/main/contracts/guard/src/lib.rs)
is the reference.

## If you can't change your contracts

A keeper can call an admin action you already have instead, for example a
Blend pool's `set_status` to stop new borrowing, through an account allowed
to call **only** that function on **only** that pool. Blend's per-reserve
switch has a one-week timelock, so the immediate option is pool-wide
([stack status §7](/evidence/stack-status/#7-lending-markets-and-how-they-stop-new-exposure)).
This will be built with the first protocol pilot.

## Pilot steps

1. Choose a testnet pool and an RWA, and the policy you'd want.
2. We register the asset in the testnet registry and post supply.
3. You add the call (or we set up the keeper) and test against the testnet
   guard: `CCVEIPYTY6RRVJZONFZL4WVGN66H5IU77H3HSSQJKH7I7WSDL6DIEKDV`.
4. We run the same four-step story as the [demo run](/evidence/demo-run/) on
   your pool and publish the transactions, with your agreement.
