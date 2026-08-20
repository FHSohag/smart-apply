"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  Loader2,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Lightbulb,
} from "lucide-react";

interface JobFitFeedback {
  matchingStrengths: string[];
  skillGaps: string[];
  suggestions: string[];
}

export function JobFitPanel({ jobId }: { jobId: string }) {
  const [feedback, setFeedback] = useState<JobFitFeedback | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleAnalyze() {
    try {
      setIsLoading(true);

      const response = await fetch(`/api/jobs/${jobId}/fit-feedback`, {
        method: "POST",
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message);
      }

      setFeedback(result.data);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to analyze fit.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  if (!feedback) {
    return (
      <div className="mb-6 rounded-lg border border-[rgba(246,244,236,0.1)] bg-[rgba(246,244,236,0.03)] p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-medium text-[#F6F4EC]">
              How well do you fit this job?
            </h3>
            <p className="mt-1 text-sm text-[#A8B0C3]">
              Get a breakdown of your strengths and gaps for this specific role.
            </p>
          </div>

          <button
            onClick={handleAnalyze}
            disabled={isLoading}
            className="cursor-pointer flex shrink-0 items-center gap-2 rounded-lg bg-[#3FA796] px-4 py-2 text-sm font-medium text-[#0B1220] hover:bg-[#3FA796]/90 disabled:opacity-60"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                Analyze My Fit
              </>
            )}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-6 rounded-lg border border-[rgba(246,244,236,0.1)] bg-[rgba(246,244,236,0.03)] p-6">
      <h3
        className="text-lg font-medium text-[#F6F4EC]"
        style={{ fontFamily: "'Fraunces', serif" }}
      >
        Your Fit for This Role
      </h3>

      {feedback.matchingStrengths.length > 0 && (
        <div className="mt-4">
          <p className="text-xs font-medium uppercase tracking-wide text-[#3FA796]">
            Matching Strengths
          </p>
          <ul className="mt-2 space-y-1">
            {feedback.matchingStrengths.map((item, i) => (
              <li
                key={i}
                className="flex items-start gap-2 text-sm text-[#A8B0C3]"
              >
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#3FA796]" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}

      {feedback.skillGaps.length > 0 && (
        <div className="mt-4">
          <p className="text-xs font-medium uppercase tracking-wide text-[#F3C77E]">
            Skill Gaps
          </p>
          <ul className="mt-2 space-y-1">
            {feedback.skillGaps.map((item, i) => (
              <li
                key={i}
                className="flex items-start gap-2 text-sm text-[#A8B0C3]"
              >
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-[#F3C77E]" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}

      {feedback.suggestions.length > 0 && (
        <div className="mt-4">
          <p className="text-xs font-medium uppercase tracking-wide text-[#A8B0C3]">
            Suggestions
          </p>
          <ul className="mt-2 space-y-1">
            {feedback.suggestions.map((item, i) => (
              <li
                key={i}
                className="flex items-start gap-2 text-sm text-[#A8B0C3]"
              >
                <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-[#A8B0C3]" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
