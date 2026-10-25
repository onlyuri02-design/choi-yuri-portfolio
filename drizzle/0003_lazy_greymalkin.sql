CREATE TABLE `analytics_state` (
	`key` text PRIMARY KEY NOT NULL,
	`value` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `traffic_activity` (
	`id` text PRIMARY KEY NOT NULL,
	`day` text NOT NULL,
	`at` text NOT NULL,
	`visitor` text,
	`session` text,
	`page` text NOT NULL,
	`device` text NOT NULL,
	`country` text NOT NULL,
	`region` text NOT NULL,
	`city` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `traffic_activity_day_at` ON `traffic_activity` (`day`,`at`);--> statement-breakpoint
CREATE INDEX `traffic_activity_visitor` ON `traffic_activity` (`visitor`);--> statement-breakpoint
CREATE TABLE `traffic_presence` (
	`visitor` text PRIMARY KEY NOT NULL,
	`session` text NOT NULL,
	`first_seen` text NOT NULL,
	`last_seen` text NOT NULL,
	`page` text NOT NULL,
	`device` text NOT NULL,
	`country` text NOT NULL,
	`region` text NOT NULL,
	`city` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `traffic_presence_last_seen` ON `traffic_presence` (`last_seen`);