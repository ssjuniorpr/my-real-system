import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { StatusHeader } from "@/components/system/StatusHeader";
import { store, useStore, type Mission } from "@/lib/store";
import { Check, Pencil, Plus, X, Zap } from "lucide-react";

export const Route = createFileRoute("/missoes")({
  component: Missoes,
});

const CAT_SUGGESTIONS = ["Trabalho", "Academia", "Estudos", "Casa", "Pessoal"];
const DAILY_XP_LIMIT = 500;
const MIN_MISSIONS_FOR_MAX = 5;

function Missoes() {
  const missions = useStore((s) => s.missions);
  const [filter, setFilter] = useState<string>("Todas");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Mission | null>(null);

  const categories = useMemo(
    () => Array.from(new Set(missions.map((m) => m.category))).sort(),
    [missions],
  );
  const list = useMemo(
    () => (filter === "Todas" ? missions : missions.filter((m) => m.category === filter)),
    [missions, filter],
  );
  const done = missions.filter((m) => m.done).length;
  const pct = Math.round((done / missions.length) * 100);
  const totalXp = missions.reduce((sum, m) => sum + m.xp, 0);
  const remainingXp = Math.max(0, DAILY_XP_LIMIT - totalXp);
  const needsMoreMissions = remainingXp > 0 && missions.length < MIN_MISSIONS_FOR_MAX;

  return (
    <div>
      <StatusHeader subtitle="Missões & Hábitos" />

      <section className="px-5 mt-2 animate-fade-up">
        <div className="glass-strong rounded-2xl p-4 relative overflow-hidden">
          <div className="absolute inset-0 opacity-40" style={{ background: "var(--gradient-glow)" }} />
          <div className="relative flex items-center gap-3">
            <div className="text-3xl font-display font-bold text-glow tabular-nums w-16">{pct}%</div>
            <div className="flex-1">
              <div className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground">Combo do Dia</div>
              <div className="font-display font-bold">{done} de {missions.length} missões</div>
              <div className="h-1.5 mt-2 rounded-full bg-secondary/60 overflow-hidden">
                <div className="h-full" style={{
                  width: `${pct}%`,
                  background: "linear-gradient(90deg, var(--cyan), var(--violet))",
                  boxShadow: "0 0 10px var(--primary)",
                }} />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-5 mt-3 animate-fade-up">
        <div className="glass rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <div className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground">XP Diário</div>
            <div className="text-xs font-semibold tabular-nums">
              <span className={totalXp > DAILY_XP_LIMIT ? "text-destructive" : "text-primary"}>{totalXp}</span>
              <span className="text-muted-foreground"> / {DAILY_XP_LIMIT}</span>
            </div>
          </div>
          <div className="h-1.5 mt-2 rounded-full bg-secondary/60 overflow-hidden">
            <div
              className="h-full transition-all"
              style={{
                width: `${Math.min(100, (totalXp / DAILY_XP_LIMIT) * 100)}%`,
                background: totalXp > DAILY_XP_LIMIT ? "var(--destructive)" : "linear-gradient(90deg, var(--cyan), var(--violet))",
              }}
            />
          </div>
          <div className="text-[11px] text-muted-foreground mt-2">Máximo de 500 XP por dia</div>
          {remainingXp > 0 && (
            <div className="text-[11px] text-primary mt-1">
              Você ainda tem {remainingXp} XP disponíveis para distribuir hoje
            </div>
          )}
          {needsMoreMissions && (
            <div className="text-[11px] text-muted-foreground mt-1">
              Para atingir os 500 XP, crie pelo menos {MIN_MISSIONS_FOR_MAX} missões no total ({missions.length}/{MIN_MISSIONS_FOR_MAX})
            </div>
          )}
        </div>
      </section>

      <div className="px-5 mt-5 animate-fade-up">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
          {["Todas", ...categories].map((c) => (
            <button
              key={c}
              onClick={() => setFilter(c)}
              className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase transition-all ${
                filter === c
                  ? "bg-primary text-primary-foreground"
                  : "glass text-muted-foreground"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <section className="px-5 mt-5 space-y-2.5 animate-fade-up pb-4">
        {list.map((m) => (
          <div
            key={m.id}
            className={`w-full glass rounded-2xl px-4 py-3 flex items-center gap-3 transition-all ${
              m.done ? "opacity-60" : ""
            }`}
          >
            <button
              onClick={() => { store.toggleMission(m.id); if (navigator.vibrate) navigator.vibrate(15); }}
              className="flex items-center gap-3 flex-1 min-w-0 text-left active:scale-[0.98] transition-all"
            >
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all ${
                  m.done ? "bg-primary text-primary-foreground" : "bg-secondary/60"
                }`}
                style={m.done ? { boxShadow: "0 0 18px var(--primary)" } : undefined}
              >
                {m.done ? <Check className="w-5 h-5" strokeWidth={3} /> : <Zap className="w-4 h-4 text-primary" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className={`text-sm font-semibold ${m.done ? "line-through" : ""}`}>{m.title}</div>
                <div className="text-[11px] text-muted-foreground flex items-center gap-2 mt-0.5">
                  <span>{m.category}</span>
                  {m.time && <span>• {m.time}</span>}
                  <span className={`px-1.5 rounded-full text-[9px] uppercase tracking-wider border ${
                    m.priority === "high" ? "border-destructive/50 text-destructive" :
                    m.priority === "med" ? "border-primary/40 text-primary" :
                    "border-muted-foreground/40 text-muted-foreground"
                  }`}>{m.priority === "high" ? "Alta" : m.priority === "med" ? "Média" : "Baixa"}</span>
                </div>
              </div>
              <div className="text-right shrink-0">
                <div className="font-display font-bold text-primary tabular-nums">+{m.xp}</div>
                <div className="text-[9px] tracking-widest uppercase text-muted-foreground">XP</div>
              </div>
            </button>
            <button
              onClick={() => setEditing(m)}
              className="w-8 h-8 rounded-full bg-secondary/60 flex items-center justify-center shrink-0 active:scale-95"
              aria-label="Editar missão"
            >
              <Pencil className="w-3.5 h-3.5 text-muted-foreground" />
            </button>
          </div>
        ))}
      </section>

      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-24 right-1/2 translate-x-[228px] z-40 w-14 h-14 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center animate-glow-pulse active:scale-95"
      >
        <Plus className="w-6 h-6" strokeWidth={2.5} />
      </button>

      {open && <MissionSheet onClose={() => setOpen(false)} />}
      {editing && <MissionSheet mission={editing} onClose={() => setEditing(null)} />}
    </div>
  );
}

function MissionSheet({ mission, onClose }: { mission?: Mission; onClose: () => void }) {
  const isEditing = !!mission;
  const missions = useStore((s) => s.missions);
  const [title, setTitle] = useState(mission?.title ?? "");
  const [category, setCategory] = useState(mission?.category ?? "");
  const [xp, setXp] = useState(mission?.xp ?? 20);
  const [priority, setPriority] = useState<Mission["priority"]>(mission?.priority ?? "med");
  const [time, setTime] = useState(mission?.time ?? "");

  const otherXp = missions.reduce((sum, m) => sum + (m.id === mission?.id ? 0 : m.xp), 0);
  const availableXp = Math.max(0, DAILY_XP_LIMIT - otherXp);
  const sliderMax = Math.max(5, Math.min(100, availableXp));
  const overLimit = xp > availableXp;

  useEffect(() => {
    if (xp > sliderMax) setXp(sliderMax);
  }, [sliderMax]);

  return (
    <div className="fixed inset-0 z-[80] flex items-end bg-background/70 backdrop-blur-sm" onClick={onClose}>
      <div className="w-full max-w-[480px] mx-auto glass-strong rounded-t-3xl p-5 pb-8 animate-fade-up" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display font-bold tracking-[0.2em] uppercase text-sm">{isEditing ? "Editar Missão" : "Nova Missão"}</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-secondary/60 flex items-center justify-center">
            <X className="w-4 h-4" />
          </button>
        </div>
        <Field label="Título"><input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full bg-transparent focus:outline-none" placeholder="Ex.: Correr 5km" /></Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Tipo da Tarefa">
            <input
              list="mission-category-suggestions"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-transparent focus:outline-none"
              placeholder="Ex.: Trabalho, Academia…"
            />
            <datalist id="mission-category-suggestions">
              {CAT_SUGGESTIONS.map((c) => <option key={c} value={c} />)}
            </datalist>
          </Field>
          <Field label="Horário">
            <input type="time" value={time} onChange={(e) => setTime(e.target.value)} className="w-full bg-transparent focus:outline-none tabular-nums" />
          </Field>
        </div>
        <Field label={`XP da Missão: ${xp}`}>
          <input type="range" min={5} max={sliderMax} step={5} value={Math.min(xp, sliderMax)} onChange={(e) => setXp(Number(e.target.value))} className="w-full accent-primary" />
        </Field>
        <div className="text-[11px] text-muted-foreground -mt-2 mb-3 px-1">
          Máximo de 500 XP por dia • {availableXp} XP disponíveis {isEditing ? "para esta missão" : "para novas missões"}
        </div>
        {overLimit && (
          <div className="text-[11px] text-destructive -mt-2 mb-3 px-1">
            O XP escolhido ultrapassa o limite diário disponível.
          </div>
        )}
        <div className="glass rounded-2xl p-3 grid grid-cols-3 gap-2">
          {(["low", "med", "high"] as const).map((p) => (
            <button key={p} onClick={() => setPriority(p)}
              className={`py-2 rounded-xl text-xs font-bold uppercase tracking-wider ${
                priority === p ? "bg-primary text-primary-foreground" : "bg-secondary/40 text-muted-foreground"
              }`}>
              {p === "low" ? "Baixa" : p === "med" ? "Média" : "Alta"}
            </button>
          ))}
        </div>
        <button
          disabled={!title || !category || overLimit || availableXp <= 0}
          onClick={() => {
            if (!title || !category || overLimit || availableXp <= 0) return;
            if (isEditing) {
              store.updateMission(mission.id, { title, category, xp, priority, time: time || undefined });
            } else {
              store.addMission({ title, category, xp, priority, time: time || undefined });
            }
            onClose();
          }}
          className="mt-5 w-full py-3.5 rounded-2xl bg-primary text-primary-foreground font-display font-bold tracking-[0.2em] uppercase animate-glow-pulse disabled:opacity-40 disabled:animate-none disabled:cursor-not-allowed"
        >
          {isEditing ? "Salvar Alterações" : "Aceitar Missão"}
        </button>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-3 glass rounded-2xl px-4 py-2.5">
      <div className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground">{label}</div>
      <div className="mt-1">{children}</div>
    </div>
  );
}
