"use client";

import { useState } from "react";
import type { DiagramSpec, VocabularyTerm } from "../data/types";
import { VocabularyVisual } from "./VocabularyVisual";

export function ContextualVocabulary({
  terms,
  diagram,
  onSelectNode,
}: {
  terms: VocabularyTerm[];
  diagram: DiagramSpec;
  onSelectNode: (id: string) => void;
}) {
  const [activeTerm, setActiveTerm] = useState(terms[0]?.term ?? "");
  const active = terms.find((item) => item.term === activeTerm) ?? terms[0];
  if (!active) return null;
  const node = diagram.nodes.find((item) => active.nodeIds.includes(item.id));

  const choose = (item: VocabularyTerm) => {
    setActiveTerm(item.term);
    if (item.nodeIds[0]) onSelectNode(item.nodeIds[0]);
  };

  return (
    <section className="context-vocabulary" aria-label="Contextual vocabulary and examples">
      <div className="section-heading-row">
        <div><span className="section-kicker">VOCABULARY AT THE POINT OF USE</span><h2>Define it, see it, use it</h2></div>
        <p>Select a term. Its explanation stays visible and highlights the related architecture component.</p>
      </div>
      <div className="term-pills" aria-label="Primary terms">
        {terms.slice(0, 8).map((item) => <button key={item.term} className={active.term === item.term ? "active" : ""} onClick={() => choose(item)}>{item.term}<small>?</small></button>)}
      </div>
      <div className="term-focus">
        <VocabularyVisual kind={active.visual} />
        <article>
          <span>TERM</span><h3>{active.term}</h3>
          <dl>
            <div><dt>PLAIN MEANING</dt><dd>{active.meaning}</dd></div>
            <div><dt>EXAMPLE · ILLUSTRATIVE CLASSROOM EXAMPLE</dt><dd>{active.example}</dd></div>
            <div><dt>IN THIS PAPER</dt><dd>{active.paperLink}</dd></div>
          </dl>
          {node ? <button className="diagram-link" onClick={() => onSelectNode(node.id)}>LOOK FOR IT IN THE DIAGRAM → {node.shortLabel}</button> : null}
        </article>
      </div>
      {terms.length > 8 ? (
        <details className="secondary-terms">
          <summary>More terms used in this lesson ({terms.length - 8})</summary>
          <div className="term-pills">
            {terms.slice(8).map((item) => <button key={item.term} className={active.term === item.term ? "active" : ""} onClick={() => choose(item)}>{item.term}<small>?</small></button>)}
          </div>
        </details>
      ) : null}
    </section>
  );
}
