"use client";

import type { CaseLesson } from "../data/types";

export function CaseNavigation({
  cases,
  activeId,
  onSelect
}: {
  cases: CaseLesson[];
  activeId: string;
  onSelect: (id: string) => void;
}) {
  const activeIndex = Math.max(0, cases.findIndex((lesson) => lesson.id === activeId));

  return (
    <aside className="case-rail" aria-label="Case navigation">
      <div className="rail-progress">
        <b>
          {activeIndex + 1} of {cases.length}
        </b>
        <span>Flagship cases</span>
      </div>
      <nav>
        {cases.map((lesson, index) => (
          <button
            key={lesson.id}
            className={lesson.id === activeId ? "active" : ""}
            onClick={() => onSelect(lesson.id)}
            aria-current={lesson.id === activeId ? "page" : undefined}
          >
            <span>Case {index + 1}</span>
            <b>{lesson.shortLabel}</b>
            <small>{lesson.field}</small>
          </button>
        ))}
      </nav>
    </aside>
  );
}
