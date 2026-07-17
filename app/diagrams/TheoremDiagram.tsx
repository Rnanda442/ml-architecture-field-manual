import type { DiagramSpec } from "../data/types";

export const theoremDiagram: DiagramSpec = {
  id: "math",
  accent: "rose",
  feedbackLabel: "Verifier outcomes create reward and search signals; accepted proof trajectories are reinforced while invalid branches are pruned or retried.",
  nodes: [
    {
      id: "state",
      label: "Formal theorem and proof state",
      shortLabel: "Proof state",
      role: "input",
      x: 90,
      y: 150,
      input: "Lean statement, hypotheses, goals, and retrieved context.",
      output: "Tokenized proof state.",
      description: "The language model sees formal syntax and local proof context.",
      weight: "\\alpha_{ij}",
      weightClass: "DYNAMIC WEIGHT",
      failure: "Surface token similarity can replace logical relevance."
    },
    {
      id: "model",
      label: "Language model proposes steps",
      shortLabel: "Model proposes",
      role: "mechanism",
      x: 275,
      y: 105,
      input: "Proof state.",
      output: "Candidate tactic or subgoal.",
      description: "The model suggests plausible next moves but cannot certify correctness.",
      weight: "p_\\theta(t|s)",
      weightClass: "LEARNED PARAMETER",
      failure: "A locally likely tactic can destroy the global proof path."
    },
    {
      id: "tree",
      label: "Branching proof search",
      shortLabel: "Search tree",
      role: "mechanism",
      x: 455,
      y: 215,
      input: "Candidate proof steps.",
      output: "Ranked branches.",
      description: "Search allocates the next attempt among multiple possible paths.",
      weight: "b_k",
      weightClass: "DECISION COST",
      failure: "Greedy allocation misses low-probability branches that would verify."
    },
    {
      id: "verifier",
      label: "Lean verifier",
      shortLabel: "Verifier",
      role: "mechanism",
      x: 650,
      y: 125,
      input: "Candidate tactic and proof state.",
      output: "Accepted step or exact rejection.",
      description: "The verifier, not the model, determines formal correctness.",
      weight: "v",
      weightClass: "HUMAN-SELECTED OBJECTIVE",
      failure: "If verifier feedback is weakly integrated, invalid branches consume the budget."
    },
    {
      id: "proof",
      label: "Accepted formal proof",
      shortLabel: "Accepted proof",
      role: "output",
      x: 805,
      y: 215,
      input: "Sequence of verifier-accepted steps.",
      output: "Complete proof artifact.",
      description: "Only a fully verified sequence counts as the scientific output.",
      weight: "r_\\tau",
      weightClass: "HUMAN-SELECTED OBJECTIVE",
      failure: "Sparse success makes credit assignment hard."
    },
    {
      id: "retry",
      label: "Retry or prune branch",
      shortLabel: "Retry/prune",
      role: "feedback",
      x: 915,
      y: 125,
      input: "Verifier rejection or partial progress.",
      output: "Updated search priority.",
      description: "Rejected paths feed the search policy rather than becoming proof.",
      weight: "A_\\tau",
      weightClass: "DATA WEIGHT",
      failure: "Unstable updates can erase useful language skill."
    }
  ],
  edges: [
    { from: "state", to: "model" },
    { from: "model", to: "tree" },
    { from: "tree", to: "verifier" },
    { from: "verifier", to: "proof" },
    { from: "verifier", to: "retry" },
    { from: "retry", to: "tree", label: "search feedback", feedback: true }
  ]
};
