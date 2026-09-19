import cron, { type ScheduledTask } from "node-cron";
import { TaskStatus } from "@prisma/client";
import { prisma } from "../../lib/prisma.js";

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
    await prisma.$transaction(async (tx) => {
      await tx.task.update({
        where: { id: task.id },
        data: { isOverdue: true },
      });

      await tx.activityLog.create({
        data: {
          projectId: task.projectId,
          taskId: task.id,
          userId: task.project.ownerId,
          action: "TASK_OVERDUE",
          description: `Task '${task.title}' was automatically flagged as Overdue by system scheduler`,
          metadata: {
            dueDate: task.dueDate.toISOString(),
            status: task.status,
          },
        },
      });
    });
  }

  console.log(
    `[OverdueTaskJob] Flagged ${overdueTasks.length} task(s) as Overdue.`,
  );

  return overdueTasks.length;
}

export function startOverdueTaskJob(): ScheduledTask {
  // Run once every minute: "* * * * *"
  const scheduledTask = cron.schedule("* * * * *", async () => {
    try {
      await runOverdueTaskCheck();
    } catch (error) {
      console.error("[OverdueTaskJob] Error running scheduler:", error);
    }
  });

  console.log("[OverdueTaskJob] Overdue task background scheduler initialized.");
  return scheduledTask;
}
