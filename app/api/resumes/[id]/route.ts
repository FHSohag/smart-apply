import { headers } from "next/headers";

import { auth } from "@/lib/auth";
import { errorResponse, successResponse } from "@/lib/api-response";
import {
  deleteResume,
  deleteResumeFromCloudinary,
  getResumeById,
} from "@/services/resume.service";

interface RouteProps {
  params: Promise<{
    id: string;
  }>;
}

export async function DELETE(
  request: Request,
  { params }: RouteProps
) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return errorResponse("Unauthorized", 401);
    }

    const { id } = await params;

    const resume = await getResumeById(id, session.user.id);

    if (!resume) {
      return errorResponse("Resume not found.", 404);
    }

    await deleteResumeFromCloudinary(resume.publicId);

    await deleteResume(resume.id);

    return successResponse(
      null,
      "Resume deleted successfully."
    );
  } catch (error) {
    console.error(error);

    return errorResponse("Internal Server Error", 500);
  }
}