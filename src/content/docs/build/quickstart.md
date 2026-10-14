---
title: Quickstart
description: Clone the core repo, build the three contracts and run every test.
---

This gets the core repo, `Garkuwa-Studio/assay`, building and tested on your
machine. Nothing here touches a network.

## Prerequisites

| Tool | Version | Notes |
|---|---|---|
| Rust | 1.94.0 | Pinned in `rust-toolchain.toml`, with `rustfmt`, `clippy` and the `wasm32v1-none` target. `rustup` installs it on first use. |
| Stellar CLI | 28.1.0 | `stellar` builds contracts and talks to testnet. [Install guide](https://developers.stellar.org/docs/tools/cli/install-cli). |
| Node.js | 24 or newer | |
| pnpm | 11.9.0 | `corepack enable` picks the version from `package.json`. |

## Clone and install

```bash
git clone https://github.com/Garkuwa-Studio/assay
cd assay
corepack enable && pnpm install
```

## Build

```bash
make build
```

This runs three steps:

1. `cargo build --workspace`: the Rust workspace (contracts, the CLI crate).
2. `stellar contract build`: the three Soroban contracts to WebAssembly, in
   `target/wasm32v1-none/release/`: `assay_registry.wasm`, `assay_guard.wasm`
   and `assay_demo_pool.wasm`.
3. `pnpm -r build`: the TypeScript SDK (`packages/sdk`) and the scripts.

## Test

```bash
make test
```

`make test` runs the same checks as CI, and stops at the first failure:

| Step | What it checks |
|---|---|
| `cargo fmt --all -- --check` | Rust formatting |
| `cargo clippy --workspace --all-targets -- -D warnings` | Lints, warnings as errors |
| `cargo test --workspace` | 71 contract tests: registry 39 (plus 1 ignored, the T1 timelock), guard 21, demo pool 10, CLI 1 |
| `pnpm lint` | ESLint and Prettier |
| `pnpm -r build` then `pnpm typecheck` | TypeScript |
| `pnpm test` | SDK 14 tests (including the signing test vectors), scripts 18 tests |

The test counts are from the run on 14 October 2026.

## What's in the repo

```
assay/
├── contracts/registry     reserve registry
├── contracts/guard        circuit breaker
├── contracts/demo-pool    TESTNET DEMO ONLY
├── crates/assay-stellar   CLI (assay), placeholder until T2
├── packages/sdk           @garkuwa/assay-sdk
├── scripts/               testnet demos, sign-report, check-links
└── docs/                  architecture, census, testnet evidence, SEP draft
```

## Next

- [Set up testnet identities](/build/testnet-setup/), then run the
  [registry demo](/build/registry-demo/) and the
  [circuit breaker](/build/circuit-breaker-demo/).
- Or go straight to [signing a reserve report](/build/issuers/).
