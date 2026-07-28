// debug-similarity.mts
import { prisma } from "@/lib/prisma";

const RESUME_ID = "cms51a1op0001izzgcluu9q0z";

async function main() {
  const resume = await prisma.resume.findUnique({
    where: { id: RESUME_ID },
    select: { title: true },
  });

  if (!resume) {
    console.log("Resume not found.");
    return;
  }

  console.log(`Testing against resume: ${resume.title}\n`);

  const results = await prisma.$queryRaw
    <Array<{ title: string; company: string; distance: number }>
  >`
    SELECT
      title,
      company,
      (embedding <=> (SELECT embedding FROM "Resume" WHERE id = ${RESUME_ID})) AS distance
    FROM "JobPosting"
    WHERE "isActive" = true
    ORDER BY distance ASC
  `;

  console.log("Ranked matches (closest first):\n");
  for (const row of results) {
    const similarity = 1 - row.distance;
    console.log(
      `${(similarity * 100).toFixed(1)}%  —  ${row.title} @ ${row.company}`
    );
  }
}

main()
  .catch((error) => console.error("FAILED:", error))
  .finally(() => prisma.$disconnect());