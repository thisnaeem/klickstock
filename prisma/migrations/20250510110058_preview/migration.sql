/*
  Warnings:

  - Added the required column `previewUrl` to the `ContributorItem` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ContributorItem" ADD COLUMN     "previewUrl" TEXT NOT NULL;
