import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { z } from "zod";

// Validation schema for updating a blog post
const updatePostSchema = z.object({
  title: z.string().min(1, "Title is required").optional(),
  description: z.string().min(1, "Description is required").optional(),
  content: z.string().min(1, "Content is required").optional(),
  catSlug: z.string().min(1, "Category is required").optional(),
  status: z.enum(["DRAFT", "PUBLISHED"]).optional(),
  isPrivate: z.boolean().optional(),
  tags: z.string().optional(),
  keywords: z.string().optional(),
  readTime: z.number().optional(),
  img: z.string().optional(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
});

// GET /api/blog/posts/[slug] - Get a specific blog post
export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;

    const post = await db.blogPost.findUnique({
      where: { slug },
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

    if (!post) {
      return NextResponse.json(
        { error: "Blog post not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(post);
  } catch (error) {
    console.error("Error fetching blog post:", error);
    return NextResponse.json(
      { error: "Failed to fetch blog post" },
      { status: 500 }
    );
  }
}

// PUT /api/blog/posts/[slug] - Update a blog post
export async function PUT(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { slug } = params;
    const body = await request.json();
    const validatedData = updatePostSchema.parse(body);

    // Check if post exists and user owns it
    const existingPost = await db.blogPost.findUnique({
      where: { slug },
      include: { user: true },
    });

    if (!existingPost) {
      return NextResponse.json(
        { error: "Blog post not found" },
        { status: 404 }
      );
    }

    // Check if user owns the post or is admin
    if (existingPost.userId !== session.user.id && session.user.email !== "admin@example.com") {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      );
    }

    // If category is being updated, check if it exists
    if (validatedData.catSlug) {
      const category = await db.blogCategory.findUnique({
        where: { slug: validatedData.catSlug },
      });

      if (!category) {
        return NextResponse.json(
          { error: "Category not found" },
          { status: 400 }
        );
      }
    }

    // Generate new slug if title is being updated
    let newSlug = slug;
    if (validatedData.title && validatedData.title !== existingPost.title) {
      newSlug = validatedData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

      // Check if new slug already exists
      const slugExists = await db.blogPost.findUnique({
        where: { slug: newSlug },
      });

      if (slugExists && slugExists.id !== existingPost.id) {
        newSlug = `${newSlug}-${Date.now()}`;
      }
    }

    // Calculate read time if content is being updated
    let readTime = existingPost.readTime;
    if (validatedData.content) {
      const wordCount = validatedData.content.split(/\s+/).length;
      readTime = Math.ceil(wordCount / 200);
    }

    const updateData = {
      ...validatedData,
      slug: newSlug,
      readTime,
      publishedAt: validatedData.status === "PUBLISHED" && existingPost.status === "DRAFT" 
        ? new Date() 
        : existingPost.publishedAt,
    };

    const post = await db.blogPost.update({
      where: { slug },
      data: updateData,
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

    return NextResponse.json(post);
  } catch (error) {
    console.error("Error updating blog post:", error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to update blog post" },
      { status: 500 }
    );
  }
}

// DELETE /api/blog/posts/[slug] - Delete a blog post
export async function DELETE(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { slug } = params;

    // Check if post exists and user owns it
    const existingPost = await db.blogPost.findUnique({
      where: { slug },
      include: { user: true },
    });

    if (!existingPost) {
      return NextResponse.json(
        { error: "Blog post not found" },
        { status: 404 }
      );
    }

    // Check if user owns the post or is admin
    if (existingPost.userId !== session.user.id && session.user.email !== "admin@example.com") {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      );
    }

    await db.blogPost.delete({
      where: { slug },
    });

    return NextResponse.json({ message: "Blog post deleted successfully" });
  } catch (error) {
    console.error("Error deleting blog post:", error);
    return NextResponse.json(
      { error: "Failed to delete blog post" },
      { status: 500 }
    );
  }
}