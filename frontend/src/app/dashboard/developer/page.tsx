"use client";

import React from "react";
import {
  RiTaskLine,
  RiPlayCircleLine,
  RiSendPlaneLine,
  RiCheckDoubleLine,
  RiTimeLine,
  RiAlarmWarningLine,
  RiFolderLine,
  RiCheckboxCircleLine,
  RiHourglassLine,
} from "@remixicon/react";

import { useDeveloperDashboard, useUpdateTaskStatus } from "@/lib/hooks/useDashboard";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export default function DeveloperDashboardPage() {
  const { data, isLoading, error, refetch } = useDeveloperDashboard();
  const { mutate: updateStatus, isPending: isUpdating } = useUpdateTaskStatus();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col gap-1">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-24 rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-96 rounded-xl" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center text-center p-4">
        <RiAlarmWarningLine className="size-10 text-destructive mb-3" />
        <h3 className="font-heading text-base font-semibold">Failed to load Developer Workspace</h3>
        <p className="text-xs text-muted-foreground mt-1 max-w-sm">
          {error?.message || "Ensure you are authenticated as a DEVELOPER."}
        </p>
        <Button onClick={() => refetch()} size="sm" className="mt-4 text-xs">
          Try Again
        </Button>
      </div>
    );
  }

  const { metrics, tasks } = data;

  const handleStatusTransition = (taskId: string, currentStatus: string) => {
    if (currentStatus === "TODO") {
      updateStatus({ taskId, status: "IN_PROGRESS" });
    } else if (currentStatus === "IN_PROGRESS") {
      updateStatus({ taskId, status: "IN_REVIEW" });
    }
  };

  const getPriorityBadgeVariant = (priority: string) => {
    switch (priority) {
      case "CRITICAL":
        return "destructive";
      case "HIGH":
        return "default";
      case "MEDIUM":
        return "secondary";
      default:
        return "outline";
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "TODO":
        return <Badge variant="outline" className="text-[10px]">TO DO</Badge>;
      case "IN_PROGRESS":
        return <Badge className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30 text-[10px]">IN PROGRESS</Badge>;
      case "IN_REVIEW":
        return <Badge className="bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/30 text-[10px]">IN REVIEW</Badge>;
      case "DONE":
        return <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 text-[10px]">COMPLETED</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-heading text-2xl font-bold tracking-tight">Developer Workspace</h1>
            <Badge variant="outline" className="text-[10px] font-mono uppercase">
              Developer
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Focus on your assigned delivery items. Move items from To Do &rarr; In Progress &rarr; In Review for PM sign-off.
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <Card className="shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-mono font-medium text-muted-foreground uppercase">
              Assigned
            </CardTitle>
            <RiTaskLine className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono">{metrics.totalAssigned}</div>
            <p className="text-[11px] text-muted-foreground mt-1">Active workload</p>
          </CardContent>
        </Card>

        <Card className="shadow-xs border-amber-500/30 bg-amber-500/5">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-mono font-medium text-amber-600 dark:text-amber-400 uppercase">
              In Progress
            </CardTitle>
            <RiHourglassLine className="size-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono text-amber-600 dark:text-amber-400">
              {metrics.inProgressCount}
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">Currently tackling</p>
          </CardContent>
        </Card>

        <Card className={`shadow-xs ${metrics.overdueCount > 0 ? "border-destructive/30 bg-destructive/5" : ""}`}>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-mono font-medium text-muted-foreground uppercase">
              Overdue
            </CardTitle>
            <RiAlarmWarningLine className={`size-4 ${metrics.overdueCount > 0 ? "text-destructive" : "text-muted-foreground"}`} />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold font-mono ${metrics.overdueCount > 0 ? "text-destructive" : ""}`}>
              {metrics.overdueCount}
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">Past due date</p>
          </CardContent>
        </Card>

        <Card className="shadow-xs border-emerald-500/30 bg-emerald-500/5">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-mono font-medium text-emerald-600 dark:text-emerald-400 uppercase">
              Done
            </CardTitle>
            <RiCheckDoubleLine className="size-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400">
              {metrics.completedCount}
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">Approved by PM</p>
          </CardContent>
        </Card>
      </div>

      {/* Assigned Tasks List */}
      <Card className="shadow-xs">
        <CardHeader>
          <CardTitle className="text-base font-semibold">Assigned Tasks ({tasks.length})</CardTitle>
          <CardDescription className="text-xs">
            Tasks assigned to your account, prioritized by urgency and due date
          </CardDescription>
        </CardHeader>
        <CardContent>
          {tasks.length === 0 ? (
            <div className="py-12 text-center text-xs text-muted-foreground">
              You currently have no tasks assigned. Great job!
            </div>
          ) : (
            <div className="divide-y divide-border/40">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between py-4 gap-3 transition-colors hover:bg-muted/30 px-2 rounded-lg"
                >
                  <div className="space-y-1.5 flex-1 pr-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-semibold text-foreground">
                        {task.title}
                      </span>
                      <Badge variant={getPriorityBadgeVariant(task.priority)} className="text-[9px]">
                        {task.priority}
                      </Badge>
                      {getStatusBadge(task.status)}
                      {task.isOverdue && (
                        <Badge variant="destructive" className="text-[9px]">
                          OVERDUE
                        </Badge>
                      )}
                    </div>
                    {task.description && (
                      <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                        {task.description}
                      </p>
                    )}
                    <div className="flex items-center gap-4 text-[11px] text-muted-foreground font-mono pt-0.5">
                      <span className="flex items-center gap-1">
                        <RiFolderLine className="size-3 text-primary" />
                        {task.project.name}
                      </span>
                      <span className="flex items-center gap-1">
                        <RiTimeLine className="size-3" />
                        Due: {new Date(task.dueDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {/* RBAC Action Controls */}
                  <div className="flex items-center gap-2 shrink-0">
                    {task.status === "TODO" && (
                      <Button
                        size="sm"
                        onClick={() => handleStatusTransition(task.id, "TODO")}
                        disabled={isUpdating}
                        className="text-xs gap-1 h-8"
                      >
                        <RiPlayCircleLine className="size-3.5" />
                        Start Working
                      </Button>
                    )}

                    {task.status === "IN_PROGRESS" && (
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => handleStatusTransition(task.id, "IN_PROGRESS")}
                        disabled={isUpdating}
                        className="text-xs gap-1 h-8"
                      >
                        <RiSendPlaneLine className="size-3.5" />
                        Submit for Review
                      </Button>
                    )}

                    {task.status === "IN_REVIEW" && (
                      <div className="inline-flex items-center gap-1.5 rounded border border-indigo-500/30 bg-indigo-500/5 px-2.5 py-1 text-[11px] text-indigo-600 dark:text-indigo-400 font-mono">
                        <RiHourglassLine className="size-3 animate-spin" />
                        <span>Awaiting PM Approval</span>
                      </div>
                    )}

                    {task.status === "DONE" && (
                      <div className="inline-flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-mono">
                        <RiCheckboxCircleLine className="size-4" />
                        <span>Approved &amp; Done</span>
                      </div>
                    )}
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
