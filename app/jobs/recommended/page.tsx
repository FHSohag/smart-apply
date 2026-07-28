import Link from "next/link";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import { getResumeByUserId } from "@/services/resume.service";
import { getRankedJobsForResume } from "@/services/job-matching.service";
import { RecommendedJobList } from "@/components/jobs/recommended-job-list";

export default async function RecommendedJobsPage() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    redirect("/login");
  }

  const resume = await getResumeByUserId(session.user.id);

  const rankedJobs =
    resume && resume.structuredData
      ? await getRankedJobsForResume(resume.id)
      : [];

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
              AI Recommended Jobs
            </h2>
            <p className="text-[#A8B0C3]">
              Ranked based on your resume — best matches first.
            </p>
          </div>

          <Link
            href="/dashboard"
            className="text-sm text-[#A8B0C3] hover:text-[#F6F4EC]"
          >
            ← Back to Dashboard
          </Link>
        </div>

        <RecommendedJobList jobs={rankedJobs} />
      </main>
    </div>
  );
}
