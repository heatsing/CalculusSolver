import * as React from "react";

export function useKeyboardShortcut(
  callback: () => void,
  key: string,
  options: { metaKey?: boolean; ctrlKey?: boolean } = {}
): void {
  React.useEffect(() => {
    function handleKeyDown(event: KeyboardEvent): void {
      const keyMatches = event.key.toLowerCase() === key.toLowerCase();
      const metaMatches = options.metaKey ? event.metaKey : true;
      const ctrlMatches = options.ctrlKey ? event.ctrlKey : true;

      if (keyMatches && metaMatches && ctrlMatches) {
        event.preventDefault();
        callback();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [callback, key, options.ctrlKey, options.metaKey]);
}
