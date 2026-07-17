import type { CaseLesson } from "../data/types";
import { Latex } from "./Latex";

const chain = ["Data", "Model prediction", "Loss", "Gradients", "Parameter update", "Calibrated output", "Cost / threshold", "Action"];

export function WeightsStage({ lesson }: { lesson: CaseLesson }) {
  return (
    <section className="weights-stage" aria-label="Case weighting system">
      <div className="section-heading-row">
        <div><span className="section-kicker">WEIGHT OWNERSHIP</span><h2>Who changes which value?</h2></div>
        <p>Stored parameters, training priorities, and operational consequences are different parts of the system.</p>
      </div>

      <div className="learning-chain" aria-label="Learning and decision chain">
        {chain.map((item, index) => <div key={item}><b>{item}</b>{index < chain.length - 1 ? <i aria-hidden="true">→</i> : null}</div>)}
      </div>

      <div className="weight-ownership-grid">
        <article className="ownership-model">
          <span>WHAT THE MODEL LEARNS · PURPLE + TEAL</span>
          <h3>Parameters and input-dependent weights</h3>
          <p>{lesson.weights.inside}</p>
          <dl><div><dt>Updated by gradients</dt><dd>Stored neural-network parameters, embeddings, gates, projections, and output mappings.</dd></div><div><dt>Calculated per input</dt><dd>Dynamic attention, gate values, probabilities, or messages produced from the current example.</dd></div></dl>
        </article>
        <article className="ownership-researcher">
          <span>WHAT THE RESEARCHER CHOOSES · BLUE + ORANGE</span>
          <h3>Data contribution and objective balance</h3>
          <p>{lesson.weights.training}</p>
          <dl><div><dt>Data weights</dt><dd>Example, class, location, variable, or time-step emphasis.</dd></div><div><dt>Loss coefficients</dt><dd>How strongly separate training errors and regularization contribute.</dd></div></dl>
        </article>
        <article className="ownership-operator">
          <span>WHAT THE OPERATOR CHOOSES · RED</span>
          <h3>Decision cost, threshold, and action</h3>
          <p>{lesson.weights.decision}</p>
          <dl><div><dt>Not a hidden model parameter</dt><dd>The consequence of a false correction, missed target, bad hedge, stockout, or false alarm.</dd></div></dl>
        </article>
      </div>

      <div className="equation-speaking-note">
        <div><span className="section-kicker">TEACHING EQUATION</span><Latex block>{lesson.weights.equation}</Latex></div>
        <div><b>How to explain it aloud</b><p>{lesson.weights.note} Identify what is learned, what is researcher-selected, and what belongs to the downstream decision before discussing coefficient size.</p><small>This displayed expression is a compact teaching abstraction unless the paper source explicitly presents the same full objective.</small></div>
      </div>
    </section>
  );
}
