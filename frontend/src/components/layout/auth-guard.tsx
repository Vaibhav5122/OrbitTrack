"use client";

import React, { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useUser } from "@/lib/hooks/useAuth";
import { OrbitLoader } from "@/components/ui/orbit-loader";
import type { UserRole } from "@/lib/api/auth";

interface AuthGuardProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

export function AuthGuard({ children, allowedRoles }: AuthGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { data: user, isLoading, isError } = useUser();

  useEffect(() => {
    if (!isLoading) {
      if (isError || !user) {
        router.push("/login");
        return;
      }

      if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
        if (user.role === "ADMIN") {
          router.replace("/dashboard/admin");
        } else if (user.role === "PROJECT_MANAGER") {
          router.replace("/dashboard/pm");
        } else {
          router.replace("/dashboard/developer");
        }
      }
    }
  }, [user, isLoading, isError, router, allowedRoles, pathname]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
        <div className="flex flex-col items-center gap-4 text-center">
          <OrbitLoader size="md" />
          <div className="space-y-1">
            <p className="font-heading text-sm font-semibold tracking-tight text-foreground">
              Authenticating Session
            </p>
            <p className="text-xs font-mono text-muted-foreground">
              Verifying OrbitTrack permissions & dual-token state...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (isError || !user) {
    return null;
  }

  if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return null;
  }

  return <>{children}</>;
}
