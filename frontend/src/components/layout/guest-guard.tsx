"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/lib/hooks/useAuth";
import { OrbitLoader } from "@/components/ui/orbit-loader";

export function GuestGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { data: user, isLoading } = useUser();

  useEffect(() => {
    if (!isLoading && user) {
      if (user.role === "ADMIN") {
        router.replace("/dashboard/admin");
      } else if (user.role === "PROJECT_MANAGER") {
        router.replace("/dashboard/pm");
      } else {
        router.replace("/dashboard/developer");
      }
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
        <OrbitLoader size="sm" />
      </div>
    );
  }

  // Prevent flash of login/signup content if user is already authenticated
  if (user) {
    return null;
  }

  return <>{children}</>;
}
