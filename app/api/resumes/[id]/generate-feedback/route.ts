import { headers } from "next/headers";

import { auth } from "@/lib/auth";
import { errorResponse, successResponse } from "@/lib/api-response";
import {
  getResumeById,
  setResumeFeedbackPending,
  saveResumeFeedback,
  markResumeFeedbackFailed,
} from "@/services/resume.service";
import { generateResumeFeedback } from "@/services/resume-feedback.service";

export const maxDuration = 30;

interface RouteProps {
  params: Promise<{ id: string }>;
}

export async function POST(request: Request, { params }: RouteProps) {
  const { id } = await params;

  try {
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session) {
      return errorResponse("Unauthorized", 401);
    }

    const resume = await getResumeById(id, session.user.id);

    if (!resume || !resume.structuredData) {
      return errorResponse("Resume not found or not yet processed.", 404);
    }

    await setResumeFeedbackPending(id);

    try {
      const feedback = await generateResumeFeedback(resume.structuredData as any);
      await saveResumeFeedback(id, feedback);
    } catch (feedbackError) {
      console.error("Feedback generation failed:", feedbackError);
      await markResumeFeedbackFailed(id);
    }

    return successResponse(null, "Feedback generation started.");
  } catch (error) {
    console.error(error);
    return errorResponse("Internal Server Error", 500);
  }
}