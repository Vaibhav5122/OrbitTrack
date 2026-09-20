"use client";

import React, { useState, useMemo, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  RiAddLine,
  RiFilter3Line,
  RiRestartLine,
  RiCalendarLine,
  RiUserLine,
  RiAlarmWarningLine,
  RiFolderLine,
  RiCheckDoubleLine,
  RiMore2Fill,
  RiDeleteBinLine,
  RiArrowRightLine,
} from "@remixicon/react";

import { useUser } from "@/lib/hooks/useAuth";
import { toast } from "sonner";
import {
  useTasks,
  useCreateTask,
  useChangeTaskStatus,
  useDeleteTask,
  useTeamMembers,
} from "@/lib/hooks/useTasks";
import { useProjects } from "@/lib/hooks/useProjects";
import type { Task, TaskStatus, TaskPriority } from "@/lib/api/tasks";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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

const COLUMNS: { id: TaskStatus; label: string; dotColor: string }[] = [
  { id: "TODO", label: "To Do", dotColor: "bg-muted-foreground/40" },
  { id: "IN_PROGRESS", label: "In Progress", dotColor: "bg-amber-500" },
  { id: "IN_REVIEW", label: "In Review", dotColor: "bg-indigo-500" },
  { id: "DONE", label: "Done", dotColor: "bg-emerald-500" },
];

function KanbanBoardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: user } = useUser();

  const selectedProjectId = searchParams.get("projectId") || "";
  const selectedPriority = (searchParams.get("priority") as TaskPriority) || "";
  const selectedStatus = (searchParams.get("status") as TaskStatus) || "";
  const selectedDateRange = searchParams.get("dueDateRange") || "";
  const isOverdueOnly = searchParams.get("isOverdue") === "true";

  const dueDateRangeFilter = useMemo(() => {
    if (selectedDateRange === "TODAY") {
      const endOfDay = new Date();
      endOfDay.setHours(23, 59, 59, 999);
      return { dueDateTo: endOfDay.toISOString() };
    }
    if (selectedDateRange === "THIS_WEEK") {
      const endOfWeek = new Date();
      endOfWeek.setDate(endOfWeek.getDate() + 7);
      return { dueDateTo: endOfWeek.toISOString() };
    }
    return {};
  }, [selectedDateRange]);

  const { data: tasks = [], isLoading, error } = useTasks({
    projectId: selectedProjectId || undefined,
    priority: selectedPriority || undefined,
    status: selectedStatus || undefined,
    isOverdue: isOverdueOnly ? true : undefined,
    ...dueDateRangeFilter,
  });

  const { data: projects = [] } = useProjects();
  const { data: teamMembers = [] } = useTeamMembers();
  const { mutate: changeStatus, isPending: isUpdatingStatus } = useChangeTaskStatus();
  const { mutate: removeTask } = useDeleteTask();
  const { mutate: createNewTask, isPending: isCreatingTask } = useCreateTask();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [taskProject, setTaskProject] = useState("");
  const [taskPriority, setTaskPriority] = useState<TaskPriority>("MEDIUM");
  const [taskDueDate, setTaskDueDate] = useState("");
  const [taskAssignee, setTaskAssignee] = useState("");

  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null);

  const isManagerOrAdmin = user?.role === "ADMIN" || user?.role === "PROJECT_MANAGER";

  const handleDropOnColumn = (targetStatus: TaskStatus) => {
    if (!draggedTaskId) return;
    const task = tasks.find((t) => t.id === draggedTaskId);
    if (!task) return;

    if (task.status === targetStatus) {
      setDraggedTaskId(null);
      setDragOverColumn(null);
      return;
    }

    if (user?.role === "DEVELOPER" && targetStatus === "DONE") {
      toast.error("Action Prohibited", {
        description: "Only Project Managers and Admins can approve tasks to Done.",
      });
      setDraggedTaskId(null);
      setDragOverColumn(null);
      return;
    }

    if (user?.role === "DEVELOPER" && task.assignedToId !== user.id) {
      toast.error("Action Prohibited", {
        description: "You can only update status on tasks assigned to you.",
      });
      setDraggedTaskId(null);
      setDragOverColumn(null);
      return;
    }

    changeStatus({ id: task.id, status: targetStatus });
    setDraggedTaskId(null);
    setDragOverColumn(null);
  };

  const updateFilters = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`/dashboard/tasks?${params.toString()}`);
  };

  const handleResetFilters = () => {
    router.push("/dashboard/tasks");
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskProject || !taskTitle || !taskDueDate) return;

    createNewTask(
      {
        projectId: taskProject,
        payload: {
          title: taskTitle,
          description: taskDescription || undefined,
          priority: taskPriority,
          dueDate: new Date(taskDueDate).toISOString(),
          assignedToId: taskAssignee && taskAssignee !== "unassigned" ? taskAssignee : undefined,
        },
      },
      {
        onSuccess: () => {
          setIsCreateOpen(false);
          setTaskTitle("");
          setTaskDescription("");
          setTaskProject("");
          setTaskDueDate("");
          setTaskAssignee("");
        },
      }
    );
  };

  const tasksByColumn = useMemo(() => {
    const grouped: Record<TaskStatus, Task[]> = {
      TODO: [],
      IN_PROGRESS: [],
      IN_REVIEW: [],
      DONE: [],
    };
    tasks.forEach((t) => {
      if (grouped[t.status]) {
        grouped[t.status].push(t);
      }
    });
    return grouped;
  }, [tasks]);

  const getPriorityBadge = (priority: TaskPriority) => {
    switch (priority) {
      case "CRITICAL":
        return <Badge variant="destructive" className="text-[10px] px-1.5 py-0 font-mono">CRITICAL</Badge>;
      case "HIGH":
        return <Badge className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30 text-[10px] px-1.5 py-0 font-mono">HIGH</Badge>;
      case "MEDIUM":
        return <Badge variant="secondary" className="text-[10px] px-1.5 py-0 font-mono">MEDIUM</Badge>;
      case "LOW":
      default:
        return <Badge variant="outline" className="text-[10px] px-1.5 py-0 font-mono">LOW</Badge>;
    }
  };

  const getInitials = (name?: string) => {
    if (!name) return "??";
    return name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-heading text-2xl font-bold tracking-tight">Interactive Kanban Board</h1>
            <Badge variant="outline" className="text-[10px] font-mono">
              Live Real-Time
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Drag, prioritize, and progress project tasks with role-based validation.
          </p>
        </div>

        {isManagerOrAdmin && (
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button className="h-9 px-4 text-xs font-medium gap-1.5 shadow-xs shadow-primary/20">
                <RiAddLine className="size-4" />
                New Task
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Create New Project Task</DialogTitle>
                <DialogDescription className="text-xs">
                  Add a deliverable item to a project. Team members will be alerted automatically.
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleCreateSubmit} className="space-y-4 py-2">
                <div className="space-y-1.5">
                  <Label htmlFor="project" className="text-xs font-medium">
                    Project *
                  </Label>
                  <Select value={taskProject} onValueChange={setTaskProject} required>
                    <SelectTrigger id="project" className="h-9 text-xs">
                      <SelectValue placeholder="Select target project" />
                    </SelectTrigger>
                    <SelectContent>
                      {projects.map((p) => (
                        <SelectItem key={p.id} value={p.id} className="text-xs">
                          {p.name} ({p.client.name})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="title" className="text-xs font-medium">
                    Task Title *
                  </Label>
                  <Input
                    id="title"
                    value={taskTitle}
                    onChange={(e) => setTaskTitle(e.target.value)}
                    placeholder="e.g. Implement OAuth2 Client Credentials"
                    className="h-9 text-xs"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="description" className="text-xs font-medium">
                    Description
                  </Label>
                  <Input
                    id="description"
                    value={taskDescription}
                    onChange={(e) => setTaskDescription(e.target.value)}
                    placeholder="Provide acceptance criteria..."
                    className="h-9 text-xs"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="priority" className="text-xs font-medium">
                      Priority
                    </Label>
                    <Select
                      value={taskPriority}
                      onValueChange={(val) => setTaskPriority(val as TaskPriority)}
                    >
                      <SelectTrigger id="priority" className="h-9 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="LOW" className="text-xs">LOW</SelectItem>
                        <SelectItem value="MEDIUM" className="text-xs">MEDIUM</SelectItem>
                        <SelectItem value="HIGH" className="text-xs">HIGH</SelectItem>
                        <SelectItem value="CRITICAL" className="text-xs text-destructive font-semibold">CRITICAL</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="dueDate" className="text-xs font-medium">
                      Due Date *
                    </Label>
                    <Input
                      id="dueDate"
                      type="date"
                      value={taskDueDate}
                      onChange={(e) => setTaskDueDate(e.target.value)}
                      className="h-9 text-xs"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="assignee" className="text-xs font-medium">
                    Assign To
                  </Label>
                  <Select value={taskAssignee} onValueChange={setTaskAssignee}>
                    <SelectTrigger id="assignee" className="h-9 text-xs">
                      <SelectValue placeholder="Unassigned" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="unassigned" className="text-xs">
                        Unassigned
                      </SelectItem>
                      {teamMembers.map((m) => (
                        <SelectItem key={m.id} value={m.id} className="text-xs">
                          {m.name} ({m.role})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <DialogFooter className="pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsCreateOpen(false)}
                    className="h-9 text-xs"
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isCreatingTask} className="h-9 text-xs">
                    {isCreatingTask ? "Creating..." : "Create Task"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-2.5 rounded-xl border border-border/60 bg-card p-3 shadow-2xs">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground mr-1">
          <RiFilter3Line className="size-4 text-primary" />
          <span className="font-medium">Filters:</span>
        </div>

        <Select
          value={selectedProjectId || "ALL"}
          onValueChange={(val) => updateFilters("projectId", val === "ALL" ? null : val)}
        >
          <SelectTrigger className="h-8 w-44 text-xs font-mono">
            <SelectValue placeholder="All Projects" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL" className="text-xs font-mono">All Projects</SelectItem>
            {projects.map((p) => (
              <SelectItem key={p.id} value={p.id} className="text-xs">
                {p.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={selectedPriority || "ALL"}
          onValueChange={(val) => updateFilters("priority", val === "ALL" ? null : val)}
        >
          <SelectTrigger className="h-8 w-36 text-xs font-mono">
            <SelectValue placeholder="All Priorities" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL" className="text-xs font-mono">All Priorities</SelectItem>
            <SelectItem value="CRITICAL" className="text-xs text-destructive">CRITICAL</SelectItem>
            <SelectItem value="HIGH" className="text-xs text-amber-500">HIGH</SelectItem>
            <SelectItem value="MEDIUM" className="text-xs">MEDIUM</SelectItem>
            <SelectItem value="LOW" className="text-xs">LOW</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={selectedStatus || "ALL"}
          onValueChange={(val) => updateFilters("status", val === "ALL" ? null : val)}
        >
          <SelectTrigger className="h-8 w-36 text-xs font-mono">
            <SelectValue placeholder="All Statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL" className="text-xs font-mono">All Statuses</SelectItem>
            <SelectItem value="TODO" className="text-xs font-mono">To Do</SelectItem>
            <SelectItem value="IN_PROGRESS" className="text-xs font-mono">In Progress</SelectItem>
            <SelectItem value="IN_REVIEW" className="text-xs font-mono">In Review</SelectItem>
            <SelectItem value="DONE" className="text-xs font-mono">Done</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={selectedDateRange || "ALL"}
          onValueChange={(val) => updateFilters("dueDateRange", val === "ALL" ? null : val)}
        >
          <SelectTrigger className="h-8 w-36 text-xs font-mono">
            <SelectValue placeholder="Due Date" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL" className="text-xs font-mono">All Dates</SelectItem>
            <SelectItem value="TODAY" className="text-xs font-mono">Due Today</SelectItem>
            <SelectItem value="THIS_WEEK" className="text-xs font-mono">Due This Week</SelectItem>
          </SelectContent>
        </Select>

        <Button
          variant={isOverdueOnly ? "destructive" : "outline"}
          size="sm"
          onClick={() => updateFilters("isOverdue", isOverdueOnly ? null : "true")}
          className="h-8 text-xs font-mono gap-1"
        >
          <RiAlarmWarningLine className="size-3.5" />
          <span>Overdue Only</span>
        </Button>

        {(selectedProjectId || selectedPriority || selectedStatus || selectedDateRange || isOverdueOnly) && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleResetFilters}
            className="h-8 text-xs gap-1 text-muted-foreground hover:text-foreground"
          >
            <RiRestartLine className="size-3.5" />
            <span>Reset</span>
          </Button>
        )}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((col) => (
            <div key={col} className="space-y-3">
              <Skeleton className="h-8 w-full rounded-lg" />
              <Skeleton className="h-32 w-full rounded-xl" />
              <Skeleton className="h-32 w-full rounded-xl" />
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="py-12 text-center text-xs text-destructive">
          Failed to load tasks: {error.message}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-start">
          {COLUMNS.map((column) => {
            const columnTasks = tasksByColumn[column.id];
            return (
              <div
                key={column.id}
                onDragOver={(e) => {
                  e.preventDefault();
                  e.dataTransfer.dropEffect = "move";
                  if (dragOverColumn !== column.id) setDragOverColumn(column.id);
                }}
                onDragLeave={() => {
                  setDragOverColumn((prev) => (prev === column.id ? null : prev));
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  handleDropOnColumn(column.id);
                }}
                className={`flex flex-col rounded-xl border transition-all p-3 shadow-2xs ${
                  dragOverColumn === column.id
                    ? "border-primary/80 ring-2 ring-primary/40 bg-primary/5"
                    : "border-border/60 bg-secondary/30"
                }`}
              >
                <div className="flex items-center justify-between pb-3 border-b border-border/50">
                  <div className="flex items-center gap-2">
                    <span className={`size-2.5 rounded-full ${column.dotColor}`} />
                    <span className="font-heading text-xs font-bold tracking-tight text-foreground">
                      {column.label}
                    </span>
                  </div>
                  <Badge variant="secondary" className="text-[10px] font-mono px-1.5 py-0">
                    {columnTasks.length}
                  </Badge>
                </div>

                <div className="flex flex-col gap-2.5 pt-3 min-h-[350px]">
                  {columnTasks.length === 0 ? (
                    <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed border-border/60 p-4 text-center text-[11px] text-muted-foreground">
                      No tasks in {column.label}
                    </div>
                  ) : (
                    columnTasks.map((task) => (
                      <Card
                        key={task.id}
                        draggable
                        onDragStart={(e) => {
                          e.dataTransfer.setData("text/plain", task.id);
                          setDraggedTaskId(task.id);
                        }}
                        onDragEnd={() => {
                          setDraggedTaskId(null);
                          setDragOverColumn(null);
                        }}
                        className={`shadow-xs transition-all cursor-grab active:cursor-grabbing hover:border-primary/50 hover:shadow-sm ${
                          draggedTaskId === task.id
                            ? "opacity-40 scale-[0.98] border-dashed border-primary"
                            : ""
                        } ${
                          task.isOverdue ? "border-destructive/40 bg-destructive/5" : ""
                        }`}
                      >
                        <CardContent className="p-3 space-y-2.5">
                          <div className="flex items-center justify-between gap-1.5">
                            <span className="text-[10px] font-mono text-muted-foreground truncate max-w-[120px]">
                              {task.project.name}
                            </span>
                            <div className="flex items-center gap-1">
                              {task.isOverdue && (
                                <Badge variant="destructive" className="text-[9px] px-1 py-0">
                                  OVERDUE
                                </Badge>
                              )}
                              {getPriorityBadge(task.priority)}
                            </div>
                          </div>

                          <h3 className="text-xs font-semibold text-foreground leading-snug">
                            {task.title}
                          </h3>

                          {task.description && (
                            <p className="text-[11px] text-muted-foreground line-clamp-2 leading-relaxed">
                              {task.description}
                            </p>
                          )}

                          <div className="flex items-center justify-between border-t border-border/40 pt-2 text-[11px] text-muted-foreground">
                            <div className="flex items-center gap-1.5">
                              <Avatar className="size-5 border border-border/80">
                                <AvatarFallback className="text-[9px] font-bold bg-primary/10 text-primary">
                                  {getInitials(task.assignedTo?.name)}
                                </AvatarFallback>
                              </Avatar>
                              <span className="truncate max-w-[80px]">
                                {task.assignedTo?.name || "Unassigned"}
                              </span>
                            </div>

                            <div className="flex items-center gap-1.5">
                              <span className="text-[10px] font-mono">
                                {new Date(task.dueDate).toLocaleDateString([], {
                                  month: "short",
                                  day: "numeric",
                                })}
                              </span>

                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <button
                                    type="button"
                                    className="flex size-6 items-center justify-center rounded hover:bg-muted text-muted-foreground transition-colors cursor-pointer"
                                    aria-label="Move task status"
                                  >
                                    <RiMore2Fill className="size-3.5" />
                                  </button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-48 text-xs">
                                  <DropdownMenuLabel className="text-[10px] font-mono uppercase text-muted-foreground">
                                    Move Task To
                                  </DropdownMenuLabel>
                                  <DropdownMenuSeparator />

                                  {COLUMNS.map((c) => {
                                    const isCurrent = task.status === c.id;
                                    const isDevRestricted =
                                      user?.role === "DEVELOPER" && c.id === "DONE";

                                    return (
                                      <DropdownMenuItem
                                        key={c.id}
                                        disabled={isCurrent || isDevRestricted || isUpdatingStatus}
                                        onClick={() => changeStatus({ id: task.id, status: c.id })}
                                        className="cursor-pointer gap-2 py-1.5 text-xs"
                                      >
                                        <span className={`size-2 rounded-full ${c.dotColor}`} />
                                        <span>{c.label}</span>
                                        {isCurrent && (
                                          <span className="ml-auto text-[10px] text-muted-foreground">
                                            (Current)
                                          </span>
                                        )}
                                        {isDevRestricted && (
                                          <span className="ml-auto text-[9px] text-destructive">
                                            (PM Only)
                                          </span>
                                        )}
                                      </DropdownMenuItem>
                                    );
                                  })}

                                  {isManagerOrAdmin && (
                                    <>
                                      <DropdownMenuSeparator />
                                      <DropdownMenuItem
                                        onClick={() => removeTask(task.id)}
                                        className="text-destructive focus:text-destructive cursor-pointer gap-2 text-xs"
                                      >
                                        <RiDeleteBinLine className="size-3.5" />
                                        <span>Delete Task</span>
                                      </DropdownMenuItem>
                                    </>
                                  )}
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function KanbanBoardPage() {
  return (
    <Suspense
      fallback={
        <div className="space-y-4">
          <Skeleton className="h-10 w-64" />
          <div className="grid grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-96" />
            ))}
          </div>
        </div>
      }
    >
      <KanbanBoardContent />
    </Suspense>
  );
}
