"use client";

import dynamic from "next/dynamic";
import { sampleGraph, sanitizeGraphExpression } from "@/lib/graph-utils";

const Plot = dynamic(() => import("react-plotly.js"), { ssr: false });

export function CalculusGraph({ expression, variable, domain }: { expression: string; variable: string; domain: [number, number] }): React.JSX.Element | null {
  const safeExpression = sanitizeGraphExpression(expression);
  if (!safeExpression) return null;
  const points = sampleGraph(safeExpression, variable, domain);
  if (!points.length) return null;

  return (
    <section className="p-5 sm:p-8">
      <h3 className="text-xl font-normal text-heading">Function Graph</h3>
      <div className="mt-4 h-80 min-w-0 overflow-hidden border border-border">
        <Plot
          data={[{ x: points.map((point) => point.x), y: points.map((point) => point.y), type: "scatter", mode: "lines", line: { color: "#0f62fe", width: 2 } }] as never}
          layout={{ autosize: true, margin: { t: 24, r: 20, b: 42, l: 50 }, paper_bgcolor: "#ffffff", plot_bgcolor: "#ffffff", showlegend: false, xaxis: { gridcolor: "#e0e0e0" }, yaxis: { gridcolor: "#e0e0e0" } }}
          config={{ responsive: true, displayModeBar: false }}
          style={{ width: "100%", height: "320px" }}
          useResizeHandler
        />
      </div>
    </section>
  );
}
