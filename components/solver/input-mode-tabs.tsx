import { MessageCircle, Code2, ImageUp } from "lucide-react";
import { cn } from "@/lib/utils";

const modes = [
  { id: "natural", label: "Natural language", status: "available", icon: MessageCircle },
  { id: "formula", label: "Formula input", status: "available", icon: Code2 },
  { id: "image", label: "Image upload", status: "beta", icon: ImageUp }
];

export function InputModeTabs(): React.JSX.Element {
  return (
    <div className="mt-4 flex flex-wrap items-center justify-center gap-6 text-sm text-body">
      {modes.map((mode) => (
        <div key={mode.id} className="flex items-center gap-2">
          <mode.icon className="h-4 w-4 text-primary" />
          <span className={cn("font-medium", mode.status === "beta" ? "text-body/80" : "text-heading")}>
            {mode.label}
          </span>
          {mode.status === "beta" && (
            <span className="rounded-full bg-warning/10 px-2 py-0.5 text-xs font-medium text-warning">Beta</span>
          )}
        </div>
      ))}
    </div>
  );
}
