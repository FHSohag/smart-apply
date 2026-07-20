import { prisma } from "@/lib/prisma";

export async function GET() {
  const resume = await prisma.resume.findFirst();

  return Response.json({
    text: resume?.extractedText,
  });
}