import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { z } from "zod";

// Validation schema for creating/updating a category
const categorySchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  img: z.string().optional(),
  parentSlug: z.string().optional(),
  order: z.number().default(0),
  isActive: z.boolean().default(true),
});

// GET /api/blog/categories - Get all categories
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const activeOnly = searchParams.get("activeOnly") !== "false";

    const categories = await db.blogCategory.findMany({
      where: activeOnly ? { isActive: true } : {},
      include: {
        _count: {
          select: {
            posts: true,
          },
        },
      },
      orderBy: {
        order: "asc",
      },
    });

    return NextResponse.json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}

// POST /api/blog/categories - Create a new category
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is admin
    if (session.user.email !== "admin@example.com") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const validatedData = categorySchema.parse(body);

    // Generate slug from title
    const slug = validatedData.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    // Check if slug already exists
    const existingCategory = await db.blogCategory.findUnique({
      where: { slug },
    });

    if (existingCategory) {
      return NextResponse.json(
        { error: "Category with this title already exists" },
        { status: 400 }
      );
    }

    // If parentSlug is provided, check if parent exists
    if (validatedData.parentSlug) {
      const parentCategory = await db.blogCategory.findUnique({
        where: { slug: validatedData.parentSlug },
      });

      if (!parentCategory) {
        return NextResponse.json(
          { error: "Parent category not found" },
          { status: 400 }
        );
      }
    }

    const category = await db.blogCategory.create({
      data: {
        ...validatedData,
        slug,
      },
      include: {
        _count: {
          select: {
            posts: true,
          },
        },
      },
    });

    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    console.error("Error creating category:", error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to create category" },
      { status: 500 }
    );
  }
}

// PUT /api/blog/categories?slug=... - Update a category
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is admin
    if (session.user.email !== "admin@example.com") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const slug = searchParams.get("slug");

    if (!slug) {
      return NextResponse.json(
        { error: "Category slug is required" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const validatedData = categorySchema.parse(body);

    // Check if category exists
    const existingCategory = await db.blogCategory.findUnique({
      where: { slug },
    });

    if (!existingCategory) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }

    // Generate new slug if title is being updated
    let newSlug = slug;
    if (validatedData.title && validatedData.title !== existingCategory.title) {
      newSlug = validatedData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

      // Check if new slug already exists
      const slugExists = await db.blogCategory.findUnique({
        where: { slug: newSlug },
      });

      if (slugExists && slugExists.id !== existingCategory.id) {
        return NextResponse.json(
          { error: "Category with this title already exists" },
          { status: 400 }
        );
      }
    }

    // If parentSlug is provided, check if parent exists and is not self
    if (validatedData.parentSlug) {
      if (validatedData.parentSlug === newSlug) {
        return NextResponse.json(
          { error: "Category cannot be its own parent" },
          { status: 400 }
        );
      }

      const parentCategory = await db.blogCategory.findUnique({
        where: { slug: validatedData.parentSlug },
      });

      if (!parentCategory) {
        return NextResponse.json(
          { error: "Parent category not found" },
          { status: 400 }
        );
      }
    }

    const category = await db.blogCategory.update({
      where: { slug },
      data: {
        ...validatedData,
        slug: newSlug,
      },
      include: {
        _count: {
          select: {
            posts: true,
          },
        },
      },
    });

    return NextResponse.json(category);
  } catch (error) {
    console.error("Error updating category:", error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to update category" },
      { status: 500 }
    );
  }
}

// DELETE /api/blog/categories?slug=... - Delete a category
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is admin
    if (session.user.email !== "admin@example.com") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const slug = searchParams.get("slug");

    if (!slug) {
      return NextResponse.json(
        { error: "Category slug is required" },
        { status: 400 }
      );
    }

    // Check if category exists
    const existingCategory = await db.blogCategory.findUnique({
      where: { slug },
      include: {
        _count: {
          select: {
            posts: true,
          },
        },
      },
    });

    if (!existingCategory) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }

    // Check if category has posts
    if (existingCategory._count.posts > 0) {
      return NextResponse.json(
        { error: "Cannot delete category with existing posts" },
        { status: 400 }
      );
    }

    await db.blogCategory.delete({
      where: { slug },
    });

    return NextResponse.json({ message: "Category deleted successfully" });
  } catch (error) {
    console.error("Error deleting category:", error);
    return NextResponse.json(
      { error: "Failed to delete category" },
      { status: 500 }
    );
  }
}