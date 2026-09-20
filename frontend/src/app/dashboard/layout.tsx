import React from "react";
import { AuthGuard } from "@/components/layout/auth-guard";
import { DashboardSidebar } from "@/components/layout/dashboard-sidebar";
import { DashboardHeader } from "@/components/layout/dashboard-header";

export const metadata = {
  title: "Dashboard | OrbitTrack",
  description: "Real-time client project dashboard and team workspace",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <div className="min-h-screen bg-background text-foreground flex">
        <DashboardSidebar />

        <div className="flex flex-1 flex-col md:pl-60 min-w-0">
          <DashboardHeader />
          <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
        </div>
      </div>
    </AuthGuard>
  );
}
