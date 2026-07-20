import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import { getUserResumes } from "@/services/resume.service";

import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { ResumeList } from "@/components/resume/resume-list";

export default async function DashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  const resumes = await getUserResumes(session.user.id);

  return (
    <main className="container mx-auto max-w-7xl px-6 py-10">
      <DashboardHeader user={session.user} hasResume={resumes.length > 0} />

      <div className="mb-6">
        <h2 className="text-2xl font-semibold">
          My Resumes ({resumes.length})
        </h2>

        <p className="text-muted-foreground">
          Your uploaded resumes are shown below.
        </p>
      </div>

      <ResumeList resumes={resumes} />
    </main>
  );
}
