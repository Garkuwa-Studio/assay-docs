---
title: Why it matters
description: Billions in tokenized real-world assets on Stellar, about two million usable as collateral, and almost no reserve reports a computer can read.
---

## The short version

Stellar holds about **$4 billion** in tokenized real-world assets: tokens
that stand for dollars, government bonds, loans and similar things held
off-chain. ([Cointelegraph, citing Stellar's Dune dashboard, 29 August 2026](/evidence/stack-status/#6-reserve-verified-stablecoins).)

The same source counts roughly **$438 million** in what the dashboard calls
"reserve-verified" stablecoins issued on Stellar. What "reserve-verified"
means there isn't published; see [stack status §6](/evidence/stack-status/#6-reserve-verified-stablecoins).

Lending markets on Stellar accept only a small part of that as collateral.
The Blend pools that take these assets held "just above **$2M**" in August
2026 ([RedStone, 26 August 2026](/evidence/stack-status/#7-lending-markets-and-how-they-stop-new-exposure)).

Price and NAV oracles already exist on Stellar. What's missing is
**verifiable backing**: a lender's risk team can't keep watching it, and no
contract can see it. A lending market listing an RWA has no on-chain signal
for "the issuer stopped reporting", "reserves fell below supply" or "only the
issuer vouches for this".

## What issuers publish today

Stellar has a standard file, `stellar.toml`, where an issuer describes its
tokens. It has an **optional** field, `attestation_of_reserve`, for a link
to proof of reserves. Leaving it out is allowed and is not a fault.

Assay's first census, on 12 October 2026, looked at every asset on Stellar's
main network and narrowed them down to the ones worth checking:

| Step | Assets |
|---|---|
| Have an issuer website where a `stellar.toml` can be looked up | 274,439 |
| Listed in that file under their own code and issuer | 110,754 |
| Say they are backed by something off the blockchain | 23,162 |
| Checked by Assay (at least 50 holders with a balance, or a reserve link on the issuer's own website) | 270 |
| Publish a reserve link | 41 |
| Link opened a document when checked | 33 |
| Have a report under 35 days old | 0 |
| Have a report a computer can read | 0 |

Source: [Census v0](/evidence/census/) and the board's
[method](https://assay.wtf/board/method/).

So 33 links work, but each opens a PDF or web page a person has to read. No
software can tell the report's date or check its figures, and nothing alerts
anyone when a report stops arriving.

## What changes with Assay

- Anyone can **see** the state of every backing claim on the board, with
  sources.
- Issuers and attestors can publish a **signed report a computer can read**
  ([how](/build/issuers/)).
- Lending protocols can **stop new exposure automatically** when reports go
  missing, go stale or show a shortfall ([how](/build/protocols/)).
