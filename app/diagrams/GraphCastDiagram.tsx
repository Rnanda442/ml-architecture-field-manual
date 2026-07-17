import type { DiagramSpec } from "../data/types";

export const graphCastDiagram: DiagramSpec = {
  id: "graphcast",
  accent: "teal",
  feedbackLabel: "Weighted forecast loss updates graph encoders, message functions, and decoders; rollout feeds each prediction back as the next input.",
  technicalDrawer: [
    "Input: ERA5 state at t-6h and t, plus static Earth fields.",
    "Target: verifying ERA5 state at t+6h during training only.",
    "Resolution: global 0.25 degree output grid at six-hour steps.",
    "Variables: surface and pressure-level atmospheric fields.",
    "Representation: grid nodes are encoded onto a spherical multimesh.",
    "Processor: repeated message passing exchanges information across mesh edges.",
    "Decoder: mesh state is projected back to the latitude-longitude grid.",
    "Loss: variable and latitude weights prevent scale and geography from dominating.",
    "Rollout: the six-hour prediction is reused autoregressively toward day 10.",
    "Risk: deterministic forecasts still need calibration or ensembles for uncertainty."
  ],
  nodes: [
    {
      id: "grid",
      label: "Two recent global weather grids",
      shortLabel: "Weather grid",
      role: "input",
      x: 85,
      y: 150,
      input: "State at t-6h, state at t, and static Earth fields.",
      output: "Grid-node features.",
      description: "GraphCast starts from recent analyzed weather states, not future observations.",
      weight: "normalization",
      weightClass: "DATA WEIGHT",
      failure: "Bad variable scaling hides important atmospheric fields."
    },
    {
      id: "encode",
      label: "Grid-to-mesh encoder",
      shortLabel: "Encode graph",
      role: "mechanism",
      x: 265,
      y: 105,
      input: "Weather grid plus edge geometry.",
      output: "Mesh latent state.",
      description: "Encoder weights move gridded variables onto a spherical multiscale graph.",
      weight: "W_{node}, W_{edge}",
      weightClass: "LEARNED PARAMETER",
      failure: "Geometry errors make the sphere behave like a flat image."
    },
    {
      id: "messages",
      label: "Multimesh message passing",
      shortLabel: "Message passing",
      role: "mechanism",
      x: 455,
      y: 215,
      input: "Mesh node states and edges.",
      output: "Updated mesh state.",
      description: "Neighboring and multiscale regions exchange learned messages.",
      weight: "m_{ij}(x)",
      weightClass: "DYNAMIC WEIGHT",
      failure: "Too little exchange misses distant coupling; too much can oversmooth fronts."
    },
    {
      id: "decode",
      label: "Mesh-to-grid decoder",
      shortLabel: "Decode grid",
      role: "mechanism",
      x: 650,
      y: 120,
      input: "Updated mesh state.",
      output: "Next weather-grid increment.",
      description: "Decoder weights translate graph information back to every output grid cell.",
      weight: "W_{decode}",
      weightClass: "LEARNED PARAMETER",
      failure: "Local details can blur during projection."
    },
    {
      id: "forecast",
      label: "Next six-hour atmospheric state",
      shortLabel: "Next 6h state",
      role: "output",
      x: 810,
      y: 215,
      input: "Decoded weather increment.",
      output: "Global weather state at t+6h.",
      description: "The exact model output is the next six-hour global atmospheric state.",
      weight: "\\lambda_v,\\omega_{lat}",
      weightClass: "HUMAN-SELECTED OBJECTIVE",
      failure: "Easy variables or dense geographic bands can dominate the loss."
    },
    {
      id: "rollout",
      label: "Autoregressive rollout and decisions",
      shortLabel: "Rollout/use",
      role: "use",
      x: 920,
      y: 125,
      input: "Predicted weather state.",
      output: "Longer forecast trajectory for weather-dependent actions.",
      description: "The prediction is repeatedly rolled forward and then interpreted by downstream decision makers.",
      weight: "C_{miss}/C_{false}",
      weightClass: "DECISION COST",
      failure: "A skillful forecast can still be too timid or too noisy for warnings."
    }
  ],
  edges: [
    { from: "grid", to: "encode" },
    { from: "encode", to: "messages" },
    { from: "messages", to: "decode" },
    { from: "decode", to: "forecast" },
    { from: "forecast", to: "rollout" },
    { from: "forecast", to: "grid", label: "roll forward", feedback: true }
  ]
};
