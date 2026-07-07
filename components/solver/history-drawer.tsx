"use client";

import { History, Inbox, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetTrigger, SheetContent, SheetClose } from "@/components/ui/sheet";
import type { HistoryItem } from "@/lib/storage";

const operationLabels: Record<string, string> = {
  derivative: "Derivative",
  integral: "Integral",
  limit: "Limit",
  solve_equation: "Solve equation",
  solve_system: "Solve system",
  simplify: "Simplify",
  factor: "Factor",
  expand: "Expand",
  graph: "Graph",
  unknown: "Unknown"
};

function formatTimestamp(iso: string): string {
  const date = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffSec < 60) return "Just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHour < 24) return `${diffHour}h ago`;
  if (diffDay < 7) return `${diffDay}d ago`;
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trimEnd() + "…";
}

export function HistoryDrawer({
  history,
  onClear,
  onSelect,
  onRemove
}: {
  history: HistoryItem[];
  onClear: () => void;
  onSelect: (input: string) => void;
  onRemove: (id: string) => void;
}): React.JSX.Element {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <History className="h-4 w-4" />
          History
        </Button>
      </SheetTrigger>
      <SheetContent>
        <div className="mt-8 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-heading">Recent problems</h2>
          {history.length > 0 && (
            <Button variant="ghost" size="sm" onClick={onClear} className="gap-1 text-error">
              <Trash2 className="h-4 w-4" />
              Clear
            </Button>
          )}
        </div>
        <div className="mt-4 flex flex-col gap-3">
          {history.length === 0 && (
            <div className="flex flex-col items-center py-10 text-center">
              <Inbox className="h-10 w-10 text-body/50" />
              <p className="mt-3 text-sm text-body">No problems solved yet.</p>
              <p className="text-xs text-body/70">Enter a problem above to get started.</p>
            </div>
          )}
          {history.map((item) => (
            <div
              key={item.id}
              className="group relative rounded-card border border-border bg-white p-4 text-left transition-shadow hover:shadow-sm"
            >
              <SheetClose asChild>
                <button
                  type="button"
                  onClick={() => onSelect(item.input)}
                  className="w-full text-left"
                  aria-label={`Select ${item.input}`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-xs font-medium text-primary">
                      {operationLabels[item.result.operation] ?? operationLabels.unknown}
                    </p>
                    <p className="text-xs text-body">{formatTimestamp(item.createdAt)}</p>
                  </div>
                  <p className="mt-1 line-clamp-2 text-sm font-medium text-heading">{item.input}</p>
                  <p className="mt-1 line-clamp-1 text-xs text-body">
                    {truncate(item.result.answer, 60)}
                  </p>
                </button>
              </SheetClose>
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  onRemove(item.id);
                }}
                className="absolute top-2 right-2 rounded-md p-1.5 text-body opacity-0 transition-opacity hover:bg-destructive/10 hover:text-error group-hover:opacity-100 focus:opacity-100"
                aria-label={`Delete history item ${item.input}`}
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
}
