// Checks every stellar.expert transaction and contract this site links to:
// transactions must return SUCCESS from Stellar RPC on their network, and
// contracts must exist (stellar.expert API). Reads src/content/docs and
// src/data/testnet.json. Read-only; sends nothing.
//
//   pnpm check-chain
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const RPC = { testnet: "https://soroban-testnet.stellar.org" };
const TX = /stellar\.expert\/explorer\/(testnet|public)\/tx\/([0-9a-f]{64})/g;
const CONTRACT = /stellar\.expert\/explorer\/(testnet|public)\/contract\/(C[A-Z2-7]{55})/g;

const files = [];
const walk = (d) => {
  for (const f of readdirSync(d)) {
    const p = join(d, f);
    if (statSync(p).isDirectory()) walk(p);
    else if (/\.mdx?$/.test(f)) files.push(p);
  }
};
walk("src/content/docs");
let text = files.map((f) => readFileSync(f, "utf8")).join("\n");

// Receipts list hashes and IDs without URLs; check those too.
const receipts = JSON.parse(readFileSync("src/data/testnet.json", "utf8"));
for (const run of receipts.runs) {
  for (const s of run.steps)
    for (const h of s.tx) text += `\nstellar.expert/explorer/${run.network}/tx/${h}`;
}

const txs = new Map([...text.matchAll(TX)].map((m) => [m[2], m[1]]));
const contracts = new Map([...text.matchAll(CONTRACT)].map((m) => [m[2], m[1]]));
const failures = [];

for (const [hash, net] of txs) {
  const rpc = RPC[net];
  if (!rpc) {
    failures.push(`tx ${hash}: no RPC configured for ${net}`);
    continue;
  }
  const res = await fetch(rpc, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ jsonrpc: "2.0", id: 1, method: "getTransaction", params: { hash } }),
  });
  const status = (await res.json()).result?.status;
  if (status !== "SUCCESS") failures.push(`tx ${hash} (${net}): ${status ?? "no result"}`);
}
for (const [id, net] of contracts) {
  const res = await fetch(`https://api.stellar.expert/explorer/${net}/contract/${id}`, {
    headers: { "user-agent": "assay-docs-check-chain" },
  });
  if (!res.ok) failures.push(`contract ${id} (${net}): HTTP ${res.status}`);
  await new Promise((r) => setTimeout(r, 500));
}

console.log(`checked ${txs.size} transactions and ${contracts.size} contracts`);
if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}
console.log("all SUCCESS / found");
