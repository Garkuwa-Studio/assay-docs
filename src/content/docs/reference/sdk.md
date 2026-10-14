---
title: SDK
description: "@garkuwa/assay-sdk: canonical form, signing and verification of reserve-report-v0 documents."
---

Source: [`packages/sdk`](https://github.com/Garkuwa-Studio/assay/tree/main/packages/sdk).

:::note[Not published yet]
`@garkuwa/assay-sdk` is version `0.0.0` and is not on npm yet; publishing is
planned for SCF tranche 1. Use it from the core repo's workspace
(`"@garkuwa/assay-sdk": "workspace:*"`) or build it with `pnpm -r build` and
import `packages/sdk/dist/index.js`.
:::

It depends on [`@stellar/stellar-sdk`](https://www.npmjs.com/package/@stellar/stellar-sdk)
17.2.1 for keys and SEP-53 message signatures.

## Exports

```ts
import {
  REPORT_SEP,        // "reserve-report-v0"
  canonicalize,      // RFC 8785 canonical JSON
  withoutSignature,
  signingPayload,
  signReport,
  verifyReport,
  type ReserveReportV0,
  type VerifyResult,
} from "@garkuwa/assay-sdk";
```

### `canonicalize(value: unknown): string`

RFC 8785 JSON Canonicalization Scheme: object keys sorted by UTF-16 code
units, ECMAScript number formatting, no whitespace. Throws a `TypeError` on
non-finite numbers, lone surrogates in strings or keys, and values JSON
can't represent.

### `withoutSignature(report): ReserveReportV0`

A copy of the report without its `signature` field.

### `signingPayload(report): Uint8Array`

The bytes that are signed: UTF-8 of `canonicalize(withoutSignature(report))`.

### `signReport(report, keypair): ReserveReportV0`

Returns a signed copy. It sets `attestor.stellar_key` to the keypair's public
key **before** signing, so the key is covered by the signature, then signs
the payload with SEP-53 (`keypair.signMessage`) and stores the base64
signature in `signature`.

```ts
import { Keypair } from "@stellar/stellar-sdk";
const signed = signReport(report, Keypair.fromSecret(process.env.SIGNER_SECRET!));
```

Prefer the [`sign-report` script](/reference/scripts/#sign-report), which
signs through the Stellar CLI keystore and never handles the secret.

### `verifyReport(report, allowedKeys?): VerifyResult`

```ts
type VerifyResult =
  | { ok: true; key: string }
  | { ok: false; reason: "unsigned" | "no_key" | "bad_key" | "bad_signature" | "key_not_allowed" };
```

| Reason | When |
|---|---|
| `unsigned` | No `signature` field |
| `no_key` | No `attestor.stellar_key` |
| `bad_key` | The key isn't a valid Stellar public key |
| `key_not_allowed` | `allowedKeys` was given and the key isn't in it |
| `bad_signature` | The signature isn't 64 bytes or doesn't verify |

Pass `allowedKeys` from the issuer's `attestation_of_reserve_signers` or the
attestor's `RESERVE_REPORT_KEYS` to check that the signer speaks for the
asset.

### `ReserveReportV0`

```ts
interface ReserveReportV0 {
  sep: "reserve-report-v0";
  asset: string;                       // CODE:ISSUER
  as_of: string;                       // ISO 8601 date the figures are true for
  ledger?: number;
  reserves: { type?: string; amount: string; unit: string }[];
  liabilities: { supply: string; unit: string };
  attestor?: { name?: string; stellar_key?: string; role?: string; domain?: string };
  evidence?: { uri: string; sha256?: string }[];
  signature?: string;
  [extra: string]: unknown;            // extra fields are signed too
}
```

## Test vectors

[`packages/sdk/test-vectors/reserve-report-v0.json`](https://github.com/Garkuwa-Studio/assay/blob/main/packages/sdk/test-vectors/reserve-report-v0.json)
has a report, its canonical payload's SHA-256, the SEP-53 message hash and
the signature, made with a published **test-only** key (seed `a1` × 32,
public key `GC6HZPFVMNRXL6Q5QJBU2RTHETMSG57VHOMANFO5JHJG2DHBEIC2KTOS`).
Regenerate them with `pnpm --filter @garkuwa/assay-sdk vectors`. The vectors
also pass `stellar message verify`, an independent implementation.
