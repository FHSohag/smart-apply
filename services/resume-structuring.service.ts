import { GoogleGenAI } from "@google/genai";

import { normalizeDate, calculateTotalExperienceYears } from "@/lib/date-normalizer";

/**
 * Resume Structuring Service
 *
 * Responsibilities:
 * - Send normalized resume text to Gemini for structured extraction
 * - Normalize raw date strings using our own date-normalizer (never
 *   trust the LLM to do date math)
 * - Compute totalExperienceYears from normalized dates
 *
 * This service does NOT:
 * - Download files
 * - Save data to the database
 * - Extract text from PDF/DOCX/OCR
 *
 * Domain-neutral by design: SmartApply matches all job types, not
 * just tech roles, so skill categories avoid tech-specific language.
 *
 * experience[] vs activities[]: kept as separate arrays because they
 * carry different signal for job matching. totalExperienceYears is
 * computed ONLY from experience[] — a co-curricular/volunteer role
 * (e.g. Scout, Cadet Corps) should never count toward "years of
 * professional experience," even though it's still valuable signal
 * for entry-level/fresher candidates and is preserved separately.
 *
 * location is structured (city/country), not a raw string, so it can
 * be used for structured location-based matching later (job matching
 * combines semantic similarity with a location score, rather than
 * folding location into the embedded text itself). country is only
 * extracted when explicitly stated — never inferred from phone codes
 * or other context, consistent with the "never guess" rule.
 */

const client = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const RESUME_SCHEMA = {
  type: "object",
  properties: {
    personalInfo: {
      type: "object",
      properties: {
        name: { type: "string", nullable: true },
        email: { type: "string", nullable: true },
        phone: { type: "string", nullable: true },
        location: {
          type: "object",
          properties: {
            raw: { type: "string", nullable: true },
            city: { type: "string", nullable: true },
            country: { type: "string", nullable: true },
          },
          required: ["raw", "city", "country"],
        },
        links: {
          type: "object",
          properties: {
            github: { type: "string", nullable: true },
            linkedin: { type: "string", nullable: true },
            portfolio: { type: "string", nullable: true },
          },
          required: ["github", "linkedin", "portfolio"],
        },
      },
      required: ["name", "email", "phone", "location", "links"],
    },
    summary: { type: "string", nullable: true },
    skills: {
      type: "object",
      properties: {
        hardSkills: { type: "array", items: { type: "string" } },
        soft: { type: "array", items: { type: "string" } },
        tools: { type: "array", items: { type: "string" } },
        languages: { type: "array", items: { type: "string" } },
      },
      required: ["hardSkills", "soft", "tools", "languages"],
    },
    experience: {
      type: "array",
      items: {
        type: "object",
        properties: {
          title: { type: "string" },
          organization: { type: "string", nullable: true },
          rawStartDate: { type: "string", nullable: true },
          rawEndDate: { type: "string", nullable: true },
          description: { type: "string" },
        },
        required: [
          "title",
          "organization",
          "rawStartDate",
          "rawEndDate",
          "description",
        ],
      },
    },
    activities: {
      type: "array",
      items: {
        type: "object",
        properties: {
          title: { type: "string" },
          organization: { type: "string", nullable: true },
          rawStartDate: { type: "string", nullable: true },
          rawEndDate: { type: "string", nullable: true },
          description: { type: "string" },
        },
        required: [
          "title",
          "organization",
          "rawStartDate",
          "rawEndDate",
          "description",
        ],
      },
    },
    education: {
      type: "array",
      items: {
        type: "object",
        properties: {
          degree: { type: "string" },
          institution: { type: "string", nullable: true },
          rawStartDate: { type: "string", nullable: true },
          rawEndDate: { type: "string", nullable: true },
          gpa: { type: "string", nullable: true },
        },
        required: [
          "degree",
          "institution",
          "rawStartDate",
          "rawEndDate",
          "gpa",
        ],
      },
    },
    projects: {
      type: "array",
      items: {
        type: "object",
        properties: {
          name: { type: "string" },
          url: { type: "string", nullable: true },
          description: { type: "string" },
          techStack: { type: "array", items: { type: "string" } },
        },
        required: ["name", "url", "description", "techStack"],
      },
    },
  },
  required: [
    "personalInfo",
    "summary",
    "skills",
    "experience",
    "activities",
    "education",
    "projects",
  ],
};

