---
title: Roadmap
description: What's built, what the demo sprint delivers, and what each tranche adds, with estimates in weeks.
---

From the [architecture, §9](/project/architecture/#9-roadmap). Estimates are
working time for each stage, not calendar dates.

| Stage | Scope | Estimate |
|---|---|---|
| Demo sprint (before submission) | Board v0 on mainnet data; registry v0 on testnet; guard demo; SEP draft | 5 weeks |
| T1 — MVP | Board, indexer and API v1 on mainnet data | 5 weeks |
| T2 — Testnet | Registry, standard, guard, pilots, threat model | 6 weeks |
| T3 — Mainnet | Audit, mainnet launch, go-live, transparency report | 6 weeks |

## Demo sprint: where it stands (14 October 2026)

| Item | State |
|---|---|
| Census v0 and stack check | Done: [census](/evidence/census/), [stack status](/evidence/stack-status/) |
| Indexer v0 | Done: weekly census of Stellar mainnet |
| Board v0 | Live at [assay.wtf](https://assay.wtf/board/) |
| Registry v0 on testnet | Done: [registry demo](/build/registry-demo/) |
| Guard and circuit-breaker demo | Done: [demo run](/evidence/demo-run/) |
| Evidence pack and SEP draft | Draft written: [report format](/reference/report-format/); not yet posted for discussion |
| Docs site | This site |

## T1 — MVP: board, indexer and API v1 on mainnet data (5 weeks)

| Deliverable | Today | Done when |
|---|---|---|
| **1.1 Indexer v1: census and reserve-report checks.** Every asset whose issuer publishes a `stellar.toml`; SEP-1 fields; report fetch and checks (resolves, content type, SHA-256, date, stated figures); supply at a recorded ledger; manual transcriptions stored with source, page, date and transcriber. | v0: weekly census, 270 assets checked; supply not yet published | 100% of anchored assets discoverable from issuer `stellar.toml` files covered, discovery method documented; refresh at least daily for 7 days in a row without manual help; every record carries its ledger and timestamp; fixture tests for a missing link, a broken link, an unstructured PDF and a structured report; manual transcriptions flagged. |
| **1.2 Risk-context checks.** Issuer account flags (`auth_required`, `auth_revocable`, `auth_clawback_enabled`, `auth_immutable`) and signer thresholds; redemption path (transfer server `/info` lists the asset for withdrawal); exit liquidity within 2% and 5% of mid on the Stellar DEX and AMMs; `collateral_address_signatures` validity windows. | Not started | Every check shown per asset with the ledger it was read at; expired collateral signatures flagged in a fixture test and on a live or testnet example; liquidity reproducible from a documented script; issuer flags match Horizon for a published sample of 10 assets. |
| **1.3 Public board v1, API v1 and correction workflow.** `/v1/assets`, `/v1/assets/{code}-{issuer}`, `/v1/summary`, `/v1/history`; every figure linked to its source and time; correction form and public log; board data under CC BY 4.0. | v0 board live; correction links; no API yet | Board and API live with identical data; every figure has a source link; a test correction processed end to end and visible in the log; disclaimers on every asset page; Lighthouse accessibility ≥ 95; API documented with examples. |

## T2 — Testnet: registry, standard, guard, pilots, threat model (6 weeks)

| Deliverable | Today | Done when |
|---|---|---|
| **2.1 Reserve registry v1.** Issuers claim their asset with a key listed in `stellar.toml`; attestors registered as independent or issuer; timelocked attestor changes; supply witness; ledger-pinned reports; conservative status including independent count; bounded history; events on every write. | v0 on testnet: attestors, supply witness, ledger-pinned reports, conservative status, bounded history, events | Deployed on testnet with its ID published; tests for: an unregistered attestor rejected, an attestor change blocked until the timelock expires, an issuer claim accepted only with the `stellar.toml` key, exactly 100% covered and 99.99% short, a stale report excluded, independent and issuer attestors counted separately, stated liabilities below witnessed supply flagged. |
| **2.2 Reserve report standard, CLI and SDK.** SEP draft (reserves by type and custodian, liabilities, ledger, attestor identity and role, evidence hashes, Ed25519 signature by a `stellar.toml` key); `assay` CLI to validate, sign and post; TypeScript SDK for reading status. | SEP drafted; signing and verification in the SDK and a script; CLI is a placeholder | SEP posted in stellar-protocol discussions, review comments answered in a public changelog; a CLI-made report validates against the schema and verifies with the `stellar.toml` key; a tampered report fails with a readable error; CLI on crates.io and SDK on npm; an attestor goes from zero to a posted testnet report in under 30 minutes using the docs, timed. |
| **2.3 Assay Guard.** `is_healthy(asset, policy)` with reasons `UNKNOWN_ASSET`, `NO_REPORT`, `STALE`, `UNDERCOVERED`, `TOO_FEW_ATTESTORS`, `NO_INDEPENDENT_ATTESTOR`, `DISAGREEMENT`, `SUPPLY_MISMATCH`; integration guide and test kit; webhook and feed alerts. Fails closed; never moves funds. | v0 on testnet with six reasons; integration guide in these docs | Deployed on testnet; a test for each reason; fail-closed tests for an unknown asset, an empty registry, a report one second past the max age, issuer-only attestation with `min_independent = 1`, and a failed registry call; strict and lenient profiles from one contract; an alert within one ledger close of a status change, recorded. |
| **2.4 Testnet pilots.** One attestor or issuer posts signed reports; one lending market or vault calls the guard in its testnet deployment. | The demo pool shows the call; no partner yet | The partner's reports on testnet with transactions, verifiable against its `stellar.toml` key; the partner protocol rejecting an action on a short or stale report and accepting it after a fresh one, with transactions; integration time recorded and published. |
| **2.5 Threat model and monitoring plan.** STRIDE (Stellar's four-section template) for registry, guard, indexer, supply witness and board; monitoring per the SCF on-chain monitoring template; Scout, cargo audit and clippy scans. | Threat summary in the [architecture](/project/architecture/#6-security-model); dated cargo audit and clippy scans in [audit](/evidence/audit/) | Every threat mapped to a component, with mitigations citing file and line; at least one monitoring rule per threat (trigger, severity, response, owner); scans committed and findings triaged in the remediation log. |

## T3 — Mainnet: audit, launch, go-live, transparency report (6 weeks)

| Deliverable | Today | Done when |
|---|---|---|
| **3.1 QA, documentation and audit package.** QA across contracts, indexer, API, board and CLI, with stress tests from the threat model; reproducible builds; docs in two tracks; audit package. | Docs in two tracks: this site | Coverage report published; reproducible build hashes match CI; docs live; QA checklist complete with no open critical issue; audit package delivered to the SCF Audit Bank. |
| **3.2 Audit remediation.** Fix the findings of the SCF Audit Bank review. | — | Audit report published; all critical, high and medium findings fixed within 20 business days and verified by re-test; remediation log updated. |
| **3.3 Mainnet deployment and monitoring.** Registry and guard on mainnet, admin keys under multisig, production monitoring. | — | Mainnet IDs and WASM hashes published, byte-identical to the audited build; multisig signers documented; every monitoring rule tested with a simulated event. |
| **3.4 Indexer production hardening.** Daily refresh, mainnet supply witness, status page, backup RPC. | — | ≥ 99% refresh success over 30 days; supply witness posting on mainnet on schedule, with transactions; public status page; recovery from a simulated RPC outage documented. |
| **3.5 Mainnet go-live.** At least one attestor posting to the mainnet registry and one protocol reading the guard on mainnet; board asset pages linked to on-chain status. | — | Mainnet reports and protocol reads verifiable with transactions; asset pages show on-chain status for registered assets. |
| **3.6 First "State of reserves on Stellar" report.** Reporting coverage, report age, structured vs unstructured, independent attestation, and changes since the first census. | The [first census](/evidence/census/) is the baseline | Report published with method and data; every figure reproducible from the public API; shared in the Stellar Dev Discord and on the SCF dashboard. |

## After launch

Oracle adapters (RedStone, Chainlink), a scoped keeper for protocols that
can't change their code, more attestors per asset, and quarterly reports.
See [Adoption and sustainability](/project/adoption/).

## Detail

Each component in the [architecture](/project/architecture/#4-components) is
tagged with the stage that delivers it, and the [flow map](/project/flow-map/)
marks every step as built or planned.

Mainnet happens only after an external audit.
