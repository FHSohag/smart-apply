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
    <div className="group rounded-xl border border-[rgba(246,244,236,0.10)] bg-[rgba(246,244,236,0.03)] p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-[#3FA796]/30 hover:bg-[rgba(246,244,236,0.05)]">
      <div className="flex items-start gap-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#3FA796]/10 text-[#3FA796]">
          <FileText className="h-5 w-5" />
        </div>

        <div className="flex-1">
          <h3 className="font-semibold text-[#F6F4EC]">{resume.title}</h3>

          <p className="text-sm text-[#A8B0C3]">{resume.originalName}</p>

          <p
            className="mt-2 text-xs text-[#A8B0C3]/80"
            style={{ fontFamily: "'IBM Plex Mono', monospace" }}
          >
            {(resume.fileSize / 1024).toFixed(1)} KB
          </p>

          <p
            className="text-xs text-[#A8B0C3]/80"
            style={{ fontFamily: "'IBM Plex Mono', monospace" }}
          >
            {new Date(resume.createdAt).toLocaleDateString()}
          </p>

          <div className="mt-4 flex gap-2">
            <a
              href={`/api/resumes/${resume.id}/preview`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                size="sm"
                variant="outline"
                className="border-[rgba(246,244,236,0.2)] bg-transparent text-[#F6F4EC] hover:bg-[rgba(246,244,236,0.08)] hover:text-[#F6F4EC]"
              >
                <Eye className="mr-2 h-4 w-4" />
                Preview
              </Button>
            </a>

            <Button
              size="sm"
              variant="destructive"
              onClick={handleDelete}
              className="bg-red-500/15 text-red-300 hover:bg-red-500/25"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
