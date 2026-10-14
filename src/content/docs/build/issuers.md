---
title: For issuers and attestors
description: Publish a signed, machine-readable reserve report in about 30 minutes, next to the report you already publish.
---

**What you get:** your asset's reserves shown on the board as a signed report
a computer can read, with its date and figures, instead of "a report a person
has to read". Lending protocols can check it automatically.

**What changes for you:** you publish one small JSON file next to your
existing report and add up to two lines to your `stellar.toml`. Your current
PDF or web page stays as it is. The format is a draft SEP:
[reserve report format](/reference/report-format/).

The pilot runs on testnet first and costs nothing.

## 1. Write the report (10 minutes)

One file per asset, with the figures from your latest attestation:

```json
{
  "sep": "reserve-report-v0",
  "asset": "YOURCODE:GYOURISSUER…",
  "as_of": "2026-09-30T23:59:59Z",
  "reserves": [{ "type": "cash", "amount": "1010000.00", "unit": "USD" }],
  "liabilities": { "supply": "1000000.00", "unit": "YOURCODE" },
  "attestor": { "name": "Your firm", "role": "auditor", "domain": "yourfirm.com" },
  "evidence": [{ "uri": "https://yourfirm.com/reports/2026-09.pdf", "sha256": "…" }]
}
```

- Amounts are strings.
- `as_of` is the date the figures are true for.
- Get the PDF's fingerprint with `shasum -a 256 report.pdf`.

## 2. Sign it (5 minutes)

Use a key you keep for reserve reports, **not your issuing key**. The secret
stays in the Stellar CLI's keystore:

```bash
stellar keys generate reserve-signer          # once
git clone https://github.com/Garkuwa-Studio/assay && cd assay
pnpm install && pnpm -r build
pnpm --filter @garkuwa/assay-scripts sign-report "$(realpath ../report.json)" --key reserve-signer
```

The script runs from `scripts/`, so pass an absolute path. It:

1. puts your public key in `attestor.stellar_key`, inside the signed content,
   so it can't be swapped later;
2. turns the report into canonical JSON (RFC 8785, without `signature`);
3. asks `stellar message sign` to sign it (SEP-53);
4. checks the signature, and writes `report.signed.json` next to your file.

```text
signed by GBQK5IGFFJUEMJJ6G4ZRU2N4ZBUUEV2OFYUQSEXLOI5NMV6FHJ6F7ZPC
wrote ~/report.signed.json
```

Any tool that signs SEP-53 messages works; the script is a convenience. To
check the result independently, see [Verify a report](/build/verify-a-report/).

## 3. Publish it (10 minutes)

Host `report.signed.json` over HTTPS the way you serve `stellar.toml`:

- `Content-Type: application/json`
- `Access-Control-Allow-Origin: *`

## 4. Point to it (5 minutes)

In the issuer's `stellar.toml`:

```toml
[[CURRENCIES]]
code = "YOURCODE"
issuer = "GYOURISSUER…"
attestation_of_reserve = "https://yourdomain.com/reserves/latest.json"
attestation_of_reserve_signers = ["GYOURSIGNINGKEY…"]
```

If a separate firm signs, it lists its key in its own `stellar.toml`:

```toml
RESERVE_REPORT_KEYS = ["GYOURSIGNINGKEY…"]
```

`attestation_of_reserve` is an existing, optional SEP-1 field;
`attestation_of_reserve_signers` and `RESERVE_REPORT_KEYS` are proposed by
the draft SEP.

**Done.** The board picks the report up at the next weekly census. On
testnet, we can also register your asset in the registry so you can see its
on-chain status.

## Good to know

- A signature says who made the statement, not that it is true.
- Reports are public.
- Each new report needs a later `as_of` than the last one.

To join the pilot, open an issue on
[Garkuwa-Studio/assay](https://github.com/Garkuwa-Studio/assay/issues).
