# Soonlay Portfolio

Official website for **Soonlay** — a product development studio that builds production-ready software for founders and startups.

The repository is a two-app monorepo:

| Directory | App | Deployment target |
| --- | --- | --- |
| `.` | Public site + Careers API | `soonlay.tech` |
| `admin/` | Careers admin portal (separate Next.js app) | `admin.soonlay.tech` |

The public site owns the Firestore datastore and the read/write API. The admin portal never touches Firestore from the browser; it calls the public app's API through its own same-origin BFF routes.

## About

Soonlay turns raw ideas into production-ready software. From MVP to full-scale platform, we engineer the systems your product needs to launch and grow. Trusted by founders in 5+ countries.

## Pages

- **Home** — Hero section with contact form modal and services overview
- **About** — Studio story and team information
- **Services** — Detailed breakdown of what we offer
- **Work** — Portfolio of past projects
- **Contact** — Contact form and information
- **Careers** — Native job board with filters, search, and pagination

## Tech Stack

- **Framework:** Next.js 15.5 (App Router, React 18)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion
- **Forms:** React Hook Form + Zod
- **Icons:** Lucide React
- **Datastore:** Firestore via `firebase-admin`
- **Auth:** HMAC-signed, self-hosted sessions (admin portal only)
- **Testing:** Vitest
- **Analytics:** Vercel Analytics

## Getting Started

### Prerequisites

- Node.js 20+ (developed on 22)
- npm

### Installation

> **Use `--legacy-peer-deps`.** npm 10 crashes resolving Vitest 4's peer graph with
> `Cannot read properties of null (reading 'edgesOut')`.

```bash
npm install --legacy-peer-deps
npm install --legacy-peer-deps --prefix admin
```

### Development

```bash
npm run dev            # public site on http://localhost:3000
npm run dev --prefix admin   # admin portal on http://localhost:3001
```

Point the admin portal at your local public site by creating `admin/.env.local`:

```bash
CAREERS_API_URL=http://localhost:3000
```

### Verification

```bash
npm run typecheck
npm run lint
npm run test
npm run build

npm run typecheck --prefix admin
npm run lint --prefix admin
npm run test --prefix admin
npm run build --prefix admin
```

## Environment

Copy `.env.example` to `.env.local`. Never commit `.env.local`.

| Variable | Required | Purpose |
| --- | --- | --- |
| `FIREBASE_PROJECT_ID` | Production | Firestore project; also the admin-credential fallback |
| `FIREBASE_CLIENT_EMAIL` | Production | Service account email |
| `FIREBASE_PRIVATE_KEY` | Production | Service account key, newlines escaped as `\n` |
| `CAREERS_ADMIN_EMAILS` | Yes | Allowlist of addresses permitted to write. Empty rejects all writes |
| `CAREERS_SESSION_SECRET` | Yes | ≥32 chars; verifies session tokens minted by the admin portal. Must match the admin app's value |
| `CAREERS_PREVIEW_SECRET` | Yes | ≥32 chars; signs five-minute draft/closed preview links. Generate with `openssl rand -hex 32` |
| `CAREERS_PAGE_SIZE` | No | Public page size, clamped to 1–100, defaults to 12 |
| `EMAIL_USER` / `EMAIL_PASS` | Yes | SMTP credentials for the contact form |

If all three Firebase credential variables are unset, the server falls back to Application Default Credentials (`gcloud auth application-default login`) or the Firestore emulator. A partial set is rejected rather than silently half-configured.

The admin portal uses `admin/.env.example` and has no Firebase dependency at all. It needs `CAREERS_ADMIN_EMAILS` (a label for who is configured), `CAREERS_SESSION_SECRET` (shared with this app), `CAREERS_ADMIN_USERS` (the `email:passwordHash` pairs it will accept), and `CAREERS_API_URL` (defaults to `https://soonlay.tech`, must be HTTPS except on localhost).

### Admin sign-in

The admin portal authenticates against its own environment rather than an identity provider, so no Firebase Auth project is required for it to work.

1. Pick a password and hash it inside the admin app. The command reads the password from stdin or arguments and never writes it to disk:

   ```bash
   cd admin && npm run hash-password -- 'your-password'
   ```

