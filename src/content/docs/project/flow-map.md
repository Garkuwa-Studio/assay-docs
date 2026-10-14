---
title: Flow map
description: The three flows through Assay, step by step, with what exists today and what is planned.
---

Three flows run through Assay. Each step is tagged:
<span class="tag built">Built</span> exists and has a contract ID, transaction or
live URL; <span class="tag sprint">Demo sprint</span> exists as a demo or draft;
<span class="tag">SCF T1/T2/T3</span> is planned for that grant tranche.

The diagrams are the target design from the [architecture](/project/architecture/).

## The whole system

![Target design: issuers' stellar.toml feeds the indexer and board; auditors and oracles feed the registry; the guard reads the registry for lending markets; wallets read the registry.](/diagrams/architecture-1.svg)

| Part | Status |
|---|---|
| Indexer census and board, on mainnet data | <span class="tag built">Built</span> [assay.wtf](https://assay.wtf/board/) |
| Registry contract | <span class="tag built">Built</span> testnet ([IDs](/reference/contracts/)) |
| Guard contract | <span class="tag built">Built</span> testnet |
| Reserve report format | <span class="tag sprint">Demo sprint</span> draft SEP |
| Indexer as supply witness | <span class="tag">SCF T1</span> |
| Oracle adapters (RedStone, Chainlink) | <span class="tag">SCF T2</span> |
| Wallets and explorers reading the registry | Planned, not yet scheduled |

## 1. Board check (no permission needed)

![Diagram: board check, indexer reads the ledger and each issuer's stellar.toml and reserve link, and publishes the board.](/diagrams/architecture-2.svg)

1. The indexer lists Stellar mainnet assets and their issuers' home domains. <span class="tag built">Built</span>
2. It reads each `stellar.toml` and its SEP-1 currency fields. <span class="tag built">Built</span>
3. It fetches the reserve link, records the HTTP result, type, size and
   SHA-256, and reads a date and figures when it can. <span class="tag built">Built</span>
4. The board publishes the snapshot, with sources, weekly. <span class="tag built">Built</span>
5. Issuers correct mistakes through a public log. <span class="tag sprint">Demo sprint</span>

## 2. An attestor posts a report

1. The attestor writes a `reserve-report-v0` document and signs it with
   SEP-53. <span class="tag built">Built</span> ([`sign-report`](/reference/scripts/#sign-report))
2. It publishes the document and posts the figures, the document's URL and
   SHA-256 to the registry with `post_report`. <span class="tag built">Built</span> testnet
3. The registry checks the attestor is registered and signed the call, the
   unit, the dates and the order. <span class="tag built">Built</span> testnet
4. The `assay report sign/post` CLI commands. <span class="tag">SCF T1</span>
5. Timelocked attestor changes; issuers claiming their asset via
   `stellar.toml`. <span class="tag">SCF T1</span>

The architecture's diagram for this flow shows the target design, in which
the registry also checks the report's signature on chain.

## 3. The circuit breaker trips

1. A borrower asks a lending pool to borrow against an RWA. <span class="tag built">Built</span> testnet demo pool
2. The pool calls `is_healthy(asset, policy)` on the guard. <span class="tag built">Built</span> testnet
3. The guard reads `status_with` from the registry and returns `(false,
   reason)` for the first rule that fails. <span class="tag built">Built</span> testnet
4. The pool rejects the borrow and records the reason; nothing moves. <span class="tag built">Built</span> ([demo run](/evidence/demo-run/))
5. A scoped keeper for pools that can't change their code. <span class="tag">SCF T2</span>
6. Pilots with real protocols and attestors. <span class="tag">SCF T2</span>

## Architecture as a PDF

The full architecture is available as a printable PDF:
[assay-architecture.pdf](/assay-architecture.pdf).
