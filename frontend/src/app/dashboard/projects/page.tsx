"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  RiFolderLine,
  RiAddLine,
  RiUserLine,
  RiTaskLine,
  RiArrowRightLine,
  RiBuildingLine,
  RiCalendarLine,
  RiAlarmWarningLine,
} from "@remixicon/react";

import { useUser } from "@/lib/hooks/useAuth";
import { useProjects, useCreateProject, useClients } from "@/lib/hooks/useProjects";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProjectsPage() {
  const { data: user } = useUser();
  const { data: projects = [], isLoading, error, refetch } = useProjects();
  const { data: clients = [] } = useClients();
  const { mutate: createNewProject, isPending: isCreating } = useCreateProject();

  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [clientId, setClientId] = useState("");

  const isManagerOrAdmin = user?.role === "ADMIN" || user?.role === "PROJECT_MANAGER";

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !clientId) return;

    createNewProject(
      {
        name,
        description: description || undefined,
        clientId,
      },
      {
        onSuccess: () => {
          setIsOpen(false);
          setName("");
          setDescription("");
          setClientId("");
        },
      }
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-heading text-2xl font-bold tracking-tight">Client Projects</h1>
            <Badge variant="outline" className="text-[10px] font-mono">
              {projects.length} Total
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {user?.role === "DEVELOPER"
              ? "Projects containing tasks assigned to your account."
              : "Enterprise client project tracks with deliverable metrics."}
          </p>
        </div>

        {isManagerOrAdmin && (
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button className="h-9 px-4 text-xs font-medium gap-1.5 shadow-xs shadow-primary/20">
                <RiAddLine className="size-4" />
                New Project
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Create New Project</DialogTitle>
                <DialogDescription className="text-xs">
                  Associate a project track with a registered client and initiate task planning.
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleCreateSubmit} className="space-y-4 py-2">
                <div className="space-y-1.5">
                  <Label htmlFor="client" className="text-xs font-medium">
                    Client *
                  </Label>
                  <Select value={clientId} onValueChange={setClientId} required>
                    <SelectTrigger id="client" className="h-9 text-xs">
                      <SelectValue placeholder="Select client company" />
                    </SelectTrigger>
                    <SelectContent>
                      {clients.map((c) => (
                        <SelectItem key={c.id} value={c.id} className="text-xs">
                          {c.name} {c.company ? `(${c.company})` : ""}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="projName" className="text-xs font-medium">
                    Project Name *
                  </Label>
                  <Input
                    id="projName"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. FinTech Ledger Modernization"
                    className="h-9 text-xs"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="projDesc" className="text-xs font-medium">
                    Description
                  </Label>
                  <Input
                    id="projDesc"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Brief scope of work..."
                    className="h-9 text-xs"
                  />
                </div>

                <DialogFooter className="pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsOpen(false)}
                    className="h-9 text-xs"
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isCreating} className="h-9 text-xs">
                    {isCreating ? "Creating..." : "Create Project"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-48 rounded-xl" />
          ))}
        </div>
      ) : error ? (
        <div className="flex min-h-[40vh] flex-col items-center justify-center text-center p-4">
          <RiAlarmWarningLine className="size-10 text-destructive mb-3" />
          <h3 className="font-heading text-base font-semibold">Failed to load projects</h3>
          <p className="text-xs text-muted-foreground mt-1 max-w-sm">{error.message}</p>
          <Button onClick={() => refetch()} size="sm" className="mt-4 text-xs">
            Retry
          </Button>
        </div>
      ) : projects.length === 0 ? (
        <div className="py-16 text-center text-xs text-muted-foreground border border-dashed border-border/70 rounded-xl">
          No projects available in your workspace.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((project) => (
            <Card
              key={project.id}
              className="shadow-xs hover:border-primary/50 transition-all flex flex-col justify-between"
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <Badge variant="outline" className="text-[10px] font-mono text-muted-foreground">
                    <RiBuildingLine className="mr-1 size-3" />
                    {project.client.name}
                  </Badge>
                  <Badge variant="secondary" className="text-[10px] font-mono">
                    {project._count?.tasks ?? 0} Tasks
                  </Badge>
                </div>
                <CardTitle className="text-base font-semibold pt-1">
                  {project.name}
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-4">
                {project.description && (
                  <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                    {project.description}
                  </p>
                )}

                <div className="flex flex-col gap-1.5 text-xs text-muted-foreground border-t border-border/40 pt-3">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <RiUserLine className="size-3.5 text-primary" />
                      <span>PM: {project.owner.name}</span>
                    </span>
                    <span className="text-[11px] font-mono">
                      {new Date(project.createdAt).toLocaleDateString([], {
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                </div>

                <div className="pt-1 flex items-center gap-2">
                  <Link href={`/dashboard/projects/${project.id}`} className="flex-1">
                    <Button variant="outline" className="w-full h-9 text-xs gap-1 font-medium">
                      <span>Details</span>
                      <RiArrowRightLine className="size-3.5" />
                    </Button>
                  </Link>
                  <Link href={`/dashboard/tasks?projectId=${project.id}`} className="flex-1">
                    <Button className="w-full h-9 text-xs gap-1 font-medium">
                      <span>Kanban</span>
                      <RiTaskLine className="size-3.5" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
