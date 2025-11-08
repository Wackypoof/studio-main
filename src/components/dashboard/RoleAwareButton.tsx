"use client";

import { Button, type ButtonProps } from "@/components/ui/button";
import { useRole } from "@/contexts/role-context";
import { cn } from "@/lib/utils";

type RoleAwareButtonProps = ButtonProps & {
  /**
   * Whether to apply the role-based gradient styling for the default variant.
   * Set to `false` to opt-out for specific buttons.
   */
  roleGradient?: boolean;
};

export function RoleAwareButton({
  className,
  variant,
  roleGradient = true,
  ...props
}: RoleAwareButtonProps) {
  const { isBuyer } = useRole();

  const isDefaultVariant = !variant || variant === "default";
  const shouldApplyGradient = roleGradient && isDefaultVariant;

  const gradientClasses = shouldApplyGradient
    ? isBuyer
      ? "border-transparent bg-gradient-to-r from-blue-500 via-blue-400 to-emerald-300 text-slate-950 shadow-[0_12px_30px_rgba(56,189,248,0.28)] transition-all hover:from-blue-400 hover:via-blue-300 hover:to-emerald-200 hover:shadow-[0_14px_34px_rgba(56,189,248,0.32)] focus-visible:ring-blue-200"
      : "border-transparent bg-gradient-to-r from-amber-400 via-orange-400 to-rose-300 text-slate-950 shadow-[0_12px_30px_rgba(251,191,36,0.28)] transition-all hover:from-amber-300 hover:via-orange-300 hover:to-rose-200 hover:shadow-[0_14px_34px_rgba(251,191,36,0.32)] focus-visible:ring-amber-200"
    : undefined;

  return (
    <Button shape="pill"
      variant={variant}
      className={cn(shouldApplyGradient && "hover:bg-transparent", gradientClasses, className)}
      {...props}
    />
  );
}
