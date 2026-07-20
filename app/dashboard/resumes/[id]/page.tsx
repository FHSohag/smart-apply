import { notFound } from "next/navigation";
import { headers } from "next/headers";

import { auth } from "@/lib/auth";
import { getResumeById } from "@/services/resume.service";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ResumePreviewPage({ params }: PageProps) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    notFound();
  }

  const { id } = await params;

  const resume = await getResumeById(id, session.user.id);

  if (!resume) {
    notFound();
  }

  const isPdf = resume.mimeType === "application/pdf";

  return (
    <main className="mx-auto max-w-6xl p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">{resume.title}</h1>

        <p className="mt-2 text-muted-foreground">{resume.originalName}</p>
      </div>

      {isPdf ? (
        <iframe
          src={resume.fileUrl}
          className="h-[80vh] w-full rounded-lg border"
        />
      ) : (
        <div className="rounded-lg border p-8 text-center">
          <h2 className="text-xl font-semibold">Preview unavailable</h2>

          <p className="mt-2 text-muted-foreground">
            DOCX files cannot be previewed in the browser.
          </p>
        </div>
      )}
    </main>
  );
}
