CREATE TABLE `employees` (
	`id` int AUTO_INCREMENT NOT NULL,
	`email` varchar(320) NOT NULL,
	`password` varchar(255) NOT NULL,
	`firstName` varchar(255) NOT NULL,
	`lastName` varchar(255) NOT NULL,
	`employeeId` varchar(50) NOT NULL,
	`department` varchar(100),
	`position` varchar(100),
	`isActive` boolean DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `employees_id` PRIMARY KEY(`id`),
	CONSTRAINT `employees_email_unique` UNIQUE(`email`),
	CONSTRAINT `employees_employeeId_unique` UNIQUE(`employeeId`)
);
--> statement-breakpoint
CREATE TABLE `monthlyReports` (
	`id` int AUTO_INCREMENT NOT NULL,
	`employeeId` int NOT NULL,
	`year` int NOT NULL,
	`month` int NOT NULL,
	`totalHours` decimal(7,2),
	`businessDayHours` decimal(7,2),
	`overtimeHours` decimal(7,2),
	`projectCount` int,
	`generatedAt` timestamp DEFAULT (now()),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `monthlyReports_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `timeTrackingRecords` (
	`id` int AUTO_INCREMENT NOT NULL,
	`employeeId` int NOT NULL,
	`workDate` timestamp NOT NULL,
	`projectNumber` varchar(100),
	`projectName` varchar(255),
	`taskType` varchar(100) NOT NULL,
	`client` varchar(255),
	`languages` varchar(500),
	`startTime` varchar(10) NOT NULL,
	`endTime` varchar(10) NOT NULL,
	`duration` decimal(5,2),
	`businessDayTime` decimal(5,2),
	`overtime` decimal(5,2),
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `timeTrackingRecords_id` PRIMARY KEY(`id`)
);
