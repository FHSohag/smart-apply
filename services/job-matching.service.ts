import { prisma } from "@/lib/prisma";
import { rankJobs } from "@/lib/job-matching";

interface JobSimilarityRow {
  id: string;
  title: string;
  company: string;
  description: string;
  hardSkills: string[];
  tools: string[];
  softSkills: string[];
  employmentType: string;
  distance: number;
  locationCity: string | null;
  locationCountry: string | null;
  locationRaw: string | null;
  isRemote: boolean;
}

export async function getRankedJobsForResume(resumeId: string) {
  const resume = await prisma.resume.findUnique({
    where: { id: resumeId },
    select: { structuredData: true },
  });

  if (!resume?.structuredData) {
    throw new Error("Resume has no structured data.");
  }

  const structured = resume.structuredData as {
    personalInfo: { location: { city: string | null; country: string | null } };
  };

  const rows = await prisma.$queryRaw<JobSimilarityRow[]>`
    SELECT
      id,
      title,
      company,
      description,
      "hardSkills",
      tools,
      "softSkills",
      "employmentType",
      "locationCity",
      "locationCountry",
      "locationRaw",
      "isRemote",
      (embedding <=> (SELECT embedding FROM "Resume" WHERE id = ${resumeId})) AS distance
    FROM "JobPosting"
    WHERE "isActive" = true
    ORDER BY distance ASC
  `;

  const candidates = rows.map((row) => ({
    id: row.id,
    title: row.title,
    company: row.company,
    description: row.description,
    hardSkills: row.hardSkills,
    tools: row.tools,
    softSkills: row.softSkills,
    employmentType: row.employmentType,
    similarity: 1 - row.distance,
    locationCity: row.locationCity,
    locationCountry: row.locationCountry,
    locationRaw: row.locationRaw,
    isRemote: row.isRemote,
  }));

  return rankJobs(
    candidates,
    structured.personalInfo.location.city,
    structured.personalInfo.location.country
  );
}