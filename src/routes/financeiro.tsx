import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { StatusHeader } from "@/components/system/StatusHeader";
import { store, useStore, type Transaction } from "@/lib/store";
import { ArrowDownRight, ArrowUpRight, Plus, X, TrendingUp, Pencil } from "lucide-react";

export const Route = createFileRoute("/financeiro")({
  component: Financeiro,
});

function Financeiro() {
  const txns = useStore((s) => s.transactions);
  const monthlyBudget = useStore((s) => s.monthlyBudget);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Transaction | null>(null);
  const [budgetInput, setBudgetInput] = useState(monthlyBudget != null ? String(monthlyBudget) : "");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const filteredTxns = useMemo(() => {
    if (!dateFrom && !dateTo) return txns;
    return txns.filter((t) => {
      const d = t.date.slice(0, 10);
      if (dateFrom && d < dateFrom) return false;
      if (dateTo && d > dateTo) return false;
      return true;
    });
  }, [txns, dateFrom, dateTo]);

  const hasBudget = monthlyBudget != null;

  const { income, expense } = useMemo(() => {
    let income = 0, expense = 0;
    filteredTxns.forEach((t) => (t.amount > 0 ? (income += t.amount) : (expense += -t.amount)));
    return { income, expense };
  }, [filteredTxns]);

  const balance = hasBudget ? monthlyBudget + income - expense : -expense;
  const maxBar = Math.max(income, expense, 1);

  return (
    <div>
      <StatusHeader subtitle="Caixa do Hunter" />

      {/* Balance hero */}
      <section className="px-5 mt-2 animate-fade-up">
        <div className="glass-strong rounded-3xl p-5 relative overflow-hidden">
          <div className="absolute inset-0 opacity-50" style={{ background: "var(--gradient-glow)" }} />
          <div className="relative">
            <div className="text-[10px] tracking-[0.4em] uppercase text-primary">
              {hasBudget ? "Saldo Disponível" : "Total de Saídas"}
            </div>
            <div className="mt-1 text-4xl font-display font-bold text-glow tabular-nums">
              R$ {balance.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </div>
            {hasBudget ? (
              <>
                <div className="mt-4 grid grid-cols-2 gap-2">
                  <BalancePill label="Entradas" value={income} tone="success" icon={<ArrowUpRight className="w-3.5 h-3.5" />} />
                  <BalancePill label="Saídas" value={expense} tone="warning" icon={<ArrowDownRight className="w-3.5 h-3.5" />} />
                </div>
                <div className="mt-4 h-2 rounded-full bg-secondary/50 overflow-hidden flex">
                  <div
                    className="h-full transition-all"
                    style={{ width: `${(income / (income + expense || 1)) * 100}%`, background: "var(--success)", boxShadow: "0 0 12px var(--success)" }}
                  />
                  <div
                    className="h-full transition-all"
                    style={{ width: `${(expense / (income + expense || 1)) * 100}%`, background: "var(--warning)", boxShadow: "0 0 12px var(--warning)" }}
                  />
                </div>
              </>
            ) : (
              <div className="mt-4 grid grid-cols-1 gap-2">
                <BalancePill label="Saídas" value={expense} tone="warning" icon={<ArrowDownRight className="w-3.5 h-3.5" />} />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Monthly budget + date filter */}
      <section className="px-5 mt-5 animate-fade-up space-y-3">
        <div className="glass rounded-2xl p-4">
          <div className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground mb-2">
            Valor mensal disponível (opcional)
          </div>
          <div className="flex items-center gap-2">
            <input
              type="number"
              inputMode="decimal"
              value={budgetInput}
              onChange={(e) => setBudgetInput(e.target.value)}
              onBlur={() => {
                const n = parseFloat(budgetInput.replace(",", "."));
                store.setMonthlyBudget(Number.isFinite(n) && budgetInput !== "" ? n : undefined);
              }}
              placeholder="Ex.: 4500,00"
              className="flex-1 bg-transparent text-lg font-display font-bold focus:outline-none"
            />
            {hasBudget && (
              <button
                onClick={() => { setBudgetInput(""); store.setMonthlyBudget(undefined); }}
                className="text-[10px] uppercase tracking-widest text-muted-foreground"
              >
                Limpar
              </button>
            )}
          </div>
          <div className="text-[11px] text-muted-foreground mt-1">
            {hasBudget ? "Exibindo entradas e saídas." : "Preencha para também acompanhar entradas."}
          </div>
        </div>

        <div className="glass rounded-2xl p-4">
          <div className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground mb-2">Filtrar por período</div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <div className="text-[9px] uppercase tracking-widest text-muted-foreground mb-1">De</div>
              <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className="w-full bg-transparent focus:outline-none tabular-nums" />
            </div>
            <div>
              <div className="text-[9px] uppercase tracking-widest text-muted-foreground mb-1">Até</div>
              <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} className="w-full bg-transparent focus:outline-none tabular-nums" />
            </div>
          </div>
          {(dateFrom || dateTo) && (
            <button
              onClick={() => { setDateFrom(""); setDateTo(""); }}
              className="mt-2 text-[10px] uppercase tracking-widest text-muted-foreground"
            >
              Limpar filtro
            </button>
          )}
        </div>
      </section>

      {/* Mini chart */}
      <section className="px-5 mt-5 animate-fade-up">
        <div className="glass rounded-2xl p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-display tracking-[0.2em] uppercase">Fluxo Semanal</h3>
            <TrendingUp className="w-4 h-4 text-success" />
          </div>
          <div className="flex items-end gap-1.5 h-24">
            {[40, 65, 30, 80, 55, 90, 70].map((v, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div
                  className="w-full rounded-t-md transition-all"
                  style={{
                    height: `${v}%`,
                    background: "linear-gradient(180deg, var(--cyan), var(--primary))",
                    boxShadow: "0 0 8px var(--primary)",
                  }}
                />
                <div className="text-[9px] text-muted-foreground">{["S","T","Q","Q","S","S","D"][i]}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Transactions */}
      <section className="px-5 mt-6 animate-fade-up">
        <div className="flex items-end justify-between mb-3">
          <h2 className="text-sm font-display font-bold tracking-[0.2em] uppercase">Movimentações</h2>
          <span className="text-[10px] text-muted-foreground">{filteredTxns.length} registros</span>
        </div>
        <div className="space-y-2.5 pb-2">
          {filteredTxns.map((t) => (
            <TxnRow key={t.id} t={t} maxBar={maxBar} onEdit={() => setEditing(t)} />
          ))}
          {filteredTxns.length === 0 && (
            <div className="glass rounded-2xl px-4 py-3 text-xs text-muted-foreground text-center">Nenhuma movimentação no período</div>
          )}
        </div>
      </section>

      <FloatingAddButton onClick={() => setOpen(true)} />
      {open && <TxnSheet onClose={() => setOpen(false)} />}
      {editing && <TxnSheet txn={editing} onClose={() => setEditing(null)} />}
    </div>
  );
}

function BalancePill({
  label, value, tone, icon,
}: { label: string; value: number; tone: "success" | "warning"; icon: React.ReactNode }) {
  return (
    <div className="rounded-xl px-3 py-2 bg-background/40 border border-border">
      <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-muted-foreground">
        <span style={{ color: `var(--${tone})` }}>{icon}</span>{label}
      </div>
      <div className="text-base font-display font-bold tabular-nums mt-0.5" style={{ color: `var(--${tone})` }}>
        R$ {value.toLocaleString("pt-BR", { minimumFractionDigits: 0 })}
      </div>
    </div>
  );
}

function TxnRow({ t, maxBar, onEdit }: { t: Transaction; maxBar: number; onEdit: () => void }) {
  const isExpense = t.amount < 0;
  const tone = isExpense ? "warning" : "success";
  const bar = (Math.abs(t.amount) / maxBar) * 100;
  return (
    <div className="glass rounded-2xl px-4 py-3 relative overflow-hidden">
      <div
        className="absolute left-0 bottom-0 h-0.5 transition-all"
        style={{ width: `${bar}%`, background: `var(--${tone})`, boxShadow: `0 0 8px var(--${tone})` }}
      />
      <div className="flex items-center gap-3">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: `oklch(from var(--${tone}) l c h / 0.15)`, color: `var(--${tone})` }}
        >
          {isExpense ? <ArrowDownRight className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-semibold truncate">{t.description}</div>
          <div className="text-[11px] text-muted-foreground flex items-center gap-1.5">
            <span>{t.category}</span>
            <span>•</span>
            <span>{t.method}</span>
            <span className={`ml-1 px-1.5 py-0.5 rounded-full text-[9px] uppercase tracking-wider border ${
              t.status === "Pago" ? "border-success/40 text-success" :
              t.status === "Pendente" ? "border-warning/40 text-warning" :
              "border-primary/40 text-primary"
            }`}>{t.status}</span>
          </div>
        </div>
        <div className="text-right shrink-0">
          <div className="font-display font-bold tabular-nums" style={{ color: `var(--${tone})` }}>
            {isExpense ? "-" : "+"} R$ {Math.abs(t.amount).toFixed(2)}
          </div>
        </div>
        <button
          onClick={onEdit}
          className="w-7 h-7 rounded-full bg-secondary/60 flex items-center justify-center shrink-0 active:scale-95"
          aria-label="Editar movimentação"
        >
          <Pencil className="w-3.5 h-3.5 text-muted-foreground" />
        </button>
      </div>
    </div>
  );
}

function FloatingAddButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-24 right-1/2 translate-x-[228px] z-40 w-14 h-14 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center animate-glow-pulse active:scale-95 transition-transform"
      aria-label="Adicionar transação"
    >
      <Plus className="w-6 h-6" strokeWidth={2.5} />
    </button>
  );
}

