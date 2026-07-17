"use client";

import { useMemo, useState } from "react";
import type { CaseLesson } from "../data/types";
import { vocabularyByCase } from "../data/vocabulary";
import { ArchitectureDiagram } from "./ArchitectureDiagram";
import { ContextualVocabulary } from "./ContextualVocabulary";
import { EvidencePanel } from "./EvidencePanel";
import { ExplanationTabs } from "./ExplanationTabs";
import { InteractiveLab } from "./InteractiveLab";
import { ObjectiveBanner } from "./ObjectiveBanner";
import { StudentGuide } from "./StudentGuide";

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
  const [presentationStage, setPresentationStage] = useState(2);
  const index = cases.findIndex((item) => item.id === lesson.id);
  const previous = cases[(index - 1 + cases.length) % cases.length];
  const next = cases[(index + 1) % cases.length];
  const graphCastDetails = useMemo(() => lesson.diagram.technicalDrawer ?? [], [lesson.diagram]);
  const vocabulary = vocabularyByCase[lesson.id] ?? [];
  const architecture = <ArchitectureDiagram key={`${lesson.id}-${resetToken}-diagram`} spec={lesson.diagram} selectedId={selectedNodeId} onSelectNode={setSelectedNodeId} vocabulary={vocabulary} />;
  const vocabularyPanel = <ContextualVocabulary terms={vocabulary} diagram={lesson.diagram} onSelectNode={setSelectedNodeId} />;
  const lab = <InteractiveLab key={`${lesson.id}-${resetToken}-lab`} caseId={lesson.id} />;

  return (
    <section
      className={`case-workspace accent-${lesson.accent} ${presentationMode ? "presentation" : "explore"}`}
      aria-labelledby="case-title"
    >
      <header className="case-heading">
        <div>
          <span className="eyebrow">Case {lesson.number} · {lesson.field} · {lesson.organization}</span>
          <h1 id="case-title">{lesson.name}</h1>
          <p className="architecture-label">Architecture used: <b>{lesson.architecture}</b></p>
        </div>
        <button onClick={onOpenWeightHelp}>What does weight mean?</button>
      </header>

      {presentationMode ? (
        <nav className="lesson-progress" aria-label="Presentation lesson stages">
          {["Objective", "Bottleneck", "Architecture", "Weights", "Result"].map((label, indexValue) => (
            <button key={label} className={presentationStage === indexValue ? "active" : ""} onClick={() => setPresentationStage(indexValue)}><span>{indexValue + 1}</span>{label}</button>
          ))}
        </nav>
      ) : null}

      {!presentationMode || presentationStage === 0 ? <ObjectiveBanner objective={lesson.objective} /> : null}
      {!presentationMode || presentationStage === 1 ? <StudentGuide lesson={lesson} /> : null}
      {!presentationMode || presentationStage === 2 ? <>{architecture}{vocabularyPanel}</> : null}
      {!presentationMode || presentationStage === 3 ? <>{lab}<ExplanationTabs key={lesson.id} lesson={lesson} technicalDetail={technicalDetail && !presentationMode} /></> : null}
      {presentationMode && presentationStage === 4 ? <section className="presentation-result"><div className="section-heading-row"><div><span className="section-kicker">FROM THE PAPER</span><h2>Reported result and limitation</h2></div><p>Paper evidence is separated from the classroom demonstrations used in the lab.</p></div><EvidencePanel evidence={lesson.evidence} /></section> : null}

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
        <button onClick={() => { setResetToken((value) => value + 1); setSelectedNodeId(lesson.diagram.nodes[1]?.id ?? lesson.diagram.nodes[0].id); }}>Reset</button>
        <button className="primary-action" onClick={() => onSelectCase(next.id)}>
          Next case
        </button>
      </footer>
    </section>
  );
}
