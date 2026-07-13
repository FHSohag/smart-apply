import { Resume } from "@/types/resume";
import { ResumeCard } from "./resume-card";

interface ResumeListProps {
  resumes: Resume[];
}

export function ResumeList({ resumes }: ResumeListProps) {
  if (resumes.length === 0) {
    return (
      <div className="rounded-lg border border-dashed p-12 text-center">
        <h2 className="text-lg font-semibold">No resumes yet</h2>

        <p className="mt-2 text-muted-foreground">
          Upload your first resume to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {resumes.map((resume) => (
        <ResumeCard key={resume.id} resume={resume} />
      ))}
    </div>
  );
}
