"use client";

import { useMemo, useState } from "react";
import { completeLessonLinks } from "../data/completeLessons";

export function SourceDrawer({
  onOpenCase,
  onOpenSupplement
}: {
  onOpenCase: (id: string) => void;
  onOpenSupplement: (id: string) => void;
}) {
  const [query, setQuery] = useState("");
  const sources = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return completeLessonLinks;
    return completeLessonLinks.filter((item) =>
      [item.title, item.organization, item.year, item.paper]
        .join(" ")
        .toLowerCase()
        .includes(needle)
    );
  }, [query]);

  return (
    <section className="source-workspace" aria-labelledby="sources-title">
      <div className="workspace-intro">
        <span className="eyebrow">Sources</span>
        <h1 id="sources-title">Primary sources for the 13 complete lessons</h1>
        <p>
          Search the compact source list. Each case keeps its primary source visible in the
          Evidence tab.
        </p>
      </div>
      <label className="search-box" htmlFor="source-search">
        <span>Search sources</span>
        <input
          id="source-search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Try GraphCast, DeepAR, LSTM, verifier..."
        />
      </label>
      <div className="source-list" aria-live="polite">
        {sources.map((source) => (
          <article className="source-row" key={`${source.type}-${source.id}`}>
            <div>
              <b>{source.title}</b>
              <p>{source.paper}</p>
            </div>
            <span>{source.organization}</span>
            <span>{source.year}</span>
            <div className="source-actions">
              <a href={source.url} target="_blank" rel="noreferrer">
                Open paper
              </a>
              <button
                onClick={() =>
                  source.type === "case" ? onOpenCase(source.id) : onOpenSupplement(source.id)
                }
              >
                Open lesson
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
