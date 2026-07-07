import { Copy, Check, RefreshCw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LatexBlock } from "@/components/solver/latex-render";
import type { SolverResult } from "@/types/solver";
import * as React from "react";

const answerTypeLabels: Record<string, string> = {
  exact: "Exact",
  approximate: "Approximate",
  conditional: "Conditional",
  no_closed_form: "No closed form",
  unknown: "Uncertain"
};

export function AnswerCard({
  result,
  onNewProblem
}: {
  result: SolverResult;
  onNewProblem: () => void;
}): React.JSX.Element {
  const [copiedAnswer, setCopiedAnswer] = React.useState(false);
  const [copiedLatex, setCopiedLatex] = React.useState(false);

  async function copy(text: string, setter: (value: boolean) => void): Promise<void> {
    await navigator.clipboard.writeText(text);
    setter(true);
    setTimeout(() => setter(false), 2000);
  }

  return (
    <Card className="animate-fade-in border-primary/20 bg-primary-soft/40">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Answer</CardTitle>
          <div className="flex gap-2">
            <Badge variant="secondary">{answerTypeLabels[result.answerType] ?? result.answerType}</Badge>
          </div>
        </div>
        <CardDescription>
          Verification: <span className="font-medium text-heading capitalize">{result.localVerification.status.replace("_", " ")}</span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-card bg-white p-4">
          <LatexBlock latex={result.answerLatex} />
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => copy(result.answer, setCopiedAnswer)}
          >
            {copiedAnswer ? <Check className="mr-1 h-4 w-4" /> : <Copy className="mr-1 h-4 w-4" />}
            Copy
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => copy(result.answerLatex, setCopiedLatex)}
          >
            {copiedLatex ? <Check className="mr-1 h-4 w-4" /> : <Copy className="mr-1 h-4 w-4" />}
            Copy LaTeX
          </Button>
          <Button variant="outline" size="sm" onClick={onNewProblem}>
            <RefreshCw className="mr-1 h-4 w-4" />
            New Problem
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
