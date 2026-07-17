"use client";

import { useMemo, useState } from "react";
import type { CaseLesson } from "../data/types";
import { ArchitectureDiagram } from "./ArchitectureDiagram";
import { ExplanationTabs } from "./ExplanationTabs";
import { InteractiveLab } from "./InteractiveLab";
import { ObjectiveBanner } from "./ObjectiveBanner";

export function CaseWorkspace({
  lesson,
  cases,
  presentationMode,
  technicalDetail,
  onSelectCase,
  onOpenWeightHelp
}: {
  lesson: CaseLesson;
  cases: CaseLesson[];
  presentationMode: boolean;
  technicalDetail: boolean;
  onSelectCase: (id: string) => void;
  onOpenWeightHelp: () => void;
}) {
  const [resetToken, setResetToken] = useState(0);
  const index = cases.findIndex((item) => item.id === lesson.id);
  const previous = cases[(index - 1 + cases.length) % cases.length];
  const next = cases[(index + 1) % cases.length];
  const heightLabel = presentationMode ? "one presentation viewport target" : "expanded technical view";
  const graphCastDetails = useMemo(() => lesson.diagram.technicalDrawer ?? [], [lesson.diagram]);

  return (
    <section
      className={`case-workspace accent-${lesson.accent} ${presentationMode ? "presentation" : "explore"}`}
      aria-labelledby="case-title"
    >
      <header className="case-heading">
        <div>
          <span className="eyebrow">
            Case {lesson.number} / {lesson.field} / {lesson.organization}
          </span>
          <h1 id="case-title">{lesson.name}</h1>
          <small>{heightLabel}</small>
        </div>
        <button onClick={onOpenWeightHelp}>What does weight mean?</button>
      </header>

      <ObjectiveBanner objective={lesson.objective} />

      <div className="case-main-grid">
        <ArchitectureDiagram key={`${lesson.id}-${resetToken}-diagram`} spec={lesson.diagram} />
        <InteractiveLab key={`${lesson.id}-${resetToken}-lab`} caseId={lesson.id} />
      </div>

      <ExplanationTabs lesson={lesson} technicalDetail={technicalDetail && !presentationMode} />

      {lesson.id === "graphcast" ? (
        <details className="technical-drawer" open={technicalDetail && !presentationMode}>
          <summary>GraphCast technical drawer</summary>
          <ol>
            {graphCastDetails.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ol>
        </details>
      ) : null}

      <footer className="case-controls">
        <button onClick={() => onSelectCase(previous.id)}>Previous case</button>
        <button onClick={() => setResetToken((value) => value + 1)}>Reset</button>
        <button className="primary-action" onClick={() => onSelectCase(next.id)}>
          Next case
        </button>
      </footer>
    </section>
  );
}
