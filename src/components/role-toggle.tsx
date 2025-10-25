"use client";

import { useState } from "react";
import { useRole } from "@/contexts/role-context";
import { BriefcaseBusiness, UserRound } from "lucide-react";
import { cn } from "@/lib/utils";

type Role = "buyer" | "seller";

const roleConfig = {
  buyer: {
    label: "Buying",
    icon: BriefcaseBusiness,
    gradient: "from-blue-500 via-blue-400 to-emerald-300",
    ring: "focus-visible:ring-blue-400",
    shadow: "shadow-[0_12px_30px_rgba(56,189,248,0.35)]",
  },
  seller: {
    label: "Selling",
    icon: UserRound,
    gradient: "from-amber-400 via-orange-400 to-rose-300",
    ring: "focus-visible:ring-amber-400",
    shadow: "shadow-[0_12px_30px_rgba(251,191,36,0.35)]",
  },
} as const;

export function RoleToggle() {
  const { isBuyer, toggleRole } = useRole();
  const [isToggling, setIsToggling] = useState(false);
  const currentRole: Role = isBuyer ? "buyer" : "seller";

  const handleToggle = async () => {
    try {
      setIsToggling(true);
      await toggleRole();
    } finally {
      setIsToggling(false);
    }
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-white/60 p-4 shadow-sm backdrop-blur">
      <div className="space-y-2">
        <p className="text-xs font-medium uppercase tracking-[0.3em] text-slate-500"></p>
        <div className="flex rounded-full border border-white/40 bg-white/70 p-1 shadow-inner shadow-slate-200">
          {(["buyer", "seller"] as const).map((role) => {
            const isActive = currentRole === role;
            const config = roleConfig[role];
            const Icon = config.icon;

            return (
              <button
                key={role}
                onClick={handleToggle}
                disabled={isToggling}
                className={cn(
                  "flex-1 items-center justify-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-all",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-offset-white",
                  "disabled:opacity-60 disabled:cursor-not-allowed",
                  isActive
                    ? cn(
                        "bg-gradient-to-r text-slate-950 shadow-lg",
                        config.gradient,
                        config.shadow
                      )
                    : "text-slate-500 hover:text-slate-700",
                  config.ring
                )}
                aria-pressed={isActive}
                aria-busy={isToggling}
              >
                <Icon className="h-4 w-4" />
                <span>{config.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
