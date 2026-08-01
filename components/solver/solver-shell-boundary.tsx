import { Suspense } from "react";
import { SolverShell } from "@/components/solver/solver-shell";

function SolverShellFallback(): React.JSX.Element {
  return (
    <div className="flex min-h-72 items-center justify-center rounded-xl border border-[#d9e4f3] bg-[#f8fbff]" role="status" aria-live="polite">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#d8e7ff] border-t-[#0967ed]" />
      <span className="ml-3 text-sm text-[#5f6f8d]">Loading calculator…</span>
    </div>
  );
}

export function SolverShellBoundary({ mode, operationHint }: { mode: string; operationHint?: string }): React.JSX.Element {
  return (
    <Suspense fallback={<SolverShellFallback />}>
      <SolverShell mode={mode} operationHint={operationHint} />
    </Suspense>
  );
}
