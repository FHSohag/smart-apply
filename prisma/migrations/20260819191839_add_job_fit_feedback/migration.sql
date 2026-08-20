-- CreateTable
CREATE TABLE "JobFitFeedback" (
    "id" TEXT NOT NULL,
    "matchingStrengths" TEXT[],
    "skillGaps" TEXT[],
    "suggestions" TEXT[],
    "generatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "resumeId" TEXT NOT NULL,
    "jobPostingId" TEXT NOT NULL,

    CONSTRAINT "JobFitFeedback_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "JobFitFeedback_resumeId_jobPostingId_key" ON "JobFitFeedback"("resumeId", "jobPostingId");

-- AddForeignKey
ALTER TABLE "JobFitFeedback" ADD CONSTRAINT "JobFitFeedback_resumeId_fkey" FOREIGN KEY ("resumeId") REFERENCES "Resume"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JobFitFeedback" ADD CONSTRAINT "JobFitFeedback_jobPostingId_fkey" FOREIGN KEY ("jobPostingId") REFERENCES "JobPosting"("id") ON DELETE CASCADE ON UPDATE CASCADE;
