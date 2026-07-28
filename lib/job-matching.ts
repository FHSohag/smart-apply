interface JobCandidate {
  id: string;
  title: string;
  company: string;
  description: string;
  hardSkills: string[];
  tools: string[];
  softSkills: string[];
  employmentType: string;
  similarity: number;
  locationCity: string | null;
  locationCountry: string | null;
  locationRaw: string | null;
  isRemote: boolean;
}

interface RankedJob extends JobCandidate {
  matchScore: number;
}

const SEMANTIC_WEIGHT = 0.85;
const LOCATION_WEIGHT = 0.15;

function computeLocationScore(
  job: JobCandidate,
  resumeCity: string | null,
  resumeCountry: string | null
): number {
  if (job.isRemote) return 0.7;
  if (!resumeCity && !resumeCountry) return 0.5;

  if (
    job.locationCity &&
    resumeCity &&
    job.locationCity.toLowerCase() === resumeCity.toLowerCase()
  ) {
    return 1.0;
  }

  if (
    job.locationCountry &&
    resumeCountry &&
    job.locationCountry.toLowerCase() === resumeCountry.toLowerCase()
  ) {
    return 0.6;
  }

  if (job.locationCity && !resumeCountry) {
    return 0.3;
  }

  return 0.1;
}

export function rankJobs(
  jobs: JobCandidate[],
  resumeCity: string | null,
  resumeCountry: string | null
): RankedJob[] {
  if (jobs.length === 0) return [];

  const similarities = jobs.map((j) => j.similarity);
  const min = Math.min(...similarities);
  const max = Math.max(...similarities);
  const range = max - min;

  const scored = jobs.map((job) => {
    const rescaledSemantic = range === 0 ? 50 : ((job.similarity - min) / range) * 100;
    const locationScore = computeLocationScore(job, resumeCity, resumeCountry) * 100;

    const matchScore = Math.round(
      rescaledSemantic * SEMANTIC_WEIGHT + locationScore * LOCATION_WEIGHT
    );

    return { ...job, matchScore };
  });

  return scored.sort((a, b) => b.matchScore - a.matchScore);
}