import { createFileRoute } from "@tanstack/react-router";
import { StatusHeader } from "@/components/system/StatusHeader";
import { store, useStore } from "@/lib/store";
import { getVerseOfTheDay } from "@/lib/bibleVerses";
import { Wallet, ListChecks, Calendar, Trophy, Zap, Check, BookOpen } from "lucide-react";

export const Route = createFileRoute("/")({
  component: Dashboard,
});

function Dashboard() {
  const missions = useStore((s) => s.missions);
  const txns = useStore((s) => s.transactions);
  const events = useStore((s) => s.events);
  const bibleVerseEnabled = useStore((s) => s.bibleVerseEnabled);
  const verse = getVerseOfTheDay();

  const done = missions.filter((m) => m.done).length;
  const total = missions.length;
  const pct = Math.round((done / total) * 100);
  const today = new Date();
  const spentToday = txns
    .filter((t) => t.amount < 0 && new Date(t.date).toDateString() === today.toDateString())
    .reduce((s, t) => s + Math.abs(t.amount), 0);

  return (
    <div>
      <StatusHeader />

      {bibleVerseEnabled && (
        <section className="px-5 mt-2 animate-fade-up">
          <div className="glass rounded-2xl p-4 text-center relative overflow-hidden">
            <div className="absolute inset-0 opacity-30" style={{ background: "var(--gradient-glow)" }} />
            <div className="relative">
              <div className="flex items-center justify-center gap-1.5 text-[10px] tracking-[0.3em] uppercase text-primary">
                <BookOpen className="w-3.5 h-3.5" /> Versículo do Dia
              </div>
              <p className="text-sm mt-2 italic text-foreground/90">"{verse.text}"</p>
              <div className="text-[11px] text-muted-foreground mt-1.5">{verse.reference}</div>
            </div>
          </div>
        </section>
      )}

      {/* Daily status stat grid */}
      <section className="px-5 mt-2 grid grid-cols-2 gap-3 animate-fade-up">
        <StatCard icon={<Wallet className="w-4 h-4" />} label="Gastos Hoje" value={`R$ ${spentToday.toFixed(0)}`} tone="warning" />
        <StatCard icon={<ListChecks className="w-4 h-4" />} label="Tarefas" value={`${done}/${total}`} tone="cyan" />
        <StatCard icon={<Calendar className="w-4 h-4" />} label="Compromissos" value={`${events.length}`} tone="violet" />
        <StatCard icon={<Trophy className="w-4 h-4" />} label="Combo" value="x3" tone="success" />
      </section>

      {/* Daily progress ring-ish */}
      <section className="px-5 mt-5 animate-fade-up">
        <div className="glass-strong rounded-2xl p-5 relative overflow-hidden">
          <div
            className="absolute -top-12 -right-12 w-48 h-48 rounded-full opacity-40 blur-3xl"
            style={{ background: "var(--gradient-hero)" }}
          />
          <div className="relative flex items-center gap-4">
            <div className="relative w-20 h-20 shrink-0">
              <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                <circle cx="18" cy="18" r="15.9" fill="none" stroke="oklch(0.3 0.04 260)" strokeWidth="2.5" />
                <circle
                  cx="18" cy="18" r="15.9" fill="none"
                  stroke="url(#g1)" strokeWidth="2.5" strokeLinecap="round"
                  strokeDasharray={`${pct} 100`}
                  style={{ filter: "drop-shadow(0 0 6px var(--primary))" }}
                />
                <defs>
                  <linearGradient id="g1" x1="0" x2="1" y1="0" y2="1">
                    <stop offset="0%" stopColor="oklch(0.85 0.18 200)" />
                    <stop offset="100%" stopColor="oklch(0.7 0.22 295)" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center font-display font-bold text-xl text-glow">
                {pct}%
              </div>
            </div>
            <div className="flex-1">
              <div className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground">Progresso Diário</div>
              <div className="text-base font-display font-bold mt-0.5">Missões em andamento</div>
              <div className="text-xs text-muted-foreground mt-1">
                Conclua tudo para o bônus combo de <span className="text-primary font-bold">+120 XP</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Missões */}
      <section className="px-5 mt-6 animate-fade-up">
        <SectionTitle title="Missões de Hoje" hint={`${done}/${total} concluídas`} />
        <div className="space-y-2.5">
          {missions.slice(0, 5).map((m) => (
            <button
              key={m.id}
              onClick={() => {
                store.toggleMission(m.id);
                if (navigator.vibrate) navigator.vibrate(15);
              }}
              className={`w-full glass rounded-2xl px-4 py-3 flex items-center gap-3 text-left transition-all duration-300 active:scale-[0.98] ${
                m.done ? "opacity-60" : "hover:border-primary/40"
              }`}
            >
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-all ${
                  m.done
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary/60 text-muted-foreground"
                }`}
                style={m.done ? { boxShadow: "0 0 16px var(--primary)" } : undefined}
              >
                {m.done ? <Check className="w-4 h-4" strokeWidth={3} /> : <Zap className="w-4 h-4" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className={`text-sm font-semibold ${m.done ? "line-through" : ""}`}>{m.title}</div>
                <div className="text-[11px] text-muted-foreground flex items-center gap-2 mt-0.5">
                  <span>{m.category}</span>
                  {m.time && <span>• {m.time}</span>}
                </div>
              </div>
              <div className="text-right shrink-0">
                <div className="text-xs font-display font-bold text-primary tabular-nums">+{m.xp}</div>
                <div className="text-[9px] tracking-widest text-muted-foreground uppercase">XP</div>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Próximos compromissos */}
      <section className="px-5 mt-6 animate-fade-up">
        <SectionTitle title="Próximos Compromissos" />
        <div className="space-y-2.5">
          {events.slice(0, 3).map((e) => (
            <div key={e.id} className="glass rounded-2xl px-4 py-3 flex items-center gap-3">
              <div
                className="w-1 h-10 rounded-full"
                style={{ background: `var(--${e.color})`, boxShadow: `0 0 12px var(--${e.color})` }}
              />
              <div className="flex-1">
                <div className="text-sm font-semibold">{e.title}</div>
                <div className="text-[11px] text-muted-foreground">{e.category}{e.location ? ` • ${e.location}` : ""}</div>
              </div>
              <div className="font-display font-bold tabular-nums text-primary">{e.time}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="px-5 mt-6 mb-4 animate-fade-up">
        <div className="glass rounded-2xl p-4 text-center">
          <div className="text-[10px] tracking-[0.3em] uppercase text-primary">System Whisper</div>
          <p className="text-sm mt-2 italic text-foreground/90">
            "Cada missão concluída é uma versão sua que nunca mais volta a ser fraca."
          </p>
        </div>
      </section>
    </div>
  );
}

function StatCard({
  icon, label, value, tone,
}: {
  icon: React.ReactNode; label: string; value: string;
  tone: "cyan" | "violet" | "warning" | "success";
}) {
  const color = `var(--${tone === "warning" ? "warning" : tone === "success" ? "success" : tone})`;
  return (
    <div className="glass rounded-2xl px-4 py-3 relative overflow-hidden">
      <div
        className="absolute -top-6 -right-6 w-20 h-20 rounded-full opacity-25 blur-2xl"
        style={{ background: color }}
      />
      <div className="relative flex items-center gap-2 text-muted-foreground">
        <span style={{ color }}>{icon}</span>
        <span className="text-[10px] tracking-[0.2em] uppercase">{label}</span>
      </div>
      <div className="relative mt-1.5 text-xl font-display font-bold tabular-nums">{value}</div>
    </div>
  );
}

function SectionTitle({ title, hint }: { title: string; hint?: string }) {
  return (
    <div className="flex items-end justify-between mb-3">
      <h2 className="text-sm font-display font-bold tracking-[0.2em] uppercase text-foreground/90">
        {title}
      </h2>
      {hint && <span className="text-[10px] text-muted-foreground tracking-wider uppercase">{hint}</span>}
    </div>
  );
}
