import { AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export function SolverError({ message }: { message: string }): React.JSX.Element {
  return (
    <Card className="mt-8 animate-fade-in border-error/20 bg-error/5">
      <CardContent className="flex items-start gap-3 p-5">
        <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-error" />
        <div>
          <p className="font-semibold text-heading">Something went wrong</p>
          <p className="mt-1 text-sm text-body">{message}</p>
        </div>
      </CardContent>
    </Card>
  );
}
