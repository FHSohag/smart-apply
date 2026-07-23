import { UploadApiResponse } from "cloudinary";
import streamifier from "streamifier";
import { prisma } from "@/lib/prisma";


import { cloudinary } from "@/lib/cloudinary";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

const ALLOWED_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

export async function uploadResumeToCloudinary(file: File): Promise<UploadApiResponse> {
  if (!file) {
    throw new Error("No file uploaded.");
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error("Only PDF and DOCX files are allowed.");
  }

  if (file.size > MAX_FILE_SIZE) {
    throw new Error("Maximum file size is 10MB.");
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type: "raw",
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

export async function deleteResumeFromCloudinary(publicId: string) {
  return cloudinary.uploader.destroy(publicId, {
    resource_type: "raw",
  });
}

export async function updateResumeParsing(
  id: string,
  extractedText: string
) {
  return prisma.resume.update({
    where: {
      id,
    },
    data: {
      extractedText,
      parsedAt: new Date(),
    },
  });
}

