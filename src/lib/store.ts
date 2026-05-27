// Simple in-memory mock store for the MySystem prototype.
// Using module-level state + React subscription pattern (no extra deps).

import { useSyncExternalStore } from "react";

export type Mission = {
  id: string;
  title: string;
  category: "Trabalho" | "Academia" | "Estudos" | "Casa" | "Pessoal";
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
  time: string;
  category: string;
  color: string;
  location?: string;
  priority: "low" | "med" | "high";
};

type State = {
  level: number;
  xp: number;
  xpToNext: number;
  streak: number;
  missions: Mission[];
  transactions: Transaction[];
  events: AgendaEvent[];
  lastLevelUp?: number;
};

const todayISO = () => new Date().toISOString();

const state: State = {
  level: 12,
  xp: 7420,
  xpToNext: 9000,
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
    { id: "e1", title: "Treino Funcional", time: "06:30", category: "Academia", color: "cyan", priority: "high" },
    { id: "e2", title: "Daily do time", time: "10:00", category: "Trabalho", color: "violet", location: "Online", priority: "med" },
    { id: "e3", title: "Consulta médica", time: "15:00", category: "Pessoal", color: "neon", location: "Clínica Vita", priority: "high" },
    { id: "e4", title: "Curso de inglês", time: "20:00", category: "Estudos", color: "cyan", priority: "med" },
  ],
};

const listeners = new Set<() => void>();
const notify = () => listeners.forEach((l) => l());

export const store = {
  get: () => state,
  toggleMission(id: string) {
    const m = state.missions.find((x) => x.id === id);
    if (!m) return;
    m.done = !m.done;
    if (m.done) {
      state.xp += m.xp;
      if (state.xp >= state.xpToNext) {
        state.level += 1;
        state.xp = state.xp - state.xpToNext;
        state.xpToNext = Math.round(state.xpToNext * 1.2);
        state.lastLevelUp = Date.now();
      }
    } else {
      state.xp = Math.max(0, state.xp - m.xp);
    }
    notify();
  },
  addMission(m: Omit<Mission, "id" | "done">) {
    state.missions.unshift({ ...m, id: crypto.randomUUID(), done: false });
    notify();
  },
  addTransaction(t: Omit<Transaction, "id" | "date">) {
    state.transactions.unshift({ ...t, id: crypto.randomUUID(), date: todayISO() });
    notify();
  },
  addEvent(e: Omit<AgendaEvent, "id">) {
    state.events.push({ ...e, id: crypto.randomUUID() });
    state.events.sort((a, b) => a.time.localeCompare(b.time));
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
