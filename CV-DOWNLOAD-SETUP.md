# Private CV download configuration

The existing hosted service keeps CV files in its private R2 bucket. The PDF and runtime secrets are not part of this repository.

Server-only configuration:

- `BUCKET`: private R2 binding
- `CV_FILE_KEY`: private object key
- `CV_PASSWORD_HASH`: PBKDF2-SHA256, 100,000 iterations, encoded as a 16-byte salt hex and 32-byte digest hex separated by a colon

Configure these through the hosting service, never `NEXT_PUBLIC_` variables or tracked files. Local development may use an ignored `.dev.vars` file and local R2 emulator.

Do not infer production availability from a source checkout. Verify `/api/cv/status` and an authorized download separately when changing the hosted service. This GitHub import does not modify runtime secrets, private storage or deployment.

The maintenance upload route is disabled unless an expiring server-side upload token is configured. Do not activate it as part of source migration.

Run `node --test tests/cv-access.test.mjs` to check the download authorization logic. Configure edge-wide rate limits separately; the in-process limiter is supplementary.
