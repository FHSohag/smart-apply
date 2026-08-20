/**
 * Skill Gap Utility
 *
 * Computes exact overlap/gap between a resume's skills and a job
 * posting's required skills. Deliberately simple (case-insensitive
 * exact match, no fuzzy matching) — matches the project's earlier
 * decision to let ranking order absorb naming inconsistencies rather
 * than build fuzzy skill matching. This is diagnostic information for
 * the LLM to phrase, not the ranking mechanism itself, so the same
 * imprecision that's acceptable in ranking is acceptable here too.
 */

function normalize(skill: string): string {
  return skill.toLowerCase().trim();
}

export interface SkillGapResult {
  overlapping: string[];
  missing: string[];
}

export function computeSkillGap(
  resumeSkills: string[],
  jobSkills: string[]
): SkillGapResult {
  const normalizedResumeSkills = new Set(resumeSkills.map(normalize));

  const overlapping: string[] = [];
  const missing: string[] = [];

  for (const jobSkill of jobSkills) {
    if (normalizedResumeSkills.has(normalize(jobSkill))) {
      overlapping.push(jobSkill);
    } else {
      missing.push(jobSkill);
    }
  }

  return { overlapping, missing };
}