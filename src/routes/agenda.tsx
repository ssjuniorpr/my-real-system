import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { StatusHeader } from "@/components/system/StatusHeader";
import { useStore, store, type AgendaEvent } from "@/lib/store";
import { Plus, MapPin, X, Pencil } from "lucide-react";

export const Route = createFileRoute("/agenda")({
  component: Agenda,
});

const WEEK = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];

function toDateOnly(d: Date) {
  return d.toISOString().slice(0, 10);
}

function formatDayLabel(dateStr: string) {
  const d = new Date(`${dateStr}T00:00:00`);
  return `${WEEK[(d.getDay() + 6) % 7]} • ${d.getDate()}/${d.getMonth() + 1}`;
}

function Agenda() {
  const events = useStore((s) => s.events);
  const [view, setView] = useState<"Dia" | "Expandida">("Dia");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<AgendaEvent | null>(null);
  const today = new Date();
  const [selectedDate, setSelectedDate] = useState(toDateOnly(today));
  const [rangeDays, setRangeDays] = useState(7);

  const dayEvents = useMemo(
    () => events.filter((e) => e.date === selectedDate),
    [events, selectedDate],
  );

  const expandedGroups = useMemo(() => {
    const days: { date: string; events: AgendaEvent[] }[] = [];
    const start = new Date(`${selectedDate}T00:00:00`);
    for (let i = 0; i < rangeDays; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      const dateStr = toDateOnly(d);
      days.push({ date: dateStr, events: events.filter((e) => e.date === dateStr) });
    }
    return days;
  }, [events, selectedDate, rangeDays]);

  return (
    <div>
      <StatusHeader subtitle="Agenda Inteligente" />

      <div className="px-5 mt-2 animate-fade-up">
        <div className="glass rounded-2xl p-1 grid grid-cols-2 gap-1">
          {(["Dia", "Expandida"] as const).map((v) => (
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
            const dateStr = toDateOnly(d);
            const isSelected = dateStr === selectedDate;
            return (
              <button
                key={i}
                onClick={() => setSelectedDate(dateStr)}
                className={`shrink-0 w-12 py-3 rounded-2xl flex flex-col items-center transition-all ${
                  isSelected ? "bg-primary text-primary-foreground animate-glow-pulse" : "glass"
                }`}
              >
                <span className="text-[10px] uppercase tracking-widest opacity-80">{WEEK[(d.getDay() + 6) % 7]}</span>
                <span className="text-lg font-display font-bold tabular-nums">{d.getDate()}</span>
              </button>
            );
          })}
        </div>
      </div>

      {view === "Expandida" && (
        <section className="px-5 mt-4 animate-fade-up">
          <div className="glass rounded-2xl px-4 py-3 flex items-center justify-between gap-3">
            <div className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground">Intervalo de dias</div>
            <input
              type="number"
              min={1}
              max={30}
              value={rangeDays}
              onChange={(e) => setRangeDays(Math.min(30, Math.max(1, Number(e.target.value) || 1)))}
              className="w-16 bg-transparent text-right font-display font-bold tabular-nums focus:outline-none"
            />
          </div>
        </section>
      )}

      {/* Timeline */}
      {view === "Dia" ? (
        <section className="px-5 mt-6 animate-fade-up pb-4">
          <div className="flex items-end justify-between mb-3">
            <h2 className="text-sm font-display font-bold tracking-[0.2em] uppercase">{formatDayLabel(selectedDate)}</h2>
            <span className="text-[10px] text-muted-foreground">{dayEvents.length} eventos</span>
          </div>
          <EventTimeline events={dayEvents} onEdit={setEditing} />
        </section>
      ) : (
        <section className="px-5 mt-6 animate-fade-up pb-4 space-y-6">
          {expandedGroups.map((group) => (
            <div key={group.date}>
              <div className="flex items-end justify-between mb-3">
                <h2 className="text-sm font-display font-bold tracking-[0.2em] uppercase">{formatDayLabel(group.date)}</h2>
                <span className="text-[10px] text-muted-foreground">{group.events.length} eventos</span>
              </div>
              {group.events.length > 0 ? (
                <EventTimeline events={group.events} onEdit={setEditing} />
              ) : (
                <div className="glass rounded-2xl px-4 py-3 text-xs text-muted-foreground text-center">Nenhum compromisso</div>
              )}
            </div>
          ))}
        </section>
      )}

      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-24 right-1/2 translate-x-[228px] z-40 w-14 h-14 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center animate-glow-pulse active:scale-95"
      >
        <Plus className="w-6 h-6" strokeWidth={2.5} />
      </button>

      {open && <EventSheet defaultDate={selectedDate} onClose={() => setOpen(false)} />}
      {editing && <EventSheet event={editing} defaultDate={selectedDate} onClose={() => setEditing(null)} />}
    </div>
  );
}

