"use client";

import { useMemo, useState } from "react";
import type { DiagramEdge, DiagramNode, DiagramSpec, VocabularyTerm } from "../data/types";
import { Latex } from "./Latex";

type RevealMode = "process" | "weights" | "feedback";

const classForWeight = (weightClass: string) =>
  weightClass.toLowerCase().replace(/[^a-z]+/g, "-").replace(/-$/, "");

const cleanPhrase = (value: string) => value.trim().replace(/[.!?]+$/, "");

function isEdgeActive(edge: DiagramEdge, selected: string) {
  return edge.from === selected || edge.to === selected;
}

function nodeById(nodes: DiagramNode[], id: string) {
  return nodes.find((node) => node.id === id);
}

const weightControl = (node: DiagramNode) => {
  if (node.weightClass === "LEARNED PARAMETER") return `Inside ${node.shortLabel}, training adjusts stored parameters that map ${cleanPhrase(node.input).toLowerCase()} into ${cleanPhrase(node.output).toLowerCase()}.`;
  if (node.weightClass === "DYNAMIC WEIGHT") return `For the current example, ${node.shortLabel} recalculates how strongly parts of ${cleanPhrase(node.input).toLowerCase()} influence ${cleanPhrase(node.output).toLowerCase()}.`;
  if (node.weightClass === "DATA WEIGHT") return `For ${node.shortLabel}, it changes how strongly this example, class, location, variable, or time step contributes to learning.`;
  if (node.weightClass === "HUMAN-SELECTED OBJECTIVE") return `The researcher uses it to decide how strongly errors connected to ${node.shortLabel} contribute to the training objective.`;
  return `The operator uses it after ${node.shortLabel} produces ${cleanPhrase(node.output).toLowerCase()}, converting that output into a consequence-aware action.`;
};

