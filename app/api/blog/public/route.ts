import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Public endpoint to fetch published blog posts for display on home page
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "10");
    const category = searchParams.get("category");

    // Build where clause for published, public posts
    const whereClause: any = {
      status: "PUBLISHED",
      isPrivate: false,
    };

    // Add category filter if provided
    if (category) {
      whereClause.catSlug = category;
    }

    // Fetch published blog posts with related data
    const posts = await prisma.blogPost.findMany({
      where: whereClause,
      orderBy: {
        publishedAt: "desc",
      },
      take: limit,
      select: {
        id: true,
        title: true,
        description: true,
        slug: true,
        img: true,
        publishedAt: true,
        readTime: true,
        tags: true,
        category: {
          select: {
            title: true,
            slug: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
      },
    });

    return NextResponse.json(posts);
  } catch (error) {
    console.error("Error fetching public blog posts:", error);
    return NextResponse.json(
      { error: "Failed to fetch blog posts" },
      { status: 500 }
    );
  }
}
