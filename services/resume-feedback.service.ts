import { GoogleGenAI } from "@google/genai";
import type { StructuredResume } from "@/services/resume-structuring.service";

const client = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const FEEDBACK_SCHEMA = {
  type: "object",
  properties: {
    overallImpression: { type: "string" },
    strengths: {
      type: "array",
      items: { type: "string" },
    },
    issues: {
      type: "array",
      items: {
        type: "object",
        properties: {
          section: { type: "string" },
          issue: { type: "string" },
          suggestion: { type: "string" },
          severity: { type: "string", enum: ["minor", "moderate", "important"] },
        },
        required: ["section", "issue", "suggestion", "severity"],
      },
    },
  },
  required: ["overallImpression", "strengths", "issues"],
};

const SYSTEM_PROMPT = `You are an experienced resume reviewer giving constructive, honest feedback. Review the structured resume data below and identify genuine ways the resume could be improved.

CRITICAL RULES:
- Base feedback ONLY on what's actually present or missing in the data given. Do not assume information that isn't there.
- Be specific — point to the actual section/entry with the issue, not vague generalities.
- "issue" should describe the actual problem. "suggestion" should be a concrete, actionable fix.
- Cover things like: vague or unquantified achievement descriptions ("responsible for X" vs. showing impact/results), missing sections that would strengthen the resume for this candidate's apparent field, inconsistent or unclear experience descriptions, weak or generic summary, missing measurable outcomes in project/experience descriptions.
- Do NOT criticize things that are stylistic preferences with no real functional impact.
- Do NOT fabricate flaws just to have something to say — if a resume is genuinely strong in an area, say so in "strengths" instead of forcing a critique.
- severity: "important" = should definitely fix before applying, "moderate" = worth improving, "minor" = small polish.
- Keep the whole response focused and useful — 3-7 issues is typical; don't pad with filler.`;

export async function generateResumeFeedback(
  resume: StructuredResume
): Promise<object> {
  const resumeContext = JSON.stringify(resume, null, 2);

  const response = await client.models.generateContent({
    model: "gemini-3.1-flash-lite",
    contents: [
      {
        role: "user",
        parts: [{ text: `${SYSTEM_PROMPT}\n\nRESUME DATA:\n${resumeContext}` }],
      },
    ],
    config: {
      responseMimeType: "application/json",
      responseSchema: FEEDBACK_SCHEMA,
    },
  });

  const text = response.text;

  if (!text) {
    throw new Error("Feedback generation returned empty response.");
  }

  return JSON.parse(text);
}