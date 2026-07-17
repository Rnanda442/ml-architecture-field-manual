import type { SupplementLesson } from "./types";

export const supplementLessons: SupplementLesson[] = [
  {
    id: "supplement-vanilla-rnn",
    name: "Vanilla RNN",
    shortName: "RNN",
    accent: "blue",
    purpose:
      "This recurrent model reuses one transition through time so recent inputs can influence the next hidden state.",
    mechanism:
      "Input x_t and prior hidden state h_{t-1} combine into h_t, then the same weights are reused at the next step.",
    diagramSteps: ["x_{t-1}", "h_{t-1}", "shared transition", "h_t", "prediction"],
    equation: "h_t=\\tanh(W_xx_t+W_hh_{t-1}+b)",
    weights: [
      { label: "Input", symbol: "W_x", role: "How new input enters memory" },
      { label: "Recurrent", symbol: "W_h", role: "How previous memory persists" },
      { label: "Output", symbol: "W_y", role: "How hidden state becomes a prediction" }
    ],
    result:
      "Foundational sequence-memory architecture used to show why recurrence matters and why later gated models were needed.",
    paper: "Learning representations by back-propagating errors",
    organization: "Foundational neural-network research",
    year: "1986",
    url: "https://www.nature.com/articles/323533a0",
    limitation: "Long dependencies can fade or blow up without careful training or gating."
  },
  {
    id: "supplement-lstm",
    name: "LSTM",
    shortName: "LSTM",
    accent: "emerald",
    purpose:
      "This gated recurrent model keeps a cell state and learns when to write, forget, or expose memory.",
    mechanism:
      "Input, forget, and output gates regulate a persistent cell state so useful information can survive longer.",
    diagramSteps: ["input gate", "forget gate", "cell state", "output gate", "hidden state"],
    equation: "c_t=f_t\\odot c_{t-1}+i_t\\odot \\tilde{c}_t",
    weights: [
      { label: "Forget gate", symbol: "f_t", role: "Retain or clear prior memory" },
      { label: "Input gate", symbol: "i_t", role: "Write candidate information" },
      { label: "Output gate", symbol: "o_t", role: "Expose memory to hidden state" }
    ],
    result:
      "The LSTM paper introduced gates and constant-error flow as a response to long-lag learning failures.",
    paper: "Long Short-Term Memory",
    organization: "Foundational neural-network research",
    year: "1997",
    url: "https://www.bioinf.jku.at/publications/older/2604.pdf",
    limitation:
      "More gates improve control but add parameters and can still forget if gate behavior is poorly learned."
  },
  {
    id: "supplement-gru",
    name: "GRU",
    shortName: "GRU",
    accent: "teal",
    purpose:
      "This compact gated recurrent model uses update and reset gates to trade retention for replacement.",
    mechanism:
      "The update gate blends previous state with a candidate state while the reset gate controls how history shapes the candidate.",
    diagramSteps: ["previous h", "reset gate", "candidate", "update gate", "new h"],
    equation: "h_t=(1-z_t)\\odot h_{t-1}+z_t\\odot \\tilde{h}_t",
    weights: [
      { label: "Update gate", symbol: "z_t", role: "Choose old memory versus candidate" },
      { label: "Reset gate", symbol: "r_t", role: "Control how much history builds candidate memory" },
      { label: "Candidate", symbol: "\\tilde{h}_t", role: "Propose replacement memory" }
    ],
    result:
      "The GRU became a compact gated alternative introduced in neural machine translation experiments.",
    paper:
      "Learning Phrase Representations using RNN Encoder-Decoder for Statistical Machine Translation",
    organization: "Foundational neural-network research",
    year: "2014",
    url: "https://arxiv.org/abs/1406.1078",
    limitation:
      "Compact gates can be easier to train, but less explicit memory control can hurt some tasks."
  },
  {
    id: "supplement-actor-critic",
    name: "Actor-Critic",
    shortName: "Actor-Critic",
    accent: "rose",
    purpose:
      "This reinforcement-learning architecture lets an actor choose actions while a critic estimates whether outcomes were better than expected.",
    mechanism:
      "The actor proposes an action, the critic estimates value, and an advantage signal updates the policy.",
    diagramSteps: ["state", "actor action", "reward", "critic value", "advantage update"],
    equation: "A_t=r_t+\\gamma V(s_{t+1})-V(s_t)",
    weights: [
      { label: "Actor", symbol: "\\theta_\\pi", role: "Map states to actions" },
      { label: "Critic", symbol: "\\theta_V", role: "Estimate future value" },
      { label: "Exploration", symbol: "\\beta", role: "Keep the policy from collapsing too early" }
    ],
    result:
      "Actor-critic methods underpin many deep reinforcement-learning systems, including asynchronous deep RL variants.",
    paper: "Asynchronous Methods for Deep Reinforcement Learning",
    organization: "Google DeepMind",
    year: "2016",
    url: "https://arxiv.org/abs/1602.01783",
    limitation: "A biased critic can confidently push the actor in the wrong direction."
  },
  {
    id: "supplement-llm-guided-formal-search",
    name: "LLM-Guided Formal Search",
    shortName: "Formal Search",
    accent: "violet",
    purpose:
      "This search architecture uses a language model to rank proof branches while a verifier accepts or rejects formal steps.",
    mechanism:
      "Model probability ranks branches, attempt budget controls expansion, and verifier feedback prunes or rewards paths.",
    diagramSteps: ["proof state", "LM branch rank", "attempt budget", "verifier", "accepted/rejected"],
    equation: "score=b_k\\,p_\\theta(branch)+\\mathbb{1}_{verified}",
    weights: [
      { label: "Probability", symbol: "p_\\theta", role: "Rank likely proof moves" },
      { label: "Budget", symbol: "b_k", role: "Allocate attempts across branches" },
      { label: "Verifier", symbol: "v", role: "Accept only formally valid steps" }
    ],
    result:
      "DeepSeek-Prover-V2 reports verifier-grounded gains on formal mathematics benchmarks.",
    paper:
      "DeepSeek-Prover-V2: Advancing Formal Mathematical Reasoning via Reinforcement Learning for Subgoal Decomposition",
    organization: "DeepSeek",
    year: "2025",
    url: "https://arxiv.org/abs/2504.21801",
    limitation:
      "The verifier is exact, but search can still miss valid low-probability branches."
  },
  {
    id: "supplement-self-supervised-pretraining",
    name: "Self-Supervised Pretraining",
    shortName: "Self-Supervised",
    accent: "amber",
    purpose:
      "This pretraining pipeline learns useful structure from unlabeled inputs before scarce labels are introduced.",
    mechanism:
      "Mask part of the input, encode the visible structure, reconstruct the hidden part, then fine-tune the encoder.",
    diagramSteps: ["complete input", "masked input", "encoder", "reconstruction", "fine-tuning"],
    equation: "L=L_{reconstruct}+\\lambda_{task}L_{supervised}",
    weights: [
      { label: "Mask", symbol: "m", role: "Choose hidden patches" },
      { label: "Encoder", symbol: "\\theta_E", role: "Retain reusable representation" },
      { label: "Task head", symbol: "\\theta_T", role: "Adapt representation to labels" }
    ],
    result:
      "Masked autoencoder-style pretraining showed scalable representation learning for vision encoders.",
    paper: "Masked Autoencoders Are Scalable Vision Learners",
    organization: "Meta AI",
    year: "2021",
    url: "https://arxiv.org/abs/2111.06377",
    limitation:
      "The pretext task must align with the downstream task; reconstruction skill alone is not enough."
  }
];

export const getSupplementById = (id: string) =>
  supplementLessons.find((lesson) => lesson.id === id) ?? supplementLessons[0];
