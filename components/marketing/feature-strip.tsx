import { Keyboard, ListOrdered, LineChart } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const features = [
  {
    icon: Keyboard,
    title: "Flexible input",
    description: "Type math notation, natural language, or use the on-screen keyboard."
  },
  {
    icon: ListOrdered,
    title: "Clear steps",
    description: "Every solution shows the rule and transformation used at each step."
  },
  {
    icon: LineChart,
    title: "Graphs",
    description: "Visualize functions and check your answer against the plot."
  }
];

export function FeatureStrip(): React.JSX.Element {
  return (
    <section className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {features.map((feature) => (
        <Card key={feature.title} className="border-border bg-white shadow-none">
          <CardHeader className="pb-2">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-primary-soft text-primary">
              <feature.icon className="h-5 w-5" />
            </div>
            <CardTitle className="text-base font-semibold">{feature.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-body">{feature.description}</p>
          </CardContent>
        </Card>
      ))}
    </section>
  );
}
