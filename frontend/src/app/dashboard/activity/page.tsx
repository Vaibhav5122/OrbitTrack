"use client";

import React from "react";
import {
  RiHistoryLine,
  RiRadarLine,
  RiShieldCheckLine,
  RiInformationLine,
} from "@remixicon/react";
import { useUser } from "@/lib/hooks/useAuth";
import { ActivityFeed } from "@/components/activity-feed";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function ActivityPage() {
  const { data: user } = useUser();

  const getRoleScopeDescription = (role?: string) => {
    switch (role) {
      case "ADMIN":
        return {
          title: "Global Platform Scope",
          description:
            "As an Administrator, you are viewing the unfiltered global stream across all agency projects, team members, and automated cron background checks.",
          badge: "Global Visibility",
        };
      case "PROJECT_MANAGER":
        return {
          title: "Project Scope",
          description:
            "As a Project Manager, you are viewing all activity, task status shifts, and member updates across projects you own.",
          badge: "Managed Projects",
        };
      case "DEVELOPER":
        return {
          title: "Assigned Tasks Scope",
          description:
            "As a Developer, your feed is focused strictly on activity, status changes, and notifications relating to tasks assigned to you.",
          badge: "Assigned Stream",
        };
      default:
        return {
          title: "Workspace Activity",
          description: "Live real-time activity stream for your workspace.",
          badge: "Scoped",
        };
    }
  };

  const scope = getRoleScopeDescription(user?.role);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-heading text-2xl font-bold tracking-tight">
              Activity Audit Feed
            </h1>
            <Badge className="bg-primary/10 text-primary border-primary/20 text-[10px] font-mono uppercase">
              {scope.badge}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Real-time WebSocket event stream with 20-event database offline catch-up.
          </p>
        </div>
      </div>

      {/* Scope Info Card */}
      <Card className="border-border/60 bg-card/40">
        <CardContent className="p-4 flex items-start gap-3">
          <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary shrink-0">
            <RiInformationLine className="size-4" />
          </div>
          <div className="space-y-0.5 text-xs">
            <span className="font-semibold text-foreground">
              {scope.title}
            </span>
            <p className="text-muted-foreground leading-relaxed">
              {scope.description}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Full Activity Feed Component */}
      <ActivityFeed
        limit={50}
        title="Live Real-Time Activity Feed"
        description="Streaming live via Socket.io rooms with automatic database synchronization upon reconnect."
      />
    </div>
  );
}
