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
  },
  seller: {
    label: "Selling",
    icon: UserRound,
    gradient: "from-amber-400 via-orange-400 to-rose-300",
  },
} as const;

export function RoleToggle() {
  const { isBuyer, toggleRole } = useRole();
  const [isToggling, setIsToggling] = useState(false);
  const currentRole: Role = isBuyer ? "buyer" : "seller";

  const handleToggle = async (targetRole: Role) => {
    if ((targetRole === "buyer") === isBuyer) {
      return;
    }
    try {
      setIsToggling(true);
      await toggleRole();
    } finally {
      setIsToggling(false);
    }
  };

  return (
    <div className="rounded-lg border border-slate-200 bg-white/70 p-1.5 shadow-sm">
      <div className="grid grid-cols-2 gap-1 rounded-md bg-white/90 p-1">
        {(["buyer", "seller"] as const).map((role) => {
          const isActive = currentRole === role;
          const config = roleConfig[role];
          const Icon = config.icon;

          return (
            <button
              key={role}
              type="button"
              onClick={() => handleToggle(role)}
              disabled={isToggling}
              className={cn(
                "flex items-center justify-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium transition-all",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-slate-200",
                "disabled:cursor-not-allowed disabled:opacity-60",
                isActive
                  ? cn("bg-gradient-to-r text-slate-950 shadow-sm", config.gradient)
                  : "text-slate-500 hover:text-slate-700"
              )}
              aria-pressed={isActive}
              aria-busy={isToggling}
            >
              <Icon className="h-3.5 w-3.5" />
              <span>{config.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