2. Copy the printed `CAREERS_ADMIN_USERS` line into `admin/.env.local`. The value is `email:scrypt$32768$8$1$salt$hash`; only the hash is stored, and the plaintext password exists nowhere in the repo.
3. Set the same `CAREERS_SESSION_SECRET` in both apps. Generate one with `openssl rand -base64 48`. The two apps verify the same HMAC, so a mismatch makes every session fail.
4. Add the same address to `CAREERS_ADMIN_EMAILS` in both apps. The admin app uses it only to label operators; the public app uses it to decide which token emails may write.

Escape `$` as `\$` when writing `CAREERS_ADMIN_USERS` into a `.env.local` file. Next.js expands `$NAME` while reading env files, so an unescaped hash is silently truncated to `admin@soonlay.com:scrypt` and every sign-in returns 401. Values entered in the Vercel dashboard are not expanded and need no escaping; `npm run hash-password` prints both forms. The parser accepts either, and rejects a hash that lost its separators rather than treating it as a wildcard.

Adding a second operator is one more `email:hash` pair in `CAREERS_ADMIN_USERS`. To change a password, generate a new hash and replace that operator's entry; the old password stops working immediately.

Rotating `CAREERS_SESSION_SECRET` in both apps invalidates every outstanding session, which is the intended way to cut off a compromised admin session.

## Careers

### Visibility

A job is publicly visible when `status === "PUBLISHED"` **and** `archivedAt` is unset. Drafts, closed jobs, and archived jobs are served only through signed preview links, which expire after five minutes and are marked `noindex` and `X-Robots-Tag: noindex`.

Career reads are uncached (`no-store`, `force-dynamic`) so publishing is visible immediately.

### Data model

```
jobs/{jobId}
jobs/{jobId}/responsibilities/{itemId}
jobs/{jobId}/requirements/{itemId}
jobs/{jobId}/niceToHave/{itemId}
jobs/{jobId}/benefits/{itemId}
jobs/{jobId}/skills/{itemId}
jobSlugs/{slug}   # slug -> jobId, created once and preserved on edit
```

### Querying

Listing deliberately avoids composite indexes. Jobs are read with a single-collection query, then filtered, searched, sorted, and paginated in memory (see `lib/careers/listing.ts`). Two consequences:

- `firestore.indexes.json` is intentionally empty. Deploying it is a no-op.
- Reads are capped at 2,000 documents per request. When the cap is hit the response sets `truncated: true` and the admin portal shows a warning. Move past ~2,000 live jobs by adding a real query layer.

Search is case- and accent-insensitive, matches all terms with AND across title, department, location, employment type, experience level, summaries, descriptions, skills, and lists, and normalizes punctuation so `nextjs` finds `Next.js`.

### Firestore rules

`firestore.rules` denies all client access. Only the server-side Admin SDK (which bypasses rules) reads or writes these collections.

## Careers admin portal

The portal is a separate Next.js app in `admin/`.

- **Session:** the browser posts an email and password to the admin app's own `/api/session`, which verifies the scrypt hash in `CAREERS_ADMIN_USERS` and sets a 5-day HttpOnly, `SameSite=Strict` `careers_session` cookie holding an HMAC-SHA256 token (`base64url(claims).base64url(signature)`, claims are `sub`/`email`/`iat`/`exp`). The public API verifies that signature, expiry, and the allowlist. Write requests also require a double-submit CSRF token and a same-origin `Origin`/`Referer` check.
- **Passwords:** stored only as scrypt hashes (`N=32768, r=8, p=1`, 64-byte key). The public app never holds a hash and cannot mint a session, so a public-app compromise does not yield passwords.
- **Brute force:** the sign-in endpoint throttles to 8 failures per 15 minutes, keyed on a hash of the normalized email *and* client address, so one attacker cannot lock out a different address and a shared NAT cannot grind through a list. Counters are per-instance and reset on deploy. Successful sign-ins clear the counter, so a legitimate admin is never locked out by their own typo.
- **Enumeration:** an unknown email still runs a full scrypt verification against a fixed dummy hash, and returns the identical 401 body as a wrong password, so the endpoint is not a user-enumeration oracle.
- **Authorization:** a valid signature is not enough; the token's email must also appear in `CAREERS_ADMIN_EMAILS`, which must be set in **both** apps.
- **Preview:** the portal renders private previews in a sandboxed iframe against `/careers/preview/{slug}?token=…`.
- **Applications:** each job stores an external HTTPS `applicationUrl`; the public page links out. Soonlay does not collect or store applications.

