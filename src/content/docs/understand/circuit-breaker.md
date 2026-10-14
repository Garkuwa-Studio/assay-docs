---
title: The circuit breaker
description: How a lending protocol can stop new exposure to an asset automatically, and why missing data is never treated as healthy.
---

A circuit breaker in your house cuts the power when something is wrong, before
damage is done. You don't have to be watching.

Assay's **guard** is a circuit breaker for lending. Before a lending pool
accepts more of an asset as collateral, it can ask the guard whether the
asset's reserve reports are in order. If they aren't, the pool can stop new
lending against that asset, automatically, with the reason recorded.

## What the guard checks, in order

The pool chooses its own thresholds. The guard checks these rules in this
order and reports the **first** one that fails:

1. **No report**: nothing has ever been posted for this asset, or it isn't
   registered.
2. **Stale**: reports exist, but none is recent enough.
3. **Too few attestors**: fewer independent checkers than the pool requires.
4. **Undercovered**: reserves are below the pool's minimum compared with
   what's owed.
5. **Disagreement**: attestors' figures differ by more than the pool allows.
6. **Supply mismatch**: more tokens exist on chain than the reports say are
   owed.

If every rule passes, the answer is **healthy**.

Planned for T2: an **unknown asset** reason of its own (today it reads as
no report), and **no independent attestor**, for a policy that won't accept
an issuer vouching for itself.

## Missing data is never healthy

This is the most important rule, and it can't be switched off. If reports
stop arriving, the guard doesn't assume things are fine. It says **stale**.
If an asset was never registered, it says **no report**. A pool can't set a
policy of "zero attestors" or "any age": the guard refuses such a policy.

## What it looks like

In the [testnet demo](/build/circuit-breaker-demo/), a borrower asks a small
demo pool for a loan four times:

| Step | Guard says | Pool does |
|---|---|---|
| Report at 101% | healthy | lends |
| Attestor posts 92% | undercovered | rejects, nothing moves |
| New report at 100.4% | healthy | lends |
| No report for 90 seconds | stale | rejects, nothing moves |

Each rejection is a successful transaction on Stellar testnet with the
reason in its event, so anyone can check it later.

## What the guard does not do

- It never moves funds, holds tokens or changes the pool.
- It doesn't decide what "unhealthy" means for you. Rejecting a borrow,
  pausing a market or alerting a person is the protocol's choice.
- It doesn't judge the issuer. It reads what was reported and when.
