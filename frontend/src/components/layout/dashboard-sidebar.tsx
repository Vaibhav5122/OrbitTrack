"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  RiRadarLine,
  RiDashboardLine,
  RiFolderLine,
  RiTaskLine,
  RiHistoryLine,
  RiShieldCheckLine,
  RiUserStarLine,
  RiCodeSSlashLine,
} from "@remixicon/react";
import { useUser } from "@/lib/hooks/useAuth";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function DashboardSidebarContent() {
  const pathname = usePathname();
  const { data: user } = useUser();

  const role = user?.role;

  const getNavLinks = () => {
    switch (role) {
      case "ADMIN":
        return [
          {
            href: "/dashboard/admin",
            label: "Overview",
            icon: RiDashboardLine,
            badge: "Admin",
          },
          {
            href: "/dashboard/projects",
            label: "Projects",
            icon: RiFolderLine,
          },
          {
            href: "/dashboard/tasks",
            label: "Kanban & Tasks",
            icon: RiTaskLine,
          },
          {
            href: "/dashboard/activity",
            label: "Audit Feed",
            icon: RiHistoryLine,
          },
        ];
      case "PROJECT_MANAGER":
        return [
          {
            href: "/dashboard/pm",
            label: "Overview",
            icon: RiDashboardLine,
            badge: "PM",
          },
          {
            href: "/dashboard/projects",
            label: "Owned Projects",
            icon: RiFolderLine,
          },
          {
            href: "/dashboard/tasks",
            label: "Review & Tasks",
            icon: RiTaskLine,
          },
          {
            href: "/dashboard/activity",
            label: "Activity Feed",
            icon: RiHistoryLine,
          },
        ];
      case "DEVELOPER":
      default:
        return [
          {
            href: "/dashboard/developer",
            label: "My Overview",
            icon: RiDashboardLine,
            badge: "Dev",
          },
          {
            href: "/dashboard/tasks",
            label: "Assigned Tasks",
            icon: RiTaskLine,
          },
          {
            href: "/dashboard/projects",
            label: "Projects",
            icon: RiFolderLine,
          },
          {
            href: "/dashboard/activity",
            label: "Activity Feed",
            icon: RiHistoryLine,
          },
        ];
    }
  };

  const navLinks = getNavLinks();

  const getRoleIcon = () => {
    switch (role) {
      case "ADMIN":
        return RiShieldCheckLine;
      case "PROJECT_MANAGER":
        return RiUserStarLine;
      case "DEVELOPER":
      default:
        return RiCodeSSlashLine;
    }
  };

  const RoleIcon = getRoleIcon();

  return (
    <div className="flex h-full flex-col justify-between bg-card/70 border-r border-border/60">
      <div className="flex flex-col">
        {/* Brand Logo Header */}
        <div className="flex h-14 items-center gap-2.5 border-b border-border/60 px-5">
          <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-xs shadow-primary/30">
            <RiRadarLine className="size-4 animate-pulse" />
          </div>
          <div className="flex flex-col">
            <span className="font-heading text-sm font-bold tracking-tight text-foreground">
              OrbitTrack
            </span>
            <span className="text-[9px] uppercase tracking-widest font-mono text-muted-foreground">
              Real-Time Platform
            </span>
          </div>
        </div>

        {/* Navigation Items */}
        <div className="p-3">
          <p className="px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
            Navigation
          </p>
          <nav className="flex flex-col gap-1 mt-1">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center justify-between rounded-lg px-3 py-2 text-xs font-medium transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-xs shadow-primary/20"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  )}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="size-4" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={cn(
                        "rounded px-1.5 py-0.5 text-[9px] font-mono uppercase font-bold",
                        isActive
                          ? "bg-primary-foreground/20 text-primary-foreground"
                          : "bg-secondary text-muted-foreground"
                      )}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Role Footer Card */}
      <div className="p-3 border-t border-border/60">
        <div className="flex items-center gap-3 rounded-lg border border-border/50 bg-secondary/40 p-2.5">
          <div className="flex size-7 items-center justify-center rounded-md bg-primary/10 text-primary">
            <RoleIcon className="size-4" />
          </div>
          <div className="flex flex-col overflow-hidden">
            <span className="text-xs font-semibold text-foreground truncate">
              {user?.name || "Team Member"}
            </span>
            <span className="text-[10px] font-mono text-muted-foreground truncate">
              {role ? role.replace("_", " ") : "Access"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function DashboardSidebar() {
  return (
    <aside className="hidden md:flex md:w-60 md:flex-col md:fixed md:inset-y-0 z-20">
      <DashboardSidebarContent />
    </aside>
  );
}
