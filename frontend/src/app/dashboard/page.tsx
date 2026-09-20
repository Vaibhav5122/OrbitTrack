"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/lib/hooks/useAuth";
import { OrbitLoader } from "@/components/ui/orbit-loader";

export default function DashboardRootPage() {
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

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center">
      <OrbitLoader size="md" />
      <p className="mt-4 text-xs font-mono text-muted-foreground">
        Routing to your role dashboard...
      </p>
    </div>
  );
}
