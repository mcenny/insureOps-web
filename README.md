# InsureOps Dashboard

InsureOps is a fictional insurance operations dashboard built to demonstrate how I approach workflow-heavy frontend and full-stack product engineering.

The project focuses on common operational problems found in insurance and fintech products: managing customers, policies, claims, documents, payment states, admin roles, and operational workflows from a single internal dashboard.

It is designed as a production-style portfolio project that shows frontend architecture, product thinking, data-heavy UI patterns, and scalable TypeScript development.

> **Disclaimer:** InsureOps is an independent portfolio project built with fictional data and simplified workflows. It is not affiliated with, copied from, or based on any proprietary product, private client code, confidential business logic, internal system, or real customer data.

---

## Problem

Insurance operations teams often manage multiple moving parts across different systems:

* customer records
* active and expired policies
* claim submissions
* document uploads
* KYC-style verification
* payment status
* policy renewal reminders
* internal admin approvals
* operational activity history

When these workflows are scattered or poorly designed, teams lose visibility. Staff may not know which claims need review, which customers have incomplete documents, which payments failed, or which policies are close to expiry.

This creates delays, poor customer experience, operational mistakes, and unnecessary manual follow-up.

---

## Solution

InsureOps provides a fictional but realistic dashboard experience for insurance operations teams.

The dashboard centralizes key operational workflows into one interface:

* customer management
* policy tracking
* claims review
* payment status monitoring
* document review
* role-based admin actions
* operational activity feed
* dashboard analytics

The goal is not to build a complete insurance company backend. The goal is to demonstrate how a senior frontend or product engineer can structure, design, and implement a complex internal tool with real-world constraints.

---

## What This Project Demonstrates

This project demonstrates my ability to build:

* production-style React and Next.js applications
* scalable TypeScript frontend architecture
* dashboard layouts and internal tools
* workflow-heavy business interfaces
* advanced data tables
* server-driven filtering patterns
* role-aware UI actions
* optimistic UI updates
* loading, empty, error, and retry states
* form-heavy product flows
* payment-state interfaces
* document upload/review interfaces
* maintainable component systems
* clear technical documentation

---

## Core Features

### 1. Dashboard Overview

The dashboard overview gives operations staff a high-level snapshot of business activity.

Planned metrics include:

* active policies
* pending claims
* failed payments
* incomplete customer documents
* policies expiring soon
* recent operational activity

This page demonstrates dashboard composition, data visualization, loading states, and summary card architecture.

---

### 2. Policy Management

The policy module allows admins to view and manage fictional insurance policies.

Features include:

* policy listing
* policy status badges
* customer association
* premium amount
* coverage type
* start and expiry dates
* payment status
* search
* filtering
* sorting
* pagination
* policy details page

Example policy statuses:

```ts
type PolicyStatus = "draft" | "active" | "expired" | "cancelled";
```

This module demonstrates advanced data table patterns and workflow-aware UI design.

---

### 3. Claims Workflow

The claims module simulates how an operations team may review insurance claims.

Features include:

* claim listing
* claim details page
* claim status transitions
* assigned reviewer
* claim amount
* supporting documents
* review notes
* timeline of claim activity

Example claim statuses:

```ts
type ClaimStatus =
  | "submitted"
  | "under_review"
  | "approved"
  | "rejected"
  | "paid_out";
```

This module demonstrates workflow-driven UI, status transitions, and action-based interfaces.

---

### 4. Customer Records

The customer module provides a central place to view customer information.

Features include:

* customer list
* customer profile page
* linked policies
* linked claims
* payment history
* document status
* contact information
* activity history

This module demonstrates relational UI design where different resources connect around a single user/customer entity.

---

### 5. Payment State Tracking

The payment module focuses on operational visibility around premium payments.

Features include:

* payment list
* payment status badges
* failed payment indicators
* retryable payment states
* invoice/payment reference
* linked customer
* linked policy
* payment method
* payment timeline

Example payment statuses:

```ts
type PaymentStatus =
  | "pending"
  | "paid"
  | "failed"
  | "refunded"
  | "cancelled";
```

