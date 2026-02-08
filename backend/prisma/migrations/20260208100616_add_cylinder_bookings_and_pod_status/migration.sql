-- AlterTable
ALTER TABLE `payments` MODIFY `status` ENUM('PENDING', 'SUCCESS', 'FAILED', 'REFUNDED', 'PAY_ON_DELIVERY') NOT NULL DEFAULT 'PENDING';

-- CreateTable
CREATE TABLE `cylinder_bookings` (
    `id` VARCHAR(36) NOT NULL,
    `userId` VARCHAR(36) NOT NULL,
    `consumerNumber` VARCHAR(50) NOT NULL,
    `provider` VARCHAR(20) NOT NULL,
    `deliveryAddress` TEXT NOT NULL,
    `cylinderType` VARCHAR(20) NOT NULL DEFAULT '14.2kg',
    `amountPaise` BIGINT NOT NULL DEFAULT 90300,
    `paymentMode` VARCHAR(20) NOT NULL DEFAULT 'PAY_ON_DELIVERY',
    `status` VARCHAR(20) NOT NULL DEFAULT 'BOOKED',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `cylinder_bookings_userId_idx`(`userId`),
    INDEX `cylinder_bookings_consumerNumber_idx`(`consumerNumber`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `cylinder_bookings` ADD CONSTRAINT `cylinder_bookings_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
