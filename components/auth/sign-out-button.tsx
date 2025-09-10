"use client";

import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

export function SignOutButton() {
  const handleSignOut = () => {
    signOut({ callbackUrl: "/" });
  };

  return (
    <Button variant="outline" onClick={handleSignOut}>
      <LogOut className="w-4 h-4 mr-2" />
      Sign Out
    </Button>
  );
}
