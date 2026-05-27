import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { StatusHeader } from "@/components/system/StatusHeader";
import { useStore, store } from "@/lib/store";
import { Plus, MapPin, X } from "lucide-react";

export const Route = createFileRoute("/agenda")({
  component: Agenda,
});

const WEEK = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];

function Agenda() {
  const events = useStore((s) => s.events);
  const [view, setView] = useState<"Dia" | "Semana" | "Mês">("Dia");
  const [open, setOpen] = useState(false);
  const today = new Date();
  const day = today.getDate();

  return (
    <div>
      <StatusHeader subtitle="Agenda Inteligente" />

      <div className="px-5 mt-2 animate-fade-up">
        <div className="glass rounded-2xl p-1 grid grid-cols-3 gap-1">
          {(["Dia", "Semana", "Mês"] as const).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`py-2 rounded-xl text-xs font-bold tracking-[0.2em] uppercase transition-all ${
                view === v ? "bg-primary text-primary-foreground" : "text-muted-foreground"
              }`}
            >
              {v}
            </button>
          ))}
        </div>
      </div>

      {/* Week strip */}
      <div className="px-5 mt-5 animate-fade-up">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide">
          {Array.from({ length: 14 }).map((_, i) => {
            const d = new Date(today);
            d.setDate(today.getDate() - 3 + i);
            const isToday = d.getDate() === day;
            return (
              <button
                key={i}
                className={`shrink-0 w-12 py-3 rounded-2xl flex flex-col items-center transition-all ${
                  isToday ? "bg-primary text-primary-foreground animate-glow-pulse" : "glass"
                }`}
              >
                <span className="text-[10px] uppercase tracking-widest opacity-80">{WEEK[(d.getDay() + 6) % 7]}</span>
                <span className="text-lg font-display font-bold tabular-nums">{d.getDate()}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Timeline */}
      <section className="px-5 mt-6 animate-fade-up pb-4">
        <div className="flex items-end justify-between mb-3">
          <h2 className="text-sm font-display font-bold tracking-[0.2em] uppercase">Hoje</h2>
          <span className="text-[10px] text-muted-foreground">{events.length} eventos</span>
        </div>
        <div className="relative">
          <div className="absolute left-[58px] top-2 bottom-2 w-px bg-border" />
          <div className="space-y-3">
            {events.map((e) => (
              <div key={e.id} className="flex items-stretch gap-3">
                <div className="w-12 pt-3 text-right">
                  <div className="font-display font-bold tabular-nums text-sm">{e.time}</div>
                </div>
                <div className="relative flex flex-col items-center pt-4">
                  <div
                    className="w-3 h-3 rounded-full ring-4 ring-background"
                    style={{ background: `var(--${e.color})`, boxShadow: `0 0 12px var(--${e.color})` }}
                  />
                </div>
                <div className="flex-1 glass rounded-2xl p-3 ml-1">
                  <div className="flex items-center gap-2">
                    <span
                      className="px-2 py-0.5 rounded-full text-[9px] uppercase tracking-widest font-bold"
                      style={{
                        background: `oklch(from var(--${e.color}) l c h / 0.15)`,
                        color: `var(--${e.color})`,
                      }}
                    >
                      {e.category}
                    </span>
                    {e.priority === "high" && (
                      <span className="text-[9px] uppercase tracking-widest text-warning">Prioritário</span>
                    )}
                  </div>
                  <div className="font-display font-bold mt-1">{e.title}</div>
                  {e.location && (
                    <div className="text-[11px] text-muted-foreground flex items-center gap-1 mt-1">
                      <MapPin className="w-3 h-3" /> {e.location}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-24 right-1/2 translate-x-[228px] z-40 w-14 h-14 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center animate-glow-pulse active:scale-95"
      >
        <Plus className="w-6 h-6" strokeWidth={2.5} />
      </button>

      {open && <AddEventSheet onClose={() => setOpen(false)} />}
    </div>
  );
}

function AddEventSheet({ onClose }: { onClose: () => void }) {
  const [title, setTitle] = useState("");
  const [time, setTime] = useState("09:00");
  const [category, setCategory] = useState("Trabalho");
  const [color, setColor] = useState<"cyan" | "violet" | "neon">("cyan");

  return (
    <div className="fixed inset-0 z-[80] flex items-end bg-background/70 backdrop-blur-sm" onClick={onClose}>
      <div className="w-full max-w-[480px] mx-auto glass-strong rounded-t-3xl p-5 pb-8 animate-fade-up" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display font-bold tracking-[0.2em] uppercase text-sm">Novo Evento</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-secondary/60 flex items-center justify-center">
            <X className="w-4 h-4" />
          </button>
        </div>
        <SheetField label="Título"><input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full bg-transparent focus:outline-none" placeholder="Reunião, treino…" /></SheetField>
        <div className="grid grid-cols-2 gap-3">
          <SheetField label="Horário"><input type="time" value={time} onChange={(e) => setTime(e.target.value)} className="w-full bg-transparent focus:outline-none tabular-nums" /></SheetField>
          <SheetField label="Categoria"><input value={category} onChange={(e) => setCategory(e.target.value)} className="w-full bg-transparent focus:outline-none" /></SheetField>
        </div>
        <div className="glass rounded-2xl px-4 py-3 mt-2">
          <div className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground mb-2">Cor</div>
          <div className="flex gap-2">
            {(["cyan", "violet", "neon"] as const).map((c) => (
              <button key={c} onClick={() => setColor(c)}
                className={`w-8 h-8 rounded-full transition-all ${color === c ? "ring-2 ring-foreground" : ""}`}
                style={{ background: `var(--${c})`, boxShadow: `0 0 12px var(--${c})` }} />
            ))}
          </div>
        </div>
        <button
          onClick={() => {
            if (!title) return;
            store.addEvent({ title, time, category, color, priority: "med" });
            onClose();
          }}
          className="mt-5 w-full py-3.5 rounded-2xl bg-primary text-primary-foreground font-display font-bold tracking-[0.2em] uppercase animate-glow-pulse"
        >
          Agendar
        </button>
      </div>
    </div>
  );
}

function SheetField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-3 glass rounded-2xl px-4 py-2.5">
      <div className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground">{label}</div>
      <div className="mt-1">{children}</div>
    </div>
  );
}