export function ArchitectureDiagram({
  spec,
  selectedId,
  onSelectNode,
  vocabulary,
  equation,
  equationNote,
}: {
  spec: DiagramSpec;
  selectedId: string;
  onSelectNode: (id: string) => void;
  vocabulary: VocabularyTerm[];
  equation: string;
  equationNote: string;
}) {
  const [mode, setMode] = useState<RevealMode>("process");
  const selected = nodeById(spec.nodes, selectedId) ?? spec.nodes[0];
  const relatedTerms = vocabulary.filter((term) => term.nodeIds.includes(selected.id));
  const relatedTerm = relatedTerms[0];
  const selectedIndex = spec.nodes.findIndex((node) => node.id === selected.id);
  const selectAt = (index: number) => onSelectNode(spec.nodes[Math.max(0, Math.min(spec.nodes.length - 1, index))].id);
  const connectedIds = useMemo(() => {
    const ids = new Set([selectedId]);
    spec.edges.forEach((edge) => {
      if (isEdgeActive(edge, selectedId)) {
        ids.add(edge.from);
        ids.add(edge.to);
      }
    });
    return ids;
  }, [selectedId, spec.edges]);

  return (
    <section className={`diagram-panel accent-${spec.accent}`} aria-label="Clickable architecture pipeline">
      <div className="section-heading-row">
        <div><span className="section-kicker">PAPER ARCHITECTURE</span><h2>Follow the information</h2></div>
        <p>Move from left to right. Each component explains its input, action, vocabulary, weight, equation connection, and output before you continue.</p>
      </div>
      <div className="diagram-toolbar" role="tablist" aria-label="Diagram reveal controls">
        {[
          ["process", "Process"],
          ["weights", "Weights"],
          ["feedback", "Training feedback"]
        ].map(([value, label]) => (
          <button
            key={value}
            role="tab"
            aria-selected={mode === value}
            className={mode === value ? "active" : ""}
            onClick={() => setMode(value as RevealMode)}
          >
            {label}
          </button>
        ))}
        <div className="weight-legend" aria-label="Weight color legend">
          <span className="learned">Learned</span><span className="dynamic">Dynamic</span><span className="data">Data</span><span className="objective">Objective</span><span className="decision">Decision</span>
        </div>
      </div>

      <div className="diagram-body">
        <div className="diagram-canvas" data-mode={mode}>
          <svg viewBox="0 0 1000 360" role="img" aria-label={`${spec.id} architecture diagram`}>
            <defs>
              <marker
                id={`arrow-${spec.id}`}
                markerWidth="10"
                markerHeight="10"
                refX="8"
                refY="3"
                orient="auto"
                markerUnits="strokeWidth"
              >
                <path d="M0,0 L0,6 L9,3 z" />
              </marker>
            </defs>
            {spec.edges.map((edge) => {
              const from = nodeById(spec.nodes, edge.from);
              const to = nodeById(spec.nodes, edge.to);
              if (!from || !to) return null;
              const visible = !edge.feedback || mode === "feedback";
              const active = isEdgeActive(edge, selectedId);
              const midX = (from.x + to.x) / 2;
              const midY = (from.y + to.y) / 2;
              return (
                <g
                  key={`${edge.from}-${edge.to}`}
                  className={`diagram-edge ${edge.feedback ? "feedback" : ""} ${
                    active ? "active" : ""
                  } ${visible ? "" : "hidden"}`}
                >
                  <path
                    d={`M ${from.x + 55} ${from.y} C ${midX} ${from.y}, ${midX} ${to.y}, ${
                      to.x - 55
                    } ${to.y}`}
                    markerEnd={`url(#arrow-${spec.id})`}
                  />
                  {edge.label && visible ? (
                    <text x={midX} y={midY - 10}>
                      {edge.label}
                    </text>
                  ) : null}
                </g>
              );
            })}

            {spec.nodes.map((node) => {
              const active = node.id === selectedId;
              const dim = !connectedIds.has(node.id);
              return (
                <g
                  key={node.id}
                  role="button"
                  tabIndex={0}
                  aria-label={`${node.label}: ${node.description}`}
                  className={`diagram-node ${node.role} ${active ? "active" : ""} ${
                    dim ? "dimmed" : ""
                  }`}
                  onClick={() => onSelectNode(node.id)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      onSelectNode(node.id);
                    }
                  }}
                >
                  <rect x={node.x - 68} y={node.y - 34} width="136" height="68" rx="14" />
                  <text x={node.x} y={node.y - 5}>
                    {node.shortLabel}
                  </text>
                  <text x={node.x} y={node.y + 16} className="node-role">
                    {node.role}
                  </text>
                  {mode === "weights" ? (
                    <text x={node.x} y={node.y + 55} className="node-weight">
                      {node.weight.replaceAll("\\", "")}
                    </text>
                  ) : null}
                </g>
              );
            })}
          </svg>
        </div>

        <aside className="node-detail" aria-live="polite">
          <div className="component-progress"><span>Component {selectedIndex + 1} of {spec.nodes.length}</span><progress value={selectedIndex + 1} max={spec.nodes.length} /></div>
          <span className="eyebrow">Component</span>
          <h3>{selected.label}</h3>
          <dl>
            <div><dt>WHAT ENTERS</dt><dd>{selected.input}</dd></div>
          </dl>
          <div className="selected-explanation">
            <span>WHAT IT DOES</span>
            <p>{selected.description}</p>
          </div>
          {relatedTerms.length ? <div className="selected-vocabulary"><span>VOCABULARY TO KNOW HERE</span>{relatedTerms.map((term) => <article key={term.term}><b>{term.term}</b><p>{term.meaning}</p><small>Example: {term.example}</small></article>)}</div> : null}
          <div className="selected-explanation example">
            <span>SIMPLE EXAMPLE</span>
            <p>{relatedTerm?.example ?? `Think of ${selected.shortLabel.toLowerCase()} as one stage that receives information, changes it, and passes a more useful form onward.`}</p>
          </div>
          <div className="selected-explanation paper-use">
            <span>IN THIS PAPER</span>
            <p>{relatedTerm?.paperLink ?? selected.description}</p>
          </div>
          <dl>
            <div>
              <dt>WHAT LEAVES</dt>
              <dd>{selected.output}</dd>
            </div>
            <div className={`weight-class ${classForWeight(selected.weightClass)}`}>
              <dt>WEIGHT OR SETTING · {selected.weightClass}</dt>
              <dd>
                <Latex>{selected.weight}</Latex>
              </dd>
            </div>
            <div>
              <dt>WHO CONTROLS IT · WHAT IT CHANGES</dt>
              <dd>{weightControl(selected)}</dd>
            </div>
            <div className="equation-connection"><dt>RELATED TRAINING EQUATION</dt><dd><Latex block>{equation}</Latex><p>{equationNote}</p></dd></div>
            <div>
              <dt>IF MISWEIGHTED</dt>
              <dd>{selected.failure}</dd>
            </div>
            <div className="look-for-cue">
              <dt>LOOK FOR</dt>
              <dd>Point to <b>{selected.shortLabel}</b> and follow the highlighted edge from its input toward its output.</dd>
            </div>
          </dl>
          <div className="component-step-controls"><button disabled={selectedIndex === 0} onClick={() => selectAt(selectedIndex - 1)}>Previous component</button><button className="primary-action" disabled={selectedIndex === spec.nodes.length - 1} onClick={() => selectAt(selectedIndex + 1)}>Next component</button></div>
        </aside>
      </div>

      {mode === "feedback" ? (
        <div className="feedback-strip">
          <b>Training feedback</b>
          <p>{spec.feedbackLabel}</p>
        </div>
      ) : null}
    </section>
  );
}
