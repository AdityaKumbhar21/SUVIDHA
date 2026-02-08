/*
  Warnings:

  - Added the required column `consumerNumber` to the `payments` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `payments` ADD COLUMN `consumerNumber` VARCHAR(50) NOT NULL;

-- CreateIndex
CREATE INDEX `payments_consumerNumber_idx` ON `payments`(`consumerNumber`);
