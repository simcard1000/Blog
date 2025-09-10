import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { z } from "zod";

// Validation schema for creating a blog post
const createPostSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  content: z.string().min(1, "Content is required"),
  catSlug: z.string().min(1, "Category is required"),
  status: z.enum(["DRAFT", "PUBLISHED"]),
  isPrivate: z.boolean().default(false),
  tags: z.string().default(""),
  keywords: z.string().default(""),
  readTime: z.number().optional(),
  img: z.string().optional(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
});

// GET /api/blog/posts - Get all blog posts
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const status = searchParams.get("status") || "PUBLISHED";
    const isPrivate = searchParams.get("isPrivate") === "true";

    const posts = await db.blogPost.findMany({
      where: {
        status: status as "DRAFT" | "PUBLISHED",
        isPrivate,
        ...(category && { catSlug: category }),
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        category: true,
      },
      orderBy: {
        publishedAt: "desc",
      },
    });

    return NextResponse.json(posts);
  } catch (error) {
    console.error("Error fetching blog posts:", error);
    return NextResponse.json(
      { error: "Failed to fetch blog posts" },
      { status: 500 }
    );
  }
}

// POST /api/blog/posts - Create a new blog post
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = createPostSchema.parse(body);

    // Check if category exists
    const category = await db.blogCategory.findUnique({
      where: { slug: validatedData.catSlug },
    });

    if (!category) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 400 }
      );
    }

    // Generate slug from title
    const slug = validatedData.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    // Check if slug already exists
    const existingPost = await db.blogPost.findUnique({
      where: { slug },
    });

    const finalSlug = existingPost ? `${slug}-${Date.now()}` : slug;

    // Calculate read time (rough estimate: 200 words per minute)
    const wordCount = validatedData.content.split(/\s+/).length;
    const readTime = Math.ceil(wordCount / 200);

    const post = await db.blogPost.create({
      data: {
        ...validatedData,
        slug: finalSlug,
        readTime,
        publishedAt: validatedData.status === "PUBLISHED" ? new Date() : null,
        userId: session.user.id,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        category: true,
      },
    });

    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    console.error("Error creating blog post:", error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to create blog post" },
      { status: 500 }
    );
  }
}