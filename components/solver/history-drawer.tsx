"use client";

import * as React from "react";
import { History, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { useSolverHistory } from "@/hooks/use-solver-history";

export type HistoryDrawerProps = {
  onSelect: (input: string) => void;
  className?: string;
};

export function HistoryDrawer({ onSelect, className }: HistoryDrawerProps): React.JSX.Element {
  const [open, setOpen] = React.useState(false);
  const { history, remove, clear } = useSolverHistory();

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className={cn("gap-2", className)}
          aria-label="Open history"
        >
          <History className="h-4 w-4" />
          History
        </Button>
      </SheetTrigger>
      <SheetContent aria-labelledby="history-title" className="flex w-full flex-col sm:max-w-md">
        <div className="mb-4">
          <h2 id="history-title" className="text-lg font-semibold text-heading">
            Recent problems
          </h2>
        </div>
        {history.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-2 text-center text-body">
            <History className="h-10 w-10 opacity-30" />
            <p>No problems solved yet.</p>
          </div>
        ) : (
          <>
            <div className="-mx-6 flex-1 overflow-y-auto px-6">
              <ul className="space-y-2" aria-labelledby="history-title">
                {history.map((item) => (
                  <li
                    key={item.id}
                    className="group flex items-start gap-2 rounded-lg border border-border bg-white p-3"
                  >
                    <button
                      type="button"
                      data-testid="history-select"
                      onClick={() => {
                        onSelect(item.input);
                        setOpen(false);
                      }}
                      className="min-w-0 flex-1 text-left text-sm text-heading transition-colors hover:text-primary"
                      aria-describedby={`history-time-${item.id}`}
                    >
                      <span className="line-clamp-2">{item.input}</span>
                      <span
                        id={`history-time-${item.id}`}
                        className="mt-1 block text-xs text-body"
                      >
                        {new Date(item.createdAt).toLocaleString()}
                      </span>
                    </button>
                    <button
                      type="button"
                      data-testid="history-delete"
                      onClick={() => remove(item.id)}
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-body transition-colors hover:bg-error/10 hover:text-error focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                      aria-label={`Delete ${item.input}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-4 border-t border-border pt-4">
              <Button type="button" variant="outline" className="w-full" onClick={clear}>
                Clear history
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