This module demonstrates how frontend systems can represent payment uncertainty, retries, and asynchronous state changes clearly.

---

### 6. Document Review

The document module simulates KYC-style or policy-related document review.

Features include:

* uploaded document list
* document type
* upload status
* review status
* rejection reason
* document preview placeholder
* admin review action

Example document statuses:

```ts
type DocumentStatus =
  | "not_uploaded"
  | "uploaded"
  | "under_review"
  | "approved"
  | "rejected";
```

This module demonstrates document-heavy workflows without exposing any real user data or private business process.

---

### 7. Role-Based UI

The dashboard includes fictional admin roles to demonstrate permission-aware interfaces.

Example roles:

```ts
type AdminRole =
  | "super_admin"
  | "operations_manager"
  | "claims_reviewer"
  | "finance_admin"
  | "support_agent";
```

Example permission logic:

* only finance admins can mark payments as reconciled
* only claims reviewers can approve or reject claims
* support agents can view customers but cannot approve claims
* operations managers can assign reviewers
* super admins can access all modules

This demonstrates role-aware UI composition and action visibility.

---

### 8. Activity Feed

The activity feed shows recent operational events.

Examples:

* claim submitted
* claim assigned
* policy activated
* payment failed
* document approved
* customer profile updated
* renewal reminder triggered

This demonstrates event-style UI and audit-log-inspired product thinking.

---

## Tech Stack

### Frontend

* Next.js
* React
* TypeScript
* Tailwind CSS
* shadcn/ui or Radix UI
* TanStack Table
* TanStack Query or SWR
* Zustand
* React Hook Form
* Zod

### Backend / Data Layer

Initial version:

* mock data
* local JSON or TypeScript fixtures
* API route simulation

Future version:

* NestJS or Next.js API routes
* PostgreSQL
* Prisma
* Redis caching
* authentication
* audit logs

### Tooling

* ESLint
* Prettier
* TypeScript strict mode
* GitHub Actions
* Vercel deployment

---

## Installation

Clone the repository:

```bash
git clone https://github.com/mcenny/insureops-dashboard.git
cd insureops-dashboard
```

Install dependencies:

```bash
yarn install
```

Run the development server:

```bash
yarn dev
```

Open the app:

```txt
http://localhost:3000
```

---

## Recommended Package Setup

Core packages:

```bash
yarn add zod react-hook-form @hookform/resolvers zustand
```

Data fetching and tables:

```bash
yarn add @tanstack/react-query @tanstack/react-table
```

UI utilities:

```bash
yarn add class-variance-authority clsx tailwind-merge lucide-react
```

Optional testing setup:

```bash
yarn add -D vitest @testing-library/react @testing-library/jest-dom jsdom
```

Optional E2E testing:

```bash
yarn add -D @playwright/test
```

---

## Project Structure

```txt
src/
  app/
    (auth)/
      login/
    (dashboard)/
      dashboard/
      policies/
      claims/
      customers/
      payments/
      documents/
      settings/
    api/
  components/
    ui/
    layout/
    tables/
    forms/
    status/
    charts/
  features/
    policies/
      components/
      data/
      hooks/
      types/
      utils/
    claims/
      components/
      data/
      hooks/
      types/
      utils/
    customers/
      components/
      data/
      hooks/
      types/
      utils/
    payments/
      components/
      data/
      hooks/
      types/
      utils/
    documents/
      components/
      data/
      hooks/
      types/
      utils/
  lib/
    constants.ts
    permissions.ts
    utils.ts
    validations.ts
  hooks/
  types/
  config/
```

---

## Architecture Principles

### 1. Feature-Based Organization

The codebase is organized around business domains instead of only technical categories.

For example:

```txt
features/claims
features/policies
features/customers
features/payments
```

This makes the project easier to scale because each feature owns its components, types, hooks, helpers, and mock data.

---

### 2. Typed Domain Models

The project uses TypeScript types to model business entities clearly.

Example:

