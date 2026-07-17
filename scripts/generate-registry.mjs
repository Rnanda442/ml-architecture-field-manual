import { mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const reviewed = "2026-07-14";

const sections = [
  ["Foundational and tabular architectures", [
    "Linear regression",
    "Logistic regression",
    "Ridge regression",
    "Lasso regression",
    "Elastic Net",
    "Decision tree",
    "Random forest",
    "Extra Trees",
    "Gradient-boosted trees",
    "XGBoost",
    "LightGBM",
    "CatBoost",
    "Multilayer perceptron"
  ]],
  ["Spatial and image architectures", [
    "Convolutional neural network",
    "ResNet",
    "DenseNet",
    "U-Net",
    "3D U-Net",
    "Vision Transformer",
    "Swin Transformer",
    "Masked autoencoder",
    "Siamese image network",
    "Geospatial foundation model"
  ]],
  ["Graph and structural architectures", [
    "Graph convolutional network",
    "Graph attention network",
    "Message-passing neural network",
    "Graph transformer",
    "Equivariant graph neural network",
    "Crystal graph convolutional network",
    "Neural interatomic potential"
  ]],
  ["Time-series architectures", [
    "Recurrent neural network",
    "LSTM",
    "GRU",
    "Temporal convolutional network",
    "DeepAR",
    "N-BEATS",
    "Temporal Fusion Transformer",
    "General time-series transformer",
    "State-space sequence model",
    "Spatiotemporal transformer"
  ]],
  ["Transformer and foundation architectures", [
    "Encoder-only transformer",
    "Decoder-only transformer",
    "Encoder-decoder transformer",
    "Recurrent transformer",
    "Multimodal transformer",
    "Mixture-of-experts transformer",
    "Retrieval-augmented architecture",
    "Tool-using or agentic architecture",
    "Transformer plus formal search"
  ]],
  ["Generative architectures", [
    "Autoencoder",
    "Variational autoencoder",
    "Generative adversarial network",
    "Autoregressive generator",
    "Diffusion model",
    "Conditional diffusion model",
    "Latent diffusion model",
    "Normalizing flow",
    "Flow-matching model"
  ]],
  ["Reinforcement-learning architectures", [
    "Deep Q-network",
    "Double DQN",
    "Policy-gradient network",
    "Actor-critic",
    "Proximal Policy Optimization",
    "Soft Actor-Critic",
    "Model-based reinforcement learning",
    "Offline reinforcement learning",
    "Contextual bandit",
    "Multi-agent reinforcement learning",
    "Hierarchical reinforcement learning"
  ]],
  ["Scientific-machine-learning architectures", [
    "Physics-informed neural network",
    "Neural operator",
    "Fourier neural operator",
    "Graph neural operator",
    "Differentiable simulator",
    "ML surrogate model",
    "Hybrid physics-ML architecture",
    "Operator-learning inverse model",
    "Scientific foundation model"
  ]],
  ["Uncertainty architectures", [
    "Gaussian process",
    "Bayesian neural network",
    "Deep ensemble",
    "Monte Carlo dropout",
    "Quantile-regression network",
    "Mixture-density network",
    "Evidential neural network",
    "Conformal prediction pipeline"
  ]],
  ["Search, discovery, and optimization", [
    "Bayesian optimization",
    "Active learning",
    "Evolutionary optimization with ML surrogate",
    "Monte Carlo tree search",
    "Neural architecture search",
    "Reinforcement-learning-guided search",
    "LLM-guided formal search",
    "Autonomous experimental-design pipeline"
  ]],
  ["Anomaly, representation, and limited-label learning", [
    "Isolation Forest",
    "One-class SVM",
    "Autoencoder anomaly detector",
    "Contrastive-learning architecture",
    "Siamese few-shot architecture",
    "Prototypical network",
    "Self-supervised pretraining pipeline",
    "Semi-supervised teacher-student model",
    "Transfer-learning architecture",
    "Federated-learning architecture"
  ]]
];

const overrides = {
  "Geospatial foundation model": complete({
    aliases: ["masked geospatial foundation model", "GFM4MPM"],
    chapter: "case-02-critical-mineral-prospectivity",
    sector: ["Rare-earth and critical-mineral exploration", "Geoscience"],
    data: ["geospatial raster", "multimodal map layers"],
    output: ["prospectivity score", "ranked map cell"],
    paradigm: ["self-supervised pretraining", "supervised fine-tuning"],
    bottleneck: ["limited labels", "spatial dependence", "class imbalance"],
    weights: ["mask weights", "class weights", "modality weights", "decision weights"],
    paper: ["GFM4MPM: Towards Geospatial Foundation Models for Mineral Prospectivity Mapping", "2024", "https://arxiv.org/abs/2406.12756"],
    org: "Viridien / industry analogue",
    relation: "relevant comparison only"
  }),
  "Message-passing neural network": complete({
    aliases: ["message passing GNN", "GraphCast graph network"],
    chapter: "case-07-graphcast-weather-forecasting",
    sector: ["Climate and environmental science", "Geoscience", "Energy", "Aerospace and NASA-related research"],
    data: ["global atmospheric fields", "Earth mesh graph"],
    output: ["weather forecast fields", "weather-dependent decision"],
    paradigm: ["supervised autoregressive forecasting"],
    bottleneck: ["spatial dependence", "computational scale", "distribution shift"],
    weights: ["node weights", "edge weights", "message weights", "latitude weights", "decision weights"],
    paper: ["GraphCast: Learning skillful medium-range global weather forecasting", "2023", "https://www.science.org/doi/10.1126/science.adi2336"],
    org: "Google DeepMind",
    relation: "authored by organization researchers"
  }),
  "DeepAR": complete({
    aliases: ["autoregressive recurrent probabilistic forecasting"],
    chapter: "case-06-probabilistic-demand-forecasting",
    sector: ["Business forecasting", "Supply chains and logistics"],
    data: ["time series panel", "item metadata"],
    output: ["forecast distribution", "inventory quantity"],
    paradigm: ["supervised probabilistic forecasting"],
    bottleneck: ["uncertainty", "temporal dependence", "missing data"],
    weights: ["series weights", "recurrent weights", "likelihood weights", "decision weights"],
    paper: ["DeepAR: Probabilistic Forecasting with Autoregressive Recurrent Networks", "2017", "https://arxiv.org/abs/1704.04110"],
    org: "Amazon",
    relation: "authored by organization researchers"
  }),
  "Recurrent transformer": complete({
    aliases: ["recurrent transformer decoder"],
    chapter: "case-01-quantum-error-correction",
    sector: ["Quantum computing"],
    data: ["syndrome time series", "hardware readout"],
    output: ["logical error probability", "correction action"],
    paradigm: ["supervised sequence learning"],
    bottleneck: ["temporal dependence", "rare-event detection", "real-time latency"],
    weights: ["attention weights", "recurrent gates", "objective weights", "decision weights"],
    paper: ["Learning to Decode the Surface Code with a Recurrent, Transformer-Based Neural Network", "2023", "https://arxiv.org/abs/2310.05900"],
    org: "Google Quantum AI",
    relation: "authored by organization researchers"
  }),
  "Transformer plus formal search": complete({
    aliases: ["transformer plus verifier reinforcement learning", "formal proof search"],
    chapter: "case-05-formal-theorem-proving",
    sector: ["Mathematics", "Computer science"],
    data: ["formal statement", "proof state", "verified trajectory"],
    output: ["verified proof", "next tactic"],
    paradigm: ["supervised learning", "reinforcement learning", "search"],
    bottleneck: ["long-horizon credit assignment", "computational scale"],
    weights: ["attention weights", "token probabilities", "reward weights", "search weights"],
    paper: ["DeepSeek-Prover-V2: Advancing Formal Mathematical Reasoning via Reinforcement Learning for Subgoal Decomposition", "2025", "https://arxiv.org/abs/2504.21801"],
    org: "DeepSeek",
    relation: "authored by organization researchers"
  }),
  "Conditional diffusion model": complete({
    aliases: ["property-conditioned diffusion", "classifier-free guidance"],
    chapter: "case-04-inverse-materials-design",
    sector: ["Materials science", "Chemistry", "Physics"],
    data: ["crystal structure", "target property"],
    output: ["generated crystal candidate"],
    paradigm: ["conditional generative modeling"],
    bottleneck: ["expensive experiments", "physical constraints", "multiple objectives"],
    weights: ["noise schedule", "score weights", "objective weights", "guidance weights"],
    paper: ["A generative model for inorganic materials design (MatterGen)", "2025", "https://www.nature.com/articles/s41586-025-08628-5"],
    org: "Microsoft Research",
    relation: "published by organization's research laboratory"
  }),
  "Graph convolutional network": libraryOnly({
    aliases: ["GCN"],
    bottleneck: ["graph locality", "neighbor aggregation"],
    weights: ["graph convolution weights", "neighborhood aggregation weights"]
  }),
  "Graph attention network": libraryOnly({
    aliases: ["GAT"],
    bottleneck: ["graph locality", "neighbor importance"],
    weights: ["attention coefficients", "message weights"]
  }),
  "Masked autoencoder": overlapping("case-02-critical-mineral-prospectivity", ["Spatial and image architectures"], ["mask sampling weights"]),
  "Diffusion model": overlapping("case-04-inverse-materials-design", ["Generative architectures"], ["noise schedule", "score weights"]),
  "LLM-guided formal search": supplement({
    chapter: "supplement-llm-guided-formal-search",
    sector: ["Mathematics", "Computer science"],
    data: ["formal statement", "proof state", "candidate branches"],
    output: ["ranked proof branch", "verified proof attempt"],
    paradigm: ["search", "supervised learning", "reinforcement learning"],
    bottleneck: ["long-horizon credit assignment", "formal verification"],
    weights: ["token probabilities", "search scores", "branch budget"],
    paper: ["DeepSeek-Prover-V2: Advancing Formal Mathematical Reasoning via Reinforcement Learning for Subgoal Decomposition", "2025", "https://arxiv.org/abs/2504.21801"],
    org: "DeepSeek"
  }),
  "Policy-gradient network": complete({
    aliases: ["time-unrolled neural policy", "deep hedging"],
    chapter: "case-03-deep-hedging",
    sector: ["Quantitative finance", "Risk management"],
    data: ["market state", "portfolio state", "trading costs"],
    output: ["hedge position", "trading policy"],
    paradigm: ["reinforcement learning", "decision optimization"],
    bottleneck: ["transaction costs", "path-dependent risk", "market frictions"],
    weights: ["policy weights", "risk weights", "friction weights", "scenario weights"],
    paper: ["Deep Hedging", "2018", "https://arxiv.org/abs/1802.03042"],
    org: "J.P. Morgan research",
    relation: "authored by organization researchers"
  }),
  "Actor-critic": supplement({
    chapter: "supplement-actor-critic",
    sector: ["Reinforcement learning", "Operations"],
    data: ["state", "action", "reward"],
    output: ["policy action", "state value"],
    paradigm: ["reinforcement learning"],
    bottleneck: ["credit assignment", "exploration"],
    weights: ["policy weights", "value weights", "advantage weights"],
    paper: ["Asynchronous Methods for Deep Reinforcement Learning", "2016", "https://arxiv.org/abs/1602.01783"],
    org: "Google DeepMind"
  }),
  "Recurrent neural network": supplement({
    chapter: "supplement-vanilla-rnn",
    sector: ["Time-series modeling", "Sequence learning"],
    data: ["ordered sequence", "hidden state"],
    output: ["next-step prediction", "sequence representation"],
    paradigm: ["supervised sequence learning"],
    bottleneck: ["temporal dependence", "vanishing gradients"],
    weights: ["input weights", "recurrent weights", "output weights"],
    paper: ["Learning representations by back-propagating errors", "1986", "https://www.nature.com/articles/323533a0"],
    org: "Foundational neural-network research"
  }),
  "LSTM": supplement({
    chapter: "supplement-lstm",
    sector: ["Time-series modeling", "Sequence learning"],
    data: ["ordered sequence", "cell state"],
    output: ["memory-controlled prediction"],
    paradigm: ["supervised sequence learning"],
    bottleneck: ["long-range memory", "vanishing gradients"],
    weights: ["forget gate", "input gate", "output gate"],
    paper: ["Long Short-Term Memory", "1997", "https://www.bioinf.jku.at/publications/older/2604.pdf"],
    org: "Foundational neural-network research"
  }),
  "GRU": supplement({
    chapter: "supplement-gru",
    sector: ["Time-series modeling", "Sequence learning"],
    data: ["ordered sequence", "hidden state"],
    output: ["compact gated sequence prediction"],
    paradigm: ["supervised sequence learning"],
    bottleneck: ["long-range memory", "model compactness"],
    weights: ["update gate", "reset gate", "candidate state"],
    paper: ["Learning Phrase Representations using RNN Encoder-Decoder for Statistical Machine Translation", "2014", "https://arxiv.org/abs/1406.1078"],
    org: "Foundational neural-network research"
  }),
  "Self-supervised pretraining pipeline": supplement({
    chapter: "supplement-self-supervised-pretraining",
    sector: ["Representation learning", "Limited-label learning"],
    data: ["unlabeled examples", "masked inputs", "few labels"],
    output: ["pretrained encoder", "fine-tuned predictor"],
    paradigm: ["self-supervised pretraining", "supervised fine-tuning"],
    bottleneck: ["limited labels", "transfer"],
    weights: ["mask weights", "encoder weights", "fine-tuning weights"],
    paper: ["Masked Autoencoders Are Scalable Vision Learners", "2021", "https://arxiv.org/abs/2111.06377"],
    org: "Meta AI"
  })
};

const registry = [];
let index = 0;
for (const [family, names] of sections) {
  for (const name of names) {
    index += 1;
    const override = overrides[name] || {};
    registry.push({
      architecture_id: `${String(index).padStart(3, "0")}-${slug(name)}`,
      canonical_name: name,
      aliases: override.aliases || [],
      architecture_family: family,
      chapter_group: override.chapter_group || "searchable-library",
      sector: override.sector || [],
      data_type: override.data_type || [],
      output_type: override.output_type || [],
      learning_paradigm: override.learning_paradigm || [],
      dominant_bottleneck: override.dominant_bottleneck || [],
      weighting_mechanisms: override.weighting_mechanisms || [],
      primary_paper: override.primary_paper || { title: "", year: "", url: "" },
      featured_organization: override.featured_organization || "",
      relationship_classification: override.relationship_classification || "",
      coverage_status: override.coverage_status || "LIBRARY ONLY",
      chapter_status: override.chapter_status || "searchable registry card only; no full interactive chapter yet",
      visual_status: override.visual_status || "library card only",
      interaction_status: override.interaction_status || "filterable library card",
      source_verification_status: override.source_verification_status || "not yet primary-source verified for a full chapter",
      last_reviewed: reviewed
    });
  }
}

if (registry.length !== 104) {
  throw new Error(`expected 104 registry entries; got ${registry.length}`);
}

await mkdir(resolve("content"), { recursive: true });
await writeFile(resolve("content/architecture-registry.json"), `${JSON.stringify(registry, null, 2)}\n`);
console.log(`Wrote ${registry.length} architecture registry entries`);

function complete({ aliases, chapter, sector, data, output, paradigm, bottleneck, weights, paper, org, relation }) {
  return {
    aliases,
    chapter_group: chapter,
    sector,
    data_type: data,
    output_type: output,
    learning_paradigm: paradigm,
    dominant_bottleneck: bottleneck,
    weighting_mechanisms: weights,
    primary_paper: { title: paper[0], year: paper[1], url: paper[2] },
    featured_organization: org,
    relationship_classification: relation,
    coverage_status: "COMPLETE",
    chapter_status: "complete interactive chapter",
    visual_status: "full chapter visuals",
    interaction_status: "interactive chapter explorer",
    source_verification_status: "primary source linked"
  };
}

function overlapping(chapter, families, weights) {
  return {
    aliases: [],
    chapter_group: chapter,
    sector: [],
    learning_paradigm: [],
    dominant_bottleneck: [],
    weighting_mechanisms: weights,
    coverage_status: "OVERLAPPING",
    chapter_status: `covered conceptually in ${chapter}`,
    visual_status: "covered by consolidated chapter visuals",
    interaction_status: "covered by consolidated chapter explorer",
    source_verification_status: "source verified through consolidated chapter",
    data_type: families,
    output_type: []
  };
}

function supplement({ aliases = [], chapter, sector, data, output, paradigm, bottleneck, weights, paper, org }) {
  return complete({
    aliases,
    chapter,
    sector,
    data,
    output,
    paradigm,
    bottleneck,
    weights,
    paper,
    org,
    relation: "complete supplement lesson"
  });
}

function libraryOnly({ aliases = [], bottleneck = [], weights = [] } = {}) {
  return {
    aliases,
    dominant_bottleneck: bottleneck,
    weighting_mechanisms: weights,
    coverage_status: "LIBRARY ONLY",
    chapter_status: "searchable registry card only; not covered by the GraphCast chapter",
    visual_status: "library card only",
    interaction_status: "filterable library card",
    source_verification_status: "not yet primary-source verified for a full chapter"
  };
}

function slug(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}
