"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { BlogCard } from "./_components/blog-card";
import { CategoryFilter } from "./_components/category-filter";
import { BlogActions } from "./_components/blog-actions";

interface BlogPost {
  id: string;
  slug: string;
  title: string;
  description: string;
  img?: string | null;
  publishedAt: string | null;
  readTime?: number | null;
  category: {
    title: string;
    slug: string;
  };
  user: {
    id: string;
    name: string | null;
    email: string;
    image: string | null;
  };
}

interface BlogCategory {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  img: string | null;
  parentSlug: string | null;
  order: number;
  isActive: boolean;
}

const BlogPage = () => {
  const searchParams = useSearchParams();
  const category = searchParams.get("category");
  
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch categories
        const categoriesResponse = await fetch("/api/blog/categories");
        const categoriesData = await categoriesResponse.json();
        setCategories(categoriesData);

        // Fetch posts
        const postsUrl = category 
          ? `/api/blog/posts?category=${encodeURIComponent(category)}`
          : "/api/blog/posts";
        const postsResponse = await fetch(postsUrl);
        const postsData = await postsResponse.json();
        setPosts(postsData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [category]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Blog</h1>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col gap-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Blog</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Discover articles, guides, and insights about web development,
            programming, and technology.
          </p>
        </div>

        {/* Action Buttons - Only visible to users with permissions */}
        <BlogActions />

        {/* Category Filter */}
        <CategoryFilter
          categories={categories}
          selectedCategory={category}
        />

        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>

        {/* Empty State */}
        {posts.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold mb-2">No posts found</h3>
            <p className="text-muted-foreground">
              {category
                ? "No posts found in this category. Check back later!"
                : "No posts available yet. Check back soon!"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogPage;
