---
title: Demo pool contract
description: The testnet-only lending pool (contracts/demo-pool) that shows how a protocol calls the guard.
---

Source: [`contracts/demo-pool/src/lib.rs`](https://github.com/Garkuwa-Studio/assay/tree/main/contracts/demo-pool).
Interface version `0`.

:::danger[TESTNET DEMO ONLY]
"TESTNET DEMO ONLY. Not a lending product: no interest, no liquidation,
fixed 1:1 prices. Never deploy to mainnet." This text is in the contract
itself: `notice()` returns it.
:::

The pool takes one collateral token and lends one debt token. Before every
borrow it asks the guard about the collateral. When the guard says
unhealthy, nothing moves: the pool emits `borrow_rejected` with the guard's
reason and returns it.

## Functions

| Function | Auth | Does |
|---|---|---|
| `__constructor(admin, guard, collateral, debt, policy: Policy, ltv_bps: u32)` | at deploy | Configures the pool. Error `InvalidConfig` if `ltv_bps` is 0 or above 10,000 |
| `version() -> u32` | none | `0` |
| `notice() -> String` | none | The testnet-only notice above |
| `config() -> Config` | none | The configuration |
| `position(user) -> Position` | none | `{ collateral, debt }` for a user |
| `deposit(user, amount: i128)` | `user` | Moves collateral from the user into the pool. Error `InvalidAmount` if `amount ≤ 0` |
| `borrow(user, amount: i128) -> BorrowResult` | `user` | Asks the guard, then lends. Errors `InvalidAmount`, `OverLimit` |

`borrow`:

1. calls `guard.is_healthy(collateral, policy)`;
2. if unhealthy: emits `borrow_rejected`, moves nothing, returns
   `Rejected(reason)`;
3. otherwise checks `debt + amount ≤ collateral × ltv_bps ÷ 10,000`
   (else `OverLimit`), transfers the debt token, emits `borrowed`, returns
   `Borrowed`.

## Types

```rust
pub struct Config { pub admin: Address, pub guard: Address, pub collateral: Address,
                    pub debt: Address, pub policy: Policy, pub ltv_bps: u32 }
pub struct Position { pub collateral: i128, pub debt: i128 }
pub enum BorrowResult { Borrowed, Rejected(Reason) }
```

`Policy` and `Reason` mirror the guard's.

## Events

All topics start with `testnet_demo`:

| Topics | Data |
|---|---|
| `testnet_demo`, `deposited`, `user` | `amount` |
| `testnet_demo`, `borrowed`, `user` | `amount` |
| `testnet_demo`, `borrow_rejected`, `user` | `amount`, `reason` |

## Errors

| Error | Code |
|---|---|
| `InvalidAmount` | 1 |
| `OverLimit` | 2 |
| `InvalidConfig` | 3 |
