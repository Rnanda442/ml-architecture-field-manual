"use client";

import { useEffect, useId, useRef, useState } from "react";

export function TermHelp({ term, meaning, example }: { term: string; meaning: string; example?: string }) {
  const [open, setOpen] = useState(false);
  const id = useId();
  const root = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!open) return;
    const close = (event: KeyboardEvent | MouseEvent) => {
      if (event instanceof KeyboardEvent && event.key === "Escape") setOpen(false);
      if (event instanceof MouseEvent && root.current && !root.current.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("keydown", close);
    document.addEventListener("pointerdown", close);
    return () => {
      document.removeEventListener("keydown", close);
      document.removeEventListener("pointerdown", close);
    };
  }, [open]);

  return (
    <span className="term-help" ref={root}>
      <button type="button" className="term-help-button" aria-expanded={open} aria-controls={id} aria-label={`What does ${term} mean?`} onClick={() => setOpen((value) => !value)}>?</button>
      {open ? <span className="term-help-card" id={id} role="dialog" aria-label={`${term} definition`}><b>{term}</b><span>{meaning}</span>{example ? <small>Example: {example}</small> : null}<button type="button" onClick={() => setOpen(false)} aria-label={`Close ${term} definition`}>Close</button></span> : null}
    </span>
  );
}