function TxnSheet({ txn, onClose }: { txn?: Transaction; onClose: () => void }) {
  const isEditing = !!txn;
  const [type, setType] = useState<"expense" | "income">(txn ? (txn.amount < 0 ? "expense" : "income") : "expense");
  const [amount, setAmount] = useState(txn ? String(Math.abs(txn.amount)) : "");
  const [category, setCategory] = useState(txn?.category ?? "Alimentação");
  const [description, setDescription] = useState(txn?.description ?? "");
  const [method, setMethod] = useState<Transaction["method"]>(txn?.method ?? "Pix");

  return (
    <div className="fixed inset-0 z-[80] flex items-end justify-center bg-background/70 backdrop-blur-sm animate-fade-up" onClick={onClose}>
      <div className="w-full max-w-[480px] glass-strong rounded-t-3xl p-5 pb-8 animate-fade-up" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display font-bold tracking-[0.2em] uppercase text-sm">{isEditing ? "Editar Movimentação" : "Nova Movimentação"}</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-secondary/60 flex items-center justify-center">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="grid grid-cols-2 gap-2 mb-4">
          {(["expense", "income"] as const).map((k) => (
            <button
              key={k}
              onClick={() => setType(k)}
              className={`py-2.5 rounded-xl text-sm font-bold uppercase tracking-wider transition-all ${
                type === k ? "bg-primary text-primary-foreground" : "bg-secondary/40 text-muted-foreground"
              }`}
            >
              {k === "expense" ? "Saída" : "Entrada"}
            </button>
          ))}
        </div>
        <Field label="Valor">
          <input
            type="number" inputMode="decimal" value={amount} onChange={(e) => setAmount(e.target.value)}
            placeholder="0,00"
            className="w-full bg-transparent text-2xl font-display font-bold focus:outline-none"
          />
        </Field>
        <Field label="Observação / Descrição">
          <input value={description} onChange={(e) => setDescription(e.target.value)} className="w-full bg-transparent focus:outline-none" placeholder="Ex.: Café no centro" />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Categoria">
            <input value={category} onChange={(e) => setCategory(e.target.value)} className="w-full bg-transparent focus:outline-none" />
          </Field>
          <Field label="Forma">
            <select value={method} onChange={(e) => setMethod(e.target.value as Transaction["method"])} className="w-full bg-transparent focus:outline-none">
              <option className="bg-background">Pix</option>
              <option className="bg-background">Crédito</option>
              <option className="bg-background">Débito</option>
              <option className="bg-background">Dinheiro</option>
            </select>
          </Field>
        </div>
        <button
          onClick={() => {
            const n = parseFloat(amount.replace(",", "."));
            if (!n || !description) return;
            if (isEditing) {
              store.updateTransaction(txn.id, {
                amount: type === "expense" ? -Math.abs(n) : Math.abs(n),
                category, description, method, status: txn.status,
              });
            } else {
              store.addTransaction({
                amount: type === "expense" ? -Math.abs(n) : Math.abs(n),
                category, description, method, status: "Pago",
              });
            }
            if (navigator.vibrate) navigator.vibrate(20);
            onClose();
          }}
          className="mt-5 w-full py-3.5 rounded-2xl bg-primary text-primary-foreground font-display font-bold tracking-[0.2em] uppercase animate-glow-pulse"
        >
          {isEditing ? "Salvar Alterações" : "Registrar"}
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
