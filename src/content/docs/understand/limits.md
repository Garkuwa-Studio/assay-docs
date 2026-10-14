---
title: Limits
description: What Assay can and can't tell you, and where the project stands today.
---

Assay is careful about what it claims. Here is what it can't do.

## It checks what is claimed, not what exists

Assay reads reports. It can't open a bank account or count bonds. A report
can be wrong, and a signed report is only as good as its signer. A signature
tells you **who** said it, not that it is **true**.

## It is not an audit, a rating or advice

There are no grades, rankings or "good/bad" colours. Figures are shown as
stated by issuers or attestors, with the source and the time Assay checked.
Nothing on the board or in these docs is investment advice.

## Dates and ledger times differ

A report's figures are true for one date; supply on Stellar can change
every few seconds. Assay shows both times and never treats them as the
same moment.

## The board checks once a week

A link can fail for an hour and work later. The board records what it saw at
the time of the census, with the time. Holder counts come from a third
party (stellar.expert) and carry the time they were fetched.

## Missing means unknown

When a figure isn't published in a form a computer can read, the board shows
**unknown**. It never estimates or fills in a number.

## Where the project stands (14 October 2026)

| Part | Status |
|---|---|
| Board | Live on Stellar mainnet data, weekly census |
| Registry, guard, demo pool | Testnet only. Not audited. |
| Reserve report format | Draft, not yet a Stellar standard |
| `assay` command-line tool | Placeholder; the scripts in the core repo do the work today |
| Attestor timelock, issuer claims, independent vs issuer attestors | Planned for T2 |

The demo pool exists only to show the guard. It has no interest, no
liquidation and fixed prices, and must never be deployed to mainnet.

The full list is on the board's [method page](https://assay.wtf/board/method/)
and in the [architecture](/project/architecture/).
