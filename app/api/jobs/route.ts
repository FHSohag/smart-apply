// app/api/jobs/route.ts
import { headers } from "next/headers";

import { auth } from "@/lib/auth";
import { errorResponse, successResponse } from "@/lib/api-response";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return errorResponse("Unauthorized", 401);
    }

    const { searchParams } = new URL(request.url);
    const keyword = searchParams.get("keyword");

    const jobs = await prisma.jobPosting.findMany({
      where: {
        isActive: true,
        ...(keyword
          ? {
              OR: [
                { title: { contains: keyword, mode: "insensitive" } },
                { company: { contains: keyword, mode: "insensitive" } },
              ],
            }
          : {}),
      },
      orderBy: { postedAt: "desc" },
    });

    return successResponse(jobs);
  } catch (error) {
    console.error(error);
    return errorResponse("Internal Server Error", 500);
  }
}