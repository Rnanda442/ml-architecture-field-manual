"use client";

import { useState } from "react";
import type { CaseLesson } from "../data/types";
import { EvidencePanel } from "./EvidencePanel";
import { Latex } from "./Latex";

type TabId = "why" | "weights" | "evidence";

export function ExplanationTabs({
  lesson,
  technicalDetail
}: {
  lesson: CaseLesson;
  technicalDetail: boolean;
}) {
  const [tab, setTab] = useState<TabId>("why");

  return (
    <section className="explanation-tabs" aria-label="Case explanation tabs">
      <div className="tab-list" role="tablist">
        {[
          ["why", "Why this model"],
          ["weights", "Weights"],
          ["evidence", "Evidence"]
        ].map(([id, label]) => (
          <button
            key={id}
            role="tab"
            aria-selected={tab === id}
            className={tab === id ? "active" : ""}
            onClick={() => setTab(id as TabId)}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === "why" ? (
        <div className="why-strip" role="tabpanel">
          <article>
            <span>PROBLEM</span>
            <p>{lesson.problem}</p>
          </article>
          <article>
            <span>BOTTLENECK</span>
            <p>{lesson.bottleneck}</p>
          </article>
          <article>
            <span>ARCHITECTURE RESPONSE</span>
            <p>{lesson.response}</p>
          </article>
        </div>
      ) : null}

      {tab === "weights" ? (
        <div className="weights-tab" role="tabpanel">
          <div className="weight-layer-diagram" aria-label="Three places weighting happens in this case">
            <article className="layer-model">
              <span>MODEL LEARNS</span>
              <Latex>{"\\theta"}</Latex>
              <p>{lesson.weights.inside}</p>
            </article>
            <article className="layer-training">
              <span>TRAINING DESIGN SELECTS</span>
              <Latex>{"\\lambda,\\omega"}</Latex>
              <p>{lesson.weights.training}</p>
            </article>
            <article className="layer-decision">
              <span>DECISION MAKER SELECTS</span>
              <Latex>{"C"}</Latex>
              <p>{lesson.weights.decision}</p>
            </article>
          </div>
          <details className="equation-details" open={technicalDetail}>
            <summary>Equation</summary>
            <Latex block>{lesson.weights.equation}</Latex>
            <p>{lesson.weights.note}</p>
          </details>
        </div>
      ) : null}

      {tab === "evidence" ? <EvidencePanel evidence={lesson.evidence} /> : null}
    </section>
  );
}
