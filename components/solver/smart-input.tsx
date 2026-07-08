"use client";

import * as React from "react";
import { ArrowRight, Loader2, MessageCircle, Code2 } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { MathFieldInput } from "@/components/solver/math-field-input";
import { SymbolKeyboard } from "@/components/solver/symbol-keyboard";
import { cn } from "@/lib/utils";
import { useKeyboardShortcut } from "@/hooks/use-keyboard-shortcut";

export type InputMode = "natural" | "formula";

export type SmartInputProps = {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  loading?: boolean;
};

const modes: { id: InputMode; label: string; icon: React.ElementType }[] = [
  { id: "natural", label: "Text", icon: MessageCircle },
  { id: "formula", label: "Formula", icon: Code2 }
];

const popularShortcuts = [
  { label: "∫ Integral", value: "integrate " },
  { label: "d/dx Derivative", value: "derivative of " },
  { label: "lim Limit", value: "limit " },
  { label: "√ Simplify", value: "simplify " }
];

export function SmartInput({ value, onChange, onSubmit, loading }: SmartInputProps): React.JSX.Element {
  const [mode, setMode] = React.useState<InputMode>("natural");
  const [keyboardOpen, setKeyboardOpen] = React.useState(() => {
    if (typeof window === "undefined") return true;
    return window.innerWidth > 640;
  });
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  React.useEffect(() => {
    function handleResize(): void {
      if (window.innerWidth <= 640) {
        setKeyboardOpen(false);
      }
    }
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useKeyboardShortcut(
    () => {
      textareaRef.current?.focus();
    },
    "/",
    { metaKey: false, ctrlKey: false }
  );

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

  function handleInsertSymbol(symbol: string): void {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart ?? value.length;
    const end = textarea.selectionEnd ?? value.length;
    const nextValue = value.slice(0, start) + symbol + value.slice(end);
    onChange(nextValue);

    requestAnimationFrame(() => {
      textarea.focus();
      const position = start + symbol.length;
      textarea.setSelectionRange(position, position);
    });
  }

  function handleShortcut(valuePrefix: string): void {
    const textarea = textareaRef.current;
    onChange(valuePrefix);
    requestAnimationFrame(() => {
      textarea?.focus();
      textarea?.setSelectionRange(valuePrefix.length, valuePrefix.length);
    });
  }

  return (
    <div className="space-y-3">
      <label
        htmlFor="math-problem-input"
        className="mx-auto block max-w-solver-input px-1 text-sm font-medium text-heading"
      >
        Enter a math problem
      </label>
      <div
        id="solver-input"
        className={cn(
          "relative mx-auto w-full max-w-solver-input rounded-input border border-border bg-white p-2 shadow-sm transition-shadow focus-within:ring-2 focus-within:ring-primary/20"
        )}
      >
        {mode === "formula" ? (
          <MathFieldInput
            value={value}
            onChange={onChange}
            placeholder="Type a formula..."
            disabled={loading}
          />
        ) : (
          <Textarea
            ref={textareaRef}
            id="math-problem-input"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a math problem, e.g. integrate x^2 sin(x)"
            disabled={loading}
            className="min-h-[120px] resize-none border-0 bg-transparent px-4 pt-4 pb-14 text-base text-heading shadow-none placeholder:text-body/90 focus-visible:ring-0 focus-visible:ring-offset-0"
          />
        )}
        <div className="absolute bottom-3 right-3 flex items-center gap-2">
          <span className="hidden text-xs text-body sm:inline">Shift + Enter for new line</span>
          <Button
            onClick={onSubmit}
            disabled={loading || value.trim().length === 0}
            size="icon"
            aria-label="Solve"
            className="h-11 w-11 rounded-input"
          >
            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <ArrowRight className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      <div className="mx-auto flex max-w-solver-input flex-wrap items-center justify-center gap-2 px-1">
        {modes.map((m) => {
          const Icon = m.icon;
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
            </button>
          );
        })}
      </div>

      {mode === "natural" && (
        <div className="mx-auto max-w-solver-input space-y-3 px-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-medium text-body">Popular:</span>
            {popularShortcuts.map((shortcut) => (
              <button
                key={shortcut.label}
                type="button"
                onClick={() => handleShortcut(shortcut.value)}
                className="inline-flex items-center gap-1 rounded-full border border-border bg-white px-2.5 py-1 text-xs font-medium text-heading transition-colors hover:border-primary hover:text-primary"
              >
                {shortcut.label}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setKeyboardOpen((prev) => !prev)}
            className="flex w-full items-center justify-between rounded-lg border border-border bg-white px-3 py-2 text-sm font-medium text-heading transition-colors hover:bg-primary-soft/30"
          >
            <span>Math keyboard</span>
            <span className="text-xs text-body">{keyboardOpen ? "Hide" : "Show"}</span>
          </button>
          {keyboardOpen && <SymbolKeyboard onInsert={handleInsertSymbol} />}
        </div>
      )}
    </div>
  );
}
