import type { DiagramSpec } from "../data/types";

export const financeDiagram: DiagramSpec = {
  id: "finance",
  accent: "emerald",
  feedbackLabel: "The policy is scored by terminal portfolio risk after costs, so gradients reward the full sequence of actions.",
  nodes: [
    {
      id: "state",
      label: "Market and portfolio state",
      shortLabel: "Market state",
      role: "input",
      x: 85,
      y: 145,
      input: "Prices, volatility, time, current positions, and limits.",
      output: "A state vector for the policy.",
      description: "The model observes the portfolio problem, not just tomorrow's price direction.",
      weight: "W_{state}",
      weightClass: "LEARNED PARAMETER",
      failure: "Poor state encoding creates fake predictability or hides exposure."
    },
    {
      id: "policy",
      label: "Sequential hedge policy",
      shortLabel: "Policy",
      role: "mechanism",
      x: 275,
      y: 105,
      input: "Current risk state.",
      output: "Next hedge position.",
      description: "The policy chooses an action that changes both risk and future cost.",
      weight: "\\theta",
      weightClass: "LEARNED PARAMETER",
      failure: "An overfit policy exploits simulator quirks instead of hedging robustly."
    },
    {
      id: "action",
      label: "Hedge action",
      shortLabel: "Hedge action",
      role: "output",
      x: 455,
      y: 205,
      input: "Policy output.",
      output: "Position change.",
      description: "The action is a trade, not a forecast.",
      weight: "\\pi_\\theta(s_t)",
      weightClass: "DYNAMIC WEIGHT",
      failure: "A locally attractive trade can increase terminal risk after costs."
    },
    {
      id: "cost",
      label: "Transaction cost",
      shortLabel: "Cost",
      role: "mechanism",
      x: 645,
      y: 125,
      input: "Position change and liquidity assumptions.",
      output: "Cost-adjusted portfolio state.",
      description: "Rising costs should naturally reduce unnecessary turnover.",
      weight: "c_j",
      weightClass: "DECISION COST",
      failure: "Ignoring cost rewards impossible high-frequency rebalancing."
    },
    {
      id: "portfolio",
      label: "Updated portfolio",
      shortLabel: "Portfolio",
      role: "mechanism",
      x: 790,
      y: 225,
      input: "Hedge action after cost.",
      output: "Next state for the next time step.",
      description: "The updated portfolio loops forward until the terminal payoff is known.",
      weight: "\\omega_s",
      weightClass: "DATA WEIGHT",
      failure: "Stress scenarios stay invisible when average paths dominate training."
    },
    {
      id: "risk",
      label: "Terminal risk objective",
      shortLabel: "Risk score",
      role: "use",
      x: 900,
      y: 120,
      input: "Terminal cost-adjusted PnL distribution.",
      output: "Policy update signal.",
      description: "The loss evaluates economic risk, not point-prediction accuracy.",
      weight: "\\gamma",
      weightClass: "HUMAN-SELECTED OBJECTIVE",
      failure: "Low risk aversion chases return; excessive risk aversion over-hedges."
    }
  ],
  edges: [
    { from: "state", to: "policy" },
    { from: "policy", to: "action" },
    { from: "action", to: "cost" },
    { from: "cost", to: "portfolio" },
    { from: "portfolio", to: "policy", label: "next step", feedback: true },
    { from: "portfolio", to: "risk" }
  ]
};
