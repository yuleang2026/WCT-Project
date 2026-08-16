# NICC SmartSpace Management System

A full-stack event space and office rental booking platform for NICC, Royal
University of Phnom Penh — built to replace manual, phone/paper-based
booking with a fully digital workflow: online booking, admin approval,
digital contracts (e-signature + PDF), invoicing, and payment tracking.

Built per the *NICC SmartSpace Management System* proposal, using:

- **Frontend:** Next.js 16 (App Router, TypeScript, Tailwind CSS v4)
- **Backend:** Laravel 12 (REST API, Sanctum auth)
- **Database:** PostgreSQL 16

The proposal's own reference stack (React + Express + MongoDB) was swapped
for Next.js + Laravel + PostgreSQL per the project owner's request; the
domain model, roles, and workflows follow the proposal directly.

## Architecture

```
Browser
  │
  ▼
Next.js (frontend/)             — Server Components render public pages;
  │  App Router, TS, Tailwind      Route Handlers under /api/* proxy every
  │                                 authenticated request to Laravel, attaching
  │                                 the Sanctum token from an httpOnly cookie.
  ▼                                 The browser never sees the API token.
Laravel API (backend/)
  │  Sanctum token auth, role middleware (customer / admin / superadmin)
  ▼
PostgreSQL
```

Auth cookies (`nicc_token`, `nicc_role`) are httpOnly and set by Next.js
Route Handlers (`src/app/api/auth/*`) — client code never touches the raw
API token. All other API calls flow through a single catch-all proxy route
(`src/app/api/backend/[...path]/route.ts`) which forwards method, body
(including file uploads) and the bearer token to Laravel, and streams the
response (including PDF/Excel downloads) back untouched.

`src/proxy.ts` (Next.js 16 renamed `middleware.ts` → `proxy.ts`) does
coarse, cookie-based route redirects for UX (bounce unauthenticated users to
`/login`, bounce customers away from `/admin`). The real authorization
boundary is Laravel's `role:` middleware on every protected route — the
frontend redirect is just UX, not the security control.

## Roles

| Role | Access |
|---|---|
| Guest | Browse spaces & pricing, no account |
| Customer | Book spaces, sign contracts, pay, view history |
| Admin | Approve/reject bookings, manage spaces/equipment, confirm payments, reports |
| SuperAdmin | Everything Admin can, plus user management, system config, audit log |

## Domain / booking flows

- **Event booking:** browse room → pick date/time → add equipment → submit →
  admin review → approve/reject → (on approval) contract + deposit invoice
  auto-generated → customer signs contract → customer submits payment →
  admin confirms payment → invoice marked paid.
- **Office rental:** browse office → submit company profile + required
  documents (business license, ID) → admin review → approve/reject → (on
  approval) contract + deposit invoice generated → sign → pay → admin can
  generate monthly rent invoices going forward.

Payments are **admin-confirmed**, not processed by a live payment gateway:
customers submit a payment (bank transfer / QR / cash reference, with an
optional proof-of-payment upload) and an admin confirms or rejects it. This
was a deliberate choice — there's no real Cambodian payment gateway account
to integrate against — and the `Payment` model/controllers are structured so
a real gateway (ABA PayWay, Stripe, etc.) can be wired in later without
touching the booking/contract/invoice logic.

## Repository layout

```
backend/    Laravel 12 API (PHP 8.4, PostgreSQL, Sanctum, DomPDF, Excel export)
frontend/   Next.js 16 app (TypeScript, Tailwind v4, App Router)
docker-compose.yml
```

## Local development (without Docker)

Requirements: PHP 8.4+, Composer, Node 22+, PostgreSQL 16+.

### 1. Database

```bash
createdb nicc_smartspace
createuser nicc --pwprompt   # or use an existing role
```

### 2. Backend

```bash
cd backend
cp .env.example .env
# edit .env: set DB_DATABASE / DB_USERNAME / DB_PASSWORD to match your Postgres setup
composer install
php artisan key:generate
php artisan migrate --seed
php artisan storage:link
php artisan serve   # http://localhost:8000
```

In a second terminal, run the queue worker (notifications — booking status
changes, contract-ready, payment-status — are queued):

```bash
php artisan queue:work
```

Seeded accounts (password for all: `Password123!`):

