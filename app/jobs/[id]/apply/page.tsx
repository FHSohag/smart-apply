import Link from "next/link";
import { headers } from "next/headers";
import { redirect, notFound } from "next/navigation";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getResumeByUserId } from "@/services/resume.service";
import { getExistingApplication } from "@/services/application.service";
import { ApplyForm } from "@/components/jobs/apply-form";
import { JobFitPanel } from "@/components/jobs/job-fit-panel";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ApplyPage({ params }: PageProps) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    redirect("/login");
  }

  const { id } = await params;

  const job = await prisma.jobPosting.findUnique({ where: { id } });

  if (!job) {
    notFound();
  }

  const resume = await getResumeByUserId(session.user.id);
  const existingApplication = await getExistingApplication(session.user.id, id);

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

      <main className="mx-auto max-w-3xl px-6 py-10">
        <Link
          href="/jobs/recommended"
          className="text-sm text-[#A8B0C3] hover:text-[#F6F4EC]"
        >
          ← Back to Recommendations
        </Link>

        <h2
          className="mt-4 text-2xl font-medium tracking-tight text-[#F6F4EC]"
          style={{ fontFamily: "'Fraunces', serif" }}
        >
          Apply — {job.title}
        </h2>
        <p className="text-[#A8B0C3]">{job.company}</p>

        {!resume || !resume.structuredData ? (
          <p className="mt-6 text-[#A8B0C3]">
            Upload a resume before applying.{" "}
            <Link href="/dashboard" className="text-[#3FA796] underline">
              Go to dashboard
            </Link>
          </p>
        ) : existingApplication ? (
          <div className="mt-6 rounded-lg border border-[rgba(63,167,150,0.3)] bg-[rgba(63,167,150,0.08)] p-6">
            <p className="text-[#3FA796]">
              You already applied to this job on{" "}
              {new Date(existingApplication.appliedAt).toLocaleDateString()}.
            </p>
          </div>
        ) : (
          <>
            <div className="mt-6">
              <JobFitPanel jobId={job.id} />
            </div>

            <ApplyForm jobId={job.id} />
          </>
        )}
      </main>
    </div>
  );
}
