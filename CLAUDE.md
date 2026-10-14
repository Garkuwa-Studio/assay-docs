# CLAUDE.md — assay-docs

The documentation site of Assay, by Garkuwa Labs (Astro Starlight). Org
repos: assay (core) · assay-indexer · assay-board · assay-docs (this) ·
proposals · .github.

## Rules

- **Facts, not ratings.** No grades, rankings or adjectives about issuers.
- Never describe SEP-1 `attestation_of_reserve` as required: it is optional.
- Nothing presented as built without a contract ID, tx hash or live URL.
  Status tags: Built / Demo sprint / SCF T1–T3. The testnet page reads
  src/data/testnet.json only; empty → "Demo in progress".
- Two tracks: Understand (plain language, short sentences, analogy first,
  second person, ~grade 8) and Build (precise, from the code).
- Synced pages come from the core repo at the ref in assay-ref.json; edit
  them there, never here.
- Reference pages are written from the source; re-check them when the
  contracts change.
- Responsive to 360px, keyboard focus, reduced motion, Lighthouse 95+, OG
  tags, dark mode. No analytics, cookies or fingerprinting.
- Plan first, WAIT for approval. Don't push to git; the human commits.
- Brand: always "Assay, by Garkuwa Labs".
