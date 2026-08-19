import { prisma } from "@/lib/prisma";
import { ValidationError } from "@/lib/errors";

export async function getExistingApplication(
  userId: string,
  jobPostingId: string
) {
  return prisma.application.findUnique({
    where: {
      userId_jobPostingId: { userId, jobPostingId },
    },
  });
}

export async function createApplication(
  userId: string,
  jobPostingId: string,
  coverLetter: string
) {
  const existing = await getExistingApplication(userId, jobPostingId);

  if (existing) {
    throw new ValidationError("You have already applied to this job.");
  }

  return prisma.application.create({
    data: { userId, jobPostingId, coverLetter },
  });
}

export async function getUserApplications(userId: string) {
  return prisma.application.findMany({
    where: { userId },
    include: { jobPosting: true },
    orderBy: { appliedAt: "desc" },
  });
}