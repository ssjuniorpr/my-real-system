import { useEffect } from "react";
import { store, useStore } from "@/lib/store";
import { Sparkles } from "lucide-react";

export function LevelUpOverlay() {
  const lastLevelUp = useStore((s) => s.lastLevelUp);
  const level = useStore((s) => s.level);

  useEffect(() => {
    if (!lastLevelUp) return;
    const t = setTimeout(() => store.clearLevelUp(), 2800);
    if (navigator.vibrate) navigator.vibrate([30, 50, 80]);
    return () => clearTimeout(t);
  }, [lastLevelUp]);

  if (!lastLevelUp) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-md animate-fade-up">
      <div className="absolute inset-0" style={{ background: "var(--gradient-glow)" }} />
      <div className="relative animate-pop text-center px-8">
        <Sparkles className="w-12 h-12 mx-auto text-primary animate-glow-pulse mb-4" />
        <div className="text-xs tracking-[0.4em] text-primary uppercase mb-2">System</div>
        <h2 className="text-5xl font-display font-bold text-glow text-foreground mb-3">
          LEVEL UP
        </h2>
        <div className="text-2xl font-display text-primary">Nível {level}</div>
        <p className="text-sm text-muted-foreground mt-3">
          Você cresceu. Continue evoluindo, Hunter.
        </p>
      </div>
    </div>
  );
}
