import "dotenv/config";
import { Role, TaskPriority, TaskStatus } from "@prisma/client";
import { prisma } from "../lib/prisma.js";
import { hashPassword } from "../app/utils/password.util.js";

async function seed() {
  console.log("Starting OrbitTrack database seeding...");

  await prisma.notification.deleteMany();
  await prisma.activityLog.deleteMany();
  await prisma.task.deleteMany();
  await prisma.project.deleteMany();
  await prisma.client.deleteMany();
  await prisma.refreshToken.deleteMany();
  await prisma.user.deleteMany();

  const defaultPasswordHash = await hashPassword("Password123!");

  const admin = await prisma.user.create({
    data: {
      name: "Vaibhav Waghmode",
      email: "vaibhav.admin@orbittrack.com",
      password: defaultPasswordHash,
      role: Role.ADMIN,
    },
  });

  const pm1 = await prisma.user.create({
    data: {
      name: "Siddhesh Kadam",
      email: "siddhesh.pm@orbittrack.com",
      password: defaultPasswordHash,
      role: Role.PROJECT_MANAGER,
    },
  });

  const pm2 = await prisma.user.create({
    data: {
      name: "Tanmay Patil",
      email: "tanmay.pm@orbittrack.com",
      password: defaultPasswordHash,
      role: Role.PROJECT_MANAGER,
    },
  });

  const dev1 = await prisma.user.create({
    data: {
      name: "Omkar Shinde",
      email: "omkar.dev@orbittrack.com",
      password: defaultPasswordHash,
      role: Role.DEVELOPER,
    },
  });

  const dev2 = await prisma.user.create({
    data: {
      name: "Pranav Deshmukh",
      email: "pranav.dev@orbittrack.com",
      password: defaultPasswordHash,
      role: Role.DEVELOPER,
    },
  });

  const dev3 = await prisma.user.create({
    data: {
      name: "Aditya Jadhav",
      email: "aditya.dev@orbittrack.com",
      password: defaultPasswordHash,
      role: Role.DEVELOPER,
    },
  });

  const dev4 = await prisma.user.create({
    data: {
      name: "Rohan More",
      email: "rohan.dev@orbittrack.com",
      password: defaultPasswordHash,
      role: Role.DEVELOPER,
    },
  });

  const client1 = await prisma.client.create({
    data: {
      name: "Sahyadri Infotech Systems",
      email: "contact@sahyadri-infotech.com",
      company: "Sahyadri Group Maharashtra",
    },
  });

  const client2 = await prisma.client.create({
    data: {
      name: "Mumbai FinTech Ventures",
      email: "support@mumbaifintech.in",
      company: "Mumbai FinTech Labs",
    },
  });

  const project1 = await prisma.project.create({
    data: {
      name: "Sahyadri Unified Client Portal",
      description: "Modern enterprise client onboarding & tracking portal for Maharashtra public-private partnerships.",
      clientId: client1.id,
      ownerId: pm1.id,
    },
  });

  const project2 = await prisma.project.create({
    data: {
      name: "FinTech Microservices Architecture",
      description: "High-throughput banking transaction reconciliation and audit streaming microservices.",
      clientId: client2.id,
      ownerId: pm1.id,
    },
  });

  const project3 = await prisma.project.create({
    data: {
      name: "Pune Logistics & Fleet Dispatcher",
      description: "Real-time telemetry monitoring and fleet dispatch route optimization dashboard.",
      clientId: client1.id,
      ownerId: pm2.id,
    },
  });

  const now = new Date();
  const past5Days = new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000);
  const past3Days = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);
  const future2Days = new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000);
  const future4Days = new Date(now.getTime() + 4 * 24 * 60 * 60 * 1000);
  const future7Days = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  const future14Days = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000);

  const t1_1 = await prisma.task.create({
    data: {
      title: "OAuth2 & Role-Based Auth Flow",
      description: "Implement dual-token auth with HttpOnly cookie rotation and role guards.",
      status: TaskStatus.DONE,
      priority: TaskPriority.CRITICAL,
      dueDate: past5Days,
      isOverdue: false,
      projectId: project1.id,
      assignedToId: dev1.id,
    },
  });

  const t1_2 = await prisma.task.create({
    data: {
      title: "Database Index Optimization & Query Profiling",
      description: "Tune PostgreSQL btree indexes on activity logs and task relations.",
      status: TaskStatus.IN_PROGRESS,
      priority: TaskPriority.HIGH,
      dueDate: past3Days,
      isOverdue: true,
      projectId: project1.id,
      assignedToId: dev2.id,
    },
  });

  const t1_3 = await prisma.task.create({
    data: {
      title: "WebSocket Live Activity Feed Component",
      description: "Connect frontend client to Socket.io room multiplexer with catch-up logic.",
      status: TaskStatus.IN_REVIEW,
      priority: TaskPriority.HIGH,
      dueDate: future2Days,
      isOverdue: false,
      projectId: project1.id,
      assignedToId: dev1.id,
    },
  });

  const t1_4 = await prisma.task.create({
    data: {
      title: "Interactive Kanban Drag-and-Drop Board",
      description: "Build drag-and-drop task status switcher with optimistic UI updates.",
      status: TaskStatus.IN_PROGRESS,
      priority: TaskPriority.MEDIUM,
      dueDate: future4Days,
      isOverdue: false,
      projectId: project1.id,
      assignedToId: dev3.id,
    },
  });

  const t1_5 = await prisma.task.create({
    data: {
      title: "Export Project Audit Report to PDF",
      description: "Generate structured compliance PDF summaries for client stakeholders.",
      status: TaskStatus.TODO,
      priority: TaskPriority.LOW,
      dueDate: future7Days,
      isOverdue: false,
      projectId: project1.id,
      assignedToId: dev4.id,
    },
  });

  const t1_6 = await prisma.task.create({
    data: {
      title: "Dark Mode UI Theme Polishing",
      description: "Refine high-contrast slate color tokens and accessible focus indicators.",
      status: TaskStatus.TODO,
      priority: TaskPriority.LOW,
      dueDate: future14Days,
      isOverdue: false,
      projectId: project1.id,
      assignedToId: dev3.id,
    },
  });

  const t2_1 = await prisma.task.create({
    data: {
      title: "Third-Party KYC Webhook Reconciliation",
      description: "Ingest and verify partner webhooks with cryptographic HMAC signatures.",
      status: TaskStatus.TODO,
      priority: TaskPriority.CRITICAL,
      dueDate: past5Days,
      isOverdue: true,
      projectId: project2.id,
      assignedToId: dev2.id,
    },
  });

  const t2_2 = await prisma.task.create({
    data: {
      title: "Transaction Ledger Event Sourcing Engine",
      description: "Build append-only ledger transaction streaming over Apache Kafka / Redis.",
      status: TaskStatus.IN_PROGRESS,
      priority: TaskPriority.CRITICAL,
      dueDate: future2Days,
      isOverdue: false,
      projectId: project2.id,
      assignedToId: dev1.id,
    },
  });

  const t2_3 = await prisma.task.create({
    data: {
      title: "Automated Fraud Detection Anomaly Heuristics",
      description: "Flag transactions exceeding velocity thresholds across geo-distributed nodes.",
      status: TaskStatus.IN_REVIEW,
      priority: TaskPriority.HIGH,
      dueDate: future4Days,
      isOverdue: false,
      projectId: project2.id,
      assignedToId: dev4.id,
    },
  });

  const t2_4 = await prisma.task.create({
    data: {
      title: "Microservice Health Check & Circuit Breaker",
      description: "Implement Resilient4j-style circuit breaker with fallback routing.",
      status: TaskStatus.DONE,
      priority: TaskPriority.MEDIUM,
      dueDate: past3Days,
      isOverdue: false,
      projectId: project2.id,
      assignedToId: dev2.id,
    },
  });

  const t2_5 = await prisma.task.create({
    data: {
      title: "OpenAPI 3.1 Swagger Specification Documentation",
      description: "Document all exposed banking gateway endpoints with sample payloads.",
      status: TaskStatus.TODO,
      priority: TaskPriority.LOW,
      dueDate: future7Days,
      isOverdue: false,
      projectId: project2.id,
      assignedToId: dev4.id,
    },
  });

  const t3_1 = await prisma.task.create({
    data: {
      title: "GPS Telemetry Stream Parsing Service",
      description: "Consume high-velocity MQTT telemetry feeds from transit trucks in Pune.",
      status: TaskStatus.IN_PROGRESS,
      priority: TaskPriority.HIGH,
      dueDate: future2Days,
      isOverdue: false,
      projectId: project3.id,
      assignedToId: dev3.id,
    },
  });

  const t3_2 = await prisma.task.create({
    data: {
      title: "Geofencing Boundary Crossing Alerts",
      description: "Trigger real-time notification alerts whenever a vehicle exits geofenced corridor.",
      status: TaskStatus.IN_REVIEW,
      priority: TaskPriority.HIGH,
      dueDate: future4Days,
      isOverdue: false,
      projectId: project3.id,
      assignedToId: dev4.id,
    },
  });

  const t3_3 = await prisma.task.create({
    data: {
      title: "Driver Schedule Route Optimization Algorithm",
      description: "Minimize total delivery transit time and fuel consumption using Dijkstra variants.",
      status: TaskStatus.TODO,
      priority: TaskPriority.MEDIUM,
      dueDate: future7Days,
      isOverdue: false,
      projectId: project3.id,
      assignedToId: dev1.id,
    },
  });

  const t3_4 = await prisma.task.create({
    data: {
      title: "Offline Sync Engine for Field Tablets",
      description: "Enable drivers to store signatures offline and sync via SQLite upon network reconnect.",
      status: TaskStatus.TODO,
      priority: TaskPriority.MEDIUM,
      dueDate: future14Days,
      isOverdue: false,
      projectId: project3.id,
      assignedToId: dev2.id,
    },
  });

  const t3_5 = await prisma.task.create({
    data: {
      title: "Maintenance Scheduling Cron Service",
      description: "Compute engine odometer intervals and schedule preventive vehicle servicing.",
      status: TaskStatus.DONE,
      priority: TaskPriority.LOW,
      dueDate: past5Days,
      isOverdue: false,
      projectId: project3.id,
      assignedToId: dev3.id,
    },
  });

  await prisma.activityLog.createMany({
    data: [
      {
        projectId: project1.id,
        taskId: t1_1.id,
        userId: admin.id,
        action: "PROJECT_CREATED",
        description: "Vaibhav Waghmode created project 'Sahyadri Unified Client Portal'",
        createdAt: new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000),
      },
      {
        projectId: project1.id,
        taskId: t1_1.id,
        userId: pm1.id,
        action: "TASK_CREATED",
        description: "Siddhesh Kadam created Task 'OAuth2 & Role-Based Auth Flow'",
        metadata: { priority: "CRITICAL", status: "TODO" },
        createdAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000),
      },
      {
        projectId: project1.id,
        taskId: t1_1.id,
        userId: dev1.id,
        action: "STATUS_UPDATED",
        description: "Omkar Shinde moved Task 'OAuth2 & Role-Based Auth Flow' from In Progress → Done",
        metadata: { fromStatus: "IN_PROGRESS", toStatus: "DONE" },
        createdAt: new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000),
      },
      {
        projectId: project1.id,
        taskId: t1_2.id,
        userId: admin.id,
        action: "TASK_OVERDUE",
        description: "Task 'Database Index Optimization & Query Profiling' was automatically flagged as Overdue by system scheduler",
        metadata: { dueDate: past3Days.toISOString(), status: "IN_PROGRESS" },
        createdAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000),
      },
      {
        projectId: project1.id,
        taskId: t1_3.id,
        userId: dev1.id,
        action: "STATUS_UPDATED",
        description: "Omkar Shinde moved Task 'WebSocket Live Activity Feed Component' from In Progress → In Review",
        metadata: { fromStatus: "IN_PROGRESS", toStatus: "IN_REVIEW" },
        createdAt: new Date(now.getTime() - 2 * 60 * 60 * 1000),
      },
      {
        projectId: project2.id,
        taskId: t2_1.id,
        userId: pm1.id,
        action: "PROJECT_CREATED",
        description: "Siddhesh Kadam created project 'FinTech Microservices Architecture'",
        createdAt: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
      },
      {
        projectId: project2.id,
        taskId: t2_1.id,
        userId: admin.id,
        action: "TASK_OVERDUE",
        description: "Task 'Third-Party KYC Webhook Reconciliation' was automatically flagged as Overdue by system scheduler",
        metadata: { dueDate: past5Days.toISOString(), status: "TODO" },
        createdAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000),
      },
      {
        projectId: project2.id,
        taskId: t2_3.id,
        userId: dev4.id,
        action: "STATUS_UPDATED",
        description: "Rohan More moved Task 'Automated Fraud Detection Anomaly Heuristics' from In Progress → In Review",
        metadata: { fromStatus: "IN_PROGRESS", toStatus: "IN_REVIEW" },
        createdAt: new Date(now.getTime() - 4 * 60 * 60 * 1000),
      },
      {
        projectId: project3.id,
        taskId: t3_2.id,
        userId: dev4.id,
        action: "STATUS_UPDATED",
        description: "Rohan More moved Task 'Geofencing Boundary Crossing Alerts' from In Progress → In Review",
        metadata: { fromStatus: "IN_PROGRESS", toStatus: "IN_REVIEW" },
        createdAt: new Date(now.getTime() - 1 * 60 * 60 * 1000),
      },
      {
        projectId: project3.id,
        taskId: t3_1.id,
        userId: pm2.id,
        action: "TASK_ASSIGNED",
        description: "Tanmay Patil assigned Task 'GPS Telemetry Stream Parsing Service' to Aditya Jadhav",
        metadata: { assignedToId: dev3.id, assignedToName: "Aditya Jadhav" },
        createdAt: new Date(now.getTime() - 20 * 60 * 1000),
      },
    ],
  });

  await prisma.notification.createMany({
    data: [
      {
        userId: dev1.id,
        title: "New Task Assigned",
        message: "You were assigned to task 'WebSocket Live Activity Feed Component' in project 'Sahyadri Unified Client Portal'",
        link: `/projects/${project1.id}?task=${t1_3.id}`,
        isRead: true,
        createdAt: new Date(now.getTime() - 24 * 60 * 60 * 1000),
      },
      {
        userId: pm1.id,
        title: "Task Submitted for Review",
        message: "Omkar Shinde moved task 'WebSocket Live Activity Feed Component' to In Review",
        link: `/projects/${project1.id}?task=${t1_3.id}`,
        isRead: false,
        createdAt: new Date(now.getTime() - 2 * 60 * 60 * 1000),
      },
      {
        userId: dev2.id,
        title: "Task Overdue Notice",
        message: "Task 'Database Index Optimization & Query Profiling' is past its scheduled due date.",
        link: `/projects/${project1.id}?task=${t1_2.id}`,
        isRead: false,
        createdAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000),
      },
      {
        userId: dev4.id,
        title: "New Task Assigned",
        message: "You were assigned to task 'Geofencing Boundary Crossing Alerts' in project 'Pune Logistics & Fleet Dispatcher'",
        link: `/projects/${project3.id}?task=${t3_2.id}`,
        isRead: true,
        createdAt: new Date(now.getTime() - 12 * 60 * 60 * 1000),
      },
      {
        userId: pm2.id,
        title: "Task Submitted for Review",
        message: "Rohan More moved task 'Geofencing Boundary Crossing Alerts' to In Review",
        link: `/projects/${project3.id}?task=${t3_2.id}`,
        isRead: false,
        createdAt: new Date(now.getTime() - 1 * 60 * 60 * 1000),
      },
    ],
  });

  console.log("Database seeded successfully!");
  console.log("Users created:");
  console.table([
    { Role: "ADMIN", Name: admin.name, Email: admin.email, Password: "Password123!" },
    { Role: "PROJECT_MANAGER", Name: pm1.name, Email: pm1.email, Password: "Password123!" },
    { Role: "PROJECT_MANAGER", Name: pm2.name, Email: pm2.email, Password: "Password123!" },
    { Role: "DEVELOPER", Name: dev1.name, Email: dev1.email, Password: "Password123!" },
    { Role: "DEVELOPER", Name: dev2.name, Email: dev2.email, Password: "Password123!" },
    { Role: "DEVELOPER", Name: dev3.name, Email: dev3.email, Password: "Password123!" },
    { Role: "DEVELOPER", Name: dev4.name, Email: dev4.email, Password: "Password123!" },
  ]);
  console.log("Projects created: 3 (Sahyadri Unified Client Portal, FinTech Microservices Architecture, Pune Logistics & Fleet Dispatcher)");
  console.log("Tasks created: 16 tasks (including 2 Overdue tasks)");
  console.log("Activity logs created: 10 pre-existing records");
  console.log("Notifications created: 5 pre-existing notifications");
}

seed()
  .catch((e) => {
    console.error("Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
