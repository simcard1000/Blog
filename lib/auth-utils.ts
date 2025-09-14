import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

interface User {
  id: string;
  email: string;
  name: string | null;
  image: string | null;
  isTwoFactorEnabled: boolean;
  emailVerified: Date | null;
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt: Date | null;
  role: string;
  seller?: {
    id: string;
    applicationAccepted: boolean;
    stripeConnected: boolean;
    isFullyActivated: boolean;
  } | null;
}

/**
 * Server-side function to get authenticated user ID
 * Throws error if user is not authenticated
 */
export async function getAuthUserId(): Promise<string> {
  try {
    const session = await auth();
    
    console.log("Auth session:", {
      exists: !!session,
      userId: session?.user?.id,
      email: session?.user?.email
    });

    if (!session) {
      console.error("Authentication failed: No session found");
      throw new Error("Unauthorized: No session found");
    }

    const userId = session.user?.id;

    if (!userId) {
      console.error("Authentication failed: User ID missing in session");
      throw new Error("Unauthorized: User ID missing");
    }

    // Verify user exists in database
    const dbUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { 
        id: true,
        email: true,
        name: true
      }
    });
    
    console.log("Database user check:", {
      exists: !!dbUser,
      userId: dbUser?.id,
      email: dbUser?.email
    });

    if (!dbUser) {
      console.error("Authentication failed: User not found in database");
      throw new Error("Unauthorized: User not found");
    }

    return userId;
  } catch (error) {
    console.error("getAuthUserId error:", error);
    throw error;
  }
}

/**
 * Server-side function to get user role
 * Throws error if user is not authenticated
 */
export async function getUserRole(): Promise<string> {
  try {
    const session = await auth();
    
    console.log("getUserRole session:", {
      exists: !!session,
      userId: session?.user?.id,
      email: session?.user?.email
    });

    if (!session?.user) {
      console.error("Authentication failed: No session found");
      throw new Error("Unauthorized: No session found");
    }

    // Fetch role from database
    const dbUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { 
        id: true,
        email: true,
        name: true,
        // Note: Add role field to your User model if you have one
        // role: true,
      }
    });
    
    if (!dbUser) {
      console.error("Authentication failed: User not found in database");
      throw new Error("Unauthorized: User not found");
    }

    // For now, return a default role since your schema doesn't have a role field
    // You can add a role field to your User model if needed
    const userRole = "MEMBER"; // Default role
    
    console.log("Database role check:", {
      dbRole: userRole,
      userId: dbUser.id,
      email: dbUser.email
    });

    return userRole;
  } catch (error) {
    console.error("getUserRole error:", error);
    throw error;
  }
}

/**
 * Server-side function to get complete user data
 * Throws error if user is not authenticated
 */
export async function getAuthUser(): Promise<User> {
  try {
    const session = await auth();
    
    console.log("Auth session:", {
      exists: !!session,
      userId: session?.user?.id,
      email: session?.user?.email
    });

    if (!session?.user) {
      console.error("Authentication failed: No session found");
      throw new Error("Unauthorized: No session found");
    }

    const userId = session.user.id;

    // Get complete user data from database
    const dbUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { 
        id: true,
        email: true,
        name: true,
        image: true,
        createdAt: true,
        updatedAt: true,
        // Note: Add role field to your User model if you have one
        // role: true,
      }
    });
    
    console.log("Database user check:", {
      exists: !!dbUser,
      userId: dbUser?.id,
      email: dbUser?.email
    });

    if (!dbUser) {
      console.error("Authentication failed: User not found in database");
      throw new Error("Unauthorized: User not found");
    }

    // For now, return a default role since your schema doesn't have a role field
    const userRole = "MEMBER"; // Default role
    
    console.log("User role from database:", {
      dbRole: userRole,
      userId: userId
    });

    return {
      id: dbUser.id,
      email: dbUser.email,
      name: dbUser.name,
      image: dbUser.image,
      createdAt: dbUser.createdAt,
      updatedAt: dbUser.updatedAt,
      role: userRole
    };
  } catch (error) {
    console.error("getAuthUser error:", error);
    throw error;
  }
}
