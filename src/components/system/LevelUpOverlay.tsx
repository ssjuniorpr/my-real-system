import { useEffect } from "react";
import { store, useStore } from "@/lib/store";
import { Sparkles, Crown, X } from "lucide-react";

const GLORY_MESSAGES = [
  "Uma nova era começa. Poucos chegam até aqui — você é um deles.",
  "Sua disciplina forjou este momento. Glória a quem não desiste.",
  "Você não subiu de nível. Você ascendeu a um novo patamar de si mesmo.",
  "O sistema reconhece sua jornada. Continue, Hunter Lendário.",
];

function gloryMessage(level: number) {
  return GLORY_MESSAGES[(level / 10 - 1) % GLORY_MESSAGES.length];
}

export function LevelUpOverlay() {
  const lastLevelUp = useStore((s) => s.lastLevelUp);
  const level = useStore((s) => s.level);
  const isMilestone = level > 0 && level % 10 === 0;

  useEffect(() => {
    if (!lastLevelUp) return;
    if (navigator.vibrate) navigator.vibrate(isMilestone ? [40, 60, 40, 60, 120] : [30, 50, 80]);
    if (isMilestone) return; // milestone popup stays until the user closes it
    const t = setTimeout(() => store.clearLevelUp(), 2800);
    return () => clearTimeout(t);
  }, [lastLevelUp, isMilestone]);

  if (!lastLevelUp) return null;

  if (isMilestone) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/85 backdrop-blur-md animate-fade-up">
        <div
          className="absolute inset-0 opacity-70"
          style={{ background: "radial-gradient(circle at 50% 35%, oklch(0.85 0.18 85 / 0.35), transparent 60%)" }}
        />
        <div className="relative animate-pop text-center px-8 max-w-sm">
          <button
            onClick={() => store.clearLevelUp()}
            className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-secondary/70 flex items-center justify-center"
            aria-label="Fechar"
          >
            <X className="w-4 h-4" />
          </button>
          <Crown
            className="w-16 h-16 mx-auto mb-4 animate-glow-pulse"
            style={{ color: "oklch(0.85 0.18 85)", filter: "drop-shadow(0 0 18px oklch(0.85 0.18 85 / 0.8))" }}
            strokeWidth={1.75}
          />
          <div className="text-xs tracking-[0.4em] uppercase mb-2" style={{ color: "oklch(0.85 0.18 85)" }}>
            Marco Épico
          </div>
          <h2
            className="text-5xl font-display font-bold mb-3"
            style={{ color: "oklch(0.9 0.15 85)", textShadow: "0 0 24px oklch(0.85 0.18 85 / 0.9)" }}
          >
            LEVEL {level}
          </h2>
          <p className="text-sm text-foreground/90 mt-3">{gloryMessage(level)}</p>
          <button
            onClick={() => store.clearLevelUp()}
            className="mt-6 w-full py-3.5 rounded-2xl font-display font-bold tracking-[0.2em] uppercase text-primary-foreground"
            style={{ background: "linear-gradient(90deg, oklch(0.75 0.16 85), oklch(0.7 0.2 60))", boxShadow: "0 0 20px oklch(0.85 0.18 85 / 0.6)" }}
          >
            Continuar Jornada
          </button>
        </div>
      </div>
    );
  }

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
