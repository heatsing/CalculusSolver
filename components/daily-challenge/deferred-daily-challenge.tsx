"use client";

import * as React from "react";
import dynamic from "next/dynamic";

const DailyChallengeGame = dynamic(
  () => import("@/components/daily-challenge/daily-challenge-game").then((module) => module.DailyChallengeGame),
  {
    ssr: false,
    loading: () => <DailyChallengePlaceholder />
  }
);

function DailyChallengePlaceholder(): React.JSX.Element {
  return (
    <div
      className="grid min-h-[220px] gap-6 rounded-2xl border border-[#cfe0f6] bg-white p-6 sm:grid-cols-[1fr_auto] sm:items-center sm:p-8"
      role="status"
      aria-live="polite"
    >
      <div>
        <p className="text-sm font-semibold text-[#0967ed]">Today&apos;s calculus problem</p>
        <div className="mt-4 border-l-4 border-[#0967ed] bg-[#f3f7fc] px-5 py-5">
          <p className="font-serif text-xl font-semibold text-[#0a234f]">Preparing the challenge…</p>
          <p className="mt-2 text-sm leading-6 text-[#526785]">Your progress and today&apos;s problem will appear here.</p>
        </div>
      </div>
      <div className="flex items-center gap-3 text-sm text-[#526785]">
        <span className="h-3 w-3 rounded-full bg-[#0967ed] motion-safe:animate-pulse" aria-hidden="true" />
        Loading challenge
      </div>
    </div>
  );
}

export function DeferredDailyChallenge(): React.JSX.Element {
  const [shouldLoad, setShouldLoad] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const element = containerRef.current;
    if (!element || shouldLoad) return;

    if (!("IntersectionObserver" in window)) {
      setShouldLoad(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      { rootMargin: "800px 0px" }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [shouldLoad]);

  return <div ref={containerRef}>{shouldLoad ? <DailyChallengeGame /> : <DailyChallengePlaceholder />}</div>;
}
