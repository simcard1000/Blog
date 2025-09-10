"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { Plus, Settings, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCurrentPermissions } from "@/hooks/use-current-permissions";
import { SignOutButton } from "@/components/auth/sign-out-button";

export const BlogActions = () => {
  const { data: session, status } = useSession();
  const { permissions, loading } = useCurrentPermissions();

  // Don't render anything while loading
  if (status === "loading" || loading) {
    return null;
  }

  // If not authenticated, show sign in button
  if (status === "unauthenticated" || !session?.user) {
    return (
      <div className="flex gap-2 mb-6 justify-center">
        <Link href="/login">
          <Button>
            <LogIn className="w-4 h-4 mr-2" />
            Sign In
          </Button>
        </Link>
      </div>
    );
  }

  // Check if user has blog permissions
  const hasWriteBlogPermission = permissions?.includes('WRITE_BLOG');
  const hasManageContentPermission = permissions?.includes('MANAGE_CONTENT');

  return (
    <div className="flex gap-2 mb-6 justify-between items-center">
      <div className="flex gap-2">
        {hasWriteBlogPermission && (
          <Link href="/blog/new">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              New Post
            </Button>
          </Link>
        )}
        
        {hasManageContentPermission && (
          <Link href="/blog/categories">
            <Button variant="outline">
              <Settings className="w-4 h-4 mr-2" />
              Manage Categories
            </Button>
          </Link>
        )}
      </div>
      
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">
          Welcome, {session.user.name || session.user.email}
        </span>
        <SignOutButton />
      </div>
    </div>
  );
}; 