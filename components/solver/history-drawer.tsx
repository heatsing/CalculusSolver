"use client";

import { History, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetTrigger, SheetContent, SheetClose } from "@/components/ui/sheet";
import type { HistoryItem } from "@/lib/storage";

export function HistoryDrawer({
  history,
  onClear,
  onSelect
}: {
  history: HistoryItem[];
  onClear: () => void;
  onSelect: (input: string) => void;
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
          {history.length === 0 && <p className="text-sm text-body">No problems solved yet.</p>}
          {history.map((item) => (
            <SheetClose key={item.id} asChild>
              <button
                onClick={() => onSelect(item.input)}
                className="rounded-card border border-border bg-white p-4 text-left transition-shadow hover:shadow-sm"
              >
                <p className="line-clamp-2 text-sm font-medium text-heading">{item.input}</p>
                <p className="mt-1 text-xs text-body">{new Date(item.createdAt).toLocaleString()}</p>
              </button>
            </SheetClose>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
}
