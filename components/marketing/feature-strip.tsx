import { Type, ListOrdered, Bot } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const features = [
  {
    icon: Type,
    title: "One Input",
    description: "Type, ask, paste, or upload a problem."
  },
  {
    icon: ListOrdered,
    title: "Step-by-Step",
    description: "Follow clear mathematical reasoning, not just an answer."
  },
  {
    icon: Bot,
    title: "AI Assisted",
    description: "AI explains the solution while local math tools help verify it."
  }
];

export function FeatureStrip(): React.JSX.Element {
  return (
    <section className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {features.map((feature) => (
        <Card key={feature.title} className="border-border bg-secondary-background">
          <CardHeader>
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-primary-soft text-primary">
              <feature.icon className="h-5 w-5" />
            </div>
            <CardTitle>{feature.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-body">{feature.description}</p>
          </CardContent>
        </Card>
      ))}
    </section>
  );
}
