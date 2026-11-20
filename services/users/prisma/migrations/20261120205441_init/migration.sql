-- CreateEnum
CREATE TYPE "Kind" AS ENUM ('USER', 'ADMIN', 'ENTERPRISE', 'INSTITUTIONAL');

-- CreateEnum
CREATE TYPE "Language" AS ENUM ('FR', 'EN');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('ACTIVE', 'BLOCKED', 'PENDING');

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "identifier" TEXT NOT NULL,
    "contact" TEXT,
    "name" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "kind" "Kind" NOT NULL DEFAULT 'USER',
    "language" "Language" NOT NULL DEFAULT 'FR',
    "status" "Status" NOT NULL DEFAULT 'PENDING',
    "failedLoginCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Account_identifier_key" ON "Account"("identifier");
