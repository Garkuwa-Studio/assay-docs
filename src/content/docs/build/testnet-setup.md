---
title: Testnet identities
description: Create and fund the Stellar testnet accounts the demos use. Secrets stay in the CLI keystore.
---

The demo scripts sign transactions with **named identities** in the Stellar
CLI's keystore. They never read a secret key themselves, and they refuse to
run against any network but testnet.

:::caution[Testnet only]
Everything here uses Stellar testnet, where tokens have no value. Never
reuse these identities, or any key you generated for a demo, on mainnet.
:::

## Create the identities

Each command creates a key, stores it in the keystore and funds the account
from Friendbot, testnet's faucet:

```bash
for k in assay-admin assay-issuer assay-attestor-a assay-attestor-b assay-witness assay-borrower; do
  stellar keys generate "$k" --network testnet --fund
done
```

| Identity | Role in the demos | Used by |
|---|---|---|
| `assay-admin` | Deploys the contracts; registry admin | both demos |
| `assay-issuer` | Issues the demo asset `ADEMO`; asset admin in the registry | both demos |
| `assay-attestor-a` | Posts reserve reports | both demos, `sign-report` |
| `assay-attestor-b` | Second attestor | registry demo |
| `assay-witness` | Posts the on-chain supply | both demos |
| `assay-borrower` | Deposits collateral and borrows from the demo pool | circuit breaker |

## Check them

Print the public addresses (never the secrets):

```bash
stellar keys address assay-admin
```

A real run from 14 October 2026:

```text
✅ Key saved with alias assay-newcomer in "~/.config/soroban/identity/assay-newcomer.toml"
✅ Account assay-newcomer funded on "Test SDF Network ; September 2015"
assay-admin        GDG23ZJYA4DPRZIWFMEKNDCMFZ2NGT56CM63D4JHU57W4FSOEN4QAGWN
assay-issuer       GDTB33U75MGMILME2RWXBL5CUPZP4W43Y225OLWUOZ7D2YNSBQTUOPKE
assay-attestor-a   GBQK5IGFFJUEMJJ6G4ZRU2N4ZBUUEV2OFYUQSEXLOI5NMV6FHJ6F7ZPC
…
```

:::danger[Keep secrets out of logs]
`stellar keys secret` (also called `stellar keys show`) prints a secret key. Don't run it in a shared terminal,
a screen recording or CI.
:::

## If Friendbot is down

Funding can fail when Friendbot is busy. Re-run with an existing name:
`stellar keys fund assay-admin --network testnet`.

## Next

Run the [registry demo](/build/registry-demo/).
