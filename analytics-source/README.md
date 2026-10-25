# Portfolio live analytics

Owner-only dashboard: `/analytics` (canonical `https://yuri-choi.yurinananana.chatgpt.site/analytics`). Public portfolio access is unchanged.

## Implementation

- `/api/page-view`: validated views and optional non-counting heartbeat. Existing daily totals remain intact.
- `/api/analytics`: owner-only live read, 15-second client polling; errors do not become zero counts.
- `/api/snapshot`, `/api/presentation`: owner-only Data shell evidence and optimistic-concurrency presentation storage.
- Runtime `ANALYTICS_OWNER_EMAIL`: owner allowlist supplied through Sites environment secrets. Never hard-code its value. Identity is supplied by Sites authentication, not by browser JavaScript.
- `ANALYTICS_SECRET`: existing HMAC secret. Raw IP and full User-Agent are not retained. A daily key estimates daily visitors; a separate stable HMAC links recent activity. Neither identifies an actual person.
- D1 migration `0003_lazy_greymalkin` appends `traffic_activity`, `traffic_presence`, `analytics_state`. It contains no seed records.
- Activity is retained for 30 days and expired rows are removed on the next page-view write. Read APIs also constrain history to the retention window.
- Session boundary: 30 minutes without received activity. Recent activity KPI: last five minutes, not a guaranteed present human count. Heartbeats never increase views.
- Known bots, DNT/GPC, excluded browsers and authenticated owner visits are ignored. This cannot guarantee all bots or all devices belonging to the owner are excluded. Local QA does not enter production traffic.
- Exclusion preference must be enabled separately for each origin and browser. `/privacy#analytics-settings` provides the control. The native dashboard origin and `yurichoi.com` do not share browser storage.
- Region/city are used only if present in trusted edge metadata. Do not infer cities from company names or country. Existing historical rows cannot be enriched retroactively.

## Dashboard authoring

The active editable component is `AnalyticsDashboard.jsx`, with `live.css` and `world-countries.json`, mirrored from the authoring project's `src/content/dashboard/`. `LiveDashboard.jsx` is the previous implementation retained for reference. The Data app's installed authoring rules and shared runtime must be preserved. Its `DashboardContent.jsx` exports `LiveDashboard` from `AnalyticsDashboard.jsx` as `DashboardContent`.

The map geometry is derived from Natural Earth's public-domain 110m admin-0 countries GeoJSON (nvkelso/natural-earth-vector, geojson/ne_110m_admin_0_countries.geojson). It is bundled locally; no visitor information is sent to a mapping service.

Migration `0004_stiff_darkhawk` adds a channel classification to detailed activity and the `traffic_clicks` table. It is additive and contains no test data. Only whitelisted click action labels and existing page keys are stored, not form contents or destination addresses. Referrer hosts are classified and discarded, not stored. Missing historical classifications remain “수집 전”.

Day/7-day/30-day windows use distinct IDs over the whole selected interval, not summed daily unique counts. Geography/device breakdowns use each session's first record in the selected interval; acquisition uses its earliest retained record. The dashboard is refreshed every 15 seconds while visible. The source-backed custom bar lists avoid overlapping labels on narrow screens.

Build using the installed Data plugin's `scripts/data-app.mjs build --project-dir <authoring-project>` command, then copy the resulting unmodified `dist/index.html` to `lib/analytics-dashboard.html` and the reviewed metadata `src/data.json` to `lib/analytics-snapshot.json`. The embedded snapshot contains definitions and empty rows, never production visitor records. Authenticated live APIs provide the records at runtime. Build the existing Vinext site, then use the Sites source/publish workflow.

## Verification (2026-10-11)

- Analytics/opt-out automated tests: 30 passed, including session boundaries, cross-day period deduplication and source attribution, click non-inflation, heartbeat non-counting, retention, owner authorization and no raw IP leakage.
- Type check and production Vinext build: passed.
- Local rendered QA: empty state, populated synthetic data, date selection, browser filter, refresh and narrow layout. The local-only synthetic fixture must never be applied to a hosted database.
- Broader regression suite: 47/48 passed. The unchanged pre-existing `company-archives.test.mjs` assertion rejects the already-published YURI&YURI "1억 원" claim. That copy and test were not changed as part of analytics work.
