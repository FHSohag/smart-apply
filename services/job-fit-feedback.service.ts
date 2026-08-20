import { GoogleGenAI } from "@google/genai";

import { computeSkillGap } from "@/lib/skill-gap";
import type { StructuredResume } from "@/services/resume-structuring.service";

const client = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

interface JobForFitAnalysis {
  title: string;
  company: string;
  description: string;
  hardSkills: string[];
  tools: string[];
  minExperienceYears: number | null;
}

const FIT_FEEDBACK_SCHEMA = {
  type: "object",
  properties: {
    matchingStrengths: { type: "array", items: { type: "string" } },
    skillGaps: { type: "array", items: { type: "string" } },
    suggestions: { type: "array", items: { type: "string" } },
  },
  required: ["matchingStrengths", "skillGaps", "suggestions"],
};

const SYSTEM_PROMPT = `You are a career advisor helping a candidate understand how well they fit a specific job, and how to strengthen their application.

You are given: the candidate's resume data, the job posting, and a pre-computed list of skills that genuinely overlap between the two, and skills the job wants that the resume doesn't show.

CRITICAL RULES:
- matchingStrengths: turn the overlapping skills/experience into short, specific statements connecting the candidate's actual background to this job (not generic praise).
- skillGaps: phrase the missing skills as neutral, factual statements — what the job wants that isn't evident in the resume. Do not guess whether the candidate secretly has this skill.
- suggestions: concrete, actionable advice — e.g. mentioning a specific already-listed project/experience more prominently if it's relevant, or being honest that a gap exists and how to address it in a cover letter or interview. NEVER suggest the candidate claim skills or experience they don't have.
- Base everything ONLY on the resume and job data given. Do not invent resume content or job requirements not present in the data.
- Keep it concise: 2-5 items per array, not padded.`;

export async function generateJobFitFeedback(
  resume: StructuredResume,
  job: JobForFitAnalysis
): Promise<{ matchingStrengths: string[]; skillGaps: string[]; suggestions: string[] }> {
  const resumeSkills = [...resume.skills.hardSkills, ...resume.skills.tools];
  const jobSkills = [...job.hardSkills, ...job.tools];

  const { overlapping, missing } = computeSkillGap(resumeSkills, jobSkills);

  const resumeContext = [
    resume.summary ? `Summary: ${resume.summary}` : "",
    ...resume.experience.map((e) => `Experience: ${e.title} — ${e.description}`),
    ...resume.projects.map((p) => `Project: ${p.name} — ${p.description}`),
  ]
    .filter(Boolean)
    .join("\n");

  const prompt = `${SYSTEM_PROMPT}

CANDIDATE RESUME:
${resumeContext}

JOB POSTING:
Title: ${job.title}
Company: ${job.company}
Description: ${job.description}
Required skills: ${jobSkills.join(", ") || "none listed"}
Minimum experience: ${job.minExperienceYears ?? "not specified"} years

PRE-COMPUTED OVERLAP:
Skills the candidate already has that this job wants: ${overlapping.join(", ") || "none found by exact match — check resume content for related experience"}
Skills this job wants that aren't listed on the resume: ${missing.join(", ") || "none — full skill coverage"}`;

  const response = await client.models.generateContent({
    model: "gemini-3.1-flash-lite",
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    config: {
      responseMimeType: "application/json",
      responseSchema: FIT_FEEDBACK_SCHEMA,
    },
  });

  const text = response.text;

  if (!text) {
    throw new Error("Job fit feedback generation returned empty response.");
  }

  return JSON.parse(text);
}