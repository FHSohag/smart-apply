import { GoogleGenAI } from "@google/genai";

import type { StructuredResume } from "@/services/resume-structuring.service";

/**
 * Embedding Service
 *
 * Responsibilities:
 * - Compose clean, matching-relevant text from structured resume/job data
 * - Generate embeddings via Gemini's embedding model
 *
 * This service does NOT:
 * - Save data to the database (embeddings are Unsupported-typed in
 *   Prisma, so callers must write them via raw SQL)
 * - Perform similarity search or scoring
 *
 * task_type matters for retrieval accuracy: resumes are embedded as
 * RETRIEVAL_QUERY (the thing searching), job postings as
 * RETRIEVAL_DOCUMENT (the things being searched through) — this
 * mirrors the actual product behavior ("find jobs matching this
 * resume"), not the reverse.
 *
 * Fields deliberately excluded from the composed text: personalInfo
 * (name/email/phone/location/links) and activities[]. Location is
 * handled as a separate structured score, not folded into the
 * semantic vector — see location-scoring logic. Activities are kept
 * out to avoid diluting the professional-skill signal that actually
 * drives job-fit matching.
 */

const client = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const EMBEDDING_MODEL = "gemini-embedding-001";
const EMBEDDING_DIMENSIONS = 768;

export function composeResumeEmbeddingText(
  resume: StructuredResume
): string {
  const parts: string[] = [];

  if (resume.summary) {
    parts.push(resume.summary);
  }

  if (resume.skills.hardSkills.length > 0) {
    parts.push(`Skills: ${resume.skills.hardSkills.join(", ")}.`);
  }

  if (resume.skills.tools.length > 0) {
    parts.push(`Tools: ${resume.skills.tools.join(", ")}.`);
  }

  if (resume.skills.soft.length > 0) {
    parts.push(`Strengths: ${resume.skills.soft.join(", ")}.`);
  }

  for (const exp of resume.experience) {
    parts.push(`Experience: ${exp.title}. ${exp.description}`);
  }

  for (const edu of resume.education) {
    parts.push(`Education: ${edu.degree} at ${edu.institution ?? "unspecified institution"}.`);
  }

  for (const project of resume.projects) {
    parts.push(
      `Project: ${project.name}. ${project.description} Tech stack: ${project.techStack.join(", ")}.`
    );
  }

  return parts.join("\n");
}

export interface JobPostingForEmbedding {
  title: string;
  description: string;
  hardSkills: string[];
  tools: string[];
  softSkills: string[];
  minExperienceYears: number | null;
}

export function composeJobEmbeddingText(job: JobPostingForEmbedding): string {
  const parts: string[] = [job.title, job.description];

  if (job.hardSkills.length > 0) {
    parts.push(`Required skills: ${job.hardSkills.join(", ")}.`);
  }

  if (job.tools.length > 0) {
    parts.push(`Tools: ${job.tools.join(", ")}.`);
  }

  if (job.softSkills.length > 0) {
    parts.push(`Desired qualities: ${job.softSkills.join(", ")}.`);
  }

  if (job.minExperienceYears !== null) {
    parts.push(`Minimum experience: ${job.minExperienceYears} years.`);
  }

  return parts.join("\n");
}

type EmbeddingTaskType = "RETRIEVAL_QUERY" | "RETRIEVAL_DOCUMENT";

async function generateEmbedding(
  text: string,
  taskType: EmbeddingTaskType
): Promise<number[]> {
  const response = await client.models.embedContent({
    model: EMBEDDING_MODEL,
    contents: text,
    config: {
      taskType,
      outputDimensionality: EMBEDDING_DIMENSIONS,
    },
  });

  const embedding = response.embeddings?.[0]?.values;

  if (!embedding || embedding.length === 0) {
    throw new Error("Embedding generation returned no vector.");
  }

  return embedding;
}

export interface ResumeEmbeddingResult {
  embedding: number[];
  sourceText: string;
}

export async function generateResumeEmbedding(
  resume: StructuredResume
): Promise<ResumeEmbeddingResult> {
  const sourceText = composeResumeEmbeddingText(resume);
  const embedding = await generateEmbedding(sourceText, "RETRIEVAL_QUERY");

  return { embedding, sourceText };
}

export async function generateJobEmbedding(
  job: JobPostingForEmbedding
): Promise<number[]> {
  const text = composeJobEmbeddingText(job);
  return generateEmbedding(text, "RETRIEVAL_DOCUMENT");
}