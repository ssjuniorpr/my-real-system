// Simple in-memory mock store for the MySystem prototype.
// Using module-level state + React subscription pattern (no extra deps).

import { useSyncExternalStore } from "react";

export type Mission = {
  id: string;
  title: string;
  category: string;
  xp: number;
  priority: "low" | "med" | "high";
  time?: string;
  done: boolean;
};

export type Transaction = {
  id: string;
  amount: number; // negative = expense, positive = income
  category: string;
  description: string;
  method: "Pix" | "Crédito" | "Débito" | "Dinheiro";
  status: "Pago" | "Pendente" | "Parcelado";
  date: string; // ISO
};

export type AgendaEvent = {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  time: string;
  category: string;
  color: string;
  location?: string;
  description?: string;
  priority: "low" | "med" | "high";
};

type State = {
  totalXp: number;
  level: number;
  xp: number;
  xpToNext: number;
  streak: number;
  missions: Mission[];
  transactions: Transaction[];
  events: AgendaEvent[];
  lastLevelUp?: number;
  monthlyBudget?: number;
  bibleVerseEnabled: boolean;
};

const todayISO = () => new Date().toISOString();
const todayDateOnly = () => new Date().toISOString().slice(0, 10);

const XP_PER_LEVEL = 1000;

const state: State = {
  totalXp: 12420,
  level: 12,
  xp: 420,
  xpToNext: XP_PER_LEVEL,
  streak: 18,
  missions: [
    { id: "m1", title: "Treinar pernas", category: "Academia", xp: 50, priority: "high", time: "06:30", done: true },
    { id: "m2", title: "Estudar 1h de TypeScript", category: "Estudos", xp: 40, priority: "high", time: "08:00", done: true },
    { id: "m3", title: "Pagar contas do mês", category: "Casa", xp: 30, priority: "high", time: "10:00", done: false },
    { id: "m4", title: "Fazer marmita da semana", category: "Casa", xp: 25, priority: "med", time: "12:00", done: false },
    { id: "m5", title: "Reunião de alinhamento", category: "Trabalho", xp: 20, priority: "med", time: "14:30", done: true },
    { id: "m6", title: "Caminhada 5km", category: "Academia", xp: 35, priority: "med", time: "18:00", done: false },
    { id: "m7", title: "Meditar 10 min", category: "Pessoal", xp: 15, priority: "low", time: "22:00", done: false },
  ],
  transactions: [
    { id: "t1", amount: -42, category: "Alimentação", description: "Almoço", method: "Pix", status: "Pago", date: todayISO() },
    { id: "t2", amount: -89.9, category: "Transporte", description: "Uber semana", method: "Crédito", status: "Pago", date: todayISO() },
    { id: "t3", amount: 4200, category: "Salário", description: "Pagamento mensal", method: "Pix", status: "Pago", date: todayISO() },
    { id: "t4", amount: -129, category: "Lazer", description: "Streaming", method: "Crédito", status: "Parcelado", date: todayISO() },
    { id: "t5", amount: -350, category: "Casa", description: "Internet", method: "Débito", status: "Pendente", date: todayISO() },
  ],
  events: [
    { id: "e1", title: "Treino Funcional", date: todayDateOnly(), time: "06:30", category: "Academia", color: "cyan", priority: "high" },
    { id: "e2", title: "Daily do time", date: todayDateOnly(), time: "10:00", category: "Trabalho", color: "violet", location: "Online", priority: "med" },
    { id: "e3", title: "Consulta médica", date: todayDateOnly(), time: "15:00", category: "Pessoal", color: "neon", location: "Clínica Vita", priority: "high" },
    { id: "e4", title: "Curso de inglês", date: todayDateOnly(), time: "20:00", category: "Estudos", color: "cyan", priority: "med" },
  ],
  bibleVerseEnabled: true,
};

const listeners = new Set<() => void>();
const notify = () => listeners.forEach((l) => l());

// Level N requires N * XP_PER_LEVEL total accumulated XP (level 0 at start).
function applyXpChange(delta: number) {
  const prevLevel = state.level;
  state.totalXp = Math.max(0, state.totalXp + delta);
  state.level = Math.floor(state.totalXp / XP_PER_LEVEL);
  state.xp = state.totalXp % XP_PER_LEVEL;
  state.xpToNext = XP_PER_LEVEL;
  if (state.level > prevLevel) {
    state.lastLevelUp = Date.now();
  }
}

export const store = {
  get: () => state,
  toggleMission(id: string) {
    const m = state.missions.find((x) => x.id === id);
    if (!m) return;
    m.done = !m.done;
    applyXpChange(m.done ? m.xp : -m.xp);
    notify();
  },
  addMission(m: Omit<Mission, "id" | "done">) {
    state.missions.unshift({ ...m, id: crypto.randomUUID(), done: false });
    notify();
  },
  updateMission(id: string, updates: Omit<Mission, "id" | "done">) {
    const m = state.missions.find((x) => x.id === id);
    if (!m) return;
    Object.assign(m, updates);
    notify();
  },
  addTransaction(t: Omit<Transaction, "id" | "date">) {
    state.transactions.unshift({ ...t, id: crypto.randomUUID(), date: todayISO() });
    notify();
  },
  addEvent(e: Omit<AgendaEvent, "id">) {
    state.events.push({ ...e, id: crypto.randomUUID() });
    state.events.sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));
    notify();
  },
  updateEvent(id: string, updates: Omit<AgendaEvent, "id">) {
    const e = state.events.find((x) => x.id === id);
    if (!e) return;
    Object.assign(e, updates);
    state.events.sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));
    notify();
  },
  updateTransaction(id: string, updates: { amount: number; description: string; category: string; method: Transaction["method"]; status: Transaction["status"] }) {
    const t = state.transactions.find((x) => x.id === id);
    if (!t) return;
    Object.assign(t, updates);
    notify();
  },
  setMonthlyBudget(value: number | undefined) {
    state.monthlyBudget = value;
    notify();
  },
  toggleBibleVerse() {
    state.bibleVerseEnabled = !state.bibleVerseEnabled;
    notify();
  },
  clearLevelUp() {
    state.lastLevelUp = undefined;
    notify();
  },
};

export function useStore<T>(selector: (s: State) => T): T {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    () => selector(state),
    () => selector(state),
  );
}
