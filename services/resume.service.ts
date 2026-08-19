import { UploadApiResponse } from "cloudinary";
import streamifier from "streamifier";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

import { cloudinary } from "@/lib/cloudinary";
import { ValidationError } from "@/lib/errors";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

const ALLOWED_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "image/png",
  "image/jpeg",
];

export async function uploadResumeToCloudinary(file: File): Promise<UploadApiResponse> {
  if (!file) {
    throw new ValidationError("No file uploaded.");
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new ValidationError("Only PDF, DOCX, PNG, and JPG files are allowed.");
  }

  if (file.size > MAX_FILE_SIZE) {
    throw new ValidationError("Maximum file size is 10MB.");
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  // Cloudinary categorizes uploads by resource_type: images use "image",
  // everything else (DOCX, etc.) uses "raw". PDFs are technically an
  // exception on Cloudinary's side (categorized as "image"), but the
  // existing PDF upload path already works using "raw" and is left
  // untouched here to avoid introducing risk into a tested flow.
  const resourceType = file.type.startsWith("image/") ? "image" : "raw";

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type: resourceType,
        folder: "smartapply/resumes",
      },
      (error, result) => {
        if (error) {
          reject(error);
          return;
        }

        if (!result) {
          reject(new Error("Cloudinary upload failed."));
          return;
        }

        resolve(result);
      }
    );

    streamifier.createReadStream(buffer).pipe(uploadStream);
  });
}

interface CreateResumeInput {
  title: string;
  originalName: string;
  fileUrl: string;
  publicId: string;
  fileSize: number;
  mimeType: string;
  userId: string;
}

export async function createResume(
  data: CreateResumeInput
) {
  return prisma.resume.create({
    data,
  });
}

export async function getUserResumes(userId: string) {
  return prisma.resume.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function getResumeByUserId(userId: string) {
  return prisma.resume.findFirst({
    where: {
      userId,
    },
  });
}

export async function getResumeById(
  id: string,
  userId: string
) {
  return prisma.resume.findFirst({
    where: {
      id,
      userId,
    },
  });
}

export async function deleteResume(id: string) {
  return prisma.resume.delete({
    where: {
      id,
    },
  });
}

export async function deleteResumeFromCloudinary(
  publicId: string,
  mimeType?: string
) {
  const resourceType =
    mimeType && mimeType.startsWith("image/") ? "image" : "raw";

  return cloudinary.uploader.destroy(publicId, {
    resource_type: resourceType,
  });
}

export async function updateResumeParsing(
  id: string,
  extractedText: string,
  structuredData: object
) {
  return prisma.resume.update({
    where: {
      id,
    },
    data: {
      extractedText,
      structuredData,
      parsedAt: new Date(),
    },
  });
}

export async function saveResumeEmbedding(
  resumeId: string,
  embedding: number[],
  embeddingSourceText: string
): Promise<void> {
  const vectorLiteral = `[${embedding.join(",")}]`;

  await prisma.$executeRaw`
    UPDATE "Resume"
    SET embedding = ${vectorLiteral}::vector,
        "embeddingSourceText" = ${embeddingSourceText}
    WHERE id = ${resumeId}
  `;
}

export async function setResumeFeedbackPending(resumeId: string): Promise<void> {
  await prisma.resume.update({
    where: { id: resumeId },
    data: { feedbackStatus: "pending", feedback: Prisma.JsonNull, feedbackGeneratedAt: null },
  });
}

export async function saveResumeFeedback(
  resumeId: string,
  feedback: object
): Promise<void> {
  await prisma.resume.update({
    where: { id: resumeId },
    data: {
      feedbackStatus: "completed",
      feedback,
      feedbackGeneratedAt: new Date(),
    },
  });
}

export async function markResumeFeedbackFailed(resumeId: string): Promise<void> {
  await prisma.resume.update({
    where: { id: resumeId },
    data: { feedbackStatus: "failed" },
  });
}