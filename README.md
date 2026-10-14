# assay-docs

The documentation site of **Assay, by Garkuwa Labs**: open proof of reserves
and circuit breakers for real-world assets and stablecoins on Stellar.

Live at **https://docs.assay.wtf** · Board: https://assay.wtf ·
Core repo: [Garkuwa-Studio/assay](https://github.com/Garkuwa-Studio/assay)

Built with [Astro Starlight](https://starlight.astro.build): sidebar,
offline search (Pagefind), dark mode, "edit this page" links. Two tracks:

- **Understand**: plain language for anyone.
- **Build**: precise pages for developers, issuers, attestors and protocols.

## Develop

```bash
corepack enable && pnpm install
pnpm dev            # http://localhost:4321
pnpm build          # dist/; fails on any broken internal link or heading
pnpm check-dist     # disclaimer on every page, no localhost, files present
pnpm check-chain    # every linked tx returns SUCCESS on Stellar RPC; contracts exist
pnpm test           # sync helpers
pnpm lint && pnpm check
```

Node 24 and pnpm 11.9.0.

## Where the content comes from

| Content | Lives in | Edit |
|---|---|---|
| Understand, Build, Reference, most of Project | `src/content/docs/` here | Here, by pull request |
| Architecture, report format (SEP draft), census, stack status, prior art, testnet log, demo run, audit, security, contributing, changelog | `docs/` and root files of the core repo | In [Garkuwa-Studio/assay](https://github.com/Garkuwa-Studio/assay); then sync |
| Testnet runs page | `src/data/testnet.json`, from the core repo's `docs/audit/e2e-receipts/` | Sync |

Synced pages are copied from the core repo at the commit in
`assay-ref.json` (a release tag once one exists), and say so at the top. To
update them:

```bash
# set "ref" in assay-ref.json to the new commit or tag, then:
pnpm sync           # needs `gh auth login` while the core repo is private, and Google Chrome for diagrams
pnpm build && pnpm pdf   # re-print public/assay-architecture.pdf
```

`pnpm sync` also renders the architecture's Mermaid diagrams to
`public/diagrams/`. A diagram that fails to render is shown as a warning box
with its source, and the sync prints a warning; fix it in the core repo.
The output of `sync` and `pdf` is committed, so building never needs the
network.

## Deploy

A static-assets Cloudflare Worker (`wrangler.jsonc`), like the board.
Build command `pnpm build`, output `dist`, `NODE_VERSION=24`. `SITE_URL` is
optional and defaults to `https://docs.assay.wtf`.

## Licence

Apache-2.0. "Assay" and "Garkuwa Labs" are names of Garkuwa Labs.
