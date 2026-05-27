import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { StatusHeader } from "@/components/system/StatusHeader";
import { store, useStore, type Mission } from "@/lib/store";
import { Check, Plus, X, Zap } from "lucide-react";

export const Route = createFileRoute("/missoes")({
  component: Missoes,
});

const CATS: Mission["category"][] = ["Trabalho", "Academia", "Estudos", "Casa", "Pessoal"];

function Missoes() {
  const missions = useStore((s) => s.missions);
  const [filter, setFilter] = useState<"Todas" | Mission["category"]>("Todas");
  const [open, setOpen] = useState(false);

  const list = useMemo(
    () => (filter === "Todas" ? missions : missions.filter((m) => m.category === filter)),
    [missions, filter],
  );
  const done = missions.filter((m) => m.done).length;
  const pct = Math.round((done / missions.length) * 100);

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

      <div className="px-5 mt-5 animate-fade-up">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
          {(["Todas", ...CATS] as const).map((c) => (
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
          <button
            key={m.id}
            onClick={() => { store.toggleMission(m.id); if (navigator.vibrate) navigator.vibrate(15); }}
            className={`w-full glass rounded-2xl px-4 py-3 flex items-center gap-3 text-left active:scale-[0.98] transition-all ${
              m.done ? "opacity-60" : ""
            }`}
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
            <div className="text-right">
              <div className="font-display font-bold text-primary tabular-nums">+{m.xp}</div>
              <div className="text-[9px] tracking-widest uppercase text-muted-foreground">XP</div>
            </div>
          </button>
        ))}
      </section>

      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-24 right-1/2 translate-x-[228px] z-40 w-14 h-14 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center animate-glow-pulse active:scale-95"
      >
        <Plus className="w-6 h-6" strokeWidth={2.5} />
      </button>

      {open && <AddMissionSheet onClose={() => setOpen(false)} />}
    </div>
  );
}

function AddMissionSheet({ onClose }: { onClose: () => void }) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<Mission["category"]>("Pessoal");
  const [xp, setXp] = useState(20);
  const [priority, setPriority] = useState<Mission["priority"]>("med");
  const [time, setTime] = useState("");

  return (
    <div className="fixed inset-0 z-[80] flex items-end bg-background/70 backdrop-blur-sm" onClick={onClose}>
      <div className="w-full max-w-[480px] mx-auto glass-strong rounded-t-3xl p-5 pb-8 animate-fade-up" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display font-bold tracking-[0.2em] uppercase text-sm">Nova Missão</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-secondary/60 flex items-center justify-center">
            <X className="w-4 h-4" />
          </button>
        </div>
        <Field label="Título"><input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full bg-transparent focus:outline-none" placeholder="Ex.: Correr 5km" /></Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Categoria">
            <select value={category} onChange={(e) => setCategory(e.target.value as Mission["category"])} className="w-full bg-transparent focus:outline-none">
              {CATS.map((c) => <option key={c} className="bg-background">{c}</option>)}
            </select>
          </Field>
          <Field label="Horário">
            <input type="time" value={time} onChange={(e) => setTime(e.target.value)} className="w-full bg-transparent focus:outline-none tabular-nums" />
          </Field>
        </div>
        <Field label={`XP da Missão: ${xp}`}>
          <input type="range" min={5} max={100} step={5} value={xp} onChange={(e) => setXp(Number(e.target.value))} className="w-full accent-primary" />
        </Field>
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
          onClick={() => {
            if (!title) return;
            store.addMission({ title, category, xp, priority, time: time || undefined });
            onClose();
          }}
          className="mt-5 w-full py-3.5 rounded-2xl bg-primary text-primary-foreground font-display font-bold tracking-[0.2em] uppercase animate-glow-pulse"
        >
          Aceitar Missão
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