function EventTimeline({ events, onEdit }: { events: AgendaEvent[]; onEdit: (e: AgendaEvent) => void }) {
  return (
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
            <div className="flex-1 glass rounded-2xl p-3 ml-1 flex items-start gap-2">
              <div className="flex-1 min-w-0">
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
                {e.description && (
                  <div className="text-[11px] text-muted-foreground mt-1">{e.description}</div>
                )}
                {e.location && (
                  <div className="text-[11px] text-muted-foreground flex items-center gap-1 mt-1">
                    <MapPin className="w-3 h-3" /> {e.location}
                  </div>
                )}
              </div>
              <button
                onClick={() => onEdit(e)}
                className="w-7 h-7 rounded-full bg-secondary/60 flex items-center justify-center shrink-0 active:scale-95"
                aria-label="Editar compromisso"
              >
                <Pencil className="w-3.5 h-3.5 text-muted-foreground" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function EventSheet({ event, defaultDate, onClose }: { event?: AgendaEvent; defaultDate: string; onClose: () => void }) {
  const isEditing = !!event;
  const [title, setTitle] = useState(event?.title ?? "");
  const [date, setDate] = useState(event?.date ?? defaultDate);
  const [time, setTime] = useState(event?.time ?? "09:00");
  const [category, setCategory] = useState(event?.category ?? "Trabalho");
  const [description, setDescription] = useState(event?.description ?? "");
  const [color, setColor] = useState<"cyan" | "violet" | "neon">((event?.color as "cyan" | "violet" | "neon") ?? "cyan");

  return (
    <div className="fixed inset-0 z-[80] flex items-end bg-background/70 backdrop-blur-sm" onClick={onClose}>
      <div className="w-full max-w-[480px] mx-auto glass-strong rounded-t-3xl p-5 pb-8 animate-fade-up" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display font-bold tracking-[0.2em] uppercase text-sm">{isEditing ? "Editar Compromisso" : "Novo Evento"}</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-secondary/60 flex items-center justify-center">
            <X className="w-4 h-4" />
          </button>
        </div>
        <SheetField label="Título"><input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full bg-transparent focus:outline-none" placeholder="Reunião, treino…" /></SheetField>
        <div className="grid grid-cols-2 gap-3">
          <SheetField label="Data"><input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full bg-transparent focus:outline-none tabular-nums" /></SheetField>
          <SheetField label="Horário"><input type="time" value={time} onChange={(e) => setTime(e.target.value)} className="w-full bg-transparent focus:outline-none tabular-nums" /></SheetField>
        </div>
        <SheetField label="Categoria"><input value={category} onChange={(e) => setCategory(e.target.value)} className="w-full bg-transparent focus:outline-none" /></SheetField>
        <SheetField label="Descrição"><input value={description} onChange={(e) => setDescription(e.target.value)} className="w-full bg-transparent focus:outline-none" placeholder="Detalhes do compromisso…" /></SheetField>
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
            if (!title || !date) return;
            if (isEditing) {
              store.updateEvent(event.id, { title, date, time, category, color, description: description || undefined, priority: event.priority, location: event.location });
            } else {
              store.addEvent({ title, date, time, category, color, description: description || undefined, priority: "med" });
            }
            onClose();
          }}
          className="mt-5 w-full py-3.5 rounded-2xl bg-primary text-primary-foreground font-display font-bold tracking-[0.2em] uppercase animate-glow-pulse"
        >
          {isEditing ? "Salvar Alterações" : "Agendar"}
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
