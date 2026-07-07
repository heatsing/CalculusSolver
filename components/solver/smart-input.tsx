"use client";

import * as React from "react";
import { ArrowRight, Loader2, MessageCircle, Code2, ImageUp } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { MathFieldInput } from "@/components/solver/math-field-input";
import { cn } from "@/lib/utils";

export type InputMode = "natural" | "formula" | "image";

export type SmartInputProps = {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  loading?: boolean;
};

const modes: { id: InputMode; label: string; icon: React.ElementType }[] = [
  { id: "natural", label: "Natural language", icon: MessageCircle },
  { id: "formula", label: "Formula input", icon: Code2 },
  { id: "image", label: "Image upload", icon: ImageUp }
];

export function SmartInput({ value, onChange, onSubmit, loading }: SmartInputProps): React.JSX.Element {
  const [mode, setMode] = React.useState<InputMode>("natural");
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  function handleKeyDown(event: React.KeyboardEvent<HTMLTextAreaElement>): void {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      onSubmit();
    }
  }

  function handleModeChange(nextMode: InputMode): void {
    setMode(nextMode);
    if (nextMode === "natural") {
      setTimeout(() => textareaRef.current?.focus(), 0);
    }
  }

  return (
    <div className="space-y-3">
      <div
        id="solver-input"
        className={cn(
          "relative mx-auto w-full max-w-solver-input rounded-input border border-border bg-white p-2 shadow-sm transition-shadow focus-within:shadow-md focus-within:ring-2 focus-within:ring-primary/20"
        )}
      >
        {mode === "image" ? (
          <div className="grid min-h-[100px] place-items-center px-4 py-8 text-center text-body">
            <div>
              <ImageUp className="mx-auto mb-2 h-8 w-8 text-primary" />
              <p className="font-medium text-heading">Image solving is coming soon.</p>
              <p className="text-sm">Drop an image or paste one here once OCR is ready.</p>
            </div>
          </div>
        ) : mode === "formula" ? (
          <MathFieldInput
            value={value}
            onChange={onChange}
            placeholder="Type a formula..."
            disabled={loading}
          />
        ) : (
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
        )}
        <div className="absolute bottom-3 right-3 flex items-center gap-2">
          <span className="hidden text-xs text-body sm:inline">Shift + Enter for new line</span>
          <Button
            onClick={onSubmit}
            disabled={loading || value.trim().length === 0 || mode === "image"}
            size="icon"
            className="h-10 w-10 rounded-input"
          >
            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <ArrowRight className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-2">
        {modes.map((m) => {
          const Icon = m.icon;
          const isBeta = m.id === "image";
          const active = mode === m.id;
          return (
            <button
              key={m.id}
              type="button"
              onClick={() => handleModeChange(m.id)}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
                active
                  ? "bg-primary text-white"
                  : "bg-white text-body hover:bg-primary-soft hover:text-primary"
              )}
            >
              <Icon className="h-4 w-4" />
              {m.label}
              {isBeta && (
                <span className="ml-0.5 rounded-full bg-white/20 px-1.5 py-0 text-[10px]">Beta</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
