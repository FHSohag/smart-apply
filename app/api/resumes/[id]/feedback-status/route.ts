import { headers } from "next/headers";

import { auth } from "@/lib/auth";
import { errorResponse, successResponse } from "@/lib/api-response";
import { getResumeById } from "@/services/resume.service";

interface RouteProps {
  params: Promise<{ id: string }>;
}

export async function GET(request: Request, { params }: RouteProps) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session) {
      return errorResponse("Unauthorized", 401);
    }

    const { id } = await params;

    const resume = await getResumeById(id, session.user.id);

    if (!resume) {
      return errorResponse("Resume not found.", 404);
    }

    return successResponse({
      feedbackStatus: resume.feedbackStatus,
      feedback: resume.feedback,
    });
  } catch (error) {
    console.error(error);
    return errorResponse("Internal Server Error", 500);
  }
}