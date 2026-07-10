import { Keyboard, ListOrdered, LineChart } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

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
    <section className="mt-24 border-l border-t border-border sm:grid sm:grid-cols-2 lg:grid-cols-3">
      {features.map((feature, index) => (
        <Card key={feature.title} className="group min-h-64 border-l-0 border-t-0 bg-white shadow-none">
          <CardHeader className="pb-2">
            <div className="mb-10 flex h-12 w-12 items-center justify-center bg-secondary-background text-primary transition-colors group-hover:bg-primary group-hover:text-white">
              <feature.icon className="h-5 w-5" />
            </div>
            <div className="font-mono text-xs text-body">0{index + 1}</div>
            <h2 className="mt-2 text-2xl font-normal text-heading">{feature.title}</h2>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-body">{feature.description}</p>
          </CardContent>
        </Card>
      ))}
    </section>
  );
}