## Deployment

Both apps deploy to Vercel as separate projects.

1. Create a Firebase project and enable **Firestore**. No Authentication provider is needed; the admin portal has its own credentials.
2. Create a service account with the **Cloud Datastore User** role and note its client email and private key.
3. Hash the admin password (`cd admin && npm run hash-password -- '…'`), then set `CAREERS_ADMIN_USERS` and `CAREERS_ADMIN_EMAILS` in both apps.
4. Generate one `openssl rand -base64 48` value and set it as `CAREERS_SESSION_SECRET` in **both** apps.
5. Deploy the public site with the root project directory set to `.`, adding the environment variables above.
6. Deploy the admin portal with root directory `admin`, adding the `admin/.env.example` variables plus `CAREERS_API_URL=https://soonlay.tech`.
7. Attach `soonlay.tech` to the public project and `admin.soonlay.tech` to the admin project.
8. Optional: `firebase deploy --only firestore:rules,firestore:indexes` to publish the deny-all rules.

Because the two apps each read their environment at runtime, `CAREERS_SESSION_SECRET` must be present in both projects. A missing or short value fails closed: the public API returns 500 rather than treating an unverifiable token as a rejection of just that request, so a misconfiguration is visible immediately instead of looking like a permissions problem.

## Security notes

`npm audit` currently reports advisories in both apps that are **not reachable** in this codebase. They are recorded here rather than force-fixed, because every available fix is a breaking major upgrade.

| Package | Severity | App | Reached via | Why it is not exploitable here |
| --- | --- | --- | --- | --- |
| `postcss` | high | both | `next`'s own `node_modules` | Build-time only. The advisories need attacker-controlled CSS or `sourceMappingURL` comments; all CSS is authored in-repo. Fix requires Next 16. |
| `nodemailer` | high | public | direct dependency of the public site | The advisories need the `raw` option, `resolveContent`, attachments, or user-controlled recipients. The contact route uses none of them and sends to hardcoded addresses. Fix requires nodemailer 10. |
| `uuid` | moderate | public | `firebase-admin` → `@google-cloud/storage` → `gaxios` | The advisory covers `v3`/`v5`/`v6` with a caller-supplied buffer; `gaxios` only calls `v4()` with no buffer. `gaxios` pins `^9.0.1`, so the fix (`>=11.1.1`) needs a transitive major override. |

Removing Firebase from the admin portal took that app from four advisories to two; the remaining pair is the shared `postcss` one above.

Revisit these on the next Next.js and nodemailer majors rather than forcing them now. Run `npm audit` in both apps to re-check after any dependency change.

## Project Structure

```
├── app/
│   ├── about/ contact/ services/ work/
│   ├── api/
│   │   ├── admin/jobs/    # Protected write API (list, create, update, status, archive, restore)
│   │   └── careers/       # Public read API
│   ├── careers/
│   │   ├── [slug]/        # Published job detail
│   │   ├── preview/[slug]/# Signed private preview
│   │   └── page.tsx       # Job board
│   └── layout.tsx  page.tsx
├── components/            # layout/ sections/ ui/ careers/
├── lib/
│   └── careers/           # auth, env, errors, firebase, http, listing, preview,
│                           # query, repository, session-token, slug, types,
│                           # validation
├── tests/                 # Vitest suites + in-memory Firestore double
├── admin/
│   ├── app/               # Portal pages, BFF routes, session handling
│   ├── lib/               # bff, csrf, env, login-throttle, password, query,
│   │                      #   schemas, session, session-token
│   └── tests/
├── firestore.rules  firestore.indexes.json
└── .env.example
```

## Contact

- Email: soonlay.tech@gmail.com
- Website: [soonlay.tech](https://soonlay.tech)
