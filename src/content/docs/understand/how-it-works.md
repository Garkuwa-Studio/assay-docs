---
title: How it works
description: The board, the registry and the guard, and how a reserve report travels from an attestor to a lending pool.
---

Picture a weights-and-measures office in a market town. Inspectors check the
scales, write the result in a public ledger, and a shopkeeper can look up any
stall's last inspection before trading with it. Assay has the same three
jobs: **check, record, and let others act on the record**.

## 1. The board checks what issuers publish

Every week, Assay's indexer reads Stellar's main network and each issuer's
`stellar.toml` file. For every asset that claims backing it records:

- whether the issuer links a reserve report,
- whether that link opened when it was checked,
- how old the report is, if the date can be read,
- what the report says, if a computer can read it.

The board at [assay.wtf](https://assay.wtf/board/) shows the result. Every
figure links to its source, and every asset page has a link for the issuer
to correct a mistake.

Coming in T1: a daily refresh, a public API, supply at a recorded ledger,
and the checks a lender asked for before accepting RWA collateral: issuer
controls (clawback, authorization flags, signer thresholds), the redemption
path, exit liquidity on the Stellar DEX and AMMs, and the validity windows of
`collateral_address_signatures`.

## 2. The registry records signed reports

Some issuers and auditors want their reports read by software. For them,
Assay has a **registry**: a smart contract on Stellar.

- The asset's administrator approves one or more **attestors**: firms that
  check reserves, such as auditors.
- Each attestor posts a report: reserves held, tokens owed, the date the
  figures are true for, and a fingerprint (a SHA-256 hash) of the full
  report document.
- A **supply witness** posts how many tokens actually exist, so a report
  can't understate what's owed.

Coming in T2: each attestor is recorded as **independent** (an auditor,
custodian or oracle) or as the **issuer**, so you can see who vouches for an
asset.

Anyone can read an asset's **status** from the registry. It is worked out
when you ask, from the reports that are still fresh, and it always takes the
cautious view: the lowest coverage any attestor reported, and the larger of
"tokens owed" and "tokens that exist". The exact rules are in
[Status rules](/build/status-rules/).

## 3. The guard answers one question

A lending protocol doesn't want a table of numbers in the middle of a loan.
It wants a yes or no. The **guard** is a smart contract that reads the
registry and answers:

> Is this asset healthy under my rules?

The protocol sets its own rules (its **policy**): how much coverage is
enough, how old a report can be, how many attestors it wants. The guard
replies `true` or `false`, and when it's false, the first rule that failed:
no report, stale, too few attestors, undercovered, attestors disagree, or
supply mismatch.

What happens next is up to the protocol. In the [testnet
demo](/build/circuit-breaker-demo/), a small lending pool rejects the borrow
and records the reason on chain. The guard itself never moves money.

## 4. A standard for the report itself

The fourth part is a draft Stellar standard (SEP) that turns the reserve
link in `stellar.toml` into a report a computer can read: reserves by type
and custodian, liabilities, the ledger, who attests and in what role,
fingerprints of the evidence, and a signature by a key listed in
`stellar.toml`. Plain PDF links keep working. See
[Signed reserve reports](/understand/reserve-reports/).

## How the pieces fit

![Target design: issuers' stellar.toml feeds the indexer and board; auditors and oracles feed the registry; the guard reads the registry for lending markets.](/diagrams/architecture-1.svg)

This is the **target design**. Today the indexer, board, registry and guard
exist (the last two on testnet). Oracle adapters, the wallet and explorer
integrations, and an indexer acting as supply witness are planned; see the
[roadmap](/project/roadmap/).

See the [flow map](/project/flow-map/) for each step, and the
[architecture](/project/architecture/) for the full design.
