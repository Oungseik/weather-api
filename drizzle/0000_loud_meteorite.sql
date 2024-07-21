CREATE TABLE `cities` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text,
	`country` text
);
--> statement-breakpoint
CREATE TABLE `weather_conditions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`chance_of_rain` integer NOT NULL,
	`temperature` integer NOT NULL,
	`real_feel` integer NOT NULL,
	`wind` integer NOT NULL,
	`uv_index` integer NOT NULL,
	`status` text NOT NULL,
	`date` text NOT NULL,
	`city_id` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `cities_name_unique` ON `cities` (`name`);--> statement-breakpoint
CREATE INDEX `name_idx` ON `cities` (`name`);