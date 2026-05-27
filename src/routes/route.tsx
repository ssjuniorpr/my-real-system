import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/system/AppShell";

// Pathless layout that wraps every child with the mobile shell + bottom nav.
export const Route = createFileRoute("")({
  component: AppShell,
});
