"use client";

import { useMemo, useState } from "react";
import type { DiagramEdge, DiagramNode, DiagramSpec } from "../data/types";
import { Latex } from "./Latex";

type RevealMode = "process" | "weights" | "feedback";

const classForWeight = (weightClass: string) =>
  weightClass.toLowerCase().replace(/[^a-z]+/g, "-").replace(/-$/, "");

function isEdgeActive(edge: DiagramEdge, selected: string) {
  return edge.from === selected || edge.to === selected;
}

function nodeById(nodes: DiagramNode[], id: string) {
  return nodes.find((node) => node.id === id);
}

export function ArchitectureDiagram({ spec }: { spec: DiagramSpec }) {
  const [selectedId, setSelectedId] = useState(spec.nodes[1]?.id ?? spec.nodes[0].id);
  const [mode, setMode] = useState<RevealMode>("process");
  const selected = nodeById(spec.nodes, selectedId) ?? spec.nodes[0];
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
                  onClick={() => setSelectedId(node.id)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      setSelectedId(node.id);
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
          <span className="eyebrow">Selected component</span>
          <h3>{selected.label}</h3>
          <p>{selected.description}</p>
          <dl>
            <div>
              <dt>Input</dt>
              <dd>{selected.input}</dd>
            </div>
            <div>
              <dt>Output</dt>
              <dd>{selected.output}</dd>
            </div>
            <div className={`weight-class ${classForWeight(selected.weightClass)}`}>
              <dt>{selected.weightClass}</dt>
              <dd>
                <Latex>{selected.weight}</Latex>
              </dd>
            </div>
            <div>
              <dt>If misweighted</dt>
              <dd>{selected.failure}</dd>
            </div>
          </dl>
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