| Email | Role |
|---|---|
| `superadmin@nicc.edu.kh` | superadmin |
| `admin@nicc.edu.kh` | admin |
| `customer@example.com` | customer |

### 3. Frontend

```bash
cd frontend
cp .env.example .env.local
# BACKEND_URL defaults to http://localhost:8000 — adjust if needed
npm install
npm run dev   # http://localhost:3000
```

Open http://localhost:3000.

> Next.js 15/16 changed a lot since most training data: `cookies()`,
> `headers()`, `params`, and `searchParams` are now fully async, and
> `middleware.ts` was renamed to `proxy.ts` (exporting `proxy` instead of
> `middleware`). This codebase is written against the installed version
> (16.2.x) — see `frontend/node_modules/next/dist/docs/01-app/02-guides/upgrading/`
> if you're extending it and something looks off vs. what you remember.

### Running tests

```bash
cd backend
php artisan test        # 34 feature tests: auth, RBAC, booking lifecycle,
                         # payments, admin CRUD, superadmin, audit log
```

```bash
cd frontend
npm run lint
npm run build            # also runs the TypeScript compiler
```

## Docker Compose

```bash
cp backend/.env.example backend/.env
# generate a real APP_KEY (Docker will use whatever is in backend/.env):
php -r "echo 'base64:'.base64_encode(random_bytes(32)).PHP_EOL;"
# paste that into APP_KEY= in backend/.env

docker compose up --build
```

This starts:

- `postgres` — PostgreSQL 16, persisted in a named volume, exposed on host
  port `5433` (container port stays 5432 — remapped since a local Postgres
  install commonly already holds 5432)
- `backend` — Laravel API, exposed on host port `8001` (container port stays
  8000 — remapped for the same reason; 8000 is a very common dev-tool
  default). Only matters if you're hitting the API directly from the host —
  the frontend container talks to it internally at `http://backend:8000`,
  unaffected by this.
- `queue` — a second copy of the backend image running `queue:work`, for
  email/in-app notifications (waits for `backend`'s healthcheck before
  starting, so it doesn't race the migrations)
- `frontend` — Next.js production build, exposed on host port `3001`
  (container port stays 3000 — remapped for the same reason; also one of
  the most commonly-occupied dev ports)

Uploaded files (contracts, invoices, payment proofs, space images, office
rental documents) persist in the `backend_storage` named volume across
container restarts/rebuilds.

Then seed the database once:

```bash
docker compose exec backend php artisan db:seed
```

Visit http://localhost:3001.

**Note on this environment:** the Docker Compose file and both Dockerfiles
were written and validated with `docker compose config` (syntax/variable
resolution), but the sandboxed environment this was built in has no running
Docker daemon, so the actual multi-container build was not executed
end-to-end here. The application itself *was* fully tested — backend via
`php artisan test` (34 passing tests) and the frontend via a real
Playwright-driven browser session against the Laravel dev server (register →
book → admin-approve → contract auto-generated → sign → pay → admin-confirm,
plus superadmin user/settings/audit-log pages) — only the containerization
step is unverified. Worth a `docker compose up --build` smoke test before
relying on it for a real deployment.

For real production traffic beyond small-to-moderate institutional load,
consider swapping the backend's `php artisan serve` for PHP-FPM + nginx (or
[Laravel Octane](https://laravel.com/docs/octane)) — `php artisan serve` is
Laravel's development server and works fine for this scale but isn't the
officially recommended production setup for high concurrency.

## Configuration notes

- **Mail:** defaults to `MAIL_MAILER=log` (mail is written to
  `storage/logs/laravel.log` instead of actually sending). Point
  `MAIL_MAILER`/`MAIL_HOST`/etc. at a real SMTP provider before going live.
- **File storage:** defaults to local disk (`storage/app/private` for
  contracts/documents/payment proofs, `storage/app/public` for space
  images). Swap to S3 (`FILESYSTEM_DISK=s3` + `AWS_*` vars, already wired in
  `config/filesystems.php`) for a multi-server deployment.
- **System settings** (site name, tax rate, default deposit %, booking lead
  time, cancellation window) are editable at `/superadmin/settings` and
  currently informational — the deposit amount actually charged is set
  per-space (`spaces.deposit_amount`), not derived from the global default
  percentage. Wire that up if you want the global default to actually drive
  new-space deposit calculation.