const SYSTEM_PROMPT = `You are a resume data extraction system. SmartApply matches candidates across ALL job types and industries — not just technology roles. Extract information from the resume text EXACTLY as written, for ANY profession (teaching, healthcare, trades, business, engineering, hospitality, etc.).

CRITICAL RULES:

EXPERIENCE vs ACTIVITIES (important — read carefully):
- experience: paid employment, internships, freelance/contract work, or any role where the person was formally employed or professionally engaged by an organization to do a job.
- activities: co-curricular activities, volunteer work, club/society memberships, sports, scouting, cadet corps, community service, competitions, or unpaid extracurricular involvement. This content is still valuable, especially for freshers/students with limited formal work history — but it is NOT professional experience and must NOT be placed in the experience array.
- If a resume entry's employment status is ambiguous (e.g. an unpaid "Event Manager" role for a college club), use context: is this an organization employing the person for a job, or a club/institution the person is a member/volunteer of? Default to activities if genuinely unclear.

DATES:
- Extract ONLY the date token itself, never surrounding label text.
  Correct: "Expected Graduation: 2026" → rawEndDate: "2026"
  Wrong: "Expected Graduation: 2026" → rawEndDate: "Expected Graduation: 2026"
- Extract dates exactly as written otherwise (e.g. "2024", "Jan 2024", "Present", "Running"). Do NOT normalize, convert, or calculate dates yourself.

LOCATION:
- raw: the location exactly as written on the resume (e.g. "Bashundhara RA, Dhaka", "Dhaka, Bangladesh").
- city: the city/town name only, if identifiable from the raw text.
- country: ONLY extract this if the country is explicitly written in the location text itself (e.g. "Dhaka, Bangladesh" → country: "Bangladesh"). Do NOT infer the country from a phone number's country code, area name, or any other contextual clue. If the resume only states a city/area with no country named, country must be null.

MISSING DATA:
- If a field is genuinely not present in the resume, use null.
- NEVER invent, guess, or infer missing information.
- NEVER use placeholder text like "Unspecified", "N/A", "Not listed", or similar. Use null, not a string standing in for null.
- Do NOT infer a person's name from an email address, GitHub username, or URL if the name is not explicitly written on the resume as text.

SKILLS CATEGORIZATION (domain-neutral — applies to every profession):
- hardSkills: subject-matter expertise, professional knowledge, or discipline-specific ability. Examples across fields: "React.js", "Biochemistry", "Patient Care", "Financial Modeling", "Welding", "Contract Law", "Accounting". Do NOT limit this to programming/tech — extract the equivalent for whatever field the resume is in.
- tools: named software, platforms, instruments, or equipment used (e.g. "Git", "MS Office", "AutoCAD", "Salesforce", "Canva").
- soft: interpersonal or professional-conduct skills. IMPORTANT: sections titled "Strengths", "Core Competencies", "Key Attributes", or similar belong here — do not drop this content, and do not merge it into the summary field.
- languages: human spoken/written languages the person knows (e.g. "Bengali (Native)", "English (Fluent)"). If a "Languages" section exists on the resume, this array must not be empty — extract every language listed.

EDUCATION:
- The degree field should include the full degree name AND any stated major, concentration, minor, or stream if present on the resume (e.g. "Bachelor of Business Administration (Accounting major, minor Finance)", not just "Bachelor of Business Administration"). Do not drop this detail even if it could also be inferred from context elsewhere.

DO NOT DROP ANY SECTION:
- Every named section on the resume must map to some field in the schema. If a section doesn't obviously fit, find the best-fitting field rather than omitting the content entirely.

GENERAL:
- The resume text may contain OCR noise (stray characters, inconsistent bullets, minor misspellings, garbled section headers from banner-style graphics). Use context to read through this noise, but do not fabricate content that isn't represented in the text at all.
- Output must match the provided schema exactly.`;

