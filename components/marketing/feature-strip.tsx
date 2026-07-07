import { Keyboard, ListOrdered, Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const features = [
  {
    icon: Keyboard,
    title: "One Input",
    description: "Type, ask, or upload anything."
  },
  {
    icon: ListOrdered,
    title: "Step-by-Step",
    description: "Clear, structured solutions you can follow."
  },
  {
    icon: Sparkles,
    title: "AI Ready",
    description: "Powered by modern AI models."
  }
];

export function FeatureStrip(): React.JSX.Element {
  return (
    <section className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {features.map((feature) => (
        <Card key={feature.title} className="border-border/80 bg-white">
          <CardHeader>
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-primary-soft text-primary">
              <feature.icon className="h-5 w-5" />
            </div>
            <CardTitle className="text-base">{feature.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-body">{feature.description}</p>
          </CardContent>
        </Card>
      ))}
    </section>
  );
}
