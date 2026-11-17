#!/usr/bin/env node
/**
 * Builds the explorer's contract registry from a Hardhat project.
 *
 * Usage:
 *   node scripts/sync-contracts.mjs <path-to-core-contracts> <deployment-folder> <output-name>
 *   node scripts/sync-contracts.mjs ../core-contracts mainnet sintrop-mainnet
 *
 * Reads deployed_contracts/<deployment-folder>/*.json (name + address) and the
 * matching artifacts, keeps functions, events and errors (enough to decode and
 * read every contract) and writes
 * config/contracts/<output-name>.json.
 */
import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const [root, deployment, output] = process.argv.slice(2)
if (!root || !deployment || !output) {
  console.error("usage: node scripts/sync-contracts.mjs <core-contracts> <deployment> <output-name>")
  process.exit(1)
}

const deployDir = path.join(root, "deployed_contracts", deployment)
const contracts = fs
  .readdirSync(deployDir)
  .filter((f) => f.endsWith(".json"))
  .map((f) => {
    const { name, address } = JSON.parse(fs.readFileSync(path.join(deployDir, f), "utf8"))
    const artifact = JSON.parse(fs.readFileSync(path.join(root, "artifacts", "contracts", `${name}.sol`, `${name}.json`), "utf8"))
    const abi = artifact.abi.filter((item) => ["function", "event", "error"].includes(item.type))
    return { name, address, abi }
  })
  .sort((a, b) => a.name.localeCompare(b.name))

const here = path.dirname(fileURLToPath(import.meta.url))
const out = path.join(here, "..", "config", "contracts", `${output}.json`)
fs.writeFileSync(out, JSON.stringify(contracts) + "\n")
console.log(`${contracts.length} contracts → ${path.relative(process.cwd(), out)} (${(fs.statSync(out).size / 1024).toFixed(0)} KB)`)
