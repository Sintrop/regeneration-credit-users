# Regeneration Credit · transparency portal

Public pages of the Regeneration Credit users at [users.regenerationcredit.org](https://users.regenerationcredit.org). It is where the QR codes of the certificates issued by the apps lead, and every number on it is read from the Regeneration Credit contracts on the Sintrop blockchain.

## Pages

| Path | Content |
|---|---|
| `/` | system impact, map of every area, top Regenerators and Supporters, recent activity, search by name or wallet, how to verify a certificate |
| `/supporter/<address>/<name>` | Supporter certificate (same numbers as the app), offset history with transactions, offsets by item, reduction commitments, referral commissions |
| `/regenerator/<address>/<name>` | Regenerator certificate (score, inspections, area, average trees and species), area map, inspection timeline with PDFs, RC received, reports |
| `/user/<address>` | resolves any wallet: redirects Supporters and Regenerators, shows the profile of Inspectors, Activists, Researchers, Developers and Contributors |
| `/regenerators`, `/supporters`, `/community` | directories |
| `/api/certificate/<supporter\|regenerator>/<address>?lang=pt\|en[&download=1]` | certificate image (1200×630), used for link previews and the "download certificate" button |

Portuguese is served without a prefix and English under `/en`. The certificate URLs printed so far keep working: `/pt/...` and `/en/...` prefixes, any name slug (or none) and the wrong profile type all redirect to the right page.

## Development

```bash
cp .env.example .env
npm install
npm run dev
```

Pages are rendered on the server and cached for 5 minutes (`revalidate = 300`), so visits don't hit the RPC every time.

## Contracts

Addresses and ABIs live in `config/contracts/<set>.json`, generated from the `core-contracts` repository:

```bash
node scripts/sync-contracts.mjs ../core-contracts mainnet sintrop-mainnet
```

Run it again whenever the contracts are redeployed, and pick the set with `NEXT_PUBLIC_CONTRACTS`.

## Stack

Next.js 15 (App Router), next-intl, ethers 6 (JSON-RPC batch reads and `eth_getLogs`), Tailwind CSS 4, next-themes, Mapbox GL and `next/og` for the certificate images.
