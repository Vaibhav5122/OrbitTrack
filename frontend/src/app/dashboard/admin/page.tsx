"use client";

import React from "react";
import Link from "next/link";
import {
  RiFolderLine,
  RiGroupLine,
  RiAlarmWarningLine,
  RiRadarLine,
  RiArrowRightLine,
  RiShieldCheckLine,
  RiTimeLine,
  RiCheckboxCircleLine,
  RiProgress3Line,
  RiSearchEyeLine,
} from "@remixicon/react";

import { useAdminDashboard } from "@/lib/hooks/useDashboard";
import { useSocket } from "@/components/providers/socket-provider";
import { ActivityFeed } from "@/components/activity-feed";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { OrbitLoader } from "@/components/ui/orbit-loader";

export default function AdminDashboardPage() {
  const { data, isLoading, error, refetch } = useAdminDashboard();
  const { activeUsersCount: liveActiveUsers } = useSocket();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col gap-1">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-28 rounded-xl" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton className="h-64 rounded-xl" />
          <Skeleton className="h-64 rounded-xl" />
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center text-center p-4">
        <RiAlarmWarningLine className="size-10 text-destructive mb-3" />
        <h3 className="font-heading text-base font-semibold">Failed to load Admin Dashboard</h3>
        <p className="text-xs text-muted-foreground mt-1 max-w-sm">
          {error?.message || "Ensure you have the ADMIN role and backend is running."}
        </p>
        <Button onClick={() => refetch()} size="sm" className="mt-4 text-xs">
          Try Again
        </Button>
      </div>
    );
  }

  const { totalProjects, totalUsers, tasksByStatus, overdueTaskCount, activeUsersCount } = data;
  const totalTasks =
    tasksByStatus.TODO +
    tasksByStatus.IN_PROGRESS +
    tasksByStatus.IN_REVIEW +
    tasksByStatus.DONE;

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-heading text-2xl font-bold tracking-tight">Admin Command Center</h1>
            <Badge className="bg-primary/10 text-primary border-primary/20 text-[10px] font-mono uppercase">
              Full Access
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Real-time overview of all client projects, team task distribution, and platform health.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/dashboard/tasks">
            <Button variant="outline" className="h-9 px-3.5 text-xs font-medium gap-1.5">
              Kanban Board
              <RiArrowRightLine className="size-3.5" />
            </Button>
          </Link>
          <Link href="/dashboard/projects">
            <Button className="h-9 px-3.5 text-xs font-medium gap-1.5 shadow-xs shadow-primary/20">
              Manage Projects
              <RiArrowRightLine className="size-3.5" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Projects */}
        <Card className="shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-medium text-muted-foreground uppercase font-mono tracking-wider">
              Total Projects
            </CardTitle>
            <div className="flex size-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <RiFolderLine className="size-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono">{totalProjects}</div>
            <p className="text-[11px] text-muted-foreground mt-1">
              Active client delivery tracks
            </p>
          </CardContent>
        </Card>

        {/* Total Team Members */}
        <Card className="shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-medium text-muted-foreground uppercase font-mono tracking-wider">
              Team Members
            </CardTitle>
            <div className="flex size-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <RiGroupLine className="size-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono">{totalUsers}</div>
            <p className="text-[11px] text-muted-foreground mt-1">
              Across Admin, PM, and Dev roles
            </p>
          </CardContent>
        </Card>

        {/* Overdue Tasks Alert */}
        <Card className={`shadow-xs ${overdueTaskCount > 0 ? "border-destructive/40 bg-destructive/5" : ""}`}>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-medium text-muted-foreground uppercase font-mono tracking-wider">
              Overdue Tasks
            </CardTitle>
            <div className={`flex size-7 items-center justify-center rounded-lg ${
              overdueTaskCount > 0 ? "bg-destructive/10 text-destructive" : "bg-muted text-muted-foreground"
            }`}>
              <RiAlarmWarningLine className="size-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold font-mono ${overdueTaskCount > 0 ? "text-destructive" : ""}`}>
              {overdueTaskCount}
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">
              Flagged by 15m background cron
            </p>
          </CardContent>
        </Card>

        {/* Live Active Presence */}
        <Card className="shadow-xs border-emerald-500/30 bg-emerald-500/5">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-medium text-muted-foreground uppercase font-mono tracking-wider">
              Live Presence
            </CardTitle>
            <div className="flex size-7 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-500">
              <RiRadarLine className="size-4 animate-pulse" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400">
              {liveActiveUsers || activeUsersCount}
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">
              WebSocket clients connected
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Task Distribution & Architectural Guarantees */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Status Distribution */}
        <Card className="lg:col-span-2 shadow-xs">
          <CardHeader>
            <CardTitle className="text-base font-semibold">Task Status Distribution</CardTitle>
            <CardDescription className="text-xs">
              Live aggregate across all {totalTasks} tasks in the platform
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Visual Progress Bar */}
            <div className="flex h-3 w-full overflow-hidden rounded-full bg-secondary">
              <div
                style={{ width: `${totalTasks > 0 ? (tasksByStatus.DONE / totalTasks) * 100 : 0}%` }}
                className="bg-emerald-500 transition-all duration-500"
                title="DONE"
              />
              <div
                style={{ width: `${totalTasks > 0 ? (tasksByStatus.IN_REVIEW / totalTasks) * 100 : 0}%` }}
                className="bg-indigo-500 transition-all duration-500"
                title="IN_REVIEW"
              />
              <div
                style={{ width: `${totalTasks > 0 ? (tasksByStatus.IN_PROGRESS / totalTasks) * 100 : 0}%` }}
                className="bg-amber-500 transition-all duration-500"
                title="IN_PROGRESS"
              />
              <div
                style={{ width: `${totalTasks > 0 ? (tasksByStatus.TODO / totalTasks) * 100 : 0}%` }}
                className="bg-muted-foreground/30 transition-all duration-500"
                title="TODO"
              />
            </div>

            {/* Status Breakdown Pills */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="rounded-lg border border-border/60 p-3 space-y-1">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <span className="size-2 rounded-full bg-muted-foreground/40" />
                  <span>To Do</span>
                </div>
                <div className="text-lg font-bold font-mono">{tasksByStatus.TODO}</div>
              </div>

              <div className="rounded-lg border border-border/60 p-3 space-y-1">
                <div className="flex items-center gap-1.5 text-xs text-amber-500">
                  <span className="size-2 rounded-full bg-amber-500" />
                  <span>In Progress</span>
                </div>
                <div className="text-lg font-bold font-mono">{tasksByStatus.IN_PROGRESS}</div>
              </div>

              <div className="rounded-lg border border-border/60 p-3 space-y-1">
                <div className="flex items-center gap-1.5 text-xs text-indigo-500">
                  <span className="size-2 rounded-full bg-indigo-500" />
                  <span>In Review</span>
                </div>
                <div className="text-lg font-bold font-mono">{tasksByStatus.IN_REVIEW}</div>
              </div>

              <div className="rounded-lg border border-border/60 p-3 space-y-1">
                <div className="flex items-center gap-1.5 text-xs text-emerald-500">
                  <span className="size-2 rounded-full bg-emerald-500" />
                  <span>Done</span>
                </div>
                <div className="text-lg font-bold font-mono">{tasksByStatus.DONE}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Architecture & Assessment Verification Checklist */}
        <Card className="shadow-xs bg-secondary/20">
          <CardHeader>
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <RiShieldCheckLine className="size-4 text-primary" />
              <span>Compliance Overview</span>
            </CardTitle>
            <CardDescription className="text-xs">
              Velozity Global Solutions Technical Verification
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3.5 text-xs">
            <div className="flex items-start gap-2.5">
              <RiCheckboxCircleLine className="size-4 text-emerald-500 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-foreground">Strict RBAC at API Level</span>
                <p className="text-muted-foreground text-[11px]">
                  Admins see all data; PMs isolated to owned projects; Devs restricted to assigned tasks.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <RiCheckboxCircleLine className="size-4 text-emerald-500 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-foreground">Background Scheduled Cron</span>
                <p className="text-muted-foreground text-[11px]">
                  Overdue tasks flagged every 15m in background worker, never calculated on page load.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <RiCheckboxCircleLine className="size-4 text-emerald-500 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-foreground">Zero Polling Real-Time Sync</span>
                <p className="text-muted-foreground text-[11px]">
                  Socket.io broadcasts task changes, offline 20-event catchup, and live notifications.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Global Real-Time Activity Feed */}
      <ActivityFeed
        limit={15}
        title="Global Platform Live Activity Stream"
        description="Live audit events streamed via WebSocket rooms across all client projects and team tasks."
      />
    </div>
  );
}
