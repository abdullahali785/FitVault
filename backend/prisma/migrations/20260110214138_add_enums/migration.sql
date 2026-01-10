/*
  Warnings:

  - The `availability` column on the `Offer` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `priceSource` column on the `Offer` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `imageSource` column on the `Offer` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[productId,retailer]` on the table `Offer` will be added. If there are existing duplicate values, this will fail.
  - Changed the type of `retailer` on the `Offer` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "Retailer" AS ENUM ('GOAT', 'STOCKX', 'ADIDAS', 'NIKE');

-- CreateEnum
CREATE TYPE "Availability" AS ENUM ('IN_STOCK', 'OUT_OF_STOCK', 'LIMITED', 'UNKNOWN');

-- CreateEnum
CREATE TYPE "DataSource" AS ENUM ('API', 'SCRAPE', 'CACHE');

-- AlterTable
ALTER TABLE "Offer" ADD COLUMN     "sourceProductId" TEXT,
DROP COLUMN "retailer",
ADD COLUMN     "retailer" "Retailer" NOT NULL,
DROP COLUMN "availability",
ADD COLUMN     "availability" "Availability",
DROP COLUMN "priceSource",
ADD COLUMN     "priceSource" "DataSource",
DROP COLUMN "imageSource",
ADD COLUMN     "imageSource" "DataSource";

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "currency" TEXT,
ADD COLUMN     "msrp" DOUBLE PRECISION;

-- CreateIndex
CREATE INDEX "Offer_retailer_idx" ON "Offer"("retailer");

-- CreateIndex
CREATE UNIQUE INDEX "Offer_productId_retailer_key" ON "Offer"("productId", "retailer");
