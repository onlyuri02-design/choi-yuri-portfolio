CREATE TABLE `page_engagement_daily` (
	`day` text NOT NULL,
	`page` text NOT NULL,
	`active_ms` integer DEFAULT 0 NOT NULL,
	`measured_views` integer DEFAULT 0 NOT NULL,
	`first_recorded_at` text NOT NULL,
	`last_recorded_at` text NOT NULL,
	PRIMARY KEY(`day`, `page`)
);
