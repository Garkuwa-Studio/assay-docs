---
title: Scripts and make targets
description: Every command in the core repo, what it does and what it needs.
---

All commands run from the root of `Garkuwa-Studio/assay`. Scripts that touch
a network refuse anything but **testnet**.

## Make targets

| Target | Runs |
|---|---|
| `make build` | `cargo build --workspace`, `stellar contract build`, `pnpm -r build` |
| `make test` | `cargo fmt --check`, `cargo clippy -D warnings`, `cargo test`, `pnpm lint`, `pnpm -r build`, `pnpm typecheck`, `pnpm test` |
| `make e2e` | `make build`, then both testnet demos. Deploys fresh contracts. |
| `make audit-scan` | `cargo audit`, `cargo clippy`, `pnpm audit` into dated files in `docs/audit/dep-scan/` |
| `make fmt` | `cargo fmt --all` and `pnpm format` |

## Scripts (`@garkuwa/assay-scripts`)

Run with `pnpm --filter @garkuwa/assay-scripts <script>`.

### `demo:registry`

Deploys a registry on testnet, registers `ADEMO`, adds two attestors, sets a
supply witness, posts supply and two reports, and reads status. Writes the
report documents to `docs/testnet/reports/` and a receipt to
`docs/audit/e2e-receipts/registry-<date>.json`.
Needs: `assay-admin`, `assay-issuer`, `assay-attestor-a`, `assay-attestor-b`,
`assay-witness`. Guide: [Run the registry demo](/build/registry-demo/).

### `demo:circuit-breaker`

Deploys a registry, the guard and the demo pool on testnet, then runs the
four-step story. Writes `docs/DEMO-RUN.md` and
`docs/audit/e2e-receipts/circuit-breaker-<date>.json`.
Needs: `assay-admin`, `assay-issuer`, `assay-attestor-a`, `assay-witness`,
`assay-borrower`. Guide: [Run the circuit breaker](/build/circuit-breaker-demo/).

### `sign-report`

```bash
pnpm --filter @garkuwa/assay-scripts sign-report <report.json> --key <identity> [--out signed.json]
```

Puts the identity's public key in `attestor.stellar_key`, signs the
canonical payload through `stellar message sign` (SEP-53) without reading
the secret, verifies the result and writes `<report>.signed.json`. The
script runs from `scripts/`, so pass an absolute path. Guide:
[For issuers](/build/issuers/).

### `check-links`

Checks every link and hash in `README.md` and `docs/`: transactions against
Stellar RPC, contracts against stellar.expert, web pages, local files and
headings. Read-only. Guide: [Checking the evidence](/build/evidence-checks/).

### `demo`

A placeholder that prints "not implemented yet". Use the two demo scripts
above.

## The `assay` CLI

The crate `assay-stellar` builds a binary called `assay`. In version 0 it has
no commands and prints `assay 0.0.0: no commands yet`. The planned commands
(`assay check`, `assay report sign/post`) come with SCF tranche 1; until then,
the scripts above do the same jobs.
