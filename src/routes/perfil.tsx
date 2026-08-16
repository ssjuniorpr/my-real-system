import { createFileRoute } from "@tanstack/react-router";
import { StatusHeader } from "@/components/system/StatusHeader";
import { store, useStore } from "@/lib/store";
import { Award, BookOpen, Flame, Sparkles, Target, TrendingUp, Trophy } from "lucide-react";

export const Route = createFileRoute("/perfil")({
  component: Perfil,
});

const TITLES = [
  { name: "Iniciante", lv: 1, unlocked: true },
  { name: "Disciplinado", lv: 5, unlocked: true },
  { name: "Hunter de Ferro", lv: 10, unlocked: true },
  { name: "Mestre da Rotina", lv: 15, unlocked: false },
  { name: "Sombra Imparável", lv: 25, unlocked: false },
];

const ACHIEVEMENTS = [
  { name: "Sequência 7 dias", icon: Flame, done: true },
  { name: "100 missões concluídas", icon: Target, done: true },
  { name: "1ª meta financeira", icon: TrendingUp, done: true },
  { name: "Combo perfeito", icon: Sparkles, done: false },
  { name: "Nível 15", icon: Trophy, done: false },
  { name: "30 dias seguidos", icon: Award, done: false },
];

function Perfil() {
  const level = useStore((s) => s.level);
  const streak = useStore((s) => s.streak);
  const bibleVerseEnabled = useStore((s) => s.bibleVerseEnabled);

  return (
    <div>
      <StatusHeader subtitle="Perfil do Hunter" />

      <section className="px-5 mt-2 animate-fade-up">
        <div className="glass-strong rounded-3xl p-5 relative overflow-hidden text-center">
          <div className="absolute inset-0 opacity-50" style={{ background: "var(--gradient-glow)" }} />
          <div className="relative">
            <div className="w-24 h-24 mx-auto rounded-full p-1 animate-float" style={{ background: "linear-gradient(135deg, var(--cyan), var(--violet))" }}>
              <div className="w-full h-full rounded-full bg-background flex items-center justify-center font-display font-bold text-3xl text-glow">
                H
              </div>
            </div>
            <h2 className="mt-3 font-display font-bold text-xl text-glow">Hunter Anônimo</h2>
            <div className="text-[10px] tracking-[0.4em] uppercase text-primary mt-1">Mestre da Rotina • LV {level}</div>
            <div className="mt-4 grid grid-cols-3 gap-2">
              <Stat label="Sequência" value={`${streak}d`} />
              <Stat label="Missões" value="148" />
              <Stat label="XP Total" value="32.4k" />
            </div>
          </div>
        </div>
      </section>

      <section className="px-5 mt-6 animate-fade-up">
        <h3 className="text-sm font-display font-bold tracking-[0.2em] uppercase mb-3">Títulos</h3>
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
          {TITLES.map((t) => (
            <div
              key={t.name}
              className={`shrink-0 glass rounded-2xl px-4 py-3 min-w-[140px] ${
                t.unlocked ? "" : "opacity-40"
              }`}
              style={t.unlocked ? { borderColor: "oklch(0.72 0.18 235 / 0.4)" } : undefined}
            >
              <div className="text-[10px] tracking-widest uppercase text-muted-foreground">LV {t.lv}</div>
              <div className="font-display font-bold mt-0.5">{t.name}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="px-5 mt-6 animate-fade-up pb-4">
        <h3 className="text-sm font-display font-bold tracking-[0.2em] uppercase mb-3">Conquistas</h3>
        <div className="grid grid-cols-3 gap-2.5">
          {ACHIEVEMENTS.map((a) => (
            <div
              key={a.name}
              className={`glass rounded-2xl p-3 text-center aspect-square flex flex-col items-center justify-center ${
                a.done ? "" : "opacity-40 grayscale"
              }`}
              style={a.done ? { boxShadow: "0 0 18px oklch(0.72 0.18 235 / 0.3)" } : undefined}
            >
              <a.icon className={`w-7 h-7 mb-2 ${a.done ? "text-primary" : "text-muted-foreground"}`} />
              <div className="text-[10px] leading-tight font-bold tracking-wide uppercase">{a.name}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="px-5 mt-6 animate-fade-up">
        <h3 className="text-sm font-display font-bold tracking-[0.2em] uppercase mb-3">Configurações</h3>
        <div className="glass rounded-2xl p-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-secondary/60 flex items-center justify-center shrink-0">
              <BookOpen className="w-4 h-4 text-primary" />
            </div>
            <div>
              <div className="text-sm font-semibold">Versículo Diário</div>
              <div className="text-[11px] text-muted-foreground">Exibir versículo bíblico na tela inicial</div>
            </div>
          </div>
          <button
            onClick={() => store.toggleBibleVerse()}
            role="switch"
            aria-checked={bibleVerseEnabled}
            className={`w-12 h-7 rounded-full shrink-0 relative transition-all ${
              bibleVerseEnabled ? "bg-primary" : "bg-secondary/60"
            }`}
          >
            <span
              className={`absolute top-1 w-5 h-5 rounded-full bg-background transition-all ${
                bibleVerseEnabled ? "left-6" : "left-1"
              }`}
            />
          </button>
        </div>
      </section>

      <section className="px-5 animate-fade-up pb-4">
        <h3 className="text-sm font-display font-bold tracking-[0.2em] uppercase mb-3">Calendário Produtivo</h3>
        <div className="glass rounded-2xl p-4">
          <div className="grid grid-cols-14 gap-1" style={{ gridTemplateColumns: "repeat(14, 1fr)" }}>
            {Array.from({ length: 42 }).map((_, i) => {
              const intensity = Math.floor(Math.random() * 4);
              const colors = [
                "oklch(0.22 0.04 260)",
                "oklch(0.4 0.1 235 / 0.5)",
                "oklch(0.55 0.15 235 / 0.7)",
                "oklch(0.72 0.18 235)",
              ];
              return (
                <div
                  key={i}
                  className="aspect-square rounded-sm"
                  style={{
                    background: colors[intensity],
                    boxShadow: intensity === 3 ? "0 0 6px var(--primary)" : undefined,
                  }}
                />
              );
            })}
          </div>
          <div className="flex items-center justify-between mt-3 text-[10px] text-muted-foreground uppercase tracking-widest">
            <span>Menos</span>
            <div className="flex gap-1">
              {["oklch(0.22 0.04 260)", "oklch(0.4 0.1 235 / 0.5)", "oklch(0.55 0.15 235 / 0.7)", "oklch(0.72 0.18 235)"].map((c, i) => (
                <div key={i} className="w-2.5 h-2.5 rounded-sm" style={{ background: c }} />
              ))}
            </div>
            <span>Mais</span>
          </div>
        </div>
      </section>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="glass rounded-xl py-2">
      <div className="text-lg font-display font-bold tabular-nums text-glow">{value}</div>
      <div className="text-[9px] tracking-widest uppercase text-muted-foreground">{label}</div>
    </div>
  );
}
