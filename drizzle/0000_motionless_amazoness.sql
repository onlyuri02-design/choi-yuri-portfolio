CREATE TABLE `page_views_daily` (
	`day` text NOT NULL,
	`page` text NOT NULL,
	`views` integer DEFAULT 0 NOT NULL,
	PRIMARY KEY(`day`, `page`)
);
