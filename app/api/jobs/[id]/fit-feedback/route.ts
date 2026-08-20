import { headers } from "next/headers";

import { auth } from "@/lib/auth";
import { errorResponse, successResponse } from "@/lib/api-response";
import { getResumeByUserId } from "@/services/resume.service";
import { prisma } from "@/lib/prisma";
import {
  getCachedJobFitFeedback,
  saveJobFitFeedback,
} from "@/services/job-fit.service";
import { generateJobFitFeedback } from "@/services/job-fit-feedback.service";

export const maxDuration = 30;

interface RouteProps {
  params: Promise<{ id: string }>;
}

export async function POST(request: Request, { params }: RouteProps) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session) {
      return errorResponse("Unauthorized", 401);
    }

    const { id } = await params;

    const resume = await getResumeByUserId(session.user.id);

    if (!resume || !resume.structuredData) {
      return errorResponse("Upload a resume first.", 400);
    }

    // Return cached result if this exact resume/job pair was already analyzed
    const cached = await getCachedJobFitFeedback(resume.id, id);

    if (cached) {
      return successResponse(cached);
    }

    const job = await prisma.jobPosting.findUnique({ where: { id } });

    if (!job) {
      return errorResponse("Job not found.", 404);
    }

    const feedback = await generateJobFitFeedback(resume.structuredData as any, job);

    const saved = await saveJobFitFeedback(resume.id, id, feedback);

    return successResponse(saved);
  } catch (error) {
    console.error("Job fit feedback generation failed:", error);
    return errorResponse("Unable to generate job fit feedback.", 500);
  }
}