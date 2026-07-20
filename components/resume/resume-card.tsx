"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Eye, FileText, Trash2 } from "lucide-react";

import { Resume } from "@/types/resume";
import { Button } from "@/components/ui/button";

interface ResumeCardProps {
  resume: Resume;
}

export function ResumeCard({ resume }: ResumeCardProps) {
  const router = useRouter();

  async function handleDelete() {
    const confirmed = window.confirm(
      "Are you sure you want to delete this resume?",
    );

    if (!confirmed) return;

    try {
      const response = await fetch(`/api/resumes/${resume.id}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message);
      }

      toast.success("Resume deleted successfully.");

      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Delete failed.");
    }
  }

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

          <div className="mt-4 flex gap-2">
            <a
              href={`/api/resumes/${resume.id}/preview`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button size="sm" variant="outline">
                <Eye className="mr-2 h-4 w-4" />
                Preview
              </Button>
            </a>

            <Button size="sm" variant="destructive" onClick={handleDelete}>
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
