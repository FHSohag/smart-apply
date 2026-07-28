import { JobCard } from "@/components/jobs/job-card";

interface RankedJobCardProps {
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

function scoreColor(score: number): string {
  if (score >= 80) return "#3FA796";
  if (score >= 50) return "#F3C77E";
  return "#A8B0C3";
}

export function RankedJobCard({ matchScore, ...jobProps }: RankedJobCardProps) {
  return (
    <div className="relative">
      <div
        className="absolute -top-3 right-4 rounded-full border px-3 py-1 text-xs font-semibold"
        style={{
          color: scoreColor(matchScore),
          borderColor: scoreColor(matchScore),
          backgroundColor: "#0B1220",
        }}
      >
        {matchScore}% match
      </div>

      <JobCard {...jobProps} />
    </div>
  );
}
