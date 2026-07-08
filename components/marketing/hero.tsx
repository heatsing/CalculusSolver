import { Badge } from "@/components/ui/badge";
import { Sparkles } from "lucide-react";

export type HeroProps = {
  badge?: string;
  title: string;
  highlight?: string;
  subtitle: string;
};

export function Hero({
  badge = "AI Powered",
  title,
  highlight,
  subtitle
}: HeroProps): React.JSX.Element {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-primary-soft/50 via-white to-white py-16 text-center sm:py-20 md:py-32">
      <Badge
        variant="secondary"
        className="mb-5 inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-wide"
      >
        <Sparkles className="h-3.5 w-3.5" />
        {badge}
      </Badge>
      <h1 className="mx-auto max-w-3xl text-3xl font-extrabold tracking-tight text-heading sm:text-4xl md:text-5xl lg:text-6xl">
        {title}
        {highlight && <span className="text-primary"> {highlight}</span>}
      </h1>
      <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-body sm:text-xl">
        {subtitle}
      </p>
    </section>
  );
}
