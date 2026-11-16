-- Run in MySQL Workbench as a MySQL administrator. LOCAL DEVELOPMENT ONLY.
CREATE DATABASE IF NOT EXISTS habit_tracker CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER IF NOT EXISTS 'habit_user'@'localhost' IDENTIFIED BY 'CHANGE_ME';
GRANT ALL PRIVILEGES ON habit_tracker.* TO 'habit_user'@'localhost';
-- Prisma migrate dev may require permission to create a temporary shadow database.
GRANT CREATE, DROP ON *.* TO 'habit_user'@'localhost';
