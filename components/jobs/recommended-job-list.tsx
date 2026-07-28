"use client";

import { useState } from "react";

import { RankedJobCard } from "@/components/jobs/ranked-job-card";

interface RankedJob {
  id: string;
  title: string;
  company: string;
  description: string;
  hardSkills: string[];
  tools: string[];
  employmentType: string;
  locationRaw: string | null;
  isRemote: boolean;
  matchScore: number;
}

const PAGE_SIZE = 10;

export function RecommendedJobList({ jobs }: { jobs: RankedJob[] }) {
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  if (jobs.length === 0) {
    return (
      <p className="text-[#A8B0C3]">
        No recommendations yet — upload a resume to see AI-matched jobs.
      </p>
    );
  }

  const visibleJobs = jobs.slice(0, visibleCount);
  const hasMore = visibleCount < jobs.length;

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        {visibleJobs.map((job) => (
          <RankedJobCard key={job.id} {...job} />
        ))}
      </div>

      {hasMore && (
        <div className="flex justify-center">
          <button
            onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
            className="cursor-pointer rounded-lg border border-[rgba(246,244,236,0.2)] bg-transparent px-6 py-2 text-[#F6F4EC] hover:bg-[rgba(246,244,236,0.08)]"
          >
            Load More
          </button>
        </div>
      )}
    </div>
  );
}
