import { cn } from "@/lib/utils";

export function BrandLogo({ inverse = false, compact = false, className }: { inverse?: boolean; compact?: boolean; className?: string }): React.JSX.Element {
  return <span className={cn("inline-flex shrink-0 items-center", compact ? "gap-2.5" : "gap-3", className)} aria-label="Calculus Solver">
    <span className={cn("flex shrink-0 items-center justify-center rounded-[22%] bg-gradient-to-br from-[#6236ff] to-[#7b35e8] text-white shadow-sm", compact ? "h-8 w-8 text-2xl" : "h-10 w-10 text-[30px]")} aria-hidden="true"><span className="-translate-y-px font-serif italic leading-none">∫</span></span>
    <span className={cn("whitespace-nowrap font-bold tracking-[-0.025em]", compact ? "text-base" : "text-xl", inverse ? "text-white" : "text-[#050b24]")}>Calculus Solver</span>
  </span>;
}
