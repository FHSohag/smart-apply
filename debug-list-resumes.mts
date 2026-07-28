// debug-list-resumes.mts
import { prisma } from "@/lib/prisma";

async function main() {
  const resumes = await prisma.resume.findMany({
    select: { id: true, title: true, createdAt: true },
    orderBy: { createdAt: "desc" },
  });

  console.log(`Found ${resumes.length} resume(s):\n`);
  for (const r of resumes) {
    console.log(`- "${r.title}"  (id: ${r.id}, created: ${r.createdAt.toISOString()})`);
  }
}

main()
  .catch((error) => console.error("FAILED:", error))
  .finally(() => prisma.$disconnect());