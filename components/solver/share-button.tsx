"use client";

import * as React from "react";
import { Share2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ShareButton({ input, mode }: { input: string; mode: string }): React.JSX.Element {
  const [copied, setCopied] = React.useState(false);

  async function handleShare(): Promise<void> {
    try {
      const url =
        window.location.origin +
        window.location.pathname +
        "?q=" +
        encodeURIComponent(input) +
        "&mode=" +
        encodeURIComponent(mode);
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Ignore clipboard errors.
    }
  }

  return (
    <Button variant="outline" size="sm" onClick={handleShare}>
      {copied ? <Check className="mr-1 h-4 w-4" /> : <Share2 className="mr-1 h-4 w-4" />}
      {copied ? "Copied" : "Share"}
    </Button>
  );
}
