import Link from "next/link";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { JobCard } from "@/components/jobs/job-card";

export default async function AllJobsPage() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    redirect("/login");
  }

  const jobs = await prisma.jobPosting.findMany({
    where: { isActive: true },
    orderBy: { postedAt: "desc" },
  });

  return (
    <div
      className="min-h-screen bg-[#0B1220] text-[#F6F4EC] antialiased"
      style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
    >
      <header className="border-b border-[rgba(246,244,236,0.08)]">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <Link
            href="/"
            className="text-3xl font-semibold tracking-tight"
            style={{ fontFamily: "'Fraunces', serif" }}
          >
            SmartApply
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-10">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2
              className="text-2xl font-medium tracking-tight text-[#F6F4EC]"
              style={{ fontFamily: "'Fraunces', serif" }}
            >
              All Job Listings ({jobs.length})
            </h2>
            <p className="text-[#A8B0C3]">Browse every open position.</p>
          </div>

          <Link
            href="/dashboard"
            className="text-sm text-[#A8B0C3] hover:text-[#F6F4EC]"
          >
            ← Back to Dashboard
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {jobs.map((job) => (
            <JobCard
              key={job.id}
              title={job.title}
              company={job.company}
              description={job.description}
              hardSkills={job.hardSkills}
              tools={job.tools}
              employmentType={job.employmentType}
              locationRaw={job.locationRaw}
              isRemote={job.isRemote}
            />
          ))}
        </div>
      </main>
    </div>
  );
}
