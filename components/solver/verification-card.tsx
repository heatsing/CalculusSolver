"use client";

import { Shield, ShieldAlert, ShieldCheck, ShieldQuestion } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { SolverResult } from "@/types/solver";
import { cn } from "@/lib/utils";

type VerificationTone = "verified" | "partial" | "unknown";

const statusConfig: Record<
  VerificationTone,
  { icon: React.ElementType; color: string; bg: string; label: string }
> = {
  verified: {
    icon: ShieldCheck,
    color: "text-success",
    bg: "bg-success/10",
    label: "Verified"
  },
  partial: {
    icon: ShieldAlert,
    color: "text-warning",
    bg: "bg-warning/10",
    label: "Partial"
  },
  unknown: {
    icon: ShieldQuestion,
    color: "text-body",
    bg: "bg-secondary-background",
    label: "Unknown"
  }
};

function mapStatusToTone(result: SolverResult): VerificationTone {
  const local = result.localVerification.status;
  if (local === "verified") return "verified";
  if (local === "partially_verified") return "partial";
  return "unknown";
}

function getVerificationExplanation(result: SolverResult): string {
  const local = result.localVerification;
  const ai = result.aiVerification;

  if (local.status === "verified") {
    return local.explanation || "Checked using symbolic equivalence.";
  }
  if (local.status === "partially_verified") {
    return local.explanation || "Numerical checks passed.";
  }

  if (ai.status === "verified") {
    return "AI reasoning indicates consistency; no independent local verification available.";
  }
  return local.explanation || "Not independently verified.";
}

export function VerificationCard({ result }: { result: SolverResult }): React.JSX.Element {
  const tone = mapStatusToTone(result);
  const config = statusConfig[tone];
  const Icon = config.icon;
  const explanation = getVerificationExplanation(result);

  return (
    <Card className="animate-fade-in">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <span className={cn("flex h-8 w-8 items-center justify-center rounded-full", config.bg)}>
            <Icon className={cn("h-4 w-4", config.color)} />
          </span>
          {config.label}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-body">{explanation}</p>
      </CardContent>
    </Card>
  );
}
