import Link from "next/link";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import { getUserApplications } from "@/services/application.service";

export default async function ApplicationsPage() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    redirect("/login");
  }

  const applications = await getUserApplications(session.user.id);

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
              Applied Jobs ({applications.length})
            </h2>
            <p className="text-[#A8B0C3]">Jobs you've applied to.</p>
          </div>

          <Link
            href="/dashboard"
            className="text-sm text-[#A8B0C3] hover:text-[#F6F4EC]"
          >
            ← Back to Dashboard
          </Link>
        </div>

        {applications.length === 0 ? (
          <p className="text-[#A8B0C3]">You haven't applied to any jobs yet.</p>
        ) : (
          <div className="space-y-4">
            {applications.map((app) => (
              <div
                key={app.id}
                className="rounded-lg border border-[rgba(246,244,236,0.1)] bg-[rgba(246,244,236,0.03)] p-6"
              >
                <h3 className="text-lg font-medium text-[#F6F4EC]">
                  {app.jobPosting.title}
                </h3>
                <p className="text-sm text-[#A8B0C3]">
                  {app.jobPosting.company}
                </p>
                <p className="mt-2 text-xs text-[#A8B0C3]">
                  Applied {new Date(app.appliedAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
