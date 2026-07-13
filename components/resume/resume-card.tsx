import { FileText } from "lucide-react";

import { Resume } from "@/types/resume";

interface ResumeCardProps {
  resume: Resume;
}

export function ResumeCard({ resume }: ResumeCardProps) {
  return (
    <div className="rounded-xl border p-5 transition hover:shadow-md">
      <div className="flex items-start gap-4">
        <FileText className="mt-1 h-10 w-10 text-blue-600" />

        <div className="flex-1">
          <h3 className="font-semibold">{resume.title}</h3>

          <p className="text-sm text-muted-foreground">{resume.originalName}</p>

          <p className="mt-2 text-xs text-muted-foreground">
            {(resume.fileSize / 1024).toFixed(1)} KB
          </p>

          <p className="text-xs text-muted-foreground">
            {new Date(resume.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );
}
