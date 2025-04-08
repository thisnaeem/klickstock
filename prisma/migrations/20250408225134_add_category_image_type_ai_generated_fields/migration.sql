/*
  Warnings:

  - You are about to drop the column `categories` on the `ContributorItem` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ContributorItem" DROP COLUMN "categories",
ADD COLUMN     "aiGeneratedStatus" TEXT NOT NULL DEFAULT 'NOT_AI_GENERATED',
ADD COLUMN     "category" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "imageType" TEXT NOT NULL DEFAULT 'JPG';
