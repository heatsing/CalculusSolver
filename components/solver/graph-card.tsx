"use client";

import * as React from "react";
import dynamic from "next/dynamic";
import { Download, RotateCcw, ZoomIn, ZoomOut } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { SolverResult } from "@/types/solver";
import { sampleGraph, sanitizeGraphExpression } from "@/lib/graph-utils";
import type { Layout } from "plotly.js";

const Plot = dynamic(() => import("react-plotly.js"), { ssr: false });

type PlotlyElement = HTMLDivElement & {
  layout?: Layout;
  relayout?: (updates: Record<string, unknown>) => void;
  downloadImage?: (opts: object) => void;
};

export function GraphCard({ result }: { result: SolverResult }): React.JSX.Element | null {
  const plotElRef = React.useRef<PlotlyElement | null>(null);

  if (!result.graph.available || !result.graph.expression || !result.graph.variable) {
    return null;
  }

  const expression = sanitizeGraphExpression(result.graph.expression);
  if (!expression) return null;

  const variable = result.graph.variable;
  const domain: [number, number] = result.graph.domain ?? [-10, 10];
  const points = sampleGraph(expression, variable, domain);
  const title = result.graph.title ?? `Graph of ${result.graph.expression}`;

  if (points.length === 0) return null;

  const data = [
    {
      x: points.map((p) => p.x),
      y: points.map((p) => p.y),
      type: "scatter",
      mode: "lines",
      line: { color: "#2563eb", width: 2.5 },
      hovertemplate: `${variable}: %{x:.3f}<br>y: %{y:.3f}<extra></extra>`
    }
  ];

  const layout: Partial<Layout> = {
    title: {
      text: title,
      font: { size: 14, color: "#1f2937" }
    },
    margin: { t: 40, r: 20, b: 40, l: 50 },
    xaxis: {
      title: variable,
      zeroline: true,
      gridcolor: "#e5e7eb"
    },
    yaxis: {
      zeroline: true,
      gridcolor: "#e5e7eb"
    },
    paper_bgcolor: "rgba(0,0,0,0)",
    plot_bgcolor: "rgba(0,0,0,0)",
    showlegend: false,
    autosize: true
  };

  const config = {
    responsive: true,
    displayModeBar: false
  };

  function handleInitialized(_figure: unknown, graphDiv: HTMLElement): void {
    plotElRef.current = graphDiv as PlotlyElement;
  }

  function handleUpdate(_figure: unknown, graphDiv: HTMLElement): void {
    plotElRef.current = graphDiv as PlotlyElement;
  }

  function getCurrentRanges(): { xRange: [number, number]; yRange: [number, number] } {
    const layout = plotElRef.current?.layout;
    const xRange = (layout?.xaxis?.range as [number, number]) ?? domain;
    const yRange = (layout?.yaxis?.range as [number, number]) ?? [-10, 10];
    return { xRange, yRange };
  }

  function handleZoomIn(): void {
    const plotly = plotElRef.current;
    if (!plotly?.relayout) return;
    const { xRange, yRange } = getCurrentRanges();
    const xCenter = (xRange[0] + xRange[1]) / 2;
    const yCenter = (yRange[0] + yRange[1]) / 2;
    const xSpan = (xRange[1] - xRange[0]) / 2;
    const ySpan = (yRange[1] - yRange[0]) / 2;
    plotly.relayout({
      "xaxis.range": [xCenter - xSpan * 0.7, xCenter + xSpan * 0.7],
      "yaxis.range": [yCenter - ySpan * 0.7, yCenter + ySpan * 0.7]
    });
  }

  function handleZoomOut(): void {
    const plotly = plotElRef.current;
    if (!plotly?.relayout) return;
    const { xRange, yRange } = getCurrentRanges();
    const xCenter = (xRange[0] + xRange[1]) / 2;
    const yCenter = (yRange[0] + yRange[1]) / 2;
    const xSpan = (xRange[1] - xRange[0]) / 2;
    const ySpan = (yRange[1] - yRange[0]) / 2;
    plotly.relayout({
      "xaxis.range": [xCenter - xSpan * 1.4, xCenter + xSpan * 1.4],
      "yaxis.range": [yCenter - ySpan * 1.4, yCenter + ySpan * 1.4]
    });
  }

  function handleReset(): void {
    const plotly = plotElRef.current;
    if (!plotly?.relayout) return;
    plotly.relayout({
      "xaxis.range": domain,
      "yaxis.range": null,
      "yaxis.autorange": true
    });
  }

  function handleDownload(): void {
    const plotly = plotElRef.current;
    if (!plotly?.downloadImage) return;
    plotly.downloadImage({
      format: "png",
      filename: "calculus-solver-graph",
      width: 800,
      height: 500
    });
  }

  return (
    <Card className="animate-fade-in">
      <CardHeader className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
        <CardTitle className="text-base">Interactive graph</CardTitle>
        <div className="flex items-center gap-1">
          <Button type="button" variant="ghost" size="icon" onClick={handleZoomIn} aria-label="Zoom in">
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button type="button" variant="ghost" size="icon" onClick={handleZoomOut} aria-label="Zoom out">
            <ZoomOut className="h-4 w-4" />
          </Button>
          <Button type="button" variant="ghost" size="icon" onClick={handleReset} aria-label="Reset view">
            <RotateCcw className="h-4 w-4" />
          </Button>
          <Button type="button" variant="ghost" size="icon" onClick={handleDownload} aria-label="Download graph">
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Plot
          data={data as never}
          layout={layout}
          config={config}
          style={{ width: "100%", height: "320px" }}
          useResizeHandler
          className="w-full"
          onInitialized={handleInitialized}
          onUpdate={handleUpdate}
        />
      </CardContent>
    </Card>
  );
}
