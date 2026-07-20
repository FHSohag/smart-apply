import { headers } from "next/headers";

import { auth } from "@/lib/auth";
import { errorResponse, successResponse } from "@/lib/api-response";
import {
  createResume,
  getResumeByUserId,
  getUserResumes,
  updateResumeParsing,
  uploadResumeToCloudinary,
} from "@/services/resume.service";

import { extractResumeText } from "@/services/resume-parser.service";

export async function GET() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return errorResponse("Unauthorized", 401);
    }

    const resumes = await getUserResumes(session.user.id);

    return successResponse(resumes);
  } catch (error) {
    console.error(error);

    return errorResponse("Internal Server Error", 500);
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return errorResponse("Unauthorized", 401);
    }

    const formData = await request.formData();

    const title = formData.get("title");
    const file = formData.get("file");

    if (!title || typeof title !== "string") {
      return errorResponse("Title is required.");
    }

    if (!(file instanceof File)) {
      return errorResponse("Resume file is required.");
    }

    // Prevent multiple resumes per user
    const existingResume = await getResumeByUserId(session.user.id);

    if (existingResume) {
      return errorResponse(
        "You already have a resume. Delete it before uploading another one.",
        409
      );
    }

    const uploaded = await uploadResumeToCloudinary(file);

    const resume = await createResume({
      title,
      originalName: file.name,
      fileUrl: uploaded.secure_url,
      publicId: uploaded.public_id,
      fileSize: file.size,
      mimeType: file.type,
      userId: session.user.id,
    });

    // Parse the uploaded resume
    const extractedText = await extractResumeText(
      resume.fileUrl,
      resume.mimeType
    );

    // Save parsing result
    await updateResumeParsing(
      resume.id,
      extractedText
    );

    return successResponse(
      resume,
      "Resume uploaded successfully.",
      201
    );
  } catch (error) {
    console.error(error);

    return errorResponse("Internal Server Error", 500);
  }
}