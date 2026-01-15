/*
  Warnings:

  - The `category` column on the `Product` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "ProductCategory" AS ENUM ('SHOES', 'APPAREL', 'OTHER');

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "rawCategory" TEXT,
DROP COLUMN "category",
ADD COLUMN     "category" "ProductCategory";
