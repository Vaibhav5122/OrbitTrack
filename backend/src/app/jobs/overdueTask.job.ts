import cron, { type ScheduledTask } from "node-cron";
import { TaskStatus } from "@prisma/client";
import { prisma } from "../../lib/prisma.js";
import { broadcastActivityLog } from "../../lib/socket.js";

export async function runOverdueTaskCheck(): Promise<number> {
  const now = new Date();

  const overdueTasks = await prisma.task.findMany({
    where: {
      status: { not: TaskStatus.DONE },
      dueDate: { lt: now },
      isOverdue: false,
    },
    include: {
      project: {
        select: { id: true, name: true, ownerId: true },
      },
    },
  });

  if (overdueTasks.length === 0) {
    return 0;
  }

  for (const task of overdueTasks) {
    const description = `Task '${task.title}' was automatically flagged as Overdue by system scheduler`;

    const [, activityLog] = await prisma.$transaction([
      prisma.task.update({
        where: { id: task.id },
        data: { isOverdue: true },
      }),
      prisma.activityLog.create({
        data: {
          projectId: task.projectId,
          taskId: task.id,
          userId: task.project.ownerId,
          action: "TASK_OVERDUE",
          description,
          metadata: {
            dueDate: task.dueDate.toISOString(),
            status: task.status,
          },
        },
        include: {
          user: { select: { id: true, name: true, email: true } },
          project: { select: { id: true, name: true } },
          task: { select: { id: true, title: true } },
        },
      }),
    ]);

    broadcastActivityLog(
      {
        id: activityLog.id,
        projectId: task.projectId,
        projectName: task.project.name,
        taskId: task.id,
        taskTitle: task.title,
        userId: activityLog.userId,
        userName: activityLog.user.name,
        userEmail: activityLog.user.email,
        action: activityLog.action,
        description: activityLog.description,
        metadata: activityLog.metadata,
        createdAt: activityLog.createdAt.toISOString(),
      },
      task.project.ownerId,
      task.assignedToId
    );
  }

  return overdueTasks.length;
}

export function startOverdueTaskJob(): ScheduledTask {
  const scheduledTask = cron.schedule("* * * * *", async () => {
    try {
      await runOverdueTaskCheck();
    } catch (error) {
      console.error("[OverdueTaskJob] Error running scheduler:", error);
    }
  });

  return scheduledTask;
}
