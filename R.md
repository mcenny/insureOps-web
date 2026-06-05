# InsureOps Dashboard

InsureOps is a fictional insurance operations dashboard built to demonstrate production-style frontend architecture: workflow-heavy internal tools, role-aware UI, server-driven tables, and clear async state handling.

> **Disclaimer:** Fictional data and simplified workflows only. Not affiliated with any real insurer or proprietary product.

## Problem

Operations teams juggle customers, policies, claims, documents, and payments across scattered systems. InsureOps centralizes those workflows in one demo dashboard.

## Features

- **Dashboard overview** — stat cards, recent activity, loading/empty/error states
- **Policies** — searchable table, filters, detail with linked claims
- **Claims** — state machine transitions, assign reviewer, timeline, optimistic updates
- **Customers** — profile with policies, claims, payments, documents tabs
- **Payments** — status filters, failed indicators, finance-gated retry
- **Documents** — review approve/reject with reasons (RHF + Zod)
- **Settings** — demo role switcher, permissions list, backend swap notes
- **Activity feed** — global sheet from the top bar

## Tech stack

- Next.js (App Router) + React + TypeScript (strict)
- Tailwind CSS v4 + shadcn/ui (Radix)
- TanStack Query + TanStack Table
- Zustand (demo user / role)
- React Hook Form + Zod
- Vitest + Testing Library + Playwright

## Getting started

```bash
git clone https://github.com/mcenny/insureops-dashboard.git
cd insureops-dashboard
yarn install
yarn dev
```

Open [http://localhost:3000](http://localhost:3000). Use **Login** and pick a demo persona to see permission differences.

### Scripts

| Command | Description |
| -------- | ------------- |
| `yarn dev` | Development server |
| `yarn build` | Production build |
| `yarn lint` | ESLint |
| `yarn typecheck` | `tsc --noEmit` |
| `yarn test` | Vitest unit/component tests |
| `yarn e2e` | Playwright (starts dev server) |
| `yarn format` | Prettier write |

## Swap in a real backend

Mock APIs live under `src/app/api/*` and an in-memory store in `src/lib/api/server-store.ts`.

1. Copy `.env.example` to `.env.local`.
2. Set `NEXT_PUBLIC_API_BASE_URL` to your backend origin (separate repo).
3. Implement the same REST shapes and Zod contracts in `src/lib/validations.ts`.
4. Remove `src/app/api` when the external API is ready.

Hooks in `src/features/*/api.ts` and UI components stay unchanged.

```bash
# Example
NEXT_PUBLIC_API_BASE_URL=https://api.insureops.example.com
```

## Project structure

```
src/
  app/           # routes + mock API
  components/    # ui, layout, tables, status, feedback
  features/      # domain modules (api, components, types)
  lib/           # api client, permissions, validations, seed
  store/         # Zustand user store
e2e/             # Playwright specs
```

## Demo users

| Name | Role |
| ------ | ------ |
| Philemon Eniola | super_admin |
| Amina Yusuf | operations_manager |
| Daniel Okafor | claims_reviewer |
| Tolu Martins | finance_admin |
| Grace Adeyemi | support_agent |

## Screenshots

Screenshots coming soon: dashboard, policy table, claim review, customer profile, payments, documents, role-based actions.

## Live demo

```
Demo URL: Coming soon (Vercel)
```

## Author

Built by Philemon Eniola.

- Portfolio: https://dev-philemon.vercel.app
- GitHub: https://github.com/mcenny
