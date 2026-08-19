import { GoogleGenAI } from "@google/genai";
import type { StructuredResume } from "@/services/resume-structuring.service";

const client = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

interface JobForCoverLetter {
  title: string;
  company: string;
  description: string;
  hardSkills: string[];
  tools: string[];
}

const SYSTEM_PROMPT = `You are a professional cover letter writer. Write a concise, genuine cover letter (250-350 words) for the candidate applying to the given job.

CRITICAL RULES:
- Only reference skills, experience, and achievements that are explicitly present in the candidate's resume data below. NEVER invent or exaggerate accomplishments, skills, job titles, or years of experience the candidate does not actually have.
- Connect the candidate's real background to the specific job's requirements — don't write a generic letter that could apply to any job.
- Professional but not stiff; avoid cliché opening lines like "I am writing to express my interest."
- Do not fabricate a specific hiring manager's name — use a neutral greeting if none is known.
- Output only the cover letter text, no preamble, no explanation, no markdown formatting.`;

export async function generateCoverLetter(
  resume: StructuredResume,
  job: JobForCoverLetter
): Promise<string> {
  const resumeContext = [
    `Name: ${resume.personalInfo.name ?? "the candidate"}`,
    resume.summary ? `Summary: ${resume.summary}` : "",
    `Skills: ${[...resume.skills.hardSkills, ...resume.skills.tools].join(", ")}`,
    ...resume.experience.map((e) => `Experience: ${e.title} — ${e.description}`),
    ...resume.education.map((e) => `Education: ${e.degree} at ${e.institution ?? "unspecified institution"}`),
  ]
    .filter(Boolean)
    .join("\n");

  const jobContext = [
    `Job Title: ${job.title}`,
    `Company: ${job.company}`,
    `Description: ${job.description}`,
    `Required skills: ${[...job.hardSkills, ...job.tools].join(", ")}`,
  ].join("\n");

  const response = await client.models.generateContent({
    model: "gemini-3.1-flash-lite",
    contents: [
      {
        role: "user",
        parts: [
          {
            text: `${SYSTEM_PROMPT}\n\nCANDIDATE RESUME:\n${resumeContext}\n\nJOB POSTING:\n${jobContext}`,
          },
        ],
      },
    ],
  });

  const text = response.text;

  if (!text) {
    throw new Error("Cover letter generation returned empty response.");
  }

  return text.trim();
}