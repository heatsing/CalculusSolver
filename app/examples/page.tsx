"use client";

import * as React from "react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { examplesData, type ExampleCategory } from "@/data/examples";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowRight, Search } from "lucide-react";
import { cn } from "@/lib/utils";

const categories: ExampleCategory[] = ["All", "Algebra", "Derivatives", "Integrals", "Limits", "Graphs"];

export default function ExamplesPage(): React.JSX.Element {
  const [activeCategory, setActiveCategory] = React.useState<ExampleCategory>("All");
  const [search, setSearch] = React.useState("");
  const [visibleCount, setVisibleCount] = React.useState(6);

  const filtered = React.useMemo(() => {
    return examplesData.filter((example) => {
      const matchesCategory = activeCategory === "All" || example.category === activeCategory;
      const matchesSearch =
        search.trim().length === 0 ||
        example.problem.toLowerCase().includes(search.toLowerCase()) ||
        example.operation.toLowerCase().includes(search.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, search]);

  const visible = filtered.slice(0, visibleCount);

  return (
    <>
      <Header />
      <main className="mx-auto w-full max-w-content px-4 py-10 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold tracking-tight text-heading sm:text-5xl">Examples</h1>
        <p className="mt-4 max-w-2xl text-lg text-body">
          Browse example problems across algebra, derivatives, integrals, limits, and graphs.
        </p>

        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-body" />
            <Input
              placeholder="Search examples..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setVisibleCount(6);
              }}
              className="pl-9"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => {
                  setActiveCategory(category);
                  setVisibleCount(6);
                }}
                className={cn(
                  "rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
                  activeCategory === category
                    ? "bg-primary text-white"
                    : "bg-secondary-background text-body hover:bg-primary-soft hover:text-primary"
                )}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((example) => (
            <a
              key={example.id}
              href={`/?example=${example.id}`}
              className="group flex flex-col justify-between rounded-card border border-border bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
            >
              <div>
                <div className="mb-3 flex items-center gap-2">
                  <Badge variant="secondary">{example.category}</Badge>
                  <span className="text-xs text-body">{example.difficulty}</span>
                </div>
                <p className="text-base font-medium text-heading">{example.problem}</p>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-soft text-sm font-semibold text-primary">
                  {example.symbol}
                </span>
                <div className="flex items-center gap-2 text-sm font-semibold text-primary">
                  Try this problem <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </a>
          ))}
        </div>

        {visibleCount < filtered.length && (
          <div className="mt-8 flex justify-center">
            <Button variant="outline" onClick={() => setVisibleCount((count) => count + 6)}>
              Load More
            </Button>
          </div>
        )}

        {filtered.length === 0 && (
          <p className="mt-10 text-center text-body">No examples match your search.</p>
        )}
      </main>
      <Footer />
    </>
  );
}
