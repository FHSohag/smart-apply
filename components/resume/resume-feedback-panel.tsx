"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AlertTriangle, CheckCircle2, Loader2, RotateCcw } from "lucide-react";
import { toast } from "sonner";

interface FeedbackIssue {
  section: string;
  issue: string;
  suggestion: string;
  severity: "minor" | "moderate" | "important";
}

interface Feedback {
  overallImpression: string;
  strengths: string[];
  issues: FeedbackIssue[];
}

function severityColor(severity: string): string {
  if (severity === "important") return "#E4756B";
  if (severity === "moderate") return "#F3C77E";
  return "#A8B0C3";
}

export function ResumeFeedbackPanel({ resumeId }: { resumeId: string }) {
  const [status, setStatus] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [isRetrying, setIsRetrying] = useState(false);
  const [hasCheckedOnce, setHasCheckedOnce] = useState(false);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const cancelledRef = useRef(false);

  const checkStatus = useCallback(async () => {
    const response = await fetch(`/api/resumes/${resumeId}/feedback-status`);
    const result = await response.json();
    return result.data as {
      feedbackStatus: string | null;
      feedback: Feedback | null;
    };
  }, [resumeId]);

  const startPolling = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    async function tick() {
      try {
        const data = await checkStatus();

        if (cancelledRef.current) return;

        setStatus(data.feedbackStatus);
        setHasCheckedOnce(true);

        if (data.feedbackStatus === "completed") {
          setFeedback(data.feedback);
          if (intervalRef.current) clearInterval(intervalRef.current);
        } else if (data.feedbackStatus === "failed") {
          if (intervalRef.current) clearInterval(intervalRef.current);
        }
      } catch {
        // Silent — will retry on next tick, hasCheckedOnce stays as-is
      }
    }

    tick();
    intervalRef.current = setInterval(tick, 4000);
  }, [checkStatus]);

  useEffect(() => {
    cancelledRef.current = false;
    startPolling();

    return () => {
      cancelledRef.current = true;
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [startPolling]);

  async function handleRetry() {
    try {
      setIsRetrying(true);
      setStatus("pending");

      const response = await fetch(
        `/api/resumes/${resumeId}/generate-feedback`,
        {
          method: "POST",
        },
      );

      if (!response.ok) {
        throw new Error();
      }

      startPolling();
    } catch {
      toast.error("Failed to retry feedback generation.");
      setStatus("failed");
    } finally {
      setIsRetrying(false);
    }
  }

  // Haven't gotten a real answer yet — always show loading, never
  // the retry state, even though `status` starts as null.
  if (!hasCheckedOnce) {
    return (
      <div className="mb-10 rounded-lg border border-[rgba(246,244,236,0.1)] bg-[rgba(246,244,236,0.03)] p-6">
        <div className="flex items-center gap-3 text-[#A8B0C3]">
          <Loader2 className="h-5 w-5 animate-spin" />
          <p>Loading resume feedback...</p>
        </div>
      </div>
    );
  }

  if (status === "completed" && feedback) {
    return (
      <div className="mb-10 rounded-lg border border-[rgba(246,244,236,0.1)] bg-[rgba(246,244,236,0.03)] p-6">
        <h3
          className="text-lg font-medium text-[#F6F4EC]"
          style={{ fontFamily: "'Fraunces', serif" }}
        >
          Resume Feedback
        </h3>

        <p className="mt-2 text-sm text-[#A8B0C3]">
          {feedback.overallImpression}
        </p>

        {feedback.strengths.length > 0 && (
          <div className="mt-4">
            <p className="text-xs font-medium uppercase tracking-wide text-[#3FA796]">
              Strengths
            </p>
            <ul className="mt-2 space-y-1">
              {feedback.strengths.map((strength, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 text-sm text-[#A8B0C3]"
                >
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#3FA796]" />
                  {strength}
                </li>
              ))}
            </ul>
          </div>
        )}

        {feedback.issues.length > 0 && (
          <div className="mt-4">
            <p className="text-xs font-medium uppercase tracking-wide text-[#A8B0C3]">
              Suggestions
            </p>
            <div className="mt-2 space-y-3">
              {feedback.issues.map((item, i) => (
                <div
                  key={i}
                  className="rounded-lg border border-[rgba(246,244,236,0.08)] p-3"
                >
                  <div className="flex items-center gap-2">
                    <AlertTriangle
                      className="h-4 w-4 shrink-0"
                      style={{ color: severityColor(item.severity) }}
                    />
                    <span className="text-xs font-medium text-[#F6F4EC]">
                      {item.section}
                    </span>
                    <span
                      className="ml-auto rounded-full border px-2 py-0.5 text-[10px] uppercase"
                      style={{
                        color: severityColor(item.severity),
                        borderColor: severityColor(item.severity),
                      }}
                    >
                      {item.severity}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-[#A8B0C3]">{item.issue}</p>
                  <p className="mt-1 text-sm text-[#3FA796]">
                    {item.suggestion}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  if (status === "failed" || status === null) {
    return (
      <div className="mb-10 rounded-lg border border-[rgba(246,244,236,0.1)] bg-[rgba(246,244,236,0.03)] p-6">
        <div className="flex items-center justify-between">
          <p className="text-[#A8B0C3]">
            We couldn't generate feedback for this resume.
          </p>

          <button
            onClick={handleRetry}
            disabled={isRetrying}
            className="cursor-pointer flex items-center gap-2 rounded-lg border border-[rgba(246,244,236,0.2)] px-4 py-2 text-sm text-[#F6F4EC] hover:bg-[rgba(246,244,236,0.08)] disabled:opacity-60"
          >
            <RotateCcw className="h-4 w-4" />
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-10 rounded-lg border border-[rgba(246,244,236,0.1)] bg-[rgba(246,244,236,0.03)] p-6">
      <div className="flex items-center gap-3 text-[#A8B0C3]">
        <Loader2 className="h-5 w-5 animate-spin" />
        <p>Analyzing your resume for feedback...</p>
      </div>
    </div>
  );
}
