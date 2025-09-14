import { auth } from "@/auth";
import { getUserPermissions } from "@/lib/permissions";
import { decryptData } from "./encryption";

export const currentUser = async () => {
  try {
    const session = await auth();
    if (!session?.user) {
      return null;
    }
    return session.user;
  } catch (error) {
    console.error("Error getting current user:", error);
    return null;
  }
};

// Get current user with permissions from database
export const currentUserWithPermissions = async () => {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return null;
    }

    // Fetch permissions from database
    const permissions = await getUserPermissions(session.user.id);
    
    return {
      ...session.user,
      permissions: permissions
    };
  } catch (error) {
    console.error("Error getting current user with permissions:", error);
    return null;
  }
};

// A utility function to get the current role of the user
// Note: Role is now fetched via API, not stored in session
export const currentRole = async () => {
  try {
    const session = await auth(); // Retrieve the session

    if (!session?.user?.id) {
      return null;
    }

    // Fetch role from database via API
    const response = await fetch('/api/auth/permissions');
    if (!response.ok) {
      throw new Error('Failed to fetch user role');
    }

    const data = await response.json();
    return data.role || 'MEMBER';
  } catch (error) {
    console.error("Error fetching current role:", error); // Log error for debugging
    return null; // You can also return `null` or `undefined` here to handle the error gracefully
  }
};

export const getUserFirstName = (user: { encryptedFirstName?: string; firstNameIV?: string; firstNameSalt?: string }): string | null => {
  try {
    if (!user?.encryptedFirstName || !user?.firstNameIV || !user?.firstNameSalt) {
      return null;
    }

    const firstName = decryptData(user.encryptedFirstName, user.firstNameIV, user.firstNameSalt);
    return firstName || null;
  } catch (error) {
    console.error("Error decrypting first name:", error);
    return null;
  }
};

// Note: authOptions has been moved to auth.ts and auth.config.ts for NextAuth v5
