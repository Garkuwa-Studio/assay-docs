---
title: What is Assay?
description: Assay checks whether the tokens on Stellar that say they are backed can show it, and lets lending protocols stop automatically when they can't.
---

Think of a jeweller's hallmark. A small office tests the gold and stamps
the result on the metal. You don't have to trust the seller: the stamp says
who checked it and what they found.

Assay does something similar for tokens on Stellar that say they are backed
by real money, bonds or loans. It doesn't decide whether a token is good or
bad. It records **what the issuer publishes about its reserves, when, and
where it says so**, with a link to the source every time.

## The parts

1. **The board** ([assay.wtf](https://assay.wtf/board/)). A public page for
   every Stellar asset that claims backing. It shows whether the issuer
   links a reserve report, whether the link works, how old the report is,
   and what it says. You can read it without an account.
2. **The registry.** A smart contract on Stellar where approved checkers,
   called _attestors_, post reserve reports. Each report says how much is
   held in reserve, how many tokens are owed, and the date the figures are
   true for.
3. **The guard.** A smart contract that lending protocols can ask one
   question: _is this asset healthy right now?_ It answers yes or no, with a
   reason. If reports are missing, out of date, or show a shortfall, the
   answer is no.
4. **The standard.** A draft Stellar standard for reserve reports a computer
   can read, signed by a key the issuer lists. Plain PDF links keep working.

The board works on Stellar's main network today. The registry and the guard
run on **testnet**, Stellar's practice network, while they are built and
tested.

## Who it is for

- **Token holders and analysts** who want to see the backing claims in one
  place, with sources.
- **Issuers and attestors** who want their reserve reports to be read by
  software, not only by people.
- **Lending protocols** that accept these tokens as collateral and need to
  stop new lending when the backing can't be shown.

## What Assay is not

Assay is not an audit and not a rating. It does not say an issuer is
trustworthy. It shows what was published and when, and it never fills in a
number that wasn't published: missing information shows as **unknown**.
Read more in [Limits](/understand/limits/).
