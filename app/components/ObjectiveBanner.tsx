import type { ObjectiveInfo } from "../data/types";

export function ObjectiveBanner({ objective }: { objective: ObjectiveInfo }) {
  const flow = [
    ["INPUT", objective.input],
    ["ARCHITECTURE", objective.architecture],
    ["EXACT OUTPUT", objective.output],
    ["PRACTICAL USE", objective.use]
  ];

  return (
    <section className="objective-banner" aria-label="Case objective">
      <div className="objective-lead">
        <span>MAIN OBJECTIVE</span>
        <p>{objective.sentence}</p>
      </div>
      <div className="objective-flow" aria-label="Input to architecture to output to use">
        {flow.map(([label, value], index) => (
          <div className="objective-step" key={label}>
            <span>{label}</span>
            <b>{value}</b>
            {index < flow.length - 1 ? <i aria-hidden="true">-&gt;</i> : null}
          </div>
        ))}
      </div>
    </section>
  );
}
