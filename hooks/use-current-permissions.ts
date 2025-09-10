"use client";

import { useSession } from "next-auth/react";
import { useMemo } from "react";

export const useCurrentPermissions = () => {
  const { data: session, status } = useSession();

  const permissions = useMemo(() => {
    if (!session?.user) return [];
    
    // For a standalone blog, we'll give all authenticated users basic permissions
    // You can modify this logic based on your needs
    const userPermissions = ["WRITE_BLOG"];
    
    // If the user is the first user (admin), give them manage content permission
    // This is a simple way to handle admin permissions
    if (session.user.email === "admin@example.com") {
      userPermissions.push("MANAGE_CONTENT");
    }
    
    return userPermissions;
  }, [session]);

  const hasPermission = (permission: string) => {
    return permissions.includes(permission);
  };

  return {
    permissions,
    hasPermission,
    loading: status === "loading",
  };
};