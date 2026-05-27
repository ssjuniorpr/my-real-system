import { Outlet } from "@tanstack/react-router";
import { BottomNav } from "./BottomNav";
import { LevelUpOverlay } from "./LevelUpOverlay";

export function AppShell() {
  return (
    <div className="app-shell pb-28">
      {/* HUD scan-line background ambience */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden opacity-[0.04]">
        <div
          className="absolute inset-x-0 h-32 animate-scan"
          style={{
            background:
              "linear-gradient(180deg, transparent, oklch(0.72 0.18 235 / 0.8), transparent)",
          }}
        />
      </div>
      <div className="relative z-10">
        <Outlet />
      </div>
      <BottomNav />
      <LevelUpOverlay />
    </div>
  );
}
