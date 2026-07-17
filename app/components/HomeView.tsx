"use client";

import type { CaseLesson } from "../data/types";

export function HomeView({
  cases,
  presentationMode,
  onPresentationMode,
  onOpenCase,
  onStartTour
}: {
  cases: CaseLesson[];
  presentationMode: boolean;
  onPresentationMode: (value: boolean) => void;
  onOpenCase: (id: string) => void;
  onStartTour: () => void;
}) {
  return (
    <section className="home-view" aria-labelledby="home-title">
      <div className="home-copy">
        <span className="eyebrow">ML Architecture Field Manual</span>
        <h1 id="home-title">Architecture follows the bottleneck.</h1>
        <p>
          A compact live workspace for seeing why each ML architecture fits the
          information relationship it has to solve.
        </p>
      </div>

      <div className="method-flow" aria-label="Architecture reasoning flow">
        {["REAL PROBLEM", "INFORMATION BOTTLENECK", "ARCHITECTURE", "DECISION OR SCIENTIFIC OUTPUT"].map(
          (step, index, list) => (
            <div className="method-step" key={step}>
              <b>{step}</b>
              {index < list.length - 1 ? <i aria-hidden="true">-&gt;</i> : null}
            </div>
          )
        )}
      </div>

      <p className="home-definition">
        Machine learning is the part of AI that learns relationships and decision rules from data.
        The architecture determines how information is allowed to move, combine, and persist.
      </p>

      <div className="home-actions">
        <button className="primary-action" onClick={onStartTour}>
          Start guided tour
        </button>
        <label className="switch-control">
          <input
            type="checkbox"
            checked={presentationMode}
            onChange={(event) => onPresentationMode(event.target.checked)}
          />
          <span>Presentation mode</span>
        </label>
        <span className="home-count">13 complete architecture lessons: 7 flagship cases + 6 supplements</span>
      </div>

      <div className="case-button-grid" aria-label="Seven flagship cases">
        {cases.map((lesson) => (
          <button key={lesson.id} className={lesson.accent} onClick={() => onOpenCase(lesson.id)}>
            <span>Case {lesson.number}</span>
            <b>{lesson.name}</b>
            <small>{lesson.field}</small>
          </button>
        ))}
      </div>
    </section>
  );
}
