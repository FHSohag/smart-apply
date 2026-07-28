// app/api/jobs/recommended/route.ts
import { headers } from "next/headers";

import { auth } from "@/lib/auth";
import { errorResponse, successResponse } from "@/lib/api-response";
import { getResumeByUserId } from "@/services/resume.service";
import { getRankedJobsForResume } from "@/services/job-matching.service";

export async function GET() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return errorResponse("Unauthorized", 401);
    }

    const resume = await getResumeByUserId(session.user.id);

    if (!resume || !resume.structuredData) {
      return errorResponse("Upload a resume to see recommendations.", 404);
    }

    const rankedJobs = await getRankedJobsForResume(resume.id);

    return successResponse(rankedJobs);
  } catch (error) {
    console.error(error);
    return errorResponse("Internal Server Error", 500);
  }
}