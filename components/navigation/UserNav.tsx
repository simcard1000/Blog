"use client";

import { logout } from "@/actions/logout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { usePermissions } from "@/components/providers/PermissionProvider";
import { PERMISSIONS, Role } from "@/data/roles-and-permissions";

interface iAppProps {
  userInfo: {
    email: string | null;
    username: string | null;
    image: string | null;
    role: Role | null;
    id: string;
  } | null;
}

export function UserNav({ userInfo }: iAppProps) {
  const { hasPermission } = usePermissions();

  // Permission-based checks for blog features
  const canWriteBlog = hasPermission(PERMISSIONS.WRITE_BLOG.value);
  const canManageContent = hasPermission(PERMISSIONS.MANAGE_CONTENT.value);
  const canAccessAdminDashboard = hasPermission(PERMISSIONS.ACCESS_ADMIN_DASHBOARD.value);
  const canAccessMemberDashboard = hasPermission(PERMISSIONS.ACCESS_MEMBER_DASHBOARD.value);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar className="h-10 w-10">
            <AvatarImage src={userInfo?.image || undefined} alt="User Image" />
            <AvatarFallback>{userInfo?.username?.[0] || "U"}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium">{userInfo?.username || "Guest"}</p>
            <p className="text-xs text-muted-foreground">{userInfo?.email || "No email provided"}</p>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          {/* Blog-specific menu items */}
          {canWriteBlog && (
            <DropdownMenuItem asChild>
              <Link href="/blog/new" className="w-full">Write Article</Link>
            </DropdownMenuItem>
          )}
          {canWriteBlog && (
            <DropdownMenuItem asChild>
              <Link href="/blog" className="w-full">My Articles</Link>
            </DropdownMenuItem>
          )}
          
          {/* Dashboard access */}
          {canAccessAdminDashboard && (
            <DropdownMenuItem asChild>
              <Link href="/admin/dashboard" className="w-full">Admin Dashboard</Link>
            </DropdownMenuItem>
          )}
          {canAccessMemberDashboard && !canAccessAdminDashboard && (
            <DropdownMenuItem asChild>
              <Link href="/member/dashboard" className="w-full">My Dashboard</Link>
            </DropdownMenuItem>
          )}
          
          {/* Content management for admins */}
          {canManageContent && (
            <DropdownMenuItem asChild>
              <Link href="/admin/content" className="w-full">Manage Content</Link>
            </DropdownMenuItem>
          )}
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={() => logout()}>Log Out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
