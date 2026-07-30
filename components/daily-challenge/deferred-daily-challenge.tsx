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
      className="min-h-[360px] animate-pulse rounded-2xl border border-[#d9e5f4] bg-[linear-gradient(110deg,#f8fbff_25%,#eef5fd_45%,#f8fbff_65%)]"
      aria-hidden="true"
    />
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
