import type { VocabularyVisual as VisualKind } from "../data/types";

export function VocabularyVisual({ kind }: { kind?: VisualKind }) {
  if (!kind) return null;

  if (kind === "qubit-grid") return <div className="mini-visual qubit-mini" aria-label="Physical qubits surrounding protected logical information"><i/><i/><i/><i/><b>logical</b><i/><i/><i/><i/></div>;
  if (kind === "timeline") return <div className="mini-visual flow-mini"><span>Cycle 1</span><i>→</i><span>Cycle 2</span><i>→</i><span>Cycle 3</span></div>;
  if (kind === "attention") return <div className="mini-visual attention-mini"><b>A</b><span className="strong">0.8 → B</span><span className="weak">0.1 → C</span></div>;
  if (kind === "probability") return <div className="mini-visual probability-mini"><span>low</span><i/><b>70% threshold</b><span>high</span></div>;
  if (kind === "map-layers") return <div className="mini-visual layers-mini"><span>geology</span><span>magnetics</span><span>chemistry</span><b>aligned stack</b></div>;
  if (kind === "masking") return <div className="mini-visual mask-mini"><i/><i/><i className="hidden-cell">?</i><i/><b>reconstruct hidden patch</b></div>;
  if (kind === "imbalance") return <div className="mini-visual imbalance-mini"><b>2 deposits</b><div><i className="positive"/><i className="positive"/>{Array.from({ length: 18 }, (_, index) => <i key={index}/>)}</div><span>18 background</span></div>;
  if (kind === "target-rank") return <div className="mini-visual rank-mini"><span><b>0.82</b> target A</span><span><b>0.61</b> target B</span><span><b>0.17</b> target C</span></div>;
  if (kind === "sequence") return <div className="mini-visual flow-mini"><span>state</span><i>→</i><span>action</span><i>→</i><span>new state</span></div>;
  if (kind === "risk-bars") return <div className="mini-visual risk-mini"><span><i style={{ width: "78%" }}/>miss cost</span><span><i style={{ width: "42%" }}/>false cost</span></div>;
  if (kind === "crystal") return <div className="mini-visual crystal-mini">{Array.from({ length: 9 }, (_, index) => <i className={index % 3 === 0 ? "atom-b" : ""} key={index}/>)}</div>;
  if (kind === "denoise") return <div className="mini-visual denoise-mini"><span>noisy</span><i>→</i><span>ordered</span><i>→</i><span>candidate</span></div>;
  if (kind === "proof-tree") return <div className="mini-visual proof-mini"><b>goal</b><span>branch A ✕</span><span>branch B ✓</span><span>branch C …</span></div>;
  if (kind === "forecast-fan") return <div className="mini-visual fan-mini"><i/><i/><i/><b>P90 order</b></div>;
  if (kind === "multimesh") return <div className="mini-visual mesh-mini">{Array.from({ length: 9 }, (_, index) => <i className={index === 4 ? "hub" : ""} key={index}/>)}</div>;
  return <div className="mini-visual weight-chain-mini"><span>data</span><i>→</i><span>prediction</span><i>→</i><span>loss</span><i>→</i><span>update</span><i>→</i><span>action</span></div>;
}
