"use client";

import * as React from "react";
import { ArrowRight, Loader2 } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const placeholderExamples = [
  "Solve ∫ x² sin(x) dx",
  "Find the derivative of x³ + 2x",
  "Solve 2x + 5 = 17",
  "Evaluate lim x→0 sin(x)/x",
  "Factor x² − 9"
];

export type SmartInputProps = {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  loading?: boolean;
};

export function SmartInput({ value, onChange, onSubmit, loading }: SmartInputProps): React.JSX.Element {
  const [placeholder, setPlaceholder] = React.useState(placeholderExamples[0]);
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  React.useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      index = (index + 1) % placeholderExamples.length;
      setPlaceholder(placeholderExamples[index]);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  function handleKeyDown(event: React.KeyboardEvent<HTMLTextAreaElement>): void {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      onSubmit();
    }
  }

  return (
    <div
      id="solver-input"
      className={cn(
        "relative mx-auto w-full max-w-solver-input rounded-input border border-border bg-white p-2 shadow-sm transition-shadow focus-within:shadow-md focus-within:ring-2 focus-within:ring-primary/20"
      )}
    >
      <Textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={loading}
        className="min-h-[100px] resize-none border-0 bg-transparent px-4 pt-4 pb-14 text-base text-heading shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
        aria-label="Math problem input"
      />
      <div className="absolute bottom-3 right-3 flex items-center gap-2">
        <span className="hidden text-xs text-body sm:inline">Shift + Enter for new line</span>
        <Button
          onClick={onSubmit}
          disabled={loading || value.trim().length === 0}
          size="sm"
          className="h-9 rounded-input px-4"
        >
          {loading ? (
            <>
              <Loader2 className="mr-1 h-4 w-4 animate-spin" /> Solving...
            </>
          ) : (
            <>
              <span className="hidden sm:inline">Solve</span>
              <ArrowRight className="h-4 w-4 sm:ml-1" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
