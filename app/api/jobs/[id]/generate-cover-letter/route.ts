import { headers } from "next/headers";

import { auth } from "@/lib/auth";
import { errorResponse, successResponse } from "@/lib/api-response";
import { getResumeByUserId } from "@/services/resume.service";
import { prisma } from "@/lib/prisma";
import { generateCoverLetter } from "@/services/cover-letter.service";

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
      return errorResponse("Upload a resume before generating a cover letter.", 400);
    }

    const job = await prisma.jobPosting.findUnique({ where: { id } });

    if (!job) {
      return errorResponse("Job not found.", 404);
    }

    const coverLetter = await generateCoverLetter(
      resume.structuredData as any,
      job
    );

    return successResponse({ coverLetter });
  } catch (error) {
    console.error("Cover letter generation failed:", error);
    return errorResponse("Unable to generate cover letter.", 500);
  }
}