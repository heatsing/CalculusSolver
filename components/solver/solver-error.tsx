import { AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function SolverError({
  message,
  onRetry
}: {
  message: string;
  onRetry?: () => void;
}): React.JSX.Element {
  return (
    <Card className="mt-8 animate-fade-in border-error/20 bg-error/5">
      <CardContent className="flex items-start gap-3 p-5">
        <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-error" />
        <div className="flex-1">
          <p className="font-semibold text-heading">Something went wrong</p>
          <p className="mt-1 text-sm text-body">{message}</p>
          {onRetry && (
            <Button
              variant="outline"
              size="sm"
              className="mt-3"
              onClick={onRetry}
            >
              Try again
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
