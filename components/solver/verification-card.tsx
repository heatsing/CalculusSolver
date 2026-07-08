import { Shield, ShieldAlert, ShieldCheck, ShieldQuestion, ShieldX } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { SolverResult } from "@/types/solver";
import { cn } from "@/lib/utils";

const statusConfig = {
  verified: { icon: ShieldCheck, color: "text-success", bg: "bg-success/10", label: "Verified locally" },
  partially_verified: { icon: ShieldAlert, color: "text-warning", bg: "bg-warning/10", label: "Partially verified locally" },
  not_verified: { icon: ShieldX, color: "text-body", bg: "bg-secondary-background", label: "Not verified locally" },
  uncertain: { icon: ShieldQuestion, color: "text-body", bg: "bg-secondary-background", label: "Uncertain" },
  unsupported: { icon: Shield, color: "text-body", bg: "bg-secondary-background", label: "Cannot verify locally" }
};

export function VerificationCard({ result }: { result: SolverResult }): React.JSX.Element {
  const config = statusConfig[result.localVerification.status];
  const Icon = config.icon;

  return (
    <Card className="animate-fade-in">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className={cn("flex h-8 w-8 items-center justify-center rounded-full", config.bg)}>
            <Icon className={cn("h-4 w-4", config.color)} />
          </span>
          {config.label}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-body">{result.localVerification.explanation}</p>
        {result.aiVerification.status === "uncertain" && (
          <p className="mt-2 text-sm text-body">AI verification status: uncertain.</p>
        )}
      </CardContent>
    </Card>
  );
}
