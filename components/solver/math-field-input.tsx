"use client";

import * as React from "react";
import dynamic from "next/dynamic";
import type { MathfieldElement } from "mathlive";

export type MathFieldInputProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
};

function MathFieldInternal({ value, onChange, placeholder, disabled }: MathFieldInputProps): React.JSX.Element {
  const ref = React.useRef<HTMLDivElement>(null);
  const mathFieldRef = React.useRef<MathfieldElement | null>(null);

  React.useEffect(() => {
    if (typeof window === "undefined" || !ref.current) return;

    let mounted = true;

    async function init() {
      await import("mathlive");

      if (!mounted || !ref.current) return;

      const mathField = document.createElement("math-field") as MathfieldElement;
      mathField.value = value;
      mathField.placeholder = placeholder ?? "Type a formula...";
      mathField.disabled = disabled ?? false;
      mathField.setAttribute("virtual-keyboard-mode", "onfocus");
      mathField.setAttribute("virtual-keyboard-theme", "material");
      mathField.style.cssText =
        "width: 100%; min-height: 100px; border: none; background: transparent; font-size: 1rem; --hue: 265;";

      mathField.addEventListener("input", () => {
        onChange(mathField.value);
      });

      ref.current.innerHTML = "";
      ref.current.appendChild(mathField);
      mathFieldRef.current = mathField;
    }

    init();

    return () => {
      mounted = false;
      mathFieldRef.current?.remove();
      mathFieldRef.current = null;
    };
  }, []);

  React.useEffect(() => {
    if (mathFieldRef.current && mathFieldRef.current.value !== value) {
      mathFieldRef.current.value = value;
    }
  }, [value]);

  React.useEffect(() => {
    if (mathFieldRef.current) {
      mathFieldRef.current.disabled = disabled ?? false;
    }
  }, [disabled]);

  return <div ref={ref} className="w-full px-4 pt-4 pb-14" />;
}

export const MathFieldInput = dynamic(() => Promise.resolve(MathFieldInternal), {
  ssr: false,
  loading: () => <div className="grid min-h-[100px] place-items-center text-sm text-body">Loading formula editor...</div>
});
