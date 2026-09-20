import Link from "next/link";
import { RiRadarLine } from "@remixicon/react";
import { LoginForm } from "@/components/login-form";
import { GuestGuard } from "@/components/layout/guest-guard";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export const metadata = {
  title: "Login | OrbitTrack",
  description: "Sign in to access your OrbitTrack project dashboard",
};

export default function LoginPage() {
  return (
    <GuestGuard>
      <div className="relative flex min-h-svh flex-col items-center justify-center bg-background px-4 py-8 sm:px-6 lg:px-8">
        <div className="absolute top-4 right-4 z-20">
          <ThemeToggle />
        </div>

        <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden">
          <div className="size-[500px] rounded-full bg-primary/5 blur-3xl" />
        </div>

        <div className="relative z-10 w-full max-w-sm sm:max-w-md space-y-6">
          <Link
            href="/"
            className="group flex items-center justify-center gap-2.5 transition-transform hover:scale-[1.02]"
          >
            <div className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-md shadow-primary/25">
              <RiRadarLine className="size-5 animate-pulse" />
            </div>
            <div className="flex flex-col">
              <span className="font-heading text-lg font-bold tracking-tight text-foreground">
                OrbitTrack
              </span>
              <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-mono">
                Live Agency Dashboard
              </span>
            </div>
          </Link>

          <LoginForm />
        </div>
      </div>
    </GuestGuard>
  );
}
