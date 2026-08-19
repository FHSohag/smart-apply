import Link from "next/link";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import { getUserResumes } from "@/services/resume.service";

import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { ResumeList } from "@/components/resume/resume-list";
import { ResumeFeedbackPanel } from "@/components/resume/resume-feedback-panel";

export default async function DashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  const resumes = await getUserResumes(session.user.id);

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
        <DashboardHeader user={session.user} hasResume={resumes.length > 0} />

        <div className="mb-10 flex gap-4">
          <Link
            href="/jobs"
            className="rounded-lg border border-[rgba(246,244,236,0.2)] bg-transparent px-5 py-2.5 text-sm font-medium text-[#F6F4EC] hover:bg-[rgba(246,244,236,0.08)]"
          >
            Browse All Jobs
          </Link>

          <Link
            href="/jobs/recommended"
            className="rounded-lg bg-[#3FA796] px-5 py-2.5 text-sm font-medium text-[#0B1220] hover:bg-[#3FA796]/90"
          >
            AI Recommended Jobs
          </Link>

          <Link
            href="/applications"
            className="rounded-lg border border-[rgba(246,244,236,0.2)] bg-transparent px-5 py-2.5 text-sm font-medium text-[#F6F4EC] hover:bg-[rgba(246,244,236,0.08)]"
          >
            Applied Jobs
          </Link>
        </div>

        <div className="mb-6">
          <h2
            className="text-2xl font-medium tracking-tight text-[#F6F4EC]"
            style={{ fontFamily: "'Fraunces', serif" }}
          >
            My Resumes ({resumes.length})
          </h2>

          <p className="text-[#A8B0C3]">
            Your uploaded resumes are shown below.
          </p>
        </div>

        <ResumeList resumes={resumes} />

        <div className="mt-10">
          {resumes.length > 0 && (
            <ResumeFeedbackPanel resumeId={resumes[0].id} />
          )}
        </div>
      </main>
    </div>
  );
}
