"use client";

import dynamic from "next/dynamic";
import type { Layout, Data } from "plotly.js";
import type { PlotParams } from "react-plotly.js";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { sampleGraph, sanitizeGraphExpression } from "@/lib/graph-utils";
import type { SolverResult } from "@/types/solver";

const Plot = dynamic<PlotParams>(() => import("react-plotly.js"), {
  ssr: false,
  loading: () => <div className="grid h-80 place-items-center text-sm text-body">Loading graph...</div>
});

export function GraphCard({ result }: { result: SolverResult }): React.JSX.Element {
  if (!result.graph.available || !result.graph.expression || !result.graph.variable || !result.graph.domain) {
    return (
      <Card className="animate-fade-in">
        <CardHeader>
          <CardTitle>Graph</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-body">Graph unavailable for this expression.</p>
        </CardContent>
      </Card>
    );
  }

  const expression = sanitizeGraphExpression(result.graph.expression);
  if (!expression) {
    return (
      <Card className="animate-fade-in">
        <CardHeader>
          <CardTitle>Graph</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-body">Graph unavailable for this expression.</p>
        </CardContent>
      </Card>
    );
  }

  const points = sampleGraph(expression, result.graph.variable, result.graph.domain);

  if (points.length === 0) {
    return (
      <Card className="animate-fade-in">
        <CardHeader>
          <CardTitle>Graph</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-body">Graph unavailable for this expression.</p>
        </CardContent>
      </Card>
    );
  }

  const data: Data[] = [
    {
      x: points.map((p) => p.x),
      y: points.map((p) => p.y),
      type: "scatter",
      mode: "lines",
      line: { color: "#6D3EF2", width: 3 },
      hovertemplate: "x=%{x}<br>y=%{y}<extra></extra>"
    }
  ];

  const layout: Partial<Layout> = {
    autosize: true,
    margin: { l: 45, r: 20, t: 30, b: 45 },
    title: { text: result.graph.title ?? undefined, font: { size: 14 } },
    paper_bgcolor: "rgba(0,0,0,0)",
    plot_bgcolor: "rgba(255,255,255,0.6)",
    xaxis: { zeroline: true, gridcolor: "rgba(16, 24, 40, 0.08)" },
    yaxis: { zeroline: true, gridcolor: "rgba(16, 24, 40, 0.08)" },
    font: { family: "var(--font-inter), system-ui, sans-serif", color: "#101828" }
  };

  return (
    <Card className="animate-fade-in">
      <CardHeader>
        <CardTitle>Graph</CardTitle>
      </CardHeader>
      <CardContent>
        <Plot
          data={data}
          layout={layout}
          config={{ displayModeBar: true, displaylogo: false, responsive: true }}
          className="h-80 w-full"
        />
      </CardContent>
    </Card>
  );
}
