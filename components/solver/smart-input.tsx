"use client";

import * as React from "react";
import { ArrowRight, Loader2 } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type SmartInputProps = {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  loading?: boolean;
};

export function SmartInput({ value, onChange, onSubmit, loading }: SmartInputProps): React.JSX.Element {
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

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
        placeholder="Solve ∫ x² sin(x) dx or find the derivative of x³ + 2x"
        disabled={loading}
        className="min-h-[100px] resize-none border-0 bg-transparent px-4 pt-4 pb-14 text-base text-heading shadow-none placeholder:text-body/60 focus-visible:ring-0 focus-visible:ring-offset-0"
        aria-label="Math problem input"
      />
      <div className="absolute bottom-3 right-3 flex items-center gap-2">
        <span className="hidden text-xs text-body sm:inline">Shift + Enter for new line</span>
        <Button
          onClick={onSubmit}
          disabled={loading || value.trim().length === 0}
          size="icon"
          className="h-10 w-10 rounded-input"
        >
          {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <ArrowRight className="h-5 w-5" />}
        </Button>
      </div>
    </div>
  );
}