```ts
type Policy = {
  id: string;
  policyNumber: string;
  customerId: string;
  customerName: string;
  type: "motor" | "travel" | "home" | "health";
  status: PolicyStatus;
  premiumAmount: number;
  paymentStatus: PaymentStatus;
  startDate: string;
  expiryDate: string;
  createdAt: string;
};
```

The goal is to keep business states explicit and avoid unclear string-based logic scattered across the UI.

---

### 3. Reusable Status Components

Insurance dashboards rely heavily on status visibility.

This project uses reusable status components for:

* policy status
* claim status
* payment status
* document status
* review status

This keeps the UI consistent and makes operational states easy to scan.

---

### 4. Table-First UX

Many internal tools are table-heavy. Instead of treating tables as basic UI elements, this project treats tables as core product features.

Tables include:

* search
* filtering
* sorting
* pagination
* row actions
* status badges
* empty states
* loading skeletons
* error recovery

---

### 5. Permission-Aware Actions

Admin users should only see actions they are allowed to perform.

Instead of hiding permissions deep inside click handlers, this project models permissions close to the UI.

Example:

```ts
const canApproveClaim = hasPermission(user.role, "claim:approve");
```

This makes the UI easier to reason about and safer to extend.

---

### 6. Realistic UI States

The project intentionally includes:

* loading states
* empty states
* error states
* retry states
* disabled states
* pending states
* success feedback

These states are important in production applications but are often missing from basic portfolio projects.

---

## Data Model

The project uses fictional data for the following entities:

### Customer

```ts
type Customer = {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  status: "active" | "inactive" | "flagged";
  createdAt: string;
};
```

### Policy

```ts
type Policy = {
  id: string;
  policyNumber: string;
  customerId: string;
  type: "motor" | "travel" | "home" | "health";
  status: "draft" | "active" | "expired" | "cancelled";
  premiumAmount: number;
  paymentStatus: "pending" | "paid" | "failed" | "refunded" | "cancelled";
  startDate: string;
  expiryDate: string;
};
```

### Claim

```ts
type Claim = {
  id: string;
  claimNumber: string;
  policyId: string;
  customerId: string;
  status: "submitted" | "under_review" | "approved" | "rejected" | "paid_out";
  claimAmount: number;
  assignedTo?: string;
  submittedAt: string;
};
```

### Payment

```ts
type Payment = {
  id: string;
  policyId: string;
  customerId: string;
  amount: number;
  status: "pending" | "paid" | "failed" | "refunded" | "cancelled";
  provider: "demo_provider";
  reference: string;
  createdAt: string;
};
```

### Document

```ts
type Document = {
  id: string;
  customerId: string;
  type: "identity" | "proof_of_address" | "vehicle_document" | "claim_evidence";
  status: "not_uploaded" | "uploaded" | "under_review" | "approved" | "rejected";
  uploadedAt?: string;
};
```

---

## Pages

### `/`

Landing page introducing the project.

### `/login`

Demo login screen.

### `/dashboard`

Overview of operational metrics.

### `/policies`

Policy management table.

### `/policies/[id]`

Policy details page.

### `/claims`

Claims management table.

### `/claims/[id]`

Claim details and review workflow.

### `/customers`

Customer records table.

### `/customers/[id]`

Customer profile with policies, claims, payments, and documents.

### `/payments`

Payment status tracking.

### `/documents`

Document review dashboard.

### `/settings`

Demo role and account settings.

---

## Demo Roles

The project may include demo role switching to preview different permission levels.

Example demo users:

```ts
const demoUsers = [
  {
    name: "Amina Yusuf",
    role: "operations_manager",
  },
  {
    name: "Daniel Okafor",
    role: "claims_reviewer",
  },
  {
    name: "Tolu Martins",
    role: "finance_admin",
  },
  {
    name: "Grace Adeyemi",
    role: "support_agent",
  },
];
```

This is useful for demonstrating how the UI changes based on user permissions.

---

## Engineering Decisions

### Why Next.js?

Next.js provides a strong foundation for building production-grade React applications with routing, layouts, server rendering options, API routes, and deployment support.

