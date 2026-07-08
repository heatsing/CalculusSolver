"use client";

import * as React from "react";
import { CheckCircle2, XCircle, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MathDisplay } from "@/components/math/math-display";
import { cn } from "@/lib/utils";

async function compareStudentAnswer(student: string, correct: string): Promise<{
  status: "correct" | "close" | "incorrect";
  feedback: string;
}> {
  if (!student.trim()) return { status: "incorrect", feedback: "Please enter an answer." };

  try {
    const nerdamer = (await import("nerdamer")).default;
    await import("nerdamer/Algebra");
    await import("nerdamer/Calculus");

    const normalize = (expr: string) =>
      expr
        .replace(/\u00B2/g, "^2")
        .replace(/\u2212/g, "-")
        .replace(/\u00D7/g, "*")
        .replace(/\u00F7/g, "/")
        .replace(/\u221A/g, "sqrt")
        .replace(/\u03C0/g, "pi")
        .replace(/(\d)([a-zA-Z(])/g, "$1*$2")
        .replace(/\s+/g, "");

    const a = normalize(student);
    const b = normalize(correct);
    const diff = nerdamer(`(${a})-(${b})`).expand().toString();

    if (diff === "0") {
      return { status: "correct", feedback: "Great job! Your answer is mathematically equivalent." };
    }

    // Numerical check at a few points.
    const testValues = [1, 2, 3];
    let closeCount = 0;
    for (const x of testValues) {
      try {
        const av = Number(nerdamer(a.replace(/\bx\b/g, `(${x})`)).evaluate().toString());
        const bv = Number(nerdamer(b.replace(/\bx\b/g, `(${x})`)).evaluate().toString());
        if (Number.isFinite(av) && Number.isFinite(bv) && Math.abs(av - bv) < 1e-6) {
          closeCount++;
        }
      } catch {
        // ignore evaluation errors
      }
    }

    if (closeCount === testValues.length) {
      return { status: "close", feedback: "Your answer matches numerically but may differ in form. Check for simplification." };
    }

    return { status: "incorrect", feedback: "Not quite. Compare your steps with the solution above." };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Comparison failed";
    return { status: "incorrect", feedback: `Could not compare answers: ${message}` };
  }
}

export function CheckAnswer({ correctAnswer, correctLatex }: { correctAnswer: string; correctLatex?: string }): React.JSX.Element {
  const [studentAnswer, setStudentAnswer] = React.useState("");
  const [result, setResult] = React.useState<{ status: "correct" | "close" | "incorrect"; feedback: string } | null>(null);
  const [loading, setLoading] = React.useState(false);

  async function handleCheck(): Promise<void> {
    setLoading(true);
    const comparison = await compareStudentAnswer(studentAnswer, correctAnswer);
    setResult(comparison);
    setLoading(false);
  }

  const statusConfig = {
    correct: { icon: CheckCircle2, color: "text-success", bg: "bg-success/10" },
    close: { icon: AlertCircle, color: "text-warning", bg: "bg-warning/10" },
    incorrect: { icon: XCircle, color: "text-error", bg: "bg-error/10" }
  };

  return (
    <Card className="animate-fade-in">
      <CardHeader>
        <CardTitle className="text-base">Check my answer</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-body">Enter your answer below to compare with the solution.</p>
        <Textarea
          value={studentAnswer}
          onChange={(e) => setStudentAnswer(e.target.value)}
          placeholder="Type your answer in plain math notation..."
          className="min-h-[80px] resize-none"
        />
        <Button onClick={handleCheck} disabled={loading || !studentAnswer.trim()}>
          {loading ? "Checking..." : "Check answer"}
        </Button>

        {result && (
          <div className={cn("rounded-lg p-3", statusConfig[result.status].bg)}>
            <div className="flex items-center gap-2">
              {React.createElement(statusConfig[result.status].icon, {
                className: cn("h-5 w-5", statusConfig[result.status].color)
              })}
              <p className={cn("font-medium", statusConfig[result.status].color)}>
                {result.status === "correct" ? "Correct" : result.status === "close" ? "Close" : "Try again"}
              </p>
            </div>
            <p className="mt-1 text-sm text-body">{result.feedback}</p>
          </div>
        )}

        {correctLatex && (
          <div className="rounded-lg border border-border bg-white p-3">
            <p className="mb-1 text-xs text-body">Expected answer</p>
            <MathDisplay latex={correctLatex} display="block" />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
