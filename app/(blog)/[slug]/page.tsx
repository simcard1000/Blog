"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Eye, Clock, Tag } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface BlogPost {
  id: string;
  slug: string;
  title: string;
  description: string;
  content: string;
  img?: string | null;
  status: "DRAFT" | "PUBLISHED";
  isPrivate: boolean;
  views: number;
  readTime?: number | null;
  tags: string;
  keywords: string;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
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

export default function BlogPostPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`/api/blog/posts/${slug}`);
        if (response.ok) {
          const postData = await response.json();
          setPost(postData);
        } else if (response.status === 404) {
          setError("Post not found");
        } else {
          setError("Failed to load post");
        }
      } catch (error) {
        console.error("Error fetching post:", error);
        setError("Failed to load post");
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchPost();
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Loading...</h1>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Post Not Found</h1>
          <p className="text-muted-foreground mb-4">
            {error || "The blog post you're looking for could not be found."}
          </p>
          <Button onClick={() => router.push("/blog")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Blog
          </Button>
        </div>
      </div>
    );
  }

  const authorName = post.user.name || "Anonymous";

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Back Button */}
      <div className="mb-6">
        <Button variant="outline" onClick={() => router.push("/blog")}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Blog
        </Button>
      </div>

      {/* Article Header */}
      <article className="prose prose-lg max-w-none">
        {/* Category */}
        <div className="mb-4">
          <Badge variant="secondary">
            {post.category.title}
          </Badge>
        </div>

        {/* Title */}
        <h1 className="text-4xl font-bold mb-4">{post.title}</h1>

        {/* Description */}
        <p className="text-xl text-muted-foreground mb-6">{post.description}</p>

        {/* Meta Information */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-8">
          <div className="flex items-center gap-2">
            {post.user.image && (
              <Image
                src={post.user.image}
                alt={authorName}
                width={32}
                height={32}
                className="rounded-full"
              />
            )}
            <span>By {authorName}</span>
          </div>
          
          {post.publishedAt && (
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>
                {formatDistanceToNow(new Date(post.publishedAt), { addSuffix: true })}
              </span>
            </div>
          )}
          
          {post.readTime && (
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{post.readTime} min read</span>
            </div>
          )}
          
          <div className="flex items-center gap-1">
            <Eye className="w-4 h-4" />
            <span>{post.views} views</span>
          </div>
        </div>

        {/* Featured Image */}
        {post.img && (
          <div className="mb-8">
            <Image
              src={post.img}
              alt={post.title}
              width={800}
              height={400}
              className="w-full h-auto rounded-lg"
            />
          </div>
        )}

        {/* Content */}
        <div 
          className="prose prose-lg max-w-none"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Tags */}
        {post.tags && (
          <div className="mt-8 pt-8 border-t">
            <div className="flex items-center gap-2 mb-4">
              <Tag className="w-4 h-4" />
              <span className="font-medium">Tags:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {post.tags.split(',').map((tag, index) => (
                <Badge key={index} variant="outline">
                  {tag.trim()}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </article>
    </div>
  );
}