For this project, the App Router structure makes it easy to separate public pages, authenticated dashboard pages, and feature-specific routes.

---

### Why TypeScript?

The application has multiple business entities and workflow states. TypeScript helps make those states explicit, reduces accidental misuse, and improves maintainability.

---

### Why Feature-Based Architecture?

A dashboard like this can quickly become large. Organizing by feature keeps related logic together and avoids a flat component folder that becomes difficult to navigate.

---

### Why Start With Mock Data?

The goal of the first version is to demonstrate frontend architecture and product thinking without spending too much time on backend infrastructure.

Mock data also keeps the project safe, fictional, and free from any private product logic.

A backend can be added later after the frontend experience is polished.

---

### Why Include Role-Based UI?

Internal tools often depend on permissions. A dashboard that ignores roles feels unrealistic.

Role-based UI demonstrates how admin actions can be safely exposed based on responsibility.

---

### Why Include Payment States?

Payment-heavy products need clear frontend states because payment systems are asynchronous. A user or admin may see pending, failed, successful, or refunded states at different times.

This project models those states generically to demonstrate payment-aware interface design.

---

## Confidentiality Boundary

This project intentionally avoids:

* private client code
* real customer data
* real policy data
* real payment records
* real KYC documents
* proprietary business logic
* private database schemas
* unreleased product screens
* confidential workflows
* internal architecture diagrams

All workflows, data models, statuses, names, and UI flows are fictional and simplified for public demonstration.

---

## Roadmap

### Version 1: Frontend Dashboard

* [ ] Dashboard layout
* [ ] Sidebar navigation
* [ ] Demo login screen
* [ ] Policy table
* [ ] Claims table
* [ ] Customer table
* [ ] Payment table
* [ ] Document review table
* [ ] Status badges
* [ ] Mock data
* [ ] Responsive UI
* [ ] Empty/loading/error states

### Version 2: Workflow Interactions

* [ ] Claim status transitions
* [ ] Assign claim reviewer
* [ ] Approve/reject documents
* [ ] Retry failed payment UI
* [ ] Role-based action visibility
* [ ] Activity feed
* [ ] Toast notifications

### Version 3: Backend Integration

* [ ] API layer
* [ ] PostgreSQL database
* [ ] Prisma schema
* [ ] Authentication
* [ ] Authorization
* [ ] Audit logs
* [ ] Server-side filtering
* [ ] Pagination
* [ ] Deployment pipeline

### Version 4: Advanced Systems

* [ ] Background jobs
* [ ] Notification service
* [ ] Redis caching
* [ ] Webhook simulation
* [ ] Observability
* [ ] Metrics dashboard

### Version 5: AI Features

* [ ] AI-assisted claim summary
* [ ] Document review assistant
* [ ] Customer support response draft
* [ ] Operational risk flags
* [ ] RAG over internal policy documents

---

## Screenshots

Screenshots will be added as the UI is built.

Planned screenshots:

* dashboard overview
* policy table
* claim review page
* customer profile
* payment tracking page
* document review page
* role-based action differences

---

## Live Demo

Live demo will be deployed on Vercel.

```txt
Demo URL: Coming soon
```

---

## Local Development

Run the development server:

```bash
yarn dev
```

Run linting:

```bash
yarn lint
```

Run tests:

```bash
yarn test
```

Build for production:

```bash
yarn build
```

---

## Lessons This Project Is Designed To Show

This project is designed to show that strong frontend engineering is not only about building screens.

It is also about:

* understanding business workflows
* modeling product states clearly
* designing for real users and internal teams
* handling uncertainty in async systems
* making complex data easy to scan
* protecting users from invalid actions
* creating maintainable architecture
* documenting tradeoffs clearly
* building software that can grow

---

## Author

Built by Philemon Eniola.

* Portfolio: https://dev-philemon.vercel.app
* GitHub: https://github.com/mcenny
* LinkedIn: https://linkedin.com/in/philemon-eniola
* X: https://x.com/philemon_eniola
