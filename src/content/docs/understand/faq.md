---
title: FAQ
description: Short answers to common questions about Assay.
---

### Is Assay a rating agency?

No. Assay shows what issuers and attestors publish, when, and where, with a
link to each source. It never grades, ranks or colours an issuer as good or
bad.

### Does "no reserve link" mean an issuer is doing something wrong?

No. The `attestation_of_reserve` field in `stellar.toml` is optional in
SEP-1. Many issuers publish reserve information elsewhere. The board records
what the field contains, nothing more.

### Can I trust a signed reserve report?

A signature proves who made the statement and that it hasn't been changed
since. It doesn't prove the figures are true. Trust in the figures still
comes from who the attestor is.

### Is my money safe if a pool uses the guard?

The guard is one safety check, not a guarantee. It stops new exposure when
reserve reports are missing, stale or short, under rules the pool chooses.
Today it runs on testnet only and has not been audited.

### Why does the board say "unknown" so often?

Because most reserve reports are PDFs or web pages without a date or figures
a computer can read. The board never guesses; unknown is the honest answer.

### Does Assay replace price oracles?

No. Oracles report prices. A price can stay flat while backing disappears.
Assay reports on backing and is meant to sit alongside oracles. See
[prior art](/evidence/prior-art/).

### Can the guard move or freeze funds?

No. It only reads the registry and answers. What to do with the answer is
the protocol's decision.

### Is it on mainnet?

The board reads mainnet data. The contracts are on testnet only, and won't
go to mainnet before an audit. See the [roadmap](/project/roadmap/).

### I'm an issuer and something about my asset is wrong.

Use the correction link on your asset's page on the board. Corrections are
fixed and logged in public with their date: see [corrections](/project/corrections/).

### Who builds Assay?

Garkuwa Labs. Everything is open source under Apache-2.0 on
[GitHub](https://github.com/Garkuwa-Studio).
