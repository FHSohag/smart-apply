import { headers } from "next/headers";

import { auth } from "@/lib/auth";
import { errorResponse, successResponse } from "@/lib/api-response";
import { ValidationError } from "@/lib/errors";
import { createApplication } from "@/services/application.service";

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
    const body = await request.json();
    const coverLetter = body.coverLetter;

    if (!coverLetter || typeof coverLetter !== "string" || coverLetter.trim().length < 10) {
      return errorResponse("Cover letter cannot be empty.", 400);
    }

    const application = await createApplication(session.user.id, id, coverLetter.trim());

    return successResponse(application, "Application submitted successfully.", 201);
  } catch (error) {
    console.error("Apply failed:", error);

    if (error instanceof ValidationError) {
      return errorResponse(error.message, 400);
    }

    return errorResponse("Internal Server Error", 500);
  }
}