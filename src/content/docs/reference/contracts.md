---
title: Contract IDs
description: Every Assay contract deployed on Stellar testnet, with its run and WASM hash.
---

All Assay contracts are on **Stellar testnet** only. None is on mainnet, and
none has been audited. The authoritative list is the receipts on the
[testnet page](/project/testnet/); this page summarises them.

## Circuit-breaker run (14 October 2026)

Use these to try the guard. The guard reads this registry.

| Contract | ID | WASM SHA-256 |
|---|---|---|
| Registry | [`CBMTQWT7DZOPHQ6WJZN4OYZIFJ6XLSZYRCYJZVOWMWHMQR4TZ3MCOG4U`](https://stellar.expert/explorer/testnet/contract/CBMTQWT7DZOPHQ6WJZN4OYZIFJ6XLSZYRCYJZVOWMWHMQR4TZ3MCOG4U) | `92f7663d…6bfec865` |
| Assay Guard | [`CCVEIPYTY6RRVJZONFZL4WVGN66H5IU77H3HSSQJKH7I7WSDL6DIEKDV`](https://stellar.expert/explorer/testnet/contract/CCVEIPYTY6RRVJZONFZL4WVGN66H5IU77H3HSSQJKH7I7WSDL6DIEKDV) | `7b29fc4a…000f27ed` |
| Demo pool (TESTNET DEMO ONLY) | [`CCQP73IMYC67UUF7R4OIHMEWRZWMUZO2TQEKCTOFGYZ6NUFZT6JNKY33`](https://stellar.expert/explorer/testnet/contract/CCQP73IMYC67UUF7R4OIHMEWRZWMUZO2TQEKCTOFGYZ6NUFZT6JNKY33) | `3b96ecb5…950f7fd3` |
| DUSD (demo stablecoin) | [`CDKWYXW5W5ZOK3FDZFHNGXHNOO6YISS7DBGCSDQTQINVMH7THUTDWDGL`](https://stellar.expert/explorer/testnet/contract/CDKWYXW5W5ZOK3FDZFHNGXHNOO6YISS7DBGCSDQTQINVMH7THUTDWDGL) | Stellar Asset Contract |

## Registry run (13 October 2026)

| Contract | ID | WASM SHA-256 |
|---|---|---|
| Registry | [`CBUEGKQJNSJI2FXEIEK6B3RK52MZLNZECDEQPOFER32Z5UCSMCSJRRRF`](https://stellar.expert/explorer/testnet/contract/CBUEGKQJNSJI2FXEIEK6B3RK52MZLNZECDEQPOFER32Z5UCSMCSJRRRF) | `92f7663d…6bfec865` |

## Demo asset

| Asset | Issuer | Token contract |
|---|---|---|
| `ADEMO` (demo RWA) | `GDTB33U75MGMILME2RWXBL5CUPZP4W43Y225OLWUOZ7D2YNSBQTUOPKE` | [`CC22EDRUYLGMSF4YOP77GKP6O6SQQT6WY2VP6VHNHALTOBPGXNIKRWTB`](https://stellar.expert/explorer/testnet/contract/CC22EDRUYLGMSF4YOP77GKP6O6SQQT6WY2VP6VHNHALTOBPGXNIKRWTB) |

Both registries run the same WASM. Each demo run deploys **new** contracts,
so a run on your machine gives you your own IDs; the ones above are the
committed runs.

## Interface versions

Every contract has `version() -> u32`. All three return `0`.
