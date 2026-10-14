---
title: Checking the evidence
description: Verify every transaction, contract and link in the docs, and produce dated dependency scans.
---

Assay's docs make claims with transaction hashes and contract IDs. Two tools
check them.

## Every link and hash: `check-links`

In the core repo:

```bash
pnpm --filter @garkuwa/assay-scripts check-links
```

It reads `README.md` and every Markdown file under `docs/`, and checks:

| Link | How it's checked |
|---|---|
| stellar.expert transaction | Stellar RPC `getTransaction` returns `SUCCESS` on that network |
| stellar.expert contract | The contract exists (stellar.expert API) |
| Web page | HTTP 2xx, following redirects, one request per second per host |
| Local file or `#heading` | The file and heading exist |

It never sends a transaction. Two groups are reported separately and don't
fail the run:

- links that need the Garkuwa-Studio repositories to be public;
- issuers' own reserve links quoted in the census, whose state was recorded
  on the census date.

A run on 14 October 2026:

```text
checked 177 links in 13 files: 46 tx, 14 contract, 64 web, 53 local (89 distinct remote)
3 need the Garkuwa-Studio repos pushed and public (expected until then):
  README.md:112  https://github.com/Garkuwa-Studio/assay-indexer  → HTTP 404
  …
4 issuer links quoted as census data (status recorded in the census):
  docs/CENSUS-v0.md:108  https://anchors.relay.vision/audits/ARST-Audit-No-1.pdf  → fetch failed
  …
no other failures
```

## Dependency and lint scans: `make audit-scan`

```bash
cargo install cargo-audit --locked   # once
make audit-scan
```

This saves three dated files in `docs/audit/dep-scan/`: `cargo audit`,
`cargo clippy` with warnings as errors, and `pnpm audit`. Local paths are
replaced with `~` and `.` so the files can be committed. Each finding and its
decision goes in the [remediation log](/evidence/remediation-log/).

## Receipts

Each demo run writes a JSON receipt to `docs/audit/e2e-receipts/` with every
transaction, contract ID and the WASM hash of each contract. The committed
receipts are shown on the [testnet page](/project/testnet/).

## On this site

The docs repo runs its own check, `pnpm check-chain`, over every
stellar.expert link on this site, and the build fails on any broken internal
link or heading.
