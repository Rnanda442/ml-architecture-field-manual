"use client";

import { useEffect, useMemo, useState } from "react";
import type { CaseLesson, PresentationStageId } from "../data/types";
import { vocabularyByCase } from "../data/vocabulary";
import { ArchitectureDiagram } from "./ArchitectureDiagram";
import { BeginnerKey } from "./BeginnerKey";
import { ContextualVocabulary } from "./ContextualVocabulary";
import { ExplanationTabs } from "./ExplanationTabs";
import { InteractiveLab } from "./InteractiveLab";
import { ObjectiveBanner } from "./ObjectiveBanner";
import { ResultStage } from "./ResultStage";
import { StudentGuide } from "./StudentGuide";

const stages: { id: PresentationStageId; label: string }[] = [
  { id: "objective", label: "Objective" },
  { id: "bottleneck", label: "Bottleneck" },
  { id: "architecture", label: "Component walkthrough" },
  { id: "lab", label: "Lab" },
  { id: "result", label: "Result" },
];

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
  const [selectedNodeId, setSelectedNodeId] = useState(lesson.diagram.nodes[1]?.id ?? lesson.diagram.nodes[0].id);
  const [presentationStage, setPresentationStage] = useState<PresentationStageId>("architecture");
  const index = cases.findIndex((item) => item.id === lesson.id);
  const previous = cases[(index - 1 + cases.length) % cases.length];
  const next = cases[(index + 1) % cases.length];
  const graphCastDetails = useMemo(() => lesson.diagram.technicalDrawer ?? [], [lesson.diagram]);
  const vocabulary = vocabularyByCase[lesson.id] ?? [];
  const architecture = <ArchitectureDiagram key={`${lesson.id}-${resetToken}-diagram`} spec={lesson.diagram} selectedId={selectedNodeId} onSelectNode={setSelectedNodeId} vocabulary={vocabulary} equation={lesson.weights.equation} equationNote={lesson.weights.note} />;
  const vocabularyPanel = <ContextualVocabulary terms={vocabulary} diagram={lesson.diagram} onSelectNode={setSelectedNodeId} />;
  const lab = <InteractiveLab key={`${lesson.id}-${resetToken}-lab`} caseId={lesson.id} />;

  useEffect(() => {
    if (!presentationMode) return;
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (target?.matches("input, select, textarea") || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
      if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
      const currentIndex = stages.findIndex((item) => item.id === presentationStage);
      const nextIndex = event.key === "ArrowRight" ? Math.min(stages.length - 1, currentIndex + 1) : Math.max(0, currentIndex - 1);
      if (nextIndex !== currentIndex) {
        event.preventDefault();
        setPresentationStage(stages[nextIndex].id);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [presentationMode, presentationStage]);

  const activeStageIndex = stages.findIndex((item) => item.id === presentationStage);

  return (
    <section
      className={`case-workspace accent-${lesson.accent} ${presentationMode ? "presentation" : "explore"}`}
      aria-labelledby="case-title"
    >
      <header className="case-heading">
        <div>
          <span className="eyebrow">Case {lesson.number} · {lesson.field} · {lesson.organization}</span>
          <h1 id="case-title">{lesson.name}</h1>
          <p className="architecture-label"><b>{lesson.architecture}</b> · {lesson.objective.sentence}</p>
        </div>
        <button onClick={onOpenWeightHelp}>Open weight key</button>
      </header>
      <BeginnerKey />

      {presentationMode ? (
        <nav className="lesson-progress" aria-label="Presentation lesson stages">
          {stages.map((item, indexValue) => (
            <button key={item.id} className={`${presentationStage === item.id ? "active" : ""} ${indexValue < activeStageIndex ? "complete" : ""}`} onClick={() => setPresentationStage(item.id)} aria-current={presentationStage === item.id ? "step" : undefined}><span>{indexValue < activeStageIndex ? "✓" : indexValue + 1}</span>{item.label}</button>
          ))}
        </nav>
      ) : null}

      {presentationMode ? <div className="keyboard-hint">← / → stages · Shift + ← / → cases · Esc closes drawers</div> : null}

      {!presentationMode || presentationStage === "objective" ? <ObjectiveBanner objective={lesson.objective} /> : null}
      {!presentationMode || presentationStage === "bottleneck" ? <StudentGuide lesson={lesson} /> : null}
      {!presentationMode || presentationStage === "architecture" ? architecture : null}
      {!presentationMode || presentationStage === "lab" ? lab : null}
      {!presentationMode || presentationStage === "result" ? <ResultStage lesson={lesson} /> : null}
      {!presentationMode ? <ExplanationTabs key={lesson.id} lesson={lesson} technicalDetail={technicalDetail} /> : null}
      {!presentationMode ? vocabularyPanel : null}

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
        <button onClick={() => { setResetToken((value) => value + 1); setSelectedNodeId(lesson.diagram.nodes[1]?.id ?? lesson.diagram.nodes[0].id); setPresentationStage("architecture"); }}>Reset</button>
        <button className="primary-action" onClick={() => onSelectCase(next.id)}>
          Next case
        </button>
      </footer>
    </section>
  );
}
