import type { DiagramSpec } from "../data/types";

export const matterGenDiagram: DiagramSpec = {
  id: "materials",
  accent: "cyan",
  feedbackLabel: "Denoising losses update atom, coordinate, and lattice channels; property guidance steers generation at sampling time.",
  nodes: [
    {
      id: "noise",
      label: "Noisy crystal variables",
      shortLabel: "Noisy crystal",
      role: "input",
      x: 85,
      y: 150,
      input: "Atom types, coordinates, lattice, and structured noise.",
      output: "Corrupted crystal state.",
      description: "Diffusion begins from a deliberately noisy scientific object.",
      weight: "\\beta_t",
      weightClass: "HUMAN-SELECTED OBJECTIVE",
      failure: "A poor schedule destroys structure too quickly or makes denoising trivial."
    },
    {
      id: "score",
      label: "Equivariant score network",
      shortLabel: "Score network",
      role: "mechanism",
      x: 275,
      y: 105,
      input: "Noisy atoms, coordinates, and lattice.",
      output: "Predicted denoising direction.",
      description: "The network learns geometry-aware corrections rather than relearning rotations from scratch.",
      weight: "\\theta_{score}",
      weightClass: "LEARNED PARAMETER",
      failure: "Non-geometric behavior wastes data and proposes unstable arrangements."
    },
    {
      id: "channels",
      label: "Atom, coordinate, lattice balance",
      shortLabel: "Channel balance",
      role: "mechanism",
      x: 455,
      y: 215,
      input: "Three coupled denoising tasks.",
      output: "Balanced crystal update.",
      description: "Atoms, positions, and lattice must improve together.",
      weight: "\\lambda_A,\\lambda_X,\\lambda_L",
      weightClass: "HUMAN-SELECTED OBJECTIVE",
      failure: "One accurate channel can hide another channel's failure."
    },
    {
      id: "guidance",
      label: "Property conditioning and guidance",
      shortLabel: "Guidance",
      role: "mechanism",
      x: 640,
      y: 120,
      input: "Requested property target and denoising prediction.",
      output: "Steered denoising step.",
      description: "Guidance pushes toward a target property without treating diversity as free.",
      weight: "s",
      weightClass: "DYNAMIC WEIGHT",
      failure: "Excess guidance collapses samples into narrow or unstable candidates."
    },
    {
      id: "candidate",
      label: "Ordered candidate crystal",
      shortLabel: "Candidate",
      role: "output",
      x: 795,
      y: 215,
      input: "Denoised crystal variables.",
      output: "Candidate structure.",
      description: "The generator proposes a structure; physics checks still decide whether it survives.",
      weight: "\\phi(c)",
      weightClass: "LEARNED PARAMETER",
      failure: "Scarce property data can overfit the adapter."
    },
    {
      id: "screen",
      label: "Simulation and synthesis triage",
      shortLabel: "Triage",
      role: "use",
      x: 910,
      y: 130,
      input: "Candidate crystal and target properties.",
      output: "Screened material candidates.",
      description: "Expensive DFT and lab work are reserved for promising structures.",
      weight: "C_{DFT}",
      weightClass: "DECISION COST",
      failure: "A generous screen wastes compute; a strict screen rejects useful novelty."
    }
  ],
  edges: [
    { from: "noise", to: "score" },
    { from: "score", to: "channels" },
    { from: "channels", to: "guidance" },
    { from: "guidance", to: "candidate" },
    { from: "candidate", to: "screen" },
    { from: "candidate", to: "score", label: "next denoise step", feedback: true }
  ]
};
