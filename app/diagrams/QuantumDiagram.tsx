import type { DiagramSpec } from "../data/types";

export const quantumDiagram: DiagramSpec = {
  id: "quantum",
  accent: "violet",
  feedbackLabel: "Loss compares predicted logical-error class with the observed outcome; gradients update embeddings, attention, memory, and decoder parameters.",
  nodes: [
    {
      id: "syndrome",
      label: "Syndrome events across qubits and time",
      shortLabel: "Syndrome events",
      role: "input",
      x: 90,
      y: 145,
      input: "Repeated stabilizer measurements and analog readout.",
      output: "A time-stamped event stream.",
      description: "The decoder starts with warning events, not the protected quantum state itself.",
      weight: "measurement reliability",
      weightClass: "DATA WEIGHT",
      failure: "Noisy events can make the rest of the decoder chase the wrong pattern."
    },
    {
      id: "spatial",
      label: "Spatial attention over qubit relationships",
      shortLabel: "Spatial attention",
      role: "mechanism",
      x: 275,
      y: 110,
      input: "Events from neighboring and distant qubits.",
      output: "Weighted relationships for the current cycle.",
      description: "Attention chooses which qubit events should explain one another now.",
      weight: "\\alpha_{ij}",
      weightClass: "DYNAMIC WEIGHT",
      failure: "Too narrow misses correlated errors; too diffuse treats local noise as global."
    },
    {
      id: "memory",
      label: "Recurrent memory across measurement cycles",
      shortLabel: "Recurrent memory",
      role: "mechanism",
      x: 450,
      y: 205,
      input: "Current-cycle attention plus previous hidden state.",
      output: "Updated evidence about unresolved errors.",
      description: "Recurrent state keeps evidence alive when an error pattern unfolds over cycles.",
      weight: "g_t",
      weightClass: "DYNAMIC WEIGHT",
      failure: "Short memory misses slow leakage; excessive memory preserves stale evidence."
    },
    {
      id: "decoder",
      label: "Decoder head",
      shortLabel: "Decoder head",
      role: "mechanism",
      x: 625,
      y: 130,
      input: "Hidden evidence vector.",
      output: "Probability for each logical-error class.",
      description: "Learned output weights translate hidden evidence into calibrated logical-error probabilities.",
      weight: "W_o",
      weightClass: "LEARNED PARAMETER",
      failure: "A poorly calibrated head can make a correct pattern look low risk."
    },
    {
      id: "probability",
      label: "Logical-error probabilities",
      shortLabel: "Error probabilities",
      role: "output",
      x: 770,
      y: 210,
      input: "Decoder logits.",
      output: "Probability distribution over logical errors.",
      description: "The model predicts probabilities; it does not directly know the real-world cost of each correction.",
      weight: "\\lambda_{logical}",
      weightClass: "HUMAN-SELECTED OBJECTIVE",
      failure: "The training objective can overemphasize easy classes and underweight rare failures."
    },
    {
      id: "correction",
      label: "Correction decision",
      shortLabel: "Correction",
      role: "use",
      x: 900,
      y: 140,
      input: "Logical-error probabilities and correction costs.",
      output: "Selected correction action.",
      description: "A controller chooses the action with the best expected consequence.",
      weight: "C_{ij}",
      weightClass: "DECISION COST",
      failure: "Accurate probabilities can still lead to the wrong action if false corrections and misses are priced badly."
    }
  ],
  edges: [
    { from: "syndrome", to: "spatial" },
    { from: "spatial", to: "memory" },
    { from: "memory", to: "decoder" },
    { from: "decoder", to: "probability" },
    { from: "probability", to: "correction" },
    { from: "correction", to: "memory", label: "next cycle", feedback: true }
  ]
};
