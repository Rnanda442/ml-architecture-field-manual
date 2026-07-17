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
  const [query, setQuery] = useState("");
  const [group, setGroup] = useState("All terms");
  const active = terms.find((item) => item.term === activeTerm) ?? terms[0];
  if (!active) return null;
  const node = diagram.nodes.find((item) => active.nodeIds.includes(item.id));

  const category = (item: VocabularyTerm) => {
    const name = item.term.toLowerCase();
    if (/cost|threshold|inventory|synthesis|dft|survey|correction/.test(name)) return "Operational decisions";
    if (/weight|loss|gradient|optimizer|regularization|imbalance|fine-tuning|self-supervised|reinforcement|kl control|guidance strength|branch budget|masking/.test(name)) return "Training and weighting";
    if (/probability|rate|uncertainty|calibration|pass@k|forecast|p&l|risk|diversity|stability|prospectivity/.test(name)) return "Outputs and evaluation";
    const roles = diagram.nodes.filter((candidate) => item.nodeIds.includes(candidate.id)).map((candidate) => candidate.role);
    if (roles.some((role) => role === "mechanism" || role === "feedback")) return "Model components";
    return "System or domain concepts";
  };

  const groups = ["All terms", "System or domain concepts", "Model components", "Training and weighting", "Outputs and evaluation", "Operational decisions"];
  const visibleTerms = terms.filter((item) => {
    const matchesGroup = group === "All terms" || category(item) === group;
    const haystack = `${item.term} ${item.meaning} ${item.example}`.toLowerCase();
    return matchesGroup && haystack.includes(query.trim().toLowerCase());
  });

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
      <div className="vocabulary-selector">
        <label className="vocabulary-search"><span>Find a term</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search this case…" /></label>
        <div className="vocabulary-groups" role="group" aria-label="Vocabulary groups">
          {groups.map((item) => <button key={item} className={group === item ? "active" : ""} onClick={() => setGroup(item)}>{item}</button>)}
        </div>
      </div>
      <div className="term-pills compact" aria-label="Terms in selected group">
        {visibleTerms.map((item) => <button key={item.term} className={active.term === item.term ? "active" : ""} onClick={() => choose(item)}>{item.term}<small>?</small></button>)}
        {visibleTerms.length === 0 ? <p className="empty-vocabulary">No matching term in this group.</p> : null}
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
          {node ? <button className="diagram-link" onClick={() => onSelectNode(node.id)}>RELATED DIAGRAM COMPONENT → {node.shortLabel}</button> : null}
        </article>
      </div>
    </section>
  );
}