interface StructuredEntryRaw {
  title: string;
  organization: string | null;
  rawStartDate: string | null;
  rawEndDate: string | null;
  description: string;
}

interface StructuredEducationRaw {
  degree: string;
  institution: string | null;
  rawStartDate: string | null;
  rawEndDate: string | null;
  gpa: string | null;
}

interface StructuredLocation {
  raw: string | null;
  city: string | null;
  country: string | null;
}

interface StructuredResumeRaw {
  personalInfo: {
    name: string | null;
    email: string | null;
    phone: string | null;
    location: StructuredLocation;
    links: {
      github: string | null;
      linkedin: string | null;
      portfolio: string | null;
    };
  };
  summary: string | null;
  skills: {
    hardSkills: string[];
    soft: string[];
    tools: string[];
    languages: string[];
  };
  experience: StructuredEntryRaw[];
  activities: StructuredEntryRaw[];
  education: StructuredEducationRaw[];
  projects: Array<{
    name: string;
    url: string | null;
    description: string;
    techStack: string[];
  }>;
}

interface NormalizedEntry extends StructuredEntryRaw {
  startDate: string | null;
  endDate: string | null;
  isCurrent: boolean;
}

export interface StructuredResume {
  personalInfo: StructuredResumeRaw["personalInfo"];
  summary: string | null;
  skills: StructuredResumeRaw["skills"];
  experience: NormalizedEntry[];
  activities: NormalizedEntry[];
  education: Array<
    StructuredEducationRaw & {
      startDate: string | null;
      endDate: string | null;
      isCurrent: boolean;
    }
  >;
  projects: StructuredResumeRaw["projects"];
  totalExperienceYears: number | null;
}

function normalizeEntries(entries: StructuredEntryRaw[]): NormalizedEntry[] {
  return entries.map((entry) => {
    const start = normalizeDate(entry.rawStartDate);
    const end = normalizeDate(entry.rawEndDate);

    return {
      ...entry,
      startDate: start.value,
      endDate: end.isCurrent ? null : end.value,
      isCurrent: end.isCurrent,
    };
  });
}

export async function structureResumeText(
  resumeText: string
): Promise<StructuredResume> {
  console.log("========== STRUCTURING START ==========");

  const startTime = Date.now();

  const response = await client.models.generateContent({
    model: "gemini-3.1-flash-lite",
    contents: [
      {
        role: "user",
        parts: [
          { text: `${SYSTEM_PROMPT}\n\nResume text:\n\n${resumeText}` },
        ],
      },
    ],
    config: {
      responseMimeType: "application/json",
      responseSchema: RESUME_SCHEMA,
    },
  });

  const rawText = response.text;

  if (!rawText) {
    throw new Error("LLM returned an empty structuring response.");
  }

  let parsed: StructuredResumeRaw;

  try {
    parsed = JSON.parse(rawText);
  } catch {
    console.error("Failed to parse LLM JSON output:", rawText);
    throw new Error("LLM returned malformed JSON.");
  }

  const experience = normalizeEntries(parsed.experience);
  const activities = normalizeEntries(parsed.activities);

  const education = parsed.education.map((edu) => {
    const start = normalizeDate(edu.rawStartDate);
    const end = normalizeDate(edu.rawEndDate);

    return {
      ...edu,
      startDate: start.value,
      endDate: end.isCurrent ? null : end.value,
      isCurrent: end.isCurrent,
    };
  });

  // Only experience[] counts toward professional experience —
  // activities[] (volunteering, clubs, sports, etc.) is excluded
  // on purpose, even though it's preserved for matching signal.
  const totalExperienceYears = calculateTotalExperienceYears(experience);

  const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);

  console.log(`Structuring completed in ${elapsed}s`);
  console.log("=========== STRUCTURING END ===========");

  return {
    personalInfo: parsed.personalInfo,
    summary: parsed.summary,
    skills: parsed.skills,
    experience,
    activities,
    education,
    projects: parsed.projects,
    totalExperienceYears,
  };
}