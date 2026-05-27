import { useStore } from "@/lib/store";
import { Flame, Shield } from "lucide-react";

export function StatusHeader({ subtitle }: { subtitle?: string }) {
  const level = useStore((s) => s.level);
  const xp = useStore((s) => s.xp);
  const xpToNext = useStore((s) => s.xpToNext);
  const streak = useStore((s) => s.streak);
  const pct = Math.min(100, Math.round((xp / xpToNext) * 100));

  return (
    <header className="px-5 pt-8 pb-4 animate-fade-up">
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="text-[11px] tracking-[0.4em] text-primary uppercase">My System</div>
          <h1 className="text-2xl font-display font-bold text-glow mt-1">
            {subtitle ?? "Status do Hunter"}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <div className="glass rounded-xl px-2.5 py-1.5 flex items-center gap-1.5">
            <Flame className="w-3.5 h-3.5 text-warning" />
            <span className="text-xs font-bold tabular-nums">{streak}d</span>
          </div>
          <div className="glass rounded-xl px-2.5 py-1.5 flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-primary" />
            <span className="text-xs font-bold tabular-nums">LV {level}</span>
          </div>
        </div>
      </div>

      {/* XP bar */}
      <div className="glass rounded-2xl p-4 relative overflow-hidden">
        <div className="flex items-end justify-between mb-2">
          <div>
            <div className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground">
              Experience
            </div>
            <div className="text-xl font-display font-bold tabular-nums mt-0.5">
              {xp.toLocaleString("pt-BR")}
              <span className="text-xs text-muted-foreground ml-1">
                / {xpToNext.toLocaleString("pt-BR")}
              </span>
            </div>
          </div>
          <div className="text-2xl font-display font-bold text-primary text-glow">{pct}%</div>
        </div>
        <div className="h-2.5 rounded-full bg-secondary/60 overflow-hidden relative">
          <div
            className="h-full rounded-full relative transition-all duration-700"
            style={{
              width: `${pct}%`,
              background:
                "linear-gradient(90deg, var(--cyan), var(--primary), var(--violet))",
              boxShadow: "0 0 12px var(--primary)",
            }}
          >
            <div
              className="absolute inset-0 opacity-60"
              style={{
                background:
                  "linear-gradient(90deg, transparent, oklch(1 0 0 / 0.5), transparent)",
                backgroundSize: "200% 100%",
                animation: "shimmer 2s linear infinite",
              }}
            />
          </div>
        </div>
      </div>
    </header>
  );
}
