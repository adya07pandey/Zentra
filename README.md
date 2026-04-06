# 🚀 Multi-Tenant Fintech SaaS Backend

## Overview

This project is a backend system for a multi-tenant financial SaaS platform. It enables organizations to manage financial records, users, and analytics within isolated environments.

The system is designed with a focus on scalability, clean architecture, data integrity, and role-based access control.

---

## SaaS Architecture

- Multi-tenant system using organization-based isolation
- Each user belongs to one or more organizations
- All data is scoped using `orgId`
- Middleware ensures tenant-level separation

---

## Key Features

### User and Role Management

- Organization-based user system
- Role-based access control (RBAC)
- Roles:
  - OWNER / ADMIN: full access
  - ANALYST: read and insights access
  - VIEWER: read-only access
- Secure invite-based onboarding

---

### Financial Records Management

- Double-entry accounting system
- Each transaction consists of multiple entries
- Ensures debit equals credit for every transaction
- Supports:
  - Create transactions
  - View transactions
  - Reverse transactions
  - Pagination for large datasets

---

### Dashboard and Analytics

Provides aggregated insights:

- Total income
- Total expenses
- Net balance
- Category-wise breakdown
- Recent transactions
- Account balances
- Activity logs

---

### Ledger System

- Account-level ledger view
- Shows debit, credit, and running balance
- Reflects real accounting behavior

---

### Access Control

- Middleware-based authorization
- Enforced at API level using roles
- Prevents unauthorized access to resources

---

### Security Features

- JWT-based authentication
- OTP-based signup verification
- Token-based invite system
- Rate limiting:
  - OTP requests limited to 3 attempts (24-hour block)
  - Login attempts limited to 3 failures

---

## Fintech Design Principles

### Double-Entry Accounting

Each transaction follows the double-entry system where total debits equal total credits.

Example:

Bank (DEBIT) 50000
Revenue (CREDIT) 50000


This ensures financial correctness and consistency.

---

### Transaction Reversal

Transactions are not deleted. Instead, reversal entries are created.

Example: 
Original:
Cash (DEBIT) 1000
Expense (CREDIT) 1000

Reversal:
Cash (CREDIT) 1000
Expense (DEBIT) 1000

This preserves audit history and ensures traceability.

---

## API Endpoints

### Authentication
POST /api/auth/signup/init
POST /api/auth/signup/verify
POST /api/auth/login
POST /api/auth/logout
GET /api/auth/me


### Transactions
POST /api/transactions
GET /api/transactions
GET /api/transactions/:id
POST /api/transactions/:id/reverse


### Accounts
POST /api/accounts
GET /api/accounts
GET /api/accounts/:id
PUT /api/accounts/:id


### Ledger
GET /api/ledger/accounts/:accountId


### Users
GET /api/users
POST /api/users/invite
POST /api/users/accept-invite


### Dashboard
GET /api/dashboard


---

## Architecture

The system follows a modular backend architecture:

- Routes: API definitions
- Controllers: request handling
- Services: business logic
- Prisma models: database layer

Middleware:

- `protect`: authentication
- `attachOrg`: tenant isolation
- `allowRoles`: role-based access

---

## Tech Stack

- Node.js
- Express
- Prisma ORM
- PostgreSQL (Neon)
- JWT Authentication
- Nodemailer

---

## Setup Instructions

---

## Architecture

The system follows a modular backend architecture:

- Routes: API definitions
- Controllers: request handling
- Services: business logic
- Prisma models: database layer

Middleware:

- `protect`: authentication
- `attachOrg`: tenant isolation
- `allowRoles`: role-based access

---

## Tech Stack

- Node.js
- Express
- Prisma ORM
- PostgreSQL (Neon)
- JWT Authentication
- Nodemailer

---

## Setup Instructions
npm install
cp .env.example .env
npx prisma db push
npx prisma db seed
npm run dev


---

## Assumptions

- Each user belongs to at least one organization
- All financial transactions must be balanced
- OTP verification is required for account creation
- Audit logging is simplified

---

## Evaluation Alignment

This project demonstrates:

- Multi-tenant SaaS architecture
- Role-based access control
- Financial data integrity
- Aggregation logic for dashboards
- Validation and error handling
- Clean and maintainable backend design

---

## Conclusion

This project is a multi-tenant fintech SaaS backend that models real-world accounting systems using double-entry principles, secure user access, and scalable backend architecture.
