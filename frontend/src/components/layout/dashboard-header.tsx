"use client";

import React from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  RiMenuLine,
  RiNotification3Line,
  RiLogoutBoxRLine,
  RiShieldUserLine,
  RiFlashlightLine,
  RiCheckDoubleLine,
  RiRadarLine,
  RiExchangeLine,
  RiCircleFill,
} from "@remixicon/react";

import { useUser, useLogout, useLogin } from "@/lib/hooks/useAuth";
import {
  useUnreadNotificationsCount,
  useNotifications,
  useMarkNotificationRead,
  useMarkAllNotificationsRead,
} from "@/lib/hooks/useDashboard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { DashboardSidebarContent } from "./dashboard-sidebar";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export function DashboardHeader() {
  const router = useRouter();
  const pathname = usePathname();
  const { data: user } = useUser();
  const { mutate: logout, isPending: isLoggingOut } = useLogout();
  const { mutate: quickLogin, isPending: isSwitchingRole } = useLogin();

  const { data: unreadData } = useUnreadNotificationsCount();
  const { data: notifications = [] } = useNotifications();
  const { mutate: markRead } = useMarkNotificationRead();
  const { mutate: markAllRead } = useMarkAllNotificationsRead();

  const unreadCount = unreadData?.unreadCount ?? 0;

  const handleQuickSwitch = (email: string, targetPath: string) => {
    quickLogin(
      { email, password: "Password123!" },
      {
        onSuccess: () => {
          router.push(targetPath);
        },
      }
    );
  };

  const getRoleBadgeVariant = (role?: string) => {
    switch (role) {
      case "ADMIN":
        return "default";
      case "PROJECT_MANAGER":
        return "secondary";
      case "DEVELOPER":
        return "outline";
      default:
        return "outline";
    }
  };

  const getInitials = (name?: string) => {
    if (!name) return "OT";
    return name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  return (
    <header className="sticky top-0 z-30 flex h-14 w-full items-center justify-between border-b border-border/60 bg-background/80 px-4 backdrop-blur-md sm:px-6">
      <div className="flex items-center gap-3">
        {/* Mobile Navigation Sheet Trigger */}
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="size-8 md:hidden"
              aria-label="Open navigation menu"
            >
              <RiMenuLine className="size-4" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0">
            <SheetHeader className="sr-only">
              <SheetTitle>Navigation Menu</SheetTitle>
            </SheetHeader>
            <DashboardSidebarContent />
          </SheetContent>
        </Sheet>

        {/* Current Area Breadcrumb */}
        <div className="hidden items-center gap-2 text-xs text-muted-foreground sm:flex">
          <Link
            href="/dashboard"
            className="flex items-center gap-1.5 font-medium transition-colors hover:text-foreground"
          >
            <RiRadarLine className="size-3.5 text-primary animate-pulse" />
            <span>OrbitTrack</span>
          </Link>
          <span>/</span>
          <span className="capitalize font-mono text-foreground">
            {pathname.split("/").filter(Boolean).slice(-1)[0] || "Dashboard"}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        {/* Live Presence Indicator */}
        <div className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-card/60 px-2.5 py-0.5 text-[11px] font-mono text-muted-foreground shadow-xs">
          <RiCircleFill className="size-2 text-emerald-500 animate-pulse" />
          <span>Live Presence Online</span>
        </div>

        {/* Evaluator Quick Role Switcher */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="h-9 px-3 gap-2 text-xs font-mono border-primary/30 bg-primary/5 hover:bg-primary/10 shadow-xs"
              disabled={isSwitchingRole}
            >
              <RiExchangeLine className="size-4 text-primary" />
              <span className="hidden md:inline">Evaluator Switch:</span>
              <span className="font-semibold text-primary">
                {user?.role === "ADMIN"
                  ? "Admin"
                  : user?.role === "PROJECT_MANAGER"
                  ? "PM"
                  : "Dev"}
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64 p-2">
            <DropdownMenuLabel className="text-xs font-mono uppercase tracking-wider text-muted-foreground pb-1.5">
              Instant RBAC Role Switch
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="my-1" />
            <DropdownMenuItem
              onClick={() =>
                handleQuickSwitch("vaibhav.admin@orbittrack.com", "/dashboard/admin")
              }
              className="cursor-pointer gap-2.5 py-2"
            >
              <Badge className="text-xs px-2 py-0.5 bg-primary text-primary-foreground font-mono font-bold">
                ADMIN
              </Badge>
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-foreground">Vaibhav Waghmode</span>
                <span className="text-xs text-muted-foreground">Full Platform Oversight</span>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() =>
                handleQuickSwitch("siddhesh.pm@orbittrack.com", "/dashboard/pm")
              }
              className="cursor-pointer gap-2.5 py-2"
            >
              <Badge variant="secondary" className="text-xs px-2 py-0.5 font-mono font-bold">
                PM
              </Badge>
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-foreground">Siddhesh Kadam</span>
                <span className="text-xs text-muted-foreground">Project Management</span>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() =>
                handleQuickSwitch("omkar.dev@orbittrack.com", "/dashboard/developer")
              }
              className="cursor-pointer gap-2.5 py-2"
            >
              <Badge variant="outline" className="text-xs px-2 py-0.5 font-mono font-bold">
                DEV
              </Badge>
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-foreground">Omkar Shinde</span>
                <span className="text-xs text-muted-foreground">Assigned Tasks Only</span>
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Theme Toggle (Black & White Dark/Light) */}
        <ThemeToggle />

        {/* Notifications Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="relative size-9"
              aria-label="Notifications"
            >
              <RiNotification3Line className="size-4.5" />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex size-4 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80 p-0">
            <div className="flex items-center justify-between border-b border-border/60 px-4 py-2.5">
              <span className="font-heading text-xs font-semibold">
                Notifications {unreadCount > 0 && `(${unreadCount})`}
              </span>
              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={() => markAllRead()}
                  className="text-[11px] text-primary hover:underline cursor-pointer"
                >
                  Mark all read
                </button>
              )}
            </div>
            <div className="max-h-72 overflow-y-auto divide-y divide-border/40">
              {notifications.length === 0 ? (
                <div className="py-6 text-center text-xs text-muted-foreground">
                  No notifications yet
                </div>
              ) : (
                notifications.slice(0, 5).map((n) => (
                  <div
                    key={n.id}
                    onClick={() => !n.isRead && markRead(n.id)}
                    className={`flex flex-col gap-1 p-3 text-xs transition-colors cursor-pointer hover:bg-muted/50 ${
                      !n.isRead ? "bg-primary/5" : ""
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-foreground">{n.title}</span>
                      {!n.isRead && (
                        <span className="size-1.5 rounded-full bg-primary" />
                      )}
                    </div>
                    <p className="text-[11px] text-muted-foreground leading-snug">
                      {n.message}
                    </p>
                    <span className="text-[9px] font-mono text-muted-foreground/70">
                      {new Date(n.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                ))
              )}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User Profile Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="flex items-center justify-center p-0.5 size-9 hover:bg-accent rounded-full"
            >
              <Avatar className="size-8 border border-border/80">
                <AvatarFallback className="text-xs font-bold bg-primary/10 text-primary">
                  {getInitials(user?.name)}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64 p-2.5">
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-3 pb-2 border-b border-border/50">
                <Avatar className="size-10 border border-border/80">
                  <AvatarFallback className="text-sm font-bold bg-primary/10 text-primary">
                    {getInitials(user?.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col overflow-hidden">
                  <span className="text-sm font-semibold text-foreground truncate">
                    {user?.name}
                  </span>
                  <span className="text-xs text-muted-foreground font-mono truncate">
                    {user?.email}
                  </span>
                </div>
              </div>
              <div className="pt-2 flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Active Role:</span>
                <Badge
                  variant={getRoleBadgeVariant(user?.role)}
                  className="text-xs px-2.5 py-0.5 font-mono font-bold"
                >
                  {user?.role?.replace("_", " ")}
                </Badge>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="my-2" />
            <DropdownMenuItem
              onClick={() => logout()}
              disabled={isLoggingOut}
              className="text-destructive focus:text-destructive cursor-pointer gap-2 py-2 text-sm font-medium"
            >
              <RiLogoutBoxRLine className="size-4" />
              <span>{isLoggingOut ? "Logging out..." : "Log out"}</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
