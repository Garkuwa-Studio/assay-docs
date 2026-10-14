---
title: "Audit"
editUrl: "https://github.com/Garkuwa-Studio/assay/edit/main/docs/audit/README.md"
---

:::note[Copied from the core repository]
This page is [`docs/audit/README.md`](https://github.com/Garkuwa-Studio/assay/blob/main/docs/audit/README.md) in `Garkuwa-Studio/assay`, copied from a local copy with changes not yet pushed. To change it, edit it there.
:::

Evidence for reviewers: what was deployed and run, what the scans found,
and what was done about it. Nothing here is an external audit; that is
planned for T3 ([ARCHITECTURE.md §9](/project/architecture/)).

| Folder or file | What it holds | How it is produced |
|---|---|---|
| [`e2e-receipts/`](https://github.com/Garkuwa-Studio/assay/tree/main/docs/audit/e2e-receipts) | One JSON receipt per testnet run: contract IDs, wasm SHA-256, every transaction hash with a stellar.expert link, the status read, and whether it matched what was expected. | `make e2e` (testnet only) |
| [`dep-scan/`](https://github.com/Garkuwa-Studio/assay/tree/main/docs/audit/dep-scan) | Dated outputs of `cargo audit`, `cargo clippy -D warnings` and `pnpm audit`. | `make audit-scan` |
| [`remediation-log.md`](/evidence/remediation-log/) | Every finding, the decision taken and the fix, with dates. | By hand, after each scan |

## Receipts so far

| Date | Run | Receipt |
|---|---|---|
| 2026-10-13 | Registry v0: register, two attestors, supply, two reports, status | [registry-2026-10-13.json](https://github.com/Garkuwa-Studio/assay/blob/main/docs/audit/e2e-receipts/registry-2026-10-13.json) |
| 2026-10-14 | Guard and demo pool: the four-step circuit breaker | [circuit-breaker-2026-10-14.json](https://github.com/Garkuwa-Studio/assay/blob/main/docs/audit/e2e-receipts/circuit-breaker-2026-10-14.json) |

Human-readable versions: [TESTNET.md](/evidence/testnet-log/) and
[DEMO-RUN.md](/evidence/demo-run/).

## Planned

- Scout (CoinFabrik's Soroban analyzer) and a STRIDE threat model: T2.
- External audit of the registry and guard before mainnet: T3.
