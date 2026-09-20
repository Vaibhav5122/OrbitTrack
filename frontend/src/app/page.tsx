import Link from "next/link";
import {
  RiRadarLine,
  RiShieldUserLine,
  RiFlashlightLine,
  RiTimeLine,
  RiNotification3Line,
  RiArrowRightLine,
  RiCheckDoubleLine,
} from "@remixicon/react";
import { Button } from "@/components/ui/button";
import { OrbitLoader } from "@/components/ui/orbit-loader";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">

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
                Live Agency Dashboard
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
              <Button size="sm" className="text-xs font-medium">
                Get Started
                <RiArrowRightLine className="ml-1 size-3.5" />
              </Button>
            </Link>
          </div>
        </div>
      </header>


      <main className="flex-1">
        <section className="relative overflow-hidden px-4 py-16 sm:px-6 sm:py-24">
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <div className="size-[600px] rounded-full bg-primary/5 blur-3xl" />
          </div>

          <div className="relative z-10 mx-auto max-w-4xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary">
              <span className="relative flex size-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex size-2 rounded-full bg-primary" />
              </span>
              Velozity Global Solutions Technical Assessment
            </div>

            <h1 className="font-heading text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-foreground leading-[1.15]">
              Real-Time Client Project Dashboard with{" "}
              <span className="text-primary underline decoration-primary/40 underline-offset-8">
                Role-Based Access
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-sm sm:text-base text-muted-foreground leading-relaxed">
              Track client projects, monitor team task progress in real time via
              WebSockets, view role-filtered audit activity feeds, and receive
              instant in-app notifications.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link href="/login" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto text-sm font-semibold shadow-lg shadow-primary/20">
                  Enter Dashboard (Sign In)
                  <RiArrowRightLine className="ml-2 size-4" />
                </Button>
              </Link>
              <Link href="/signup" className="w-full sm:w-auto">
                <Button variant="outline" size="lg" className="w-full sm:w-auto text-sm font-medium">
                  Create Account
                </Button>
              </Link>
            </div>

            {/* OrbitLoader Showcase */}
            <div className="mt-12 flex justify-center">
              <div className="inline-flex items-center gap-3 rounded-xl border border-border/60 bg-card/50 p-4 shadow-sm backdrop-blur-sm">
                <OrbitLoader size="sm" />
                <span className="text-xs font-mono text-muted-foreground">
                  WebSocket & Postgres Engine Online
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Core Pillars */}
        <section className="border-t border-border/40 bg-secondary/30 px-4 py-16 sm:px-6">
          <div className="mx-auto max-w-5xl">
            <h2 className="text-center text-xs uppercase font-mono tracking-widest text-primary font-bold">
              Engineering Architecture
            </h2>
            <p className="mt-2 text-center text-2xl font-bold tracking-tight text-foreground">
              Built for Strict Compliance & Real-Time Performance
            </p>

            <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="rounded-xl border border-border/60 bg-card p-5 shadow-sm space-y-3">
                <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <RiShieldUserLine className="size-4" />
                </div>
                <h3 className="font-semibold text-sm">Strict RBAC at API Level</h3>
                <p className="text-xs text-muted-foreground leading-normal">
                  Zero trust security. Developers only see assigned tasks, PMs
                  only see owned projects, Admins see all.
                </p>
              </div>

              <div className="rounded-xl border border-border/60 bg-card p-5 shadow-sm space-y-3">
                <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <RiFlashlightLine className="size-4" />
                </div>
                <h3 className="font-semibold text-sm">Socket.io Real-Time Feed</h3>
                <p className="text-xs text-muted-foreground leading-normal">
                  Instant Kanban board updates and role-filtered live activity
                  broadcasting without page refreshes.
                </p>
              </div>

              <div className="rounded-xl border border-border/60 bg-card p-5 shadow-sm space-y-3">
                <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <RiTimeLine className="size-4" />
                </div>
                <h3 className="font-semibold text-sm">Background Overdue Cron</h3>
                <p className="text-xs text-muted-foreground leading-normal">
                  Overdue tasks are flagged via background scheduled worker,
                  never calculated on page load.
                </p>
              </div>

              <div className="rounded-xl border border-border/60 bg-card p-5 shadow-sm space-y-3">
                <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <RiNotification3Line className="size-4" />
                </div>
                <h3 className="font-semibold text-sm">In-App Notifications</h3>
                <p className="text-xs text-muted-foreground leading-normal">
                  Real-time alerts when tasks are assigned to developers or
                  submitted for review to PMs.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Seed Credentials Quick Guide */}
        <section className="px-4 py-16 sm:px-6">
          <div className="mx-auto max-w-4xl rounded-2xl border border-border/80 bg-card p-6 sm:p-8 shadow-md">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-border/40">
              <div>
                <h3 className="text-lg font-bold tracking-tight">Quick Testing Credentials</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Seeded with authentic Marathi & Indian team members (Default Password: <code className="font-mono text-primary font-bold">Password123!</code>)
                </p>
              </div>
              <Link href="/login">
                <Button size="sm" className="text-xs">
                  Go to Login
                  <RiArrowRightLine className="ml-1 size-3.5" />
                </Button>
              </Link>
            </div>

            <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="rounded-lg border border-border/50 bg-secondary/30 p-4 space-y-1.5">
                <span className="inline-block rounded bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">
                  ADMIN
                </span>
                <p className="text-xs font-semibold text-foreground">Vaibhav Waghmode</p>
                <p className="text-[11px] font-mono text-muted-foreground truncate">
                  vaibhav.admin@orbittrack.com
                </p>
                <p className="text-[10px] text-muted-foreground pt-1">
                  Full platform access & live presence
                </p>
              </div>

              <div className="rounded-lg border border-border/50 bg-secondary/30 p-4 space-y-1.5">
                <span className="inline-block rounded bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">
                  PROJECT MANAGER
                </span>
                <p className="text-xs font-semibold text-foreground">Siddhesh Kadam</p>
                <p className="text-[11px] font-mono text-muted-foreground truncate">
                  siddhesh.pm@orbittrack.com
                </p>
                <p className="text-[10px] text-muted-foreground pt-1">
                  Owns Sahyadri & FinTech projects
                </p>
              </div>

              <div className="rounded-lg border border-border/50 bg-secondary/30 p-4 space-y-1.5">
                <span className="inline-block rounded bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">
                  DEVELOPER
                </span>
                <p className="text-xs font-semibold text-foreground">Omkar Shinde</p>
                <p className="text-[11px] font-mono text-muted-foreground truncate">
                  omkar.dev@orbittrack.com
                </p>
                <p className="text-[10px] text-muted-foreground pt-1">
                  Assigned tasks & review status
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/40 py-6 text-center text-xs text-muted-foreground">
        OrbitTrack &copy; 2026. Real-Time Client Project Dashboard.
      </footer>
    </div>
  );
}
