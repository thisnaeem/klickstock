-- CreateEnum
CREATE TYPE "ContributorItemStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "License" AS ENUM ('STANDARD', 'EXTENDED');

-- CreateTable
CREATE TABLE "ContributorItem" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "status" "ContributorItemStatus" NOT NULL DEFAULT 'PENDING',
    "license" "License" NOT NULL,
    "tags" TEXT[],
    "categories" TEXT[],
    "downloads" INTEGER NOT NULL DEFAULT 0,
    "views" INTEGER NOT NULL DEFAULT 0,
    "userId" TEXT NOT NULL,
    "reviewerId" TEXT,
    "reviewNote" TEXT,
    "reviewedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ContributorItem_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ContributorItem" ADD CONSTRAINT "ContributorItem_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
