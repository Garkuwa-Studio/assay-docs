---
title: Registry contract
description: Functions, types, events and errors of the reserve registry (contracts/registry), version 0.
---

Source: [`contracts/registry/src/lib.rs`](https://github.com/Garkuwa-Studio/assay/blob/main/contracts/registry/src/lib.rs).
Interface version `0`. Testnet only.

Registered attestors post reserve reports per asset, a supply witness posts
the asset's supply, and anyone reads a status computed on read. Amounts are
integers with 7 decimals. The contract never converts units: a report must
state reserves in the unit the asset was registered with.

## Constants

| Name | Value | Meaning |
|---|---|---|
| `BPS` | 10,000 | Basis points in 100% |
| `MAX_ATTESTORS` | 20 | Attestors per asset |
| `HISTORY_LEN` | 10 | Reports kept per attestor per asset; older ones are dropped |
| `DEFAULT_MAX_AGE_SECS` | 3,024,000 (35 days) | Suggested `max_age_secs` at registration |
| `DEFAULT_MISMATCH_TOLERANCE_BPS` | 50 (0.5%) | Suggested tolerance at registration |

## Functions

### Setup and roles

| Function | Auth | Does |
|---|---|---|
| `__constructor(admin: Address)` | at deploy | Sets the contract admin |
| `version() -> u32` | none | `0` |
| `admin() -> Address` | none | The contract admin |
| `register_asset(asset: Address, asset_admin: Address, unit: Symbol, max_age_secs: u64, mismatch_tolerance_bps: u32)` | contract admin | Registers an asset (its token contract). Errors: `AlreadyRegistered`, `InvalidPolicy` |
| `add_attestor(asset, attestor)` | asset admin | Adds an attestor. Errors: `NotRegistered`, `AlreadyAttestor`, `TooManyAttestors` |
| `remove_attestor(asset, attestor)` | asset admin | Removes an attestor; its reports stay readable but stop counting. Errors: `NotRegistered`, `NotAttestor` |
| `set_supply_witness(asset, witness)` | asset admin | Sets the one supply witness and clears the previous witness's post |

In v0 only the contract admin registers assets. Issuers claiming their own
asset through `stellar.toml`, and a timelock on attestor changes, are
planned for SCF tranche 1.

### Posting

| Function | Auth | Does |
|---|---|---|
| `post_supply(asset, amount: i128, ledger: u32)` | the witness | Records supply measured at `ledger`. Errors: `NotRegistered`, `NoWitness`, `NegativeAmount`, `FutureLedger`, `StaleLedger` |
| `post_report(asset, attestor, report: Report)` | the attestor | Appends a report to the attestor's history. Errors: `NotRegistered`, `NotAttestor`, `UnitMismatch`, `NegativeAmount`, `FutureTimestamp`, `FutureLedger`, `OutOfOrder` |

### Reading (no auth, no writes)

| Function | Returns |
|---|---|
| `status(asset) -> Status` | Status under the asset's own max age and tolerance |
| `status_with(asset, max_age_secs: u64, mismatch_tolerance_bps: u32) -> Status` | Status under the caller's (used by the guard) |
| `asset(asset) -> Option<AssetConfig>` | The asset's configuration |
| `attestors(asset) -> Vec<Attestor>` | Current attestors |
| `reports(asset, attestor) -> Vec<ReportEntry>` | Kept history, oldest first |
| `supply(asset) -> Option<SupplyPost>` | The latest supply post |

How `Status` is computed: [Status rules](/build/status-rules/).

## Types

```rust
pub struct AssetConfig {
    pub asset_admin: Address,
    pub unit: Symbol,               // what the asset is backed by, e.g. USD
    pub max_age_secs: u64,
    pub mismatch_tolerance_bps: u32,
    pub witness: Option<Address>,
    pub registered_at: u64,
}

pub struct Attestor { pub address: Address, pub added_at: u64 }

pub struct Report {
    pub reserves: i128,
    pub reserves_unit: Symbol,
    pub liabilities: i128,          // as stated by the report, in token units
    pub as_of: u64,                 // Unix seconds the figures are as of
    pub ledger: u32,
    pub uri: String,                // where the full report document is
    pub sha256: BytesN<32>,         // SHA-256 of that document
}

pub struct ReportEntry { pub report: Report, pub posted_at: u64, pub posted_ledger: u32 }

pub struct SupplyPost { pub amount: i128, pub ledger: u32, pub posted_at: u64 }

pub struct Status {
    pub coverage_bps: u32,
    pub newest_age_secs: u64,
    pub attestor_count: u32,
    pub disagreement_bps: u32,
    pub supply_mismatch: bool,
    pub supply_age_secs: u64,
}
```

## Events

Every write emits one event. The first topic is the event's name in snake
case; the other topics are the fields marked `#[topic]` in the source.

| Event | Topics | Data |
|---|---|---|
| `AssetRegistered` | `asset_registered`, `asset` | `asset_admin`, `unit`, `max_age_secs`, `mismatch_tolerance_bps` |
| `AttestorAdded` | `attestor_added`, `asset`, `attestor` | `at` |
| `AttestorRemoved` | `attestor_removed`, `asset`, `attestor` | `at` |
| `WitnessSet` | `witness_set`, `asset` | `witness` |
| `SupplyPosted` | `supply_posted`, `asset` | `amount`, `ledger` |
| `ReportPosted` | `report_posted`, `asset`, `attestor` | `reserves`, `liabilities`, `as_of`, `ledger`, `sha256` |

## Errors

| Error | Code |
|---|---|
| `AlreadyRegistered` | 1 |
| `NotRegistered` | 2 |
| `AlreadyAttestor` | 3 |
| `NotAttestor` | 4 |
| `TooManyAttestors` | 5 |
| `NoWitness` | 6 |
| `UnitMismatch` | 7 |
| `FutureTimestamp` | 8 |
| `FutureLedger` | 9 |
| `StaleLedger` | 10 |
| `OutOfOrder` | 11 |
| `NegativeAmount` | 12 |
| `InvalidPolicy` | 13 |

When each one is raised: [Status rules](/build/status-rules/#what-the-registry-refuses-to-store).

## Storage

All entries are persistent and extended to the maximum TTL on every write to
the asset, so `status` keeps working as long as the asset is in use.
