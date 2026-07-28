import { prisma } from "@/lib/prisma";

export interface CreateJobPostingInput {
  title: string;
  company: string;
  description: string;
  hardSkills: string[];
  tools: string[];
  softSkills: string[];
  languages: string[];
  minExperienceYears: number | null;
  employmentType: string;
  locationRaw: string | null;
  locationCity: string | null;
  locationCountry: string | null;
  isRemote: boolean;
}

export async function createJobPosting(data: CreateJobPostingInput) {
  return prisma.jobPosting.create({ data });
}

export async function saveJobEmbedding(
  jobPostingId: string,
  embedding: number[],
): Promise<void> {
  const vectorLiteral = `[${embedding.join(",")}]`;

  await prisma.$executeRaw`
    UPDATE "JobPosting"
    SET embedding = ${vectorLiteral}::vector
    WHERE id = ${jobPostingId}
  `;
}
