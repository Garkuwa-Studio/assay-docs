---
title: Glossary
description: Plain definitions of the words used across Assay.
---

**Anchored asset.** A token whose issuer says, in `stellar.toml`, that it is
backed by something off the blockchain (`is_asset_anchored = true`).

**Attestation of reserve.** The optional SEP-1 field where an issuer links
to proof of its reserves.

**Attestor.** A party, such as an auditor or custodian, that signs a
statement about an asset's reserves. In the registry, an asset's
administrator approves attestors.

**Basis points (bps).** Hundredths of a percent. 10,000 bps = 100%;
50 bps = 0.5%.

**Board.** Assay's public website at [assay.wtf](https://assay.wtf/board/),
showing what every backed asset publishes about its reserves.

**Circuit breaker.** An automatic stop when a safety condition fails. In
Assay, a lending protocol asking the guard before accepting more of an asset.

**Coverage.** Reserves divided by what is owed. 100% (10,000 bps) means the
reserves equal the tokens owed.

**Disagreement.** The gap between the highest and the lowest coverage that
fresh attestors report for the same asset.

**Guard.** Assay's contract that answers "is this asset healthy under my
policy?" with yes or no and a reason. It never moves funds.

**Liabilities.** What the issuer owes token holders, usually the token
supply.

**Policy.** A protocol's own thresholds for the guard: minimum coverage,
maximum report age, minimum attestors, allowed disagreement and supply
tolerance.

**Registry.** Assay's contract where attestors post reserve reports and a
witness posts supply. Anyone can read an asset's status from it.

**Report age.** Time since the date a report's figures are true for (its
`as_of` date), not since it was posted.

**Reserves.** The real assets (cash, bonds, loans) that back a token.

**RWA.** Real-world asset: a token that stands for something off-chain.

**SEP.** Stellar Ecosystem Proposal: a shared standard for apps on Stellar.
SEP-1 defines `stellar.toml`; SEP-53 defines signed messages.

**`stellar.toml`.** A file an issuer publishes on its website describing
its organisation and tokens.

**Supply witness.** A party that records the on-chain token supply in the
registry, so reports can't understate what is owed.

**Testnet.** Stellar's practice network. Tokens there have no value.
