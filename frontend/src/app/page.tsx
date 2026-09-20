import Link from "next/link";
import {
  RiRadarLine,
  RiShieldUserLine,
  RiFlashlightLine,
  RiTimeLine,
  RiArrowRightLine,
  RiCheckDoubleLine,
  RiExchangeLine,
  RiCircleFill,
  RiDatabase2Line,
  RiCodeSSlashLine,
  RiFolderLine,
  RiTaskLine,
  RiUserLine,
  RiBuildingLine,
  RiNotification3Line,
  RiShieldCheckLine,
  RiSpeedUpLine,
  RiHistoryLine,
} from "@remixicon/react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground selection:bg-primary/20 selection:text-primary">
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-2.5">
            <div className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm shadow-primary/30">
              <RiRadarLine className="size-5 animate-pulse" />
            </div>
            <div className="flex flex-col">
              <span className="font-heading text-lg font-bold tracking-tight">
                OrbitTrack
              </span>
              <span className="text-[10px] uppercase font-mono tracking-widest text-muted-foreground">
                Live Agency Operations
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 sm:gap-4">
            <ThemeToggle />
            <Link href="/login">
              <Button variant="ghost" size="sm" className="text-xs font-medium">
                Sign In
              </Button>
            </Link>
            <Link href="/signup">
              <Button size="sm" className="text-xs font-medium gap-1 shadow-xs shadow-primary/20">
                Get Started
                <RiArrowRightLine className="size-3.5" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="relative overflow-hidden px-4 pt-16 pb-12 sm:px-6 sm:pt-24 sm:pb-20">
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <div className="size-[700px] rounded-full bg-primary/5 blur-3xl" />
          </div>

          <div className="relative z-10 mx-auto max-w-5xl text-center space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3.5 py-1 text-xs font-medium text-primary shadow-xs">
              <span className="relative flex size-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75" />
                <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
              </span>
              <span className="font-mono text-[11px] tracking-wide">
                Live Agency Command Center & Real-Time Sync
              </span>
            </div>

            <h1 className="font-heading text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-foreground leading-[1.12]">
              Orchestrate Client Projects with{" "}
              <span className="text-primary underline decoration-primary/40 underline-offset-8">
                Real-Time Precision
              </span>
            </h1>

            <p className="mx-auto max-w-2xl text-sm sm:text-base text-muted-foreground leading-relaxed">
              Streamline agency deliverables, track task movements live across team boards,
              enforce zero-leak role boundaries, and audit every change with sub-millisecond WebSocket updates.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link href="/login" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto text-sm font-semibold shadow-md shadow-primary/20 gap-2">
                  Launch Live Workspace
                  <RiArrowRightLine className="size-4" />
                </Button>
              </Link>
              <Link href="/signup" className="w-full sm:w-auto">
                <Button variant="outline" size="lg" className="w-full sm:w-auto text-sm font-medium">
                  Create Account
                </Button>
              </Link>
            </div>

            <div className="pt-10 mx-auto max-w-4xl text-left">
              <div className="rounded-2xl border border-border/80 bg-card/80 p-4 sm:p-6 shadow-2xl backdrop-blur-md space-y-4 ring-1 ring-border/50">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/60 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="size-3 rounded-full bg-destructive/70" />
                    <span className="size-3 rounded-full bg-amber-500/70" />
                    <span className="size-3 rounded-full bg-emerald-500/70" />
                    <span className="ml-2 font-mono text-xs text-muted-foreground">
                      orbittrack.internal/dashboard/tasks
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-mono text-emerald-500 font-medium">
                      <RiCircleFill className="size-1.5 animate-pulse" />
                      <span>Live Presence: 3 Online</span>
                    </div>
                    <Badge variant="outline" className="text-[10px] font-mono text-primary border-primary/30">
                      Socket.io Active
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="rounded-xl border border-border/50 bg-secondary/30 p-3 space-y-2">
                    <div className="flex items-center justify-between text-[11px] font-mono font-semibold text-muted-foreground pb-1 border-b border-border/40">
                      <span>TO DO</span>
                      <Badge variant="secondary" className="text-[9px] px-1.5 py-0">2</Badge>
                    </div>
                    <div className="rounded-lg border border-border/60 bg-card p-2.5 shadow-xs space-y-1.5 hover:border-border transition-colors">
                      <div className="flex items-center justify-between text-[9px] font-mono">
                        <span className="text-muted-foreground">Sahyadri Portal</span>
                        <Badge variant="outline" className="text-[8px] text-amber-500 border-amber-500/30">HIGH</Badge>
                      </div>
                      <p className="text-xs font-semibold">Neon DB B-Tree Indexing</p>
                      <div className="flex items-center justify-between text-[10px] text-muted-foreground pt-1 border-t border-border/40">
                        <span>Omkar Shinde</span>
                        <span className="font-mono">Oct 2</span>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-xl border border-border/50 bg-secondary/30 p-3 space-y-2">
                    <div className="flex items-center justify-between text-[11px] font-mono font-semibold text-amber-500 pb-1 border-b border-border/40">
                      <span>IN PROGRESS</span>
                      <Badge variant="secondary" className="text-[9px] px-1.5 py-0">1</Badge>
                    </div>
                    <div className="rounded-lg border border-primary/40 bg-card p-2.5 shadow-xs space-y-1.5 ring-1 ring-primary/20">
                      <div className="flex items-center justify-between text-[9px] font-mono">
                        <span className="text-muted-foreground">FinTech Redesign</span>
                        <Badge variant="outline" className="text-[8px] text-destructive border-destructive/30">CRITICAL</Badge>
                      </div>
                      <p className="text-xs font-semibold">Socket.io Live Activity Feed</p>
                      <div className="flex items-center justify-between text-[10px] text-muted-foreground pt-1 border-t border-border/40">
                        <span>Vaibhav W.</span>
                        <span className="font-mono">Today</span>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-xl border border-border/50 bg-secondary/30 p-3 space-y-2">
                    <div className="flex items-center justify-between text-[11px] font-mono font-semibold text-indigo-500 pb-1 border-b border-border/40">
                      <span>IN REVIEW</span>
                      <Badge variant="secondary" className="text-[9px] px-1.5 py-0">1</Badge>
                    </div>
                    <div className="rounded-lg border border-border/60 bg-card p-2.5 shadow-xs space-y-1.5 hover:border-border transition-colors">
                      <div className="flex items-center justify-between text-[9px] font-mono">
                        <span className="text-muted-foreground">AI Analytics</span>
                        <Badge variant="outline" className="text-[8px] text-indigo-500 border-indigo-500/30">MEDIUM</Badge>
                      </div>
                      <p className="text-xs font-semibold">Dual-Token Refresh Interceptor</p>
                      <div className="flex items-center justify-between text-[10px] text-muted-foreground pt-1 border-t border-border/40">
                        <span>Siddhesh K.</span>
                        <span className="font-mono">Oct 5</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg border border-border/60 bg-muted/40 px-3 py-2 text-xs flex flex-wrap items-center justify-between gap-2 font-mono">
                  <div className="flex items-center gap-2 text-foreground/90">
                    <RiExchangeLine className="size-3.5 text-blue-500 animate-pulse shrink-0" />
                    <span>Omkar Shinde moved Task #12 from In Progress → In Review</span>
                  </div>
                  <span className="text-[10px] text-muted-foreground">· just now (Live WebSocket Broadcast)</span>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
                <div className="rounded-xl border border-border/40 bg-card/50 p-3">
                  <div className="text-lg font-bold font-heading text-foreground">100%</div>
                  <div className="text-[10px] font-mono uppercase text-muted-foreground">Zero-Trust RBAC</div>
                </div>
                <div className="rounded-xl border border-border/40 bg-card/50 p-3">
                  <div className="text-lg font-bold font-heading text-foreground">&lt; 15ms</div>
                  <div className="text-[10px] font-mono uppercase text-muted-foreground">Socket Broadcast</div>
                </div>
                <div className="rounded-xl border border-border/40 bg-card/50 p-3">
                  <div className="text-lg font-bold font-heading text-foreground">Zero</div>
                  <div className="text-[10px] font-mono uppercase text-muted-foreground">Polling Overhead</div>
                </div>
                <div className="rounded-xl border border-border/40 bg-card/50 p-3">
                  <div className="text-lg font-bold font-heading text-foreground">15 min</div>
                  <div className="text-[10px] font-mono uppercase text-muted-foreground">Auto Cron Audits</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="border-t border-border/40 bg-secondary/30 px-4 py-16 sm:px-6">
          <div className="mx-auto max-w-5xl space-y-10">
            <div className="text-center space-y-2">
              <h2 className="text-xs uppercase font-mono tracking-widest text-primary font-bold">
                Platform Architecture
              </h2>
              <p className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                Engineered for High-Reliability Agency Operations
              </p>
              <p className="text-xs sm:text-sm text-muted-foreground max-w-xl mx-auto">
                Built from the ground up to eliminate state drift, access leaks, and stale client dashboards.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="rounded-xl border border-border/60 bg-card p-5 shadow-xs space-y-3 flex flex-col justify-between hover:border-primary/40 transition-colors">
                <div className="space-y-3">
                  <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <RiShieldUserLine className="size-4.5" />
                  </div>
                  <h3 className="font-semibold text-sm text-foreground">Strict Server-Side RBAC</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Zero-trust authorization enforced at Express router and Prisma database layers. Developers cannot touch other developers tasks even with tampered tokens.
                  </p>
                </div>
                <div className="text-[10px] font-mono text-primary font-semibold pt-2 border-t border-border/40 flex items-center gap-1">
                  <RiCheckDoubleLine className="size-3" /> API-Level Enforced
                </div>
              </div>

              <div className="rounded-xl border border-border/60 bg-card p-5 shadow-xs space-y-3 flex flex-col justify-between hover:border-primary/40 transition-colors">
                <div className="space-y-3">
                  <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <RiFlashlightLine className="size-4.5" />
                  </div>
                  <h3 className="font-semibold text-sm text-foreground">Socket.io Multi-Room Sync</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Targeted WebSocket room multiplexing (&apos;project:id&apos;, &apos;user:id&apos;, &apos;admin_room&apos;). Move a task card and see it update instantly across all active viewers.
                  </p>
                </div>
                <div className="text-[10px] font-mono text-primary font-semibold pt-2 border-t border-border/40 flex items-center gap-1">
                  <RiCheckDoubleLine className="size-3" /> Zero Polling Delay
                </div>
              </div>

              <div className="rounded-xl border border-border/60 bg-card p-5 shadow-xs space-y-3 flex flex-col justify-between hover:border-primary/40 transition-colors">
                <div className="space-y-3">
                  <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <RiTimeLine className="size-4.5" />
                  </div>
                  <h3 className="font-semibold text-sm text-foreground">Autonomous Overdue Sentinel</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Dedicated scheduled background worker scans due dates without adding request latency, atomically updating overdue flags and broadcasting alerts.
                  </p>
                </div>
                <div className="text-[10px] font-mono text-primary font-semibold pt-2 border-t border-border/40 flex items-center gap-1">
                  <RiCheckDoubleLine className="size-3" /> Background Cron Worker
                </div>
              </div>

              <div className="rounded-xl border border-border/60 bg-card p-5 shadow-xs space-y-3 flex flex-col justify-between hover:border-primary/40 transition-colors">
                <div className="space-y-3">
                  <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <RiDatabase2Line className="size-4.5" />
                  </div>
                  <h3 className="font-semibold text-sm text-foreground">Offline Catch-Up Stream</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Reconnect gracefully after network interruptions. Bypasses transient memory to pull the last 20 events from indexed PostgreSQL logs, resuming live feeds.
                  </p>
                </div>
                <div className="text-[10px] font-mono text-primary font-semibold pt-2 border-t border-border/40 flex items-center gap-1">
                  <RiCheckDoubleLine className="size-3" /> Indexed DB Persistence
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="px-4 py-16 sm:px-6">
          <div className="mx-auto max-w-5xl space-y-10">
            <div className="text-center space-y-2">
              <h2 className="text-xs uppercase font-mono tracking-widest text-primary font-bold">
                Operational Flow
              </h2>
              <p className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                How OrbitTrack Powers Agency Execution
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative rounded-xl border border-border/60 bg-card p-4 space-y-2">
                <span className="font-mono text-xs font-bold text-primary">01</span>
                <h4 className="font-semibold text-sm">Client & Project Setup</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Admins and Project Managers create client profiles and project milestones with assigned teams.
                </p>
              </div>

              <div className="relative rounded-xl border border-border/60 bg-card p-4 space-y-2">
                <span className="font-mono text-xs font-bold text-primary">02</span>
                <h4 className="font-semibold text-sm">Task Dispatch & Alert</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  PM assigns deliverables to developers, triggering real-time in-app notifications and task queue sync.
                </p>
              </div>

              <div className="relative rounded-xl border border-border/60 bg-card p-4 space-y-2">
                <span className="font-mono text-xs font-bold text-primary">03</span>
                <h4 className="font-semibold text-sm">Live Status Movement</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Developers progress tasks (To Do → In Progress → In Review), broadcasting live changes to all active viewers.
                </p>
              </div>

              <div className="relative rounded-xl border border-border/60 bg-card p-4 space-y-2">
                <span className="font-mono text-xs font-bold text-primary">04</span>
                <h4 className="font-semibold text-sm">PM Review & Audit Log</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  PM reviews submissions, signs off on Done, and writes immutable audit logs with actor timestamps.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="border-t border-border/40 bg-secondary/30 px-4 py-16 sm:px-6">
          <div className="mx-auto max-w-4xl rounded-2xl border border-border/80 bg-card p-6 sm:p-8 shadow-md space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-border/40">
              <div>
                <h3 className="text-lg font-bold tracking-tight">
                  Test Drive Role Isolation
                </h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Experience how permissions dynamically adapt across roles. Seeded with authentic team members.
                </p>
              </div>
              <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-mono text-primary font-medium">
                <span>Default Password:</span>
                <code className="font-bold">Password123!</code>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="rounded-xl border border-border/50 bg-secondary/30 p-4 space-y-2 flex flex-col justify-between hover:border-primary/30 transition-colors">
                <div className="space-y-1.5">
                  <Badge className="text-[10px] font-mono font-bold bg-primary text-primary-foreground">
                    ADMIN
                  </Badge>
                  <p className="text-xs font-semibold text-foreground">Vaibhav Waghmode</p>
                  <p className="text-[11px] font-mono text-muted-foreground truncate">
                    vaibhav.admin@orbittrack.com
                  </p>
                  <p className="text-[10px] text-muted-foreground leading-relaxed pt-1">
                    Full platform oversight, global activity audit feed, and live user presence metrics.
                  </p>
                </div>
                <Link href="/login" className="pt-2">
                  <Button variant="outline" size="sm" className="w-full text-xs h-8">
                    Login as Admin
                  </Button>
                </Link>
              </div>

              <div className="rounded-xl border border-border/50 bg-secondary/30 p-4 space-y-2 flex flex-col justify-between hover:border-primary/30 transition-colors">
                <div className="space-y-1.5">
                  <Badge variant="secondary" className="text-[10px] font-mono font-bold">
                    PROJECT MANAGER
                  </Badge>
                  <p className="text-xs font-semibold text-foreground">Siddhesh Kadam</p>
                  <p className="text-[11px] font-mono text-muted-foreground truncate">
                    siddhesh.pm@orbittrack.com
                  </p>
                  <p className="text-[10px] text-muted-foreground leading-relaxed pt-1">
                    Owns projects, assigns tasks to developers, signs off on Done, receives review alerts.
                  </p>
                </div>
                <Link href="/login" className="pt-2">
                  <Button variant="outline" size="sm" className="w-full text-xs h-8">
                    Login as PM
                  </Button>
                </Link>
              </div>

              <div className="rounded-xl border border-border/50 bg-secondary/30 p-4 space-y-2 flex flex-col justify-between hover:border-primary/30 transition-colors">
                <div className="space-y-1.5">
                  <Badge variant="outline" className="text-[10px] font-mono font-bold">
                    DEVELOPER
                  </Badge>
                  <p className="text-xs font-semibold text-foreground">Omkar Shinde</p>
                  <p className="text-[11px] font-mono text-muted-foreground truncate">
                    omkar.dev@orbittrack.com
                  </p>
                  <p className="text-[10px] text-muted-foreground leading-relaxed pt-1">
                    Assigned task queue, status transitions (TODO → In Review), restricted from closing tasks.
                  </p>
                </div>
                <Link href="/login" className="pt-2">
                  <Button variant="outline" size="sm" className="w-full text-xs h-8">
                    Login as Dev
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border/40 py-6 text-center text-xs text-muted-foreground font-mono">
        OrbitTrack &copy; 2026. Built by Vaibhav Waghmode &middot; Real-Time Agency Management Platform.
      </footer>
    </div>
  );
}
