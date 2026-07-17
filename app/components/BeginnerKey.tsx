"use client";

import { TermHelp } from "./TermHelp";

const basics = [
  ["Input", "The information given to a model before it performs a task.", "Recent weather measurements given to a forecast system."],
  ["Model", "A learned mathematical system that turns inputs into predictions, scores, or actions.", "A system that converts map layers into a prospectivity score."],
  ["Architecture", "The organized set of components and information paths inside a model.", "A blueprint showing what each part receives and passes onward."],
  ["Training", "The process that adjusts learned parameters using examples and measured errors.", "Repeatedly changing model settings so its predictions improve."],
  ["Weight", "A number that controls influence. It may be learned by the model, calculated for one input, or chosen by a person.", "Giving rare deposits more importance during training."],
  ["Prediction", "The model's output before a person or system decides what action to take.", "An 80% error probability is a prediction; applying a correction is an action."],
  ["Uncertainty", "A description of how unsure the system is, not simply whether its best guess is right or wrong.", "A wide forecast range signals less confidence about demand."],
  ["Metric", "A measurement used to evaluate performance under a stated test setting.", "Logical error rate or forecast error."],
] as const;

export function BeginnerKey() {
  return (
    <details className="beginner-key">
      <summary>New to machine learning? Open the plain-language key</summary>
      <div>{basics.map(([term, meaning, example]) => <span key={term}><b>{term}</b><TermHelp term={term} meaning={meaning} example={example} /></span>)}</div>
    </details>
  );
}
