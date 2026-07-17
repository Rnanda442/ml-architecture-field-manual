import type { ObjectiveInfo } from "../data/types";
import { TermHelp } from "./TermHelp";

export function ObjectiveBanner({ objective }: { objective: ObjectiveInfo }) {
  const flow = [
    ["INPUT", objective.input, "The information supplied before the model begins its task."],
    ["ARCHITECTURE", objective.architecture, "The connected components that transform the input."],
    ["EXACT OUTPUT", objective.output, "The specific prediction, score, state, or action produced."],
    ["PRACTICAL USE", objective.use, "How a person or operating system may use the output after validation."]
  ];

  return (
    <section className="objective-banner" aria-label="Case objective">
      <div className="objective-lead">
        <span>MAIN OBJECTIVE</span>
        <p>{objective.sentence}</p>
      </div>
      <div className="objective-flow" aria-label="Input to architecture to output to use">
        {flow.map(([label, value, meaning], index) => (
          <div className="objective-step" key={label}>
            <span>{label} <TermHelp term={label.toLowerCase()} meaning={meaning} /></span>
            <b>{value}</b>
            {index < flow.length - 1 ? <i aria-hidden="true">-&gt;</i> : null}
          </div>
        ))}
      </div>
    </section>
  );
}
