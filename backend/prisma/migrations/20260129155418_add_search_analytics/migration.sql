-- CreateTable
CREATE TABLE `FraudLog` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NULL,
    `ipAddress` VARCHAR(191) NULL,
    `deviceFingerprint` VARCHAR(191) NULL,
    `riskScore` INTEGER NOT NULL,
    `riskLevel` VARCHAR(191) NOT NULL,
    `reasons` TEXT NOT NULL,
    `orderDetails` JSON NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `FraudLog_userId_idx`(`userId`),
    INDEX `FraudLog_ipAddress_idx`(`ipAddress`),
    INDEX `FraudLog_riskLevel_idx`(`riskLevel`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SearchAnalytics` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NULL,
    `query` VARCHAR(500) NOT NULL,
    `resultsCount` INTEGER NOT NULL,
    `clickedProductId` INTEGER NULL,
    `purchased` BOOLEAN NOT NULL DEFAULT false,
    `sessionId` VARCHAR(191) NULL,
    `timestamp` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `SearchAnalytics_query_idx`(`query`),
    INDEX `SearchAnalytics_timestamp_idx`(`timestamp`),
    INDEX `SearchAnalytics_userId_idx`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `SearchAnalytics` ADD CONSTRAINT `SearchAnalytics_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
