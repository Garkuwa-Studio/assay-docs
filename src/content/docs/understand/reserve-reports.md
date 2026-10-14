---
title: Signed reserve reports
description: What a machine-readable, signed reserve report is, and why a signature matters.
---

Today a reserve report is usually a PDF. A person can read it; a computer
can't. Nobody can tell from the link alone how old it is, and if it stops
being updated, nothing notices.

Assay proposes a small change: **publish the same figures as a short JSON
file, signed with a Stellar key**, next to the PDF you already have.

## What's in one

```json
{
  "sep": "reserve-report-v0",
  "asset": "YOURCODE:GYOURISSUER…",
  "as_of": "2026-09-30T23:59:59Z",
  "reserves": [{ "type": "cash", "amount": "1010000.00", "unit": "USD" }],
  "liabilities": { "supply": "1000000.00", "unit": "YOURCODE" },
  "attestor": { "name": "Your firm", "role": "auditor", "domain": "yourfirm.com" },
  "evidence": [{ "uri": "https://yourfirm.com/reports/2026-09.pdf", "sha256": "…" }],
  "signature": "…"
}
```

- **as_of**: the date the figures are true for. That's how report age is
  measured.
- **reserves** and **liabilities**: what's held and what's owed, as text so
  no rounding creeps in.
- **evidence**: your existing PDF, with its fingerprint (SHA-256), so anyone
  can check the PDF wasn't swapped later.
- **signature**: made with the attestor's Stellar key.

## Why sign it

A signature says **who** made the statement. Anyone can check it with free
tools, and if a single figure is changed afterwards, the check fails. You can
see that happen in [Verify a report](/build/verify-a-report/).

A signature does not prove the figures are true. It ties them to a named
signer, which is what an audit trail needs.

## Is it a standard?

It's a draft. The format is written up as a proposed Stellar Ecosystem
Proposal (SEP), and builds on two existing standards: SEP-1 (`stellar.toml`)
and SEP-53 (signed messages). Read the [draft](/reference/report-format/).

Publishing one is optional, like the `attestation_of_reserve` field itself.
The step-by-step guide for issuers and attestors is
[here](/build/issuers/).
