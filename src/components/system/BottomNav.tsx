import { Link, useRouterState } from "@tanstack/react-router";
import { Home, Wallet, Calendar, Target, User } from "lucide-react";

const items = [
  { to: "/", label: "Status", icon: Home },
  { to: "/financeiro", label: "Caixa", icon: Wallet },
  { to: "/agenda", label: "Agenda", icon: Calendar },
  { to: "/missoes", label: "Missões", icon: Target },
  { to: "/perfil", label: "Perfil", icon: User },
];

export function BottomNav() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] z-50 px-3 pb-3 pt-2 pointer-events-none">
      <div className="glass-strong pointer-events-auto rounded-2xl px-2 py-2 flex justify-between items-center">
        {items.map(({ to, label, icon: Icon }) => {
          const active = path === to;
          return (
            <Link
              key={to}
              to={to}
              className="flex flex-col items-center justify-center flex-1 py-1.5 rounded-xl transition-all duration-300 group"
            >
              <div
                className={`relative flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-300 ${
                  active
                    ? "bg-primary/20 text-primary"
                    : "text-muted-foreground group-hover:text-foreground"
                }`}
                style={active ? { boxShadow: "0 0 20px var(--primary)" } : undefined}
              >
                <Icon className="w-5 h-5" strokeWidth={active ? 2.5 : 2} />
                {active && (
                  <span className="absolute -top-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary animate-glow-pulse" />
                )}
              </div>
              <span
                className={`text-[10px] mt-0.5 font-medium tracking-wider uppercase ${
                  active ? "text-primary text-glow" : "text-muted-foreground"
                }`}
              >
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
