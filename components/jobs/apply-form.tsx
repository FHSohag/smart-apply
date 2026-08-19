"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Loader2, Sparkles, CheckCircle2 } from "lucide-react";

import { Button } from "@/components/ui/button";

export function ApplyForm({ jobId }: { jobId: string }) {
  const [coverLetter, setCoverLetter] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);

  async function handleGenerate() {
    try {
      setIsGenerating(true);

      const response = await fetch(`/api/jobs/${jobId}/generate-cover-letter`, {
        method: "POST",
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message);
      }

      setCoverLetter(result.data.coverLetter);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to generate cover letter.",
      );
    } finally {
      setIsGenerating(false);
    }
  }

  async function handleApply() {
    if (coverLetter.trim().length < 10) {
      toast.error("Please write or generate a cover letter first.");
      return;
    }

    try {
      setIsSubmitting(true);

      const response = await fetch(`/api/jobs/${jobId}/apply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ coverLetter }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message);
      }

      toast.success("Application submitted successfully!");
      setHasApplied(true);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to apply.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (hasApplied) {
    return (
      <div className="mt-6 rounded-lg border border-[rgba(63,167,150,0.3)] bg-[rgba(63,167,150,0.08)] p-6">
        <div className="flex items-center gap-2 text-[#3FA796]">
          <CheckCircle2 className="h-5 w-5" />
          <p className="font-medium">Application submitted successfully!</p>
        </div>
        <p className="mt-2 text-sm text-[#A8B0C3]">
          You can view all your applications on the Applied Jobs page.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-6 space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-sm text-[#A8B0C3]">Cover Letter</label>

        <Button
          type="button"
          variant="outline"
          disabled={isGenerating}
          onClick={handleGenerate}
          className="cursor-pointer border-[rgba(246,244,236,0.2)] bg-transparent text-[#F6F4EC] hover:bg-[rgba(246,244,236,0.08)]"
        >
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-4 w-4" />
              Generate with AI
            </>
          )}
        </Button>
      </div>

      <textarea
        value={coverLetter}
        onChange={(e) => setCoverLetter(e.target.value)}
        rows={14}
        placeholder="Write your cover letter, or click 'Generate with AI' to draft one based on your resume."
        className="w-full rounded-lg border border-[rgba(246,244,236,0.15)] bg-[rgba(246,244,236,0.05)] p-4 text-[#F6F4EC] placeholder:text-[#A8B0C3]/60 focus:border-[#3FA796] focus:outline-none"
      />

      <Button
        onClick={handleApply}
        disabled={isSubmitting}
        className="cursor-pointer w-full bg-[#3FA796] text-[#0B1220] hover:bg-[#3FA796]/90 disabled:opacity-60"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Submitting...
          </>
        ) : (
          "Apply"
        )}
      </Button>
    </div>
  );
}
