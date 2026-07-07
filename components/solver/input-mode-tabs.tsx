import { cn } from "@/lib/utils";

const modes = [
  { id: "natural", label: "Natural language", status: "available" },
  { id: "formula", label: "Formula input", status: "available" },
  { id: "image", label: "Image upload", status: "beta" }
];

export function InputModeTabs(): React.JSX.Element {
  return (
    <div className="mt-3 flex flex-wrap items-center justify-center gap-4 text-sm text-body">
      {modes.map((mode) => (
        <div key={mode.id} className="flex items-center gap-1.5">
          <span
            className={cn(
              "h-2 w-2 rounded-full",
              mode.status === "available" ? "bg-success" : "bg-warning"
            )}
          />
          <span>
            {mode.label}
            {mode.status === "beta" && (
              <span className="ml-1 text-xs text-body/70">(Image solving is coming soon.)</span>
            )}
          </span>
        </div>
      ))}
    </div>
  );
}
