"use client";

import { useMemo, useState } from "react";
import type { CaseScript, PresentationStageId, ScriptCue } from "../data/types";

const stageOrder: PresentationStageId[] = [
  "objective",
  "bottleneck",
  "architecture",
  "vocabulary",
  "weights",
  "lab",
  "result",
];

const stageLabels: Record<PresentationStageId, string> = {
  objective: "Objective",
  bottleneck: "Bottleneck",
  architecture: "Architecture",
  vocabulary: "Vocabulary",
  weights: "Weights",
  lab: "Lab",
  result: "Result",
};

function plainScript(lines: ScriptCue[]) {
  return lines.map((line) => `${line.cue ? `[${line.cue}] ` : ""}${line.text}`).join("\n\n");
}

export function PresenterScriptPanel({
  script,
  stage,
  onStageChange,
}: {
  script: CaseScript;
  stage: PresentationStageId;
  onStageChange: (stage: PresentationStageId) => void;
}) {
  const [presenterView, setPresenterView] = useState(false);
  const [open, setOpen] = useState(true);
  const [length, setLength] = useState<"quick" | "full">("full");
  const [scope, setScope] = useState<"stage" | "case">("stage");
  const [copied, setCopied] = useState(false);

  const lines = useMemo(() => {
    if (length === "quick") {
      return scope === "stage" ? script.quick.filter((line) => line.stage === stage) : script.quick;
    }
    return scope === "stage" ? script.full[stage] : stageOrder.flatMap((item) => script.full[item]);
  }, [length, scope, script, stage]);

  const stageIndex = stageOrder.indexOf(stage);
  const copyCase = async () => {
    const full = stageOrder
      .map((item) => `${stageLabels[item].toUpperCase()}\n${plainScript(script.full[item])}`)
      .join("\n\n");
    await navigator.clipboard.writeText(`${script.title}\n\n${full}\n\nTECHNICAL NOTES\n${script.deeperNotes.join("\n")}`);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  };

  if (!presenterView) {
    return (
      <div className="presenter-controls audience-controls" aria-label="Audience and presenter controls">
        <span><b>Audience view</b> · speaker notes hidden</span>
        <button onClick={() => setPresenterView(true)}>Open Presenter View</button>
      </div>
    );
  }

  return (
    <section className="presenter-system" aria-label="Presenter script">
      <div className="presenter-controls">
        <div>
          <span className="section-kicker">PRESENTER VIEW</span>
          <b>{script.title}</b>
        </div>
        <div className="presenter-actions">
          <button onClick={() => setPresenterView(false)}>Audience View</button>
          <button onClick={() => setOpen((value) => !value)}>{open ? "Hide Script" : "Show Script"}</button>
          <button onClick={copyCase}>{copied ? "Copied" : "Copy Case Script"}</button>
        </div>
      </div>

      {open ? (
        <div className="script-drawer">
          <div className="script-toolbar">
            <div role="group" aria-label="Script length">
              <button className={length === "quick" ? "active" : ""} onClick={() => setLength("quick")}>Quick Version</button>
              <button className={length === "full" ? "active" : ""} onClick={() => setLength("full")}>Full Version</button>
            </div>
            <div role="group" aria-label="Script scope">
              <button className={scope === "stage" ? "active" : ""} onClick={() => setScope("stage")}>Current Stage</button>
              <button className={scope === "case" ? "active" : ""} onClick={() => setScope("case")}>Full Script View</button>
            </div>
          </div>

          <div className="script-copy" aria-live="polite">
            <span className="script-stage-label">{scope === "stage" ? stageLabels[stage] : "Complete case"}</span>
            {lines.map((line, index) => (
              <p key={`${line.stage}-${index}`}>
                {line.cue ? <b className="script-cue">[{line.cue}{line.relatedNodeId ? `: ${line.relatedNodeId}` : line.relatedLabControl ? `: ${line.relatedLabControl}` : ""}]</b> : null}
                <span>{line.text}</span>
              </p>
            ))}
            {scope === "case" ? (
              <details className="technical-notes">
                <summary>Optional deeper notes for questions</summary>
                <ul>{script.deeperNotes.map((note) => <li key={note}>{note}</li>)}</ul>
              </details>
            ) : null}
          </div>

          <div className="script-stage-actions">
            <button disabled={stageIndex === 0} onClick={() => onStageChange(stageOrder[Math.max(0, stageIndex - 1)])}>Previous Stage</button>
            <span>{stageIndex + 1} / {stageOrder.length} · {stageLabels[stage]}</span>
            <button className="primary-action" disabled={stageIndex === stageOrder.length - 1} onClick={() => onStageChange(stageOrder[Math.min(stageOrder.length - 1, stageIndex + 1)])}>Next Stage</button>
          </div>
        </div>
      ) : null}
    </section>
  );
}
