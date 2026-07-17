"use client";

import { useState } from "react";
import { weightDictionary } from "../data/vocabulary";
import { weightDictionaryScript } from "../data/scripts";
import { VocabularyVisual } from "./VocabularyVisual";

export function WeightHelpDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [selected, setSelected] = useState(weightDictionary[0].term);
  if (!open) return null;
  const term = weightDictionary.find((item) => item.term === selected) ?? weightDictionary[0];

  return (
    <aside className="drawer weight-drawer open" aria-label="Weight dictionary">
      <div className="drawer-head">
        <div><span className="eyebrow">Reusable weight dictionary</span><h2>What does “weight” mean here?</h2></div>
        <button className="icon-button" onClick={onClose} aria-label="Close weight help">×</button>
      </div>
      <p className="drawer-lead">A weight can belong to the model, the training design, or the real-world decision. The color tells you which.</p>
      <div className="weight-legend drawer-legend"><span className="learned">Learned</span><span className="dynamic">Dynamic</span><span className="data">Data</span><span className="objective">Objective</span><span className="decision">Decision</span></div>
      <VocabularyVisual kind="weight-chain" />
      <div className="weight-dictionary-list">
        {weightDictionary.map((item) => <button key={item.term} className={selected === item.term ? "active" : ""} onClick={() => setSelected(item.term)}>{item.term}<small>?</small></button>)}
      </div>
      <article className="weight-term-detail">
        <span>TERM</span><h3>{term.term}</h3>
        <b>PLAIN MEANING</b><p>{term.meaning}</p>
        <b>EXAMPLE</b><p>{term.example}</p>
        <b>IN THESE PAPERS</b><p>{term.paperLink}</p>
      </article>
      <div className="weight-help-layers">
        <article className="learned"><b>WHAT THE MODEL LEARNS</b><p>θ, embeddings, network connections, gates, and attention projections.</p></article>
        <article className="training"><b>WHAT THE RESEARCHER CHOOSES</b><p>Loss coefficients, class weights, regularization, and training horizon.</p></article>
        <article className="decision"><b>WHAT THE OPERATOR CHOOSES</b><p>Risk tolerance, action threshold, survey cost, shortage cost, or false-alarm cost.</p></article>
      </div>
      <details className="weight-script-notes">
        <summary>3–4 minute presenter script</summary>
        <div className="script-copy">
          {weightDictionaryScript.map((line) => <p key={line}><span>{line}</span></p>)}
        </div>
      </details>
    </aside>
  );
}
