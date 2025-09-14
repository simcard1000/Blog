import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function getAuthUserId() {
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

        // Verify user exists in database and get full user data
        const dbUser = await prisma.user.findUnique({
            where: { id: userId },
            select: { 
                id: true,
                email: true,
                name: true,
                image: true,
                createdAt: true,
                updatedAt: true
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

        // Fetch role from database since it's no longer stored in session
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