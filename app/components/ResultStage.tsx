import type { CaseLesson } from "../data/types";
import { TermHelp } from "./TermHelp";

export function ResultStage({ lesson }: { lesson: CaseLesson }) {
  return (
    <section className="result-stage" aria-label="Reported paper evidence and limitation">
      <div className="section-heading-row">
        <div><span className="section-kicker">REPORTED BY THE PAPER</span><h2>Evidence, meaning, and boundary</h2></div>
        <a href={lesson.evidence.url} target="_blank" rel="noreferrer">Open primary paper</a>
      </div>
      <div className="reported-evidence">
        <div className="evidence-context">
          <dl>
            <div><dt>Research question</dt><dd>{lesson.objective.sentence}</dd></div>
            <div><dt>Dataset or experimental setting</dt><dd>{lesson.evidence.setting}</dd></div>
            <div><dt>Architecture</dt><dd>{lesson.architecture}</dd></div>
            <div><dt>Training objective <TermHelp term="training objective" meaning="The measured error or reward that guides parameter updates during training." /></dt><dd>{lesson.weights.training}</dd></div>
            <div><dt>Evaluation metric <TermHelp term="evaluation metric" meaning="A measurement used to judge performance on a stated test setting. It is evidence, not a guarantee for every deployment." /></dt><dd>{lesson.evidence.metric}</dd></div>
          </dl>
        </div>
        <article className="reported-result">
          <span>REPORTED RESULT</span>
          <p>{lesson.evidence.result}</p>
          <small>{lesson.evidence.organization} · {lesson.evidence.year}</small>
        </article>
      </div>
      <div className="result-interpretation">
        <article><span>OPERATIONAL INTERPRETATION</span><p>{lesson.evidence.operationalInterpretation}</p></article>
        <article><span>LIMITATION</span><p>{lesson.evidence.limitation}</p><small>The paper result does not by itself establish general deployment readiness or remove external validation.</small></article>
      </div>
    </section>
  );
}
