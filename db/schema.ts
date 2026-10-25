import { index, integer, primaryKey, sqliteTable, text } from 'drizzle-orm/sqlite-core';

// Existing aggregate page counts, preserved across the analytics upgrade.
export const pageViewsDaily = sqliteTable('page_views_daily', {
  day: text('day').notNull(), // Asia/Seoul calendar date
  page: text('page').notNull(),
  views: integer('views').notNull().default(0),
}, (table) => [primaryKey({ columns: [table.day, table.page] })]);

export const trafficDaily = sqliteTable('traffic_daily', {
  day: text('day').primaryKey(),
  views: integer('views').notNull().default(0),
  identifiedViews: integer('identified_views').notNull().default(0),
  geoViews: integer('geo_views').notNull().default(0),
  estimatedVisitors: integer('estimated_visitors').notNull().default(0),
  firstRecordedAt: text('first_recorded_at').notNull(),
});

export const trafficRegionsDaily = sqliteTable('traffic_regions_daily', {
  day: text('day').notNull(),
  country: text('country').notNull(),
  region: text('region').notNull(),
  city: text('city').notNull(),
  views: integer('views').notNull().default(0),
  estimatedVisitors: integer('estimated_visitors').notNull().default(0),
}, (table) => [primaryKey({ columns: [table.day, table.country, table.region, table.city] })]);

// Daily HMACs only: no raw IP, user-agent, page history or location per visitor.
// Previous days are purged on the next successful collection request.
export const trafficVisitorKeys = sqliteTable('traffic_visitor_keys', {
  day: text('day').notNull(),
  token: text('token').notNull(),
}, (table) => [primaryKey({ columns: [table.day, table.token] })]);

// Aggregate foreground engagement only; no visitor/session identifiers or paths.
// measured_views is the denominator for average active time per measured view.
export const pageEngagementDaily = sqliteTable('page_engagement_daily', {
  day: text('day').notNull(),
  page: text('page').notNull(),
  activeMs: integer('active_ms').notNull().default(0),
  measuredViews: integer('measured_views').notNull().default(0),
  firstRecordedAt: text('first_recorded_at').notNull(),
  lastRecordedAt: text('last_recorded_at').notNull(),
}, (table) => [primaryKey({ columns: [table.day, table.page] })]);

// Short-lived pseudonymous activity. Never store IPs or raw User-Agent strings.
export const trafficActivity = sqliteTable('traffic_activity', {
  id: text('id').primaryKey(), day: text('day').notNull(), at: text('at').notNull(),
  visitor: text('visitor'), session: text('session'), page: text('page').notNull(),
  device: text('device').notNull(), country: text('country').notNull(),
  region: text('region').notNull(), city: text('city').notNull(),
  channel: text('channel'),
}, t => [index('traffic_activity_day_at').on(t.day, t.at), index('traffic_activity_visitor').on(t.visitor)]);

export const trafficClicks = sqliteTable('traffic_clicks', {
  id: text('id').primaryKey(), day: text('day').notNull(), at: text('at').notNull(),
  visitor: text('visitor'), session: text('session'), page: text('page').notNull(), action: text('action').notNull(),
}, t => [index('traffic_clicks_day_at').on(t.day, t.at)]);

export const trafficPresence = sqliteTable('traffic_presence', {
  visitor: text('visitor').primaryKey(), session: text('session').notNull(),
  firstSeen: text('first_seen').notNull(), lastSeen: text('last_seen').notNull(),
  page: text('page').notNull(), device: text('device').notNull(),
  country: text('country').notNull(), region: text('region').notNull(), city: text('city').notNull(),
}, t => [index('traffic_presence_last_seen').on(t.lastSeen)]);

export const analyticsState = sqliteTable('analytics_state', {
  key: text('key').primaryKey(), value: text('value').notNull(),
});
