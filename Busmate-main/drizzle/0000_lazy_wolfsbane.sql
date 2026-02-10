CREATE TABLE `account` (
	`id` varchar(191) NOT NULL,
	`account_id` varchar(255) NOT NULL,
	`provider_id` varchar(255) NOT NULL,
	`user_id` varchar(191) NOT NULL,
	`access_token` text,
	`refresh_token` text,
	`id_token` text,
	`access_token_expires_at` datetime,
	`refresh_token_expires_at` datetime,
	`scope` text,
	`password` text,
	`created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `account_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `bookings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` varchar(191) NOT NULL,
	`driver_id` int,
	`pickup_location` text NOT NULL,
	`drop_location` text NOT NULL,
	`pickup_time` datetime NOT NULL,
	`fare` double NOT NULL,
	`status` varchar(50) NOT NULL DEFAULT 'pending',
	`seats` int NOT NULL DEFAULT 1,
	`payment_status` varchar(191) NOT NULL DEFAULT 'pending',
	`payment_id` varchar(191),
	`order_id` varchar(191),
	`confirmation_code` varchar(191),
	`vehicle_type` varchar(191),
	`created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `bookings_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `drivers` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` varchar(191) NOT NULL,
	`name` varchar(191) NOT NULL,
	`email` varchar(191),
	`phone` varchar(191) NOT NULL,
	`vehicle_type` varchar(191) NOT NULL,
	`vehicle_number` varchar(191) NOT NULL,
	`license_number` varchar(191) NOT NULL,
	`license_image` text,
	`vehicle_image` text,
	`status` varchar(50) NOT NULL DEFAULT 'pending',
	`rating` double DEFAULT 0,
	`total_rides` int NOT NULL DEFAULT 0,
	`verification_status` varchar(191) NOT NULL DEFAULT 'pending',
	`created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `drivers_id` PRIMARY KEY(`id`),
	CONSTRAINT `drivers_user_id_unique` UNIQUE(`user_id`),
	CONSTRAINT `drivers_vehicle_number_unique` UNIQUE(`vehicle_number`),
	CONSTRAINT `drivers_license_number_unique` UNIQUE(`license_number`)
);
--> statement-breakpoint
CREATE TABLE `reviews` (
	`id` int AUTO_INCREMENT NOT NULL,
	`booking_id` int NOT NULL,
	`user_id` varchar(191) NOT NULL,
	`driver_id` int,
	`rating` int NOT NULL,
	`comment` text,
	`created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `reviews_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `session` (
	`id` varchar(191) NOT NULL,
	`expires_at` datetime NOT NULL,
	`token` varchar(255) NOT NULL,
	`created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	`ip_address` varchar(255),
	`user_agent` varchar(255),
	`user_id` varchar(191) NOT NULL,
	CONSTRAINT `session_id` PRIMARY KEY(`id`),
	CONSTRAINT `session_token_unique` UNIQUE(`token`)
);
--> statement-breakpoint
CREATE TABLE `user` (
	`id` varchar(191) NOT NULL,
	`name` varchar(191) NOT NULL,
	`email` varchar(191) NOT NULL,
	`email_verified` boolean NOT NULL DEFAULT false,
	`image` text,
	`created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `user_id` PRIMARY KEY(`id`),
	CONSTRAINT `user_email_unique` UNIQUE(`email`)
);
--> statement-breakpoint
CREATE TABLE `vehicles` (
	`id` int AUTO_INCREMENT NOT NULL,
	`driver_id` int NOT NULL,
	`type` varchar(191) NOT NULL,
	`number` varchar(191) NOT NULL,
	`model` varchar(191) NOT NULL,
	`capacity` int NOT NULL,
	`image` text,
	`status` varchar(191) NOT NULL DEFAULT 'available',
	`location_lat` double,
	`location_lng` double,
	`current_route` text,
	`created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `vehicles_id` PRIMARY KEY(`id`),
	CONSTRAINT `vehicles_number_unique` UNIQUE(`number`)
);
--> statement-breakpoint
CREATE TABLE `verification` (
	`id` varchar(191) NOT NULL,
	`identifier` varchar(255) NOT NULL,
	`value` varchar(255) NOT NULL,
	`expires_at` datetime NOT NULL,
	`created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `verification_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `wallet_transactions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`wallet_id` int NOT NULL,
	`user_id` varchar(191) NOT NULL,
	`type` varchar(191) NOT NULL,
	`amount` double NOT NULL,
	`balance_after` double NOT NULL,
	`description` text NOT NULL,
	`reference_id` varchar(191),
	`status` varchar(191) NOT NULL DEFAULT 'completed',
	`created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `wallet_transactions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `wallets` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` varchar(191) NOT NULL,
	`balance` double NOT NULL DEFAULT 0,
	`currency` varchar(50) NOT NULL DEFAULT 'INR',
	`created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `wallets_id` PRIMARY KEY(`id`),
	CONSTRAINT `wallets_user_id_unique` UNIQUE(`user_id`)
);
--> statement-breakpoint
ALTER TABLE `account` ADD CONSTRAINT `account_user_id_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `bookings` ADD CONSTRAINT `bookings_user_id_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `bookings` ADD CONSTRAINT `bookings_driver_id_drivers_id_fk` FOREIGN KEY (`driver_id`) REFERENCES `drivers`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `drivers` ADD CONSTRAINT `drivers_user_id_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `reviews` ADD CONSTRAINT `reviews_booking_id_bookings_id_fk` FOREIGN KEY (`booking_id`) REFERENCES `bookings`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `reviews` ADD CONSTRAINT `reviews_user_id_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `reviews` ADD CONSTRAINT `reviews_driver_id_drivers_id_fk` FOREIGN KEY (`driver_id`) REFERENCES `drivers`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `session` ADD CONSTRAINT `session_user_id_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `vehicles` ADD CONSTRAINT `vehicles_driver_id_drivers_id_fk` FOREIGN KEY (`driver_id`) REFERENCES `drivers`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `wallet_transactions` ADD CONSTRAINT `wallet_transactions_wallet_id_wallets_id_fk` FOREIGN KEY (`wallet_id`) REFERENCES `wallets`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `wallet_transactions` ADD CONSTRAINT `wallet_transactions_user_id_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `wallets` ADD CONSTRAINT `wallets_user_id_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `booking_user_id_idx` ON `bookings` (`user_id`);--> statement-breakpoint
CREATE INDEX `booking_driver_id_idx` ON `bookings` (`driver_id`);--> statement-breakpoint
CREATE INDEX `booking_status_idx` ON `bookings` (`status`);--> statement-breakpoint
CREATE INDEX `driver_user_id_idx` ON `drivers` (`user_id`);--> statement-breakpoint
CREATE INDEX `driver_status_idx` ON `drivers` (`status`);--> statement-breakpoint
CREATE INDEX `review_booking_id_idx` ON `reviews` (`booking_id`);--> statement-breakpoint
CREATE INDEX `review_driver_id_idx` ON `reviews` (`driver_id`);--> statement-breakpoint
CREATE INDEX `vehicle_driver_id_idx` ON `vehicles` (`driver_id`);--> statement-breakpoint
CREATE INDEX `vehicle_status_idx` ON `vehicles` (`status`);--> statement-breakpoint
CREATE INDEX `wt_wallet_id_idx` ON `wallet_transactions` (`wallet_id`);--> statement-breakpoint
CREATE INDEX `wt_user_id_idx` ON `wallet_transactions` (`user_id`);--> statement-breakpoint
CREATE INDEX `wallet_user_id_idx` ON `wallets` (`user_id`);