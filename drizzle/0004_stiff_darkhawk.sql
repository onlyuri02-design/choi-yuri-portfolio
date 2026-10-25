CREATE TABLE `traffic_clicks` (
	`id` text PRIMARY KEY NOT NULL,
	`day` text NOT NULL,
	`at` text NOT NULL,
	`visitor` text,
	`session` text,
	`page` text NOT NULL,
	`action` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `traffic_clicks_day_at` ON `traffic_clicks` (`day`,`at`);--> statement-breakpoint
ALTER TABLE `traffic_activity` ADD `channel` text;