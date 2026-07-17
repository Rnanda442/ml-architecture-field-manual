import type { DiagramSpec } from "../data/types";

export const mineralsDiagram: DiagramSpec = {
  id: "minerals",
  accent: "amber",
  feedbackLabel: "Masked reconstruction updates the encoder before scarce deposit labels tune the prospectivity head.",
  nodes: [
    {
      id: "layers",
      label: "Geology, magnetics, gravity, geochemistry",
      shortLabel: "Aligned map layers",
      role: "input",
      x: 85,
      y: 155,
      input: "Multimodal maps on different scales and reliabilities.",
      output: "Aligned grid patches.",
      description: "Each layer is useful for a different geological clue, but units and reliability differ.",
      weight: "m_1...m_4",
      weightClass: "DATA WEIGHT",
      failure: "A noisy layer can dominate the map because it is dense or high variance."
    },
    {
      id: "mask",
      label: "Masked self-supervised learning",
      shortLabel: "Masked encoder",
      role: "mechanism",
      x: 275,
      y: 110,
      input: "Complete and masked geospatial patches.",
      output: "Reusable geological representations.",
      description: "The encoder practices reconstructing hidden map structure before labels are available.",
      weight: "a_p",
      weightClass: "DATA WEIGHT",
      failure: "Bad mask sampling teaches easy texture instead of meaningful geological structure."
    },
    {
      id: "labels",
      label: "Few confirmed deposit labels",
      shortLabel: "Rare labels",
      role: "mechanism",
      x: 455,
      y: 205,
      input: "Known positives and many unlabeled or negative cells.",
      output: "Fine-tuned prospectivity features.",
      description: "Class weighting stops the model from winning by predicting no deposit everywhere.",
      weight: "w_+",
      weightClass: "HUMAN-SELECTED OBJECTIVE",
      failure: "Rare positives disappear inside the loss."
    },
    {
      id: "map",
      label: "Prospectivity and uncertainty map",
      shortLabel: "Prospectivity map",
      role: "output",
      x: 650,
      y: 130,
      input: "Fine-tuned geospatial features.",
      output: "Cell-level geological probability and uncertainty.",
      description: "Probability and uncertainty stay separate so confidence is not confused with priority.",
      weight: "\\theta",
      weightClass: "LEARNED PARAMETER",
      failure: "Overconfident predictions can look operationally decisive before field validation."
    },
    {
      id: "rank",
      label: "Exploration ranking",
      shortLabel: "Top targets",
      role: "use",
      x: 865,
      y: 165,
      input: "Prospectivity, uncertainty, access, and survey cost.",
      output: "Ranked field-survey and drilling targets.",
      description: "The decision layer turns geological probability into an exploration priority.",
      weight: "C_{survey}",
      weightClass: "DECISION COST",
      failure: "A high-probability target can still be the wrong first survey if cost or uncertainty is ignored."
    }
  ],
  edges: [
    { from: "layers", to: "mask" },
    { from: "mask", to: "labels" },
    { from: "labels", to: "map" },
    { from: "map", to: "rank" },
    { from: "map", to: "labels", label: "fine-tune", feedback: true }
  ]
};
