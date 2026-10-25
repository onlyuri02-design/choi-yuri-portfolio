CREATE TABLE `traffic_daily` (
	`day` text PRIMARY KEY NOT NULL,
	`views` integer DEFAULT 0 NOT NULL,
	`identified_views` integer DEFAULT 0 NOT NULL,
	`geo_views` integer DEFAULT 0 NOT NULL,
	`estimated_visitors` integer DEFAULT 0 NOT NULL,
	`first_recorded_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `traffic_regions_daily` (
	`day` text NOT NULL,
	`country` text NOT NULL,
	`region` text NOT NULL,
	`city` text NOT NULL,
	`views` integer DEFAULT 0 NOT NULL,
	`estimated_visitors` integer DEFAULT 0 NOT NULL,
	PRIMARY KEY(`day`, `country`, `region`, `city`)
);
--> statement-breakpoint
CREATE TABLE `traffic_visitor_keys` (
	`day` text NOT NULL,
	`token` text NOT NULL,
	PRIMARY KEY(`day`, `token`)
);
