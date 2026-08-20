import { prisma } from "@/lib/prisma";

export async function getCachedJobFitFeedback(
  resumeId: string,
  jobPostingId: string
) {
  return prisma.jobFitFeedback.findUnique({
    where: {
      resumeId_jobPostingId: { resumeId, jobPostingId },
    },
  });
}

export async function saveJobFitFeedback(
  resumeId: string,
  jobPostingId: string,
  feedback: { matchingStrengths: string[]; skillGaps: string[]; suggestions: string[] }
) {
  return prisma.jobFitFeedback.create({
    data: {
      resumeId,
      jobPostingId,
      ...feedback,
    },
  });
}