"use client";

import React from "react";
import Link from "next/link";
import {
  RiFolderLine,
  RiFlagLine,
  RiTimeLine,
  RiArrowRightLine,
  RiAlarmWarningLine,
  RiUserLine,
  RiTaskLine,
  RiCheckDoubleLine,
} from "@remixicon/react";

import { usePmDashboard } from "@/lib/hooks/useDashboard";
import { ActivityFeed } from "@/components/activity-feed";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export default function PmDashboardPage() {
  const { data, isLoading, error, refetch } = usePmDashboard();

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
        <Skeleton className="h-72 rounded-xl" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center text-center p-4">
        <RiAlarmWarningLine className="size-10 text-destructive mb-3" />
        <h3 className="font-heading text-base font-semibold">Failed to load PM Workspace</h3>
        <p className="text-xs text-muted-foreground mt-1 max-w-sm">
          {error?.message || "Ensure you are logged in as a PROJECT_MANAGER."}
        </p>
        <Button onClick={() => refetch()} size="sm" className="mt-4 text-xs">
          Try Again
        </Button>
      </div>
    );
  }

  const { projectsSummary, tasksByPriority, upcomingDueDatesThisWeek } = data;
  const totalOwnedProjects = projectsSummary.length;

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-heading text-2xl font-bold tracking-tight">Project Manager Workspace</h1>
            <Badge variant="secondary" className="text-[10px] font-mono uppercase">
              Project Manager
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Deliver client milestones, approve developer submissions, and track upcoming deadlines.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/dashboard/tasks">
            <Button className="h-9 px-4 text-xs font-medium gap-1.5 shadow-xs shadow-primary/20">
              <RiTaskLine className="size-3.5" />
              Review Tasks & Kanban
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <Card className="shadow-xs border-destructive/30 bg-destructive/5">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-mono font-medium text-destructive uppercase">
              Critical Tasks
            </CardTitle>
            <RiFlagLine className="size-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono text-destructive">
              {tasksByPriority.CRITICAL}
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">Requires immediate review</p>
          </CardContent>
        </Card>

        <Card className="shadow-xs border-amber-500/30 bg-amber-500/5">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-mono font-medium text-amber-600 dark:text-amber-400 uppercase">
              High Priority
            </CardTitle>
            <RiFlagLine className="size-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono text-amber-600 dark:text-amber-400">
              {tasksByPriority.HIGH}
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">Milestone blockers</p>
          </CardContent>
        </Card>

        <Card className="shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-mono font-medium text-muted-foreground uppercase">
              Medium Priority
            </CardTitle>
            <RiFlagLine className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono">{tasksByPriority.MEDIUM}</div>
            <p className="text-[11px] text-muted-foreground mt-1">Normal sprint flow</p>
          </CardContent>
        </Card>

        <Card className="shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-mono font-medium text-muted-foreground uppercase">
              Low Priority
            </CardTitle>
            <RiFlagLine className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono">{tasksByPriority.LOW}</div>
            <p className="text-[11px] text-muted-foreground mt-1">Backlog items</p>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold tracking-tight">Owned Projects ({totalOwnedProjects})</h2>
            <p className="text-xs text-muted-foreground">
              Projects under your direct management and client relationship
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projectsSummary.map((project) => (
            <Card key={project.id} className="shadow-xs hover:border-primary/50 transition-colors">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <Badge variant="outline" className="text-[10px] font-mono text-muted-foreground">
                    {project.clientName}
                  </Badge>
                  {project.overdueTasks > 0 && (
                    <Badge variant="destructive" className="text-[10px] font-mono">
                      {project.overdueTasks} Overdue
                    </Badge>
                  )}
                </div>
                <CardTitle className="text-sm font-semibold pt-1 truncate">
                  {project.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Progress</span>
                    <span className="font-mono font-bold text-foreground">
                      {project.progressPercentage}%
                    </span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                    <div
                      className="h-full bg-primary transition-all duration-500 rounded-full"
                      style={{ width: `${project.progressPercentage}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-muted-foreground border-t border-border/40 pt-2">
                  <span>
                    <strong className="text-foreground">{project.completedTasks}</strong> /{" "}
                    {project.totalTasks} Tasks Done
                  </span>
                  <Link
                    href={`/dashboard/tasks?projectId=${project.id}`}
                    className="text-primary hover:underline inline-flex items-center gap-1 text-[11px]"
                  >
                    View Tasks
                    <RiArrowRightLine className="size-3" />
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Card className="shadow-xs">
        <CardHeader>
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <RiTimeLine className="size-4 text-primary" />
            <span>Upcoming Deadlines This Week</span>
          </CardTitle>
          <CardDescription className="text-xs">
            Tasks with due dates in the next 7 days across your projects
          </CardDescription>
        </CardHeader>
        <CardContent>
          {upcomingDueDatesThisWeek.length === 0 ? (
            <div className="py-8 text-center text-xs text-muted-foreground">
              No tasks due in the upcoming 7 days. Everything is on schedule!
            </div>
          ) : (
            <div className="divide-y divide-border/40">
              {upcomingDueDatesThisWeek.map((task) => (
                <div key={task.id} className="flex flex-col sm:flex-row sm:items-center justify-between py-3 gap-2">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-foreground">{task.title}</span>
                      <Badge
                        variant={
                          task.priority === "CRITICAL"
                            ? "destructive"
                            : task.priority === "HIGH"
                            ? "default"
                            : "outline"
                        }
                        className="text-[9px]"
                      >
                        {task.priority}
                      </Badge>
                      {task.isOverdue && (
                        <Badge variant="destructive" className="text-[9px]">
                          OVERDUE
                        </Badge>
                      )}
                    </div>
                    <p className="text-[11px] text-muted-foreground">
                      Project: {task.project.name}
                    </p>
                  </div>

                  <div className="flex items-center gap-4 text-xs">
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <RiUserLine className="size-3.5" />
                      <span>{task.assignedTo?.name || "Unassigned"}</span>
                    </div>
                    <div className="font-mono text-muted-foreground text-[11px]">
                      Due: {new Date(task.dueDate).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <ActivityFeed
        limit={12}
        title="Project Team Activity Feed"
        description="Real-time events from tasks and team member actions across your owned projects."
      />
    </div>
  );
}
