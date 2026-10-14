---
title: Verify a report yourself
description: Check a signed reserve report with the Stellar CLI, and watch the check fail when one figure changes.
---

You don't need Assay's code to check a signed report. The signature is a
standard SEP-53 message signature, and the Stellar CLI can verify it. This
page uses the `report.signed.json` from [For issuers](/build/issuers/).

## How the signature is made

1. Take the report **without** its `signature` field.
2. Serialise it as canonical JSON ([RFC 8785](https://www.rfc-editor.org/rfc/rfc8785)):
   keys sorted, no spaces, fixed number format. This is the _payload_.
3. Sign the payload with SEP-53: Ed25519 over
   SHA-256(`"Stellar Signed Message:\n"` + payload).
4. Store the base64 signature in `signature`, and the signer's public key in
   `attestor.stellar_key`, which is part of the signed content.

## 1. Rebuild the payload

With the core repo built (`pnpm -r build`), from the folder holding the
report:

```bash
node --input-type=module -e "import {signingPayload} from './assay/packages/sdk/dist/index.js'; import {readFileSync} from 'node:fs'; process.stdout.write(signingPayload(JSON.parse(readFileSync(process.argv[1]))))" report.signed.json > payload.json
cat payload.json
```

```text
{"as_of":"2026-10-13T23:59:59Z","asset":"ADEMO:GDTB33U75MGMILME2RWXBL5CUPZP4W43Y225OLWUOZ7D2YNSBQTUOPKE","attestor":{"domain":"assay.wtf","name":"Demo Attestor A (testnet)","role":"auditor","stellar_key":"GBQK5IGFFJUEMJJ6G4ZRU2N4ZBUUEV2OFYUQSEXLOI5NMV6FHJ6F7ZPC"},"evidence":[],"liabilities":{"supply":"1000000.00","unit":"ADEMO"},"note":"TESTNET DEMO. Figures are illustrative.","reserves":[{"amount":"1010000.00","type":"cash","unit":"USD"}],"sep":"reserve-report-v0"}
```

Any RFC 8785 library gives the same bytes; the SDK is one option.

## 2. Verify with the Stellar CLI

```bash
stellar message verify \
  --public-key "$(jq -r .attestor.stellar_key report.signed.json)" \
  --signature "$(jq -r .signature report.signed.json)" < payload.json
```

```text
ℹ️  Verifying signature against: GBQK5IGFFJUEMJJ6G4ZRU2N4ZBUUEV2OFYUQSEXLOI5NMV6FHJ6F7ZPC
✅ Signature valid
```

## 3. Change one figure

Raise the reserves from 1,010,000.00 to 1,110,000.00 and check again:

```bash
sed 's/1010000.00/1110000.00/' report.signed.json > tampered.json
# rebuild the payload from tampered.json as in step 1, into payload2.json
stellar message verify \
  --public-key "$(jq -r .attestor.stellar_key tampered.json)" \
  --signature "$(jq -r .signature tampered.json)" < payload2.json
```

```text
❌ Signature invalid
❌ error: Signature verification failed
```

## 4. Check the signer is allowed

A valid signature only tells you who signed. To know that signer speaks for
the asset, check that the key is listed in the issuer's `stellar.toml`
(`attestation_of_reserve_signers`) or, for a separate firm, in the firm's
own `stellar.toml` (`RESERVE_REPORT_KEYS`). The SDK's `verifyReport(report,
allowedKeys)` does both checks: see [SDK](/reference/sdk/).

## Test vectors

The repo has fixed test vectors in
[`packages/sdk/test-vectors/reserve-report-v0.json`](https://github.com/Garkuwa-Studio/assay/blob/main/packages/sdk/test-vectors/reserve-report-v0.json):
a report, its payload hash and signature from a published test-only key.
They also pass `stellar message verify`, a separate implementation.
