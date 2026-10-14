---
title: Reading the board
description: What each column and status on assay.wtf/board means, and what it doesn't mean.
---

The board is at [assay.wtf/board](https://assay.wtf/board/). It shows the
latest weekly snapshot. The date and the ledger number it was computed at
are at the top of the page.

## The summary line

Three numbers across the top:

- **Assets checked**: assets that say they are backed and have either at
  least 50 holders with a balance, or a reserve link on the issuer's own
  website. In the 12 October 2026 snapshot: 270.
- **With a working reserve link**: the link opened a document when Assay
  checked it: 33.
- **With a report under 35 days old**: 0. Most reports have no date a
  computer can read, so their age is unknown.

## The four statuses

Each asset has one status. None of them is a grade: they describe what the
issuer publishes, not whether the backing is real.

| Status | What it means |
|---|---|
| No reserve link | The issuer's `stellar.toml` has no `attestation_of_reserve` link. This field is optional, so this is not a fault. |
| Link did not load | There is a link, but it didn't open a document when checked. |
| Report to read | The link opens a web page or PDF that a person has to read. |
| Machine-readable report | The link opens a report a computer can read, with figures and a date. |

## Columns

- **Holders**: accounts holding a balance of the asset, from
  stellar.expert, with the date it was fetched.
- **Report age**: days since the date the report's figures are true for.
  **Unknown** means no date could be read.
- **Coverage as stated**: reserves divided by what's owed, as the issuer or
  attestor stated it. **Unknown** when no figures are in a form a computer
  can read. Assay never estimates a missing figure.
- **Sources**: the issuer's `stellar.toml` and the reserve link itself.

## Filters

You can filter by **kind** (stablecoins, real-world assets, crypto-backed,
from the issuer's own description), by **status**, and sort by holders,
asset code or issuer domain. Choosing "Report to read" lists the 33 assets
whose link opened a document.

## An asset page

Open any asset to see:

- the reserve link, when Assay checked it, the HTTP result and a SHA-256
  fingerprint of what it received;
- every field the issuer publishes in `stellar.toml` (SEP-1);
- holders and supply on the ledger;
- a **correction link**. Anyone, including the issuer, can report a
  mistake; corrections are logged in public ([log](/project/corrections/)).

## Method and limits

The full rules for each status, report age, coverage and supply are on the
board's [method page](https://assay.wtf/board/method/), including what the
board can't see. See also [Limits](/understand/limits/).
