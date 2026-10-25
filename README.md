# YURI CHOI — Portfolio

Source repository for [yurichoi.com](https://yurichoi.com).

## GitHub source migration

- Prepared from Sites version 175, source commit `2b28d5dad60df2f0a6f756758f51a15383d0bcd2`.
- Hosting remains on the existing Sites deployment. Importing this repository does not change DNS or deploy the site.
- The site includes server-side analytics and private CV downloads. It is not a GitHub Pages static site.
- Secrets, private CV PDFs, production visitor records, local logs and standalone unpublished drafts are not included.
- `lib/analytics-snapshot.json` contains dashboard definitions with empty rows; live records stay in the hosted database.
- Preserve `.openai/hosting.json` when updating the existing Sites project. GitHub-to-Sites automatic deployment is not configured.
- Install dependencies with Node.js >=22.13.0, then run `npm run typecheck`, `npm run build`, and the relevant tests before publishing through Sites.

Source folders: `app/` (pages), `lib/` (server helpers), `public/` (images and fonts), `analytics-source/` (dashboard source), `db/` and `drizzle/` (schema), `tests/` (checks).

Never commit `.env*`, `.dev.vars*`, database exports, visitor records or hosting credentials. Keep private runtime configuration in the hosting service.

## Public URLs and initial HTML (2026-10-11)

The approved portfolio design is reused by `/work`, `/case/:id`, `/project/:id`,
`/process/:topic`, `/press`, `/cv`, and `/cv/summary`. The public route registry is
`lib/portfolio-routes.ts`; the catch-all page server-renders its selected content
and emits a unique title, description, canonical URL, and social metadata.
Legacy hash links resolve to the same content in `use-route-memory.ts`.

Notes keep their existing authoring sources under `app/notes/`. Run
`node scripts/generate-notes-pages.mjs` after editing those sources. It renders
the trusted source document at build time into `lib/notes-pages.json`; the public
handlers return only the selected published article. No runtime VM is used and
unpublished drafts are not included. `npm run build` regenerates these pages.
`/notes#note/fandom` remains compatible with `/notes/fandom`.

`/sitemap.xml` lists public canonical URLs. `/robots.txt` points to it; this does
not guarantee search indexing or AI retrieval. CV PDF authorization and owner
analytics are unchanged. The analytics client maps new paths to historical keys
and retains local-preview/owner opt-outs.

Validation: typecheck and production build; `tests/public-routes.test.mjs` checks
canonical URLs, isolated Notes HTML and analytics compatibility. Set
`TEST_ORIGIN=http://localhost:3010` to check initial HTML for all 87 public URLs
without running page JavaScript. Traffic, engagement and CV access tests verify
the existing exclusions and authorization boundaries. Browser checks cover
legacy CV/Notes links, navigation, filtering and responsive Work Process.

Known pre-existing test issues, not changed by this routing release:
`company-archives.test.mjs` rejects the already-published YURI&YURI first-year
revenue sentence; `depth-navigation.test.mjs` depends on a missing local image
manifest and an obsolete builder implementation. Approved content is preserved.

A clean full-stack starter running on
[vinext](https://github.com/cloudflare/vinext), with optional Cloudflare D1 and
Drizzle support.

## Prerequisites

- Node.js `>=22.13.0`

## Quick Start

```bash
npm install
npm run dev
npm run build
```

This starter does not use `wrangler.jsonc`.

## Included Shape

- edit site code under `app/`
- `.openai/hosting.json` declares optional Sites D1 and R2 bindings
- `vite.config.ts` simulates declared bindings for local development
- `db/schema.ts` starts intentionally empty
- `examples/d1/` contains an optional D1 example surface
- `drizzle.config.ts` supports local migration generation when needed

## Workspace Auth Headers

OpenAI workspace sites can read the current user's email from
`oai-authenticated-user-email`.

SIWC-authenticated workspace sites may also receive
`oai-authenticated-user-full-name` when the user's SIWC profile has a non-empty
`name` claim. The full-name value is percent-encoded UTF-8 and is accompanied by
`oai-authenticated-user-full-name-encoding: percent-encoded-utf-8`.

Treat the full name as optional and fall back to email when it is absent:

```tsx
import { headers } from "next/headers";

export default async function Home() {
  const requestHeaders = await headers();
  const email = requestHeaders.get("oai-authenticated-user-email");
  const encodedFullName = requestHeaders.get("oai-authenticated-user-full-name");
  const fullName =
    encodedFullName &&
    requestHeaders.get("oai-authenticated-user-full-name-encoding") ===
      "percent-encoded-utf-8"
      ? decodeURIComponent(encodedFullName)
      : null;

  const displayName = fullName ?? email;
  // ...
}
```

## Optional Dispatch-Owned ChatGPT Sign-In

Import the ready-to-use helpers from `app/chatgpt-auth.ts` when the site needs
optional or required ChatGPT sign-in:

- Use `getChatGPTUser()` for optional signed-in UI.
- Use `requireChatGPTUser(returnTo)` for server-rendered pages that should send
  anonymous visitors through Sign in with ChatGPT.
- Use `chatGPTSignInPath(returnTo)` and `chatGPTSignOutPath(returnTo)` for
  browser links or actions.
- Pass a same-origin relative `returnTo` path for the destination after sign-in
  or sign-out. The helper validates and safely encodes it.
- Mark protected pages with `export const dynamic = "force-dynamic"` because
  they depend on per-request identity headers.

Dispatch owns `/signin-with-chatgpt`, `/signout-with-chatgpt`, `/callback`, the
OAuth cookies, and identity header injection. Do not implement app routes for
those reserved paths. Routes that do not import and call the helper remain
anonymous-compatible.

SIWC establishes identity only; it does not prove workspace membership. Use the
Sites hosting platform's access policy controls for workspace-wide restrictions,
or enforce explicit server-side membership or allowlist checks.

Use SIWC for account pages, user-specific dashboards, saved records, and write
actions tied to the current ChatGPT user. Leave public content anonymous.

## Useful Commands

- `npm run dev`: start local development
- `npm run build`: verify the vinext build output
- `npm test`: build the starter and verify its rendered loading skeleton
- `npm run db:generate`: generate Drizzle migrations after schema changes

## Learn More

- [vinext Documentation](https://github.com/cloudflare/vinext)
- [Drizzle D1 Guide](https://orm.drizzle.team/docs/get-started/d1-new)
