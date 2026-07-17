import type { DiagramSpec } from "../data/types";

export const deepARDiagram: DiagramSpec = {
  id: "business",
  accent: "blue",
  feedbackLabel: "Likelihood loss trains the distribution; inventory costs are applied after the model outputs uncertainty.",
  nodes: [
    {
      id: "history",
      label: "Product histories and covariates",
      shortLabel: "Histories",
      role: "input",
      x: 85,
      y: 150,
      input: "Demand, calendar, price, promotion, and item metadata.",
      output: "Scaled time-series inputs.",
      description: "Many sparse products contribute to one shared recurrent learner.",
      weight: "\\nu_i",
      weightClass: "DATA WEIGHT",
      failure: "High-volume items drown out sparse long-tail items."
    },
    {
      id: "rnn",
      label: "Shared recurrent core",
      shortLabel: "Shared RNN",
      role: "mechanism",
      x: 275,
      y: 105,
      input: "Scaled item histories.",
      output: "Item-specific hidden state.",
      description: "The shared core transfers seasonality and demand patterns across products.",
      weight: "\\theta_{RNN}",
      weightClass: "LEARNED PARAMETER",
      failure: "A global model can miss item-specific regimes if metadata is weak."
    },
    {
      id: "likelihood",
      label: "Probabilistic likelihood head",
      shortLabel: "Distribution head",
      role: "mechanism",
      x: 455,
      y: 215,
      input: "Hidden state for each item and horizon.",
      output: "Distribution parameters.",
      description: "The model predicts a distribution, not one demand number.",
      weight: "-\\log p(y|\\theta)",
      weightClass: "HUMAN-SELECTED OBJECTIVE",
      failure: "Wrong distribution family distorts tails."
    },
    {
      id: "fan",
      label: "Forecast distribution P10/P50/P90",
      shortLabel: "Forecast fan",
      role: "output",
      x: 650,
      y: 120,
      input: "Distribution parameters.",
      output: "Demand uncertainty across horizons.",
      description: "Uncertainty remains visible as a fan of possible demand futures.",
      weight: "\\lambda_h",
      weightClass: "HUMAN-SELECTED OBJECTIVE",
      failure: "One average score hides horizon decay."
    },
    {
      id: "quantile",
      label: "Business-cost quantile",
      shortLabel: "Cost quantile",
      role: "mechanism",
      x: 805,
      y: 215,
      input: "Forecast distribution and costs.",
      output: "Selected quantile.",
      description: "Shortage and overstock costs determine which point on the distribution is useful.",
      weight: "q=C_u/(C_u+C_o)",
      weightClass: "DECISION COST",
      failure: "The median forecast is not always the right inventory level."
    },
    {
      id: "stock",
      label: "Inventory decision",
      shortLabel: "Inventory",
      role: "use",
      x: 915,
      y: 125,
      input: "Selected quantile.",
      output: "Stocking quantity.",
      description: "The business decision is downstream from the probabilistic forecast.",
      weight: "C_u/C_o",
      weightClass: "DECISION COST",
      failure: "A good distribution can become a bad order if the cost ratio is wrong."
    }
  ],
  edges: [
    { from: "history", to: "rnn" },
    { from: "rnn", to: "likelihood" },
    { from: "likelihood", to: "fan" },
    { from: "fan", to: "quantile" },
    { from: "quantile", to: "stock" },
    { from: "fan", to: "likelihood", label: "likelihood training", feedback: true }
  ]
};
