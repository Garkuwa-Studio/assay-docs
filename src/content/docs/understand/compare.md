---
title: How Assay compares
description: Assay next to SEP-1 reserve links as they are today and price or NAV oracles.
---

Think of three ways to answer "is this token backed?". A link in the issuer's
file is a note saying "the proof is over there". An oracle tells you the
price, which can stay flat while the backing disappears. Assay checks the
proof, keeps the date, and lets a contract act when the proof goes missing.

| | SEP-1 link today | Price / NAV oracles | Assay |
|---|---|---|---|
| Reads every issuer's reserve link | — | — | Yes ([board](https://assay.wtf/board/)) |
| Report age tracked; stale triggers action | No | No | Yes: fails closed (testnet) |
| Figures pinned to a ledger | No | — | Yes: every registry report carries a ledger (testnet) |
| Signed, attributable reports | No | Signed prices, not reserves | Yes: SEP-53 signatures, attestor signs each post |
| Independent vs issuer attestation visible | No | — | Planned for T2 |
| Readable by Soroban contracts | No | Prices yes; reserves not on Stellar today | Yes: `is_healthy` (testnet) |
| Open standard, any provider can post | — | Provider-specific | Draft SEP; any registered attestor can post |

"Testnet" means it works today on Stellar testnet, with
[transactions](/project/testnet/), and goes to mainnet in T3 after an audit.

## Complement, don't compete

Assay doesn't replace oracles. RedStone, Chainlink or any other provider can
become an attestor and post reserve data to the registry. Oracle adapters
are planned after launch. See [prior art](/evidence/prior-art/) for what each
project on Stellar does today.

## Not a rating agency

Assay publishes facts with sources and never scores an issuer. See
[Safeguards](/project/safeguards/).
