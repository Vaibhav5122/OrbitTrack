"use client";

import React, { use } from "react";
import Link from "next/link";
import {
  RiArrowLeftLine,
  RiFolderLine,
  RiBuildingLine,
  RiUserLine,
  RiCalendarLine,
  RiTaskLine,
  RiCheckDoubleLine,
  RiAlarmWarningLine,
  RiArrowRightLine,
  RiCircleFill,
} from "@remixicon/react";
import { useProject } from "@/lib/hooks/useProjects";
import { useProjectActivity } from "@/lib/hooks/useActivity";
import { useSocket } from "@/components/providers/socket-provider";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import type { ActivityItem } from "@/lib/api/activity";

export default function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const projectId = resolvedParams.id;

  const { data: project, isLoading, error } = useProject(projectId);
  const { data: projectActivities = [], isLoading: isActivityLoading } =
    useProjectActivity(projectId, 20);
  const { isConnected } = useSocket();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-24 w-full rounded-xl" />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-28 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center text-center p-4">
        <RiAlarmWarningLine className="size-10 text-destructive mb-3" />
        <h3 className="font-heading text-base font-semibold">
          Project Not Found
        </h3>
        <p className="text-xs text-muted-foreground mt-1 max-w-sm">
          {error?.message || "You may not have permission to view this project."}
        </p>
        <Link href="/dashboard/projects">
          <Button size="sm" className="mt-4 text-xs gap-1.5">
            <RiArrowLeftLine className="size-3.5" />
            Back to Projects
          </Button>
        </Link>
      </div>
    );
  }

  const tasks = (project as unknown as { tasks?: Array<{ id: string; status: string; isOverdue: boolean }> })?.tasks || [];
  const totalTasks = tasks.length;
  const doneTasks = tasks.filter((t) => t.status === "DONE").length;
  const overdueTasks = tasks.filter((t) => t.isOverdue).length;
  const progressPercent = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;

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
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Link
          href="/dashboard/projects"
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors font-mono"
        >
          <RiArrowLeftLine className="size-3.5" />
          <span>Back to Projects</span>
        </Link>
      </div>

      <Card className="border-border/60 shadow-xs">
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="outline" className="text-[10px] font-mono">
                  <RiBuildingLine className="mr-1 size-3" />
                  {project.client?.name || "Client"}
                </Badge>
                <Badge className="bg-primary/10 text-primary border-primary/20 text-[10px] font-mono">
                  Active Track
                </Badge>
              </div>

              <CardTitle className="font-heading text-2xl font-bold tracking-tight">
                {project.name}
              </CardTitle>

              {project.description && (
                <CardDescription className="text-xs text-muted-foreground max-w-2xl leading-relaxed">
                  {project.description}
                </CardDescription>
              )}
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <Link href={`/dashboard/tasks?projectId=${project.id}`}>
                <Button className="h-9 px-4 text-xs font-medium gap-1.5 shadow-xs shadow-primary/20">
                  <RiTaskLine className="size-3.5" />
                  <span>Open Kanban Board</span>
                  <RiArrowRightLine className="size-3.5" />
                </Button>
              </Link>
            </div>
          </div>
        </CardHeader>

        <CardContent className="border-t border-border/40 pt-4 flex flex-wrap items-center justify-between gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <Avatar className="size-6 border border-border/80">
              <AvatarFallback className="text-[9px] font-bold bg-primary/10 text-primary">
                {getInitials(project.owner?.name)}
              </AvatarFallback>
            </Avatar>
            <span>
              Project Manager:{" "}
              <strong className="text-foreground">{project.owner?.name}</strong>
            </span>
          </div>

          <div className="flex items-center gap-1.5 font-mono text-[11px]">
            <RiCalendarLine className="size-3.5" />
            <span>
              Created: {new Date(project.createdAt).toLocaleDateString()}
            </span>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="shadow-xs">
          <CardHeader className="pb-2 space-y-0 flex flex-row items-center justify-between">
            <CardTitle className="text-xs font-medium text-muted-foreground uppercase font-mono">
              Total Deliverables
            </CardTitle>
            <RiTaskLine className="size-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono">{totalTasks}</div>
            <p className="text-[11px] text-muted-foreground mt-1">
              Active tasks in this delivery track
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-xs">
          <CardHeader className="pb-2 space-y-0 flex flex-row items-center justify-between">
            <CardTitle className="text-xs font-medium text-muted-foreground uppercase font-mono">
              Completion Rate
            </CardTitle>
            <RiCheckDoubleLine className="size-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400">
              {progressPercent}%
            </div>
            <div className="w-full bg-secondary h-2 rounded-full mt-2 overflow-hidden">
              <div
                className="bg-emerald-500 h-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </CardContent>
        </Card>

        <Card
          className={`shadow-xs ${
            overdueTasks > 0 ? "border-destructive/40 bg-destructive/5" : ""
          }`}
        >
          <CardHeader className="pb-2 space-y-0 flex flex-row items-center justify-between">
            <CardTitle className="text-xs font-medium text-muted-foreground uppercase font-mono">
              Overdue Tasks
            </CardTitle>
            <RiAlarmWarningLine
              className={`size-4 ${
                overdueTasks > 0 ? "text-destructive" : "text-muted-foreground"
              }`}
            />
          </CardHeader>
          <CardContent>
            <div
              className={`text-2xl font-bold font-mono ${
                overdueTasks > 0 ? "text-destructive" : ""
              }`}
            >
              {overdueTasks}
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">
              Automated 15m cron flag
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border/60 shadow-xs">
        <CardHeader className="pb-3 border-b border-border/40">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CardTitle className="font-heading text-base font-semibold">
                Project Real-Time Activity Feed
              </CardTitle>
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] font-mono border ${
                  isConnected
                    ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-500"
                    : "border-amber-500/30 bg-amber-500/10 text-amber-500"
                }`}
              >
                <RiCircleFill
                  className={`size-1.5 ${
                    isConnected ? "text-emerald-500 animate-pulse" : "text-amber-500"
                  }`}
                />
                {isConnected ? "ROOM ACTIVE" : "CONNECTING"}
              </span>
            </div>
            <span className="text-[11px] font-mono text-muted-foreground">
              Scoped to {project.name}
            </span>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {isActivityLoading ? (
            <div className="p-4 space-y-2">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-10 w-full rounded-md" />
              ))}
            </div>
          ) : projectActivities.length === 0 ? (
            <div className="p-8 text-center text-xs text-muted-foreground">
              No recent activity recorded on this project yet.
            </div>
          ) : (
            <div className="divide-y divide-border/40 max-h-80 overflow-y-auto">
              {projectActivities.map((act: ActivityItem) => (
                <div
                  key={act.id}
                  className="flex items-start gap-3 p-3 text-xs hover:bg-muted/30 transition-colors"
                >
                  <Avatar className="size-6 mt-0.5 border border-border/80 shrink-0">
                    <AvatarFallback className="text-[9px] font-bold bg-primary/10 text-primary">
                      {getInitials(act.user?.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0 space-y-0.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-semibold text-foreground truncate">
                        {act.user?.name || "System"}
                      </span>
                      <span className="text-[10px] font-mono text-muted-foreground shrink-0">
                        {new Date(act.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                    <p className="text-muted-foreground text-[11px] leading-snug">
                      {act.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
