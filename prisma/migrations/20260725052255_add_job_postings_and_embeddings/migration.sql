CREATE EXTENSION IF NOT EXISTS vector;

-- AlterTable
ALTER TABLE "Resume" ADD COLUMN     "embedding" vector(768);

-- CreateTable
CREATE TABLE "JobPosting" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "hardSkills" TEXT[],
    "tools" TEXT[],
    "softSkills" TEXT[],
    "languages" TEXT[],
    "minExperienceYears" INTEGER,
    "employmentType" TEXT NOT NULL,
    "locationRaw" TEXT,
    "locationCity" TEXT,
    "locationCountry" TEXT,
    "isRemote" BOOLEAN NOT NULL DEFAULT false,
    "embedding" vector(768),
    "postedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "JobPosting_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "JobPosting_isActive_idx" ON "JobPosting"("isActive");
