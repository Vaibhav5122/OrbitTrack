"use client";

import React from "react";
import {
  RiPulseLine,
  RiExchangeLine,
  RiAddCircleLine,
  RiUserAddLine,
  RiAlarmWarningLine,
  RiFolderAddLine,
  RiFolderLine,
  RiTaskLine,
  RiCircleFill,
  RiRestartLine,
} from "@remixicon/react";
import { useActivityFeed } from "@/lib/hooks/useActivity";
import { useSocket } from "@/components/providers/socket-provider";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import type { ActivityItem } from "@/lib/api/activity";

interface ActivityFeedProps {
  limit?: number;
  compact?: boolean;
  className?: string;
  title?: string;
  description?: string;
}

export function ActivityFeed({
  limit = 20,
  compact = false,
  className = "",
  title = "Real-Time Activity Feed",
  description = "Live audit trail of task status shifts, assignments, and milestones.",
}: ActivityFeedProps) {
  const { data: activities = [], isLoading, isError, refetch } = useActivityFeed(limit);
  const { isConnected } = useSocket();

  const getActionBadge = (action: string) => {
    switch (action) {
      case "STATUS_UPDATED":
        return (
          <Badge
            variant="outline"
            className="gap-1 border-blue-500/30 bg-blue-500/10 text-blue-500 text-[10px] font-mono"
          >
            <RiExchangeLine className="size-3" />
            STATUS
          </Badge>
        );
      case "TASK_CREATED":
        return (
          <Badge
            variant="outline"
            className="gap-1 border-emerald-500/30 bg-emerald-500/10 text-emerald-500 text-[10px] font-mono"
          >
            <RiAddCircleLine className="size-3" />
            NEW TASK
          </Badge>
        );
      case "TASK_ASSIGNED":
        return (
          <Badge
            variant="outline"
            className="gap-1 border-amber-500/30 bg-amber-500/10 text-amber-500 text-[10px] font-mono"
          >
            <RiUserAddLine className="size-3" />
            ASSIGNED
          </Badge>
        );
      case "FLAGGED_OVERDUE":
        return (
          <Badge
            variant="destructive"
            className="gap-1 text-[10px] font-mono font-bold animate-pulse"
          >
            <RiAlarmWarningLine className="size-3" />
            OVERDUE
          </Badge>
        );
      case "PROJECT_CREATED":
        return (
          <Badge
            variant="outline"
            className="gap-1 border-violet-500/30 bg-violet-500/10 text-violet-500 text-[10px] font-mono"
          >
            <RiFolderAddLine className="size-3" />
            PROJECT
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="text-[10px] font-mono">
            {action}
          </Badge>
        );
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

  const formatRelativeTime = (isoString: string) => {
    try {
      const now = new Date();
      const past = new Date(isoString);
      const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);

      if (diffInSeconds < 15) return "just now";
      if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
      const diffInMinutes = Math.floor(diffInSeconds / 60);
      if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
      const diffInHours = Math.floor(diffInMinutes / 60);
      if (diffInHours < 24) return `${diffInHours}h ago`;
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays}d ago`;
    } catch {
      return "recently";
    }
  };

  return (
    <Card className={`border-border/60 shadow-sm ${className}`}>
      <CardHeader className="pb-3 border-b border-border/40">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <CardTitle className="font-heading text-base font-bold tracking-tight">
                {title}
              </CardTitle>
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] font-mono font-medium border ${
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
                {isConnected ? "LIVE STREAM" : "CONNECTING"}
              </span>
            </div>
            {!compact && (
              <CardDescription className="text-xs text-muted-foreground mt-0.5">
                {description}
              </CardDescription>
            )}
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => refetch()}
            className="h-8 px-2.5 text-xs text-muted-foreground hover:text-foreground self-start sm:self-auto gap-1"
            title="Refresh feed"
          >
            <RiRestartLine className="size-3.5" />
            <span className="hidden sm:inline font-mono text-[11px]">Sync DB</span>
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        {isLoading ? (
          <div className="p-4 space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-start gap-3">
                <Skeleton className="size-8 rounded-full" />
                <div className="flex-1 space-y-1.5">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : isError ? (
          <div className="p-6 text-center">
            <RiAlarmWarningLine className="size-8 text-destructive mx-auto mb-2" />
            <p className="text-xs text-muted-foreground">
              Unable to load live activity stream.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetch()}
              className="mt-3 text-xs"
            >
              Retry
            </Button>
          </div>
        ) : activities.length === 0 ? (
          <div className="p-8 text-center text-xs text-muted-foreground">
            <RiPulseLine className="size-8 text-muted-foreground/50 mx-auto mb-2" />
            <p className="font-medium text-foreground">No recent activity</p>
            <p className="text-[11px] mt-0.5">
              Task changes and project milestones will appear here in real-time.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-border/40 max-h-[480px] overflow-y-auto">
            {activities.map((item: ActivityItem) => (
              <div
                key={item.id}
                className="flex items-start gap-3 p-3.5 sm:px-4 transition-colors hover:bg-muted/40 animate-in fade-in-50 duration-200"
              >
                <Avatar className="size-8 mt-0.5 border border-border/80 shrink-0">
                  <AvatarFallback className="text-[11px] font-bold bg-primary/10 text-primary">
                    {getInitials(item.user?.name)}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex flex-wrap items-center gap-1.5">
                    {getActionBadge(item.action)}
                    <span className="text-xs font-semibold text-foreground truncate">
                      {item.user?.name || "System"}
                    </span>
                    <span className="text-[10px] font-mono text-muted-foreground ml-auto shrink-0">
                      {formatRelativeTime(item.createdAt)}
                    </span>
                  </div>

                  <p className="text-xs text-foreground/90 leading-snug">
                    {item.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-2 pt-0.5 text-[10px] font-mono text-muted-foreground">
                    {item.project && (
                      <span className="inline-flex items-center gap-1 bg-muted/60 px-1.5 py-0.5 rounded text-foreground/80">
                        <RiFolderLine className="size-3 text-primary" />
                        <span className="truncate max-w-[140px]">
                          {item.project.name}
                        </span>
                      </span>
                    )}

                    {item.task && (
                      <span className="inline-flex items-center gap-1 bg-muted/60 px-1.5 py-0.5 rounded text-foreground/80">
                        <RiTaskLine className="size-3 text-secondary-foreground" />
                        <span className="truncate max-w-[140px]">
                          {item.task.title}
                        </span>
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
