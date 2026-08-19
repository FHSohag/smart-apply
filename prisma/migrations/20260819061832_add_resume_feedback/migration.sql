-- AlterTable
ALTER TABLE "Resume" ADD COLUMN     "feedback" JSONB,
ADD COLUMN     "feedbackGeneratedAt" TIMESTAMP(3),
ADD COLUMN     "feedbackStatus" TEXT;
