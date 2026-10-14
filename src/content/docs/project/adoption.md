---
title: Adoption and sustainability
description: How Assay reaches issuers, attestors, protocols and wallets, and how it stays maintained.
---

## Launch coverage: every anchored asset, day one

The board needs no one's permission. It reads public `stellar.toml` files and
ledger data, so it covers every anchored asset on mainnet from the start.
Issuers, protocols and holders see Assay working before anyone is asked to
integrate.

## Bringing in attestors

- **Start where reporting already exists.** Issuers that publish an
  `attestation_of_reserve` link today get a pre-filled structured report and
  a [30-minute guide](/build/issuers/) to sign and post it.
- **Independent attestors**, such as auditors and custodians, get the same
  guide.
- **Oracle providers** are invited to post reserve data as attestors.

## Protocol adoption: three channels

1. **Lending markets and vaults.** A pilot with a protocol that already reacts
   to stale data (for example, Octarine stops quoting on a stale NAV), then
   Blend pools, Templar, Liqvid, DeFindex and Strata vaults. One
   [`is_healthy` call](/build/protocols/) plus a test kit.
2. **Wallets and explorers.** A TypeScript SDK and a badge, so reserve status
   appears where people hold and inspect assets: stellar.expert and wallets
   built on stellar-wallets-kit.
3. **Ecosystem visibility.** The SEP developed in public in the
   stellar-protocol discussions, monthly census posts in the Stellar Dev
   Discord, demos at Stellar developer meetings, and risk-signal partners
   such as Sylox (issuer-default and depeg protection markets) using Assay
   status as an input.

These are plans. None of the protocols or partners named here has committed
to an integration yet; pilots are announced with their transactions when
they happen.

## After launch

Oracle adapters (RedStone, Chainlink), a scoped keeper for protocols that
can't change their code, more attestors per asset, and quarterly "State of
reserves on Stellar" reports.

## Sustainability

The board, registry, guard, SEP and SDKs are a free public good under
Apache-2.0, maintained for 12 months after T3 and then through the SCF Public
Goods Award. Any future paid layer, such as an SLA-backed API or real-time
alerts, is sold to risk-data consumers, never to issuers, and never gates the
public board.

## Decentralisation and infrastructure

- Many attestors per asset; anyone can run the indexer or a supply witness;
  disagreements are shown, not hidden.
- Soroban contracts, a self-hostable indexer (container and Postgres) on
  public Horizon and RPC, and static sites for the board and these docs.

## Updates

Progress every two weeks on the SCF dashboard, the Stellar Dev Discord,
Matrix and Bluesky, and a monthly devlog in the core repo.
