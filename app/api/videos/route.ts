import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    const videos = await prisma.video.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    return NextResponse.json(videos);
  } catch (error) {
    return NextResponse.json(
      {
        error: "An error occurred while fetching the videos",
      },
      {
        status: 500,
      }
    );
  } finally {
    await prisma.$disconnect();
  }
}