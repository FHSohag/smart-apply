import { FileText } from "lucide-react";

import { Resume } from "@/types/resume";
import { ResumeCard } from "./resume-card";

interface ResumeListProps {
  resumes: Resume[];
}

export function ResumeList({ resumes }: ResumeListProps) {
  if (resumes.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-[rgba(246,244,236,0.15)] bg-[rgba(246,244,236,0.02)] p-12 text-center">
        <FileText className="mx-auto mb-4 h-10 w-10 text-[#A8B0C3]/60" />

        <h2 className="text-lg font-semibold text-[#F6F4EC]">No resumes yet</h2>

        <p className="mt-2 text-[#A8B0C3]">
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
