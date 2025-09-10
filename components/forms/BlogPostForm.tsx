"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Validation schema
const blogPostSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  content: z.string().min(1, "Content is required"),
  catSlug: z.string().min(1, "Category is required"),
  isPrivate: z.boolean().default(false),
  tags: z.string().default(""),
  keywords: z.string().default(""),
  img: z.string().optional(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
});

type BlogPostFormData = z.infer<typeof blogPostSchema>;

interface BlogCategory {
  id: string;
  title: string;
  slug: string;
  description: string | null;
}

interface BlogPostFormProps {
  initialData?: Partial<BlogPostFormData>;
  onSubmit: (data: BlogPostFormData, status: "DRAFT" | "PUBLISHED") => void;
  isSubmitting: boolean;
  mode: "create" | "edit";
}

export default function BlogPostForm({
  initialData,
  onSubmit,
  isSubmitting,
  mode,
}: BlogPostFormProps) {
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<BlogPostFormData>({
    resolver: zodResolver(blogPostSchema),
    defaultValues: {
      title: initialData?.title || "",
      description: initialData?.description || "",
      content: initialData?.content || "",
      catSlug: initialData?.catSlug || "",
      isPrivate: initialData?.isPrivate || false,
      tags: initialData?.tags || "",
      keywords: initialData?.keywords || "",
      img: initialData?.img || "",
      metaTitle: initialData?.metaTitle || "",
      metaDescription: initialData?.metaDescription || "",
    },
  });

  const isPrivate = watch("isPrivate");

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/blog/categories");
        if (response.ok) {
          const data = await response.json();
          setCategories(data);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  // Reset form when initialData changes
  useEffect(() => {
    if (initialData) {
      reset(initialData);
    }
  }, [initialData, reset]);

  const handleFormSubmit = (data: BlogPostFormData) => {
    onSubmit(data, "DRAFT");
  };

  const handlePublish = (data: BlogPostFormData) => {
    onSubmit(data, "PUBLISHED");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                {...register("title")}
                placeholder="Enter blog post title"
              />
              {errors.title && (
                <p className="text-sm text-red-600 mt-1">{errors.title.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                {...register("description")}
                placeholder="Enter a brief description of your blog post"
                rows={3}
              />
              {errors.description && (
                <p className="text-sm text-red-600 mt-1">{errors.description.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="catSlug">Category *</Label>
              <Select
                value={watch("catSlug")}
                onValueChange={(value) => setValue("catSlug", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {loadingCategories ? (
                    <SelectItem value="" disabled>Loading categories...</SelectItem>
                  ) : (
                    categories.map((category) => (
                      <SelectItem key={category.slug} value={category.slug}>
                        {category.title}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              {errors.catSlug && (
                <p className="text-sm text-red-600 mt-1">{errors.catSlug.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="img">Featured Image URL</Label>
              <Input
                id="img"
                {...register("img")}
                placeholder="https://example.com/image.jpg"
              />
            </div>
          </CardContent>
        </Card>

        {/* Content */}
        <Card>
          <CardHeader>
            <CardTitle>Content</CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              <Label htmlFor="content">Content *</Label>
              <Textarea
                id="content"
                {...register("content")}
                placeholder="Write your blog post content here..."
                rows={15}
                className="font-mono"
              />
              {errors.content && (
                <p className="text-sm text-red-600 mt-1">{errors.content.message}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* SEO & Settings */}
        <Card>
          <CardHeader>
            <CardTitle>SEO & Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="tags">Tags (comma-separated)</Label>
              <Input
                id="tags"
                {...register("tags")}
                placeholder="react, nextjs, tutorial"
              />
            </div>

            <div>
              <Label htmlFor="keywords">Keywords (comma-separated)</Label>
              <Input
                id="keywords"
                {...register("keywords")}
                placeholder="web development, programming, tutorial"
              />
            </div>

            <div>
              <Label htmlFor="metaTitle">Meta Title</Label>
              <Input
                id="metaTitle"
                {...register("metaTitle")}
                placeholder="SEO optimized title"
              />
            </div>

            <div>
              <Label htmlFor="metaDescription">Meta Description</Label>
              <Textarea
                id="metaDescription"
                {...register("metaDescription")}
                placeholder="SEO optimized description"
                rows={2}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="isPrivate"
                checked={isPrivate}
                onCheckedChange={(checked) => setValue("isPrivate", checked)}
              />
              <Label htmlFor="isPrivate">Private Post</Label>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={handleSubmit(handleFormSubmit)}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Saving..." : "Save as Draft"}
          </Button>
          <Button
            type="button"
            onClick={handleSubmit(handlePublish)}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Publishing..." : "Publish"}
          </Button>
        </div>
      </form>
    </div>
  );
}
