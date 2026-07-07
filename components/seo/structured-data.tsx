"use client";

import * as React from "react";
import { serializeJsonLd } from "@/lib/seo";

export function StructuredData({ data }: { data: unknown }): React.JSX.Element {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: serializeJsonLd(data) }}
    />
  );
}
