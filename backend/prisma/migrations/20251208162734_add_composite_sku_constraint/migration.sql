/*
  Warnings:

  - A unique constraint covering the columns `[categoryId,sku]` on the table `Product` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX `Product_sku_key` ON `product`;

-- CreateIndex
CREATE UNIQUE INDEX `Product_categoryId_sku_key` ON `Product`(`categoryId`, `sku`);
