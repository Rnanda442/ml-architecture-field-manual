import type { CaseLesson } from "./types";
import { deepARDiagram } from "../diagrams/DeepARDiagram";
import { financeDiagram } from "../diagrams/FinanceDiagram";
import { graphCastDiagram } from "../diagrams/GraphCastDiagram";
import { matterGenDiagram } from "../diagrams/MatterGenDiagram";
import { mineralsDiagram } from "../diagrams/MineralsDiagram";
import { quantumDiagram } from "../diagrams/QuantumDiagram";
import { theoremDiagram } from "../diagrams/TheoremDiagram";

export const caseLessons: CaseLesson[] = [
  {
    id: "quantum",
    number: "01",
    name: "Quantum error correction",
    shortLabel: "Quantum",
    field: "Quantum computing",
    organization: "Google Quantum AI",
    architecture: "Recurrent transformer decoder",
    accent: "violet",
    objective: {
      sentence:
        "This recurrent transformer predicts logical quantum-error probabilities from syndrome events across qubits and time so a controller can choose a correction before encoded information fails.",
      input: "Syndrome events",
      architecture: "Recurrent transformer",
      output: "Logical-error probabilities",
      use: "Correction decision"
    },
    problem:
      "Hand-built decoders simplify real hardware noise and can miss correlated errors that unfold across qubits and measurement cycles.",
    bottleneck:
      "The hard relationship is spatial and temporal: which scattered warning events belong to the same logical failure pattern?",
    response:
      "Attention compares qubits within a cycle while recurrence keeps unresolved evidence alive across cycles.",
    diagram: quantumDiagram,
    weights: {
      inside:
        "Embeddings, attention maps, recurrent gates, and output weights learn how warning events relate.",
      training:
        "The logical-error loss and regularization weights decide what training mistakes matter most.",
      decision:
        "A correction-cost matrix prices false corrections against missed errors after probabilities are produced.",
      equation:
        "\\mathcal{L}=\\lambda_{logical}\\,\\mathrm{BCE}(y,p_\\theta)+\\lambda_{reg}\\lVert\\theta\\rVert_2^2",
      note:
        "theta is learned by gradients. lambda values and correction costs are selected outside the model."
    },
    evidence: {
      paper:
        "Learning to Decode the Surface Code with a Recurrent, Transformer-Based Neural Network",
      organization: "Google Quantum AI",
      year: "2023",
      result:
        "The paper reports lower logical error rate than leading algorithmic decoders on real Sycamore surface-code data and generalization beyond the 25-cycle training setting.",
      metric: "Logical error rate on distance-3 and distance-5 surface-code data",
      limitation:
        "Small-code, hardware-specific demonstrations still need validation before broad operational deployment.",
      url: "https://arxiv.org/abs/2310.05900"
    }
  },
  {
    id: "minerals",
    number: "02",
    name: "Critical-mineral prospectivity",
    shortLabel: "Minerals",
    field: "Critical minerals",
    organization: "GFM4MPM research",
    architecture: "Masked geospatial foundation model",
    accent: "amber",
    objective: {
      sentence:
        "This masked geospatial model ranks map cells by mineral-deposit prospectivity so geoscientists can prioritize limited field surveys and drilling.",
      input: "Geology, geophysics, geochemistry",
      architecture: "Masked geospatial encoder",
      output: "Prospectivity ranking",
      use: "Survey and drilling priority"
    },
    problem:
      "Exploration teams have many unlabeled map layers but very few confirmed deposits, and field validation is expensive.",
    bottleneck:
      "The difficult relationship is cross-layer geology under rare labels: useful signals are weak, spatially biased, and multimodal.",
    response:
      "Self-supervised masking learns map structure first, then scarce labels fine-tune a prospectivity head.",
    diagram: mineralsDiagram,
    weights: {
      inside:
        "Encoder parameters learn cross-layer geological features from masked geospatial patches.",
      training:
        "Mask sampling and rare-positive class weights keep unlabeled structure and scarce deposits visible.",
      decision:
        "Survey-cost weights turn geological probability into an operational exploration priority.",
      equation:
        "\\mathcal{L}=\\lambda_{mask}\\mathcal{L}_{reconstruct}+\\lambda_{prospect}\\,\\mathrm{weightedBCE}+\\lambda_{cal}\\mathcal{L}_{calibration}",
      note:
        "The model estimates prospectivity; the exploration plan also depends on uncertainty, access, and field cost."
    },
    evidence: {
      paper:
        "GFM4MPM: Towards Geospatial Foundation Models for Mineral Prospectivity Mapping",
      organization: "GFM4MPM research",
      year: "2024",
      result:
        "The paper reports that self-supervised pretraining produced more robust features and improved lead-zinc prospectivity predictions across North America and Australia.",
      metric: "Prospectivity performance and geological interpretability",
      limitation:
        "Known deposits are sparse and spatially biased; predictions still need field validation.",
      url: "https://arxiv.org/abs/2406.12756"
    }
  },
  {
    id: "finance",
    number: "03",
    name: "Deep hedging",
    shortLabel: "Hedging",
    field: "Quantitative finance",
    organization: "J.P. Morgan research",
    architecture: "Sequential neural hedge policy",
    accent: "emerald",
    objective: {
      sentence:
        "This sequential policy chooses hedge positions through time to reduce terminal portfolio risk after transaction costs.",
      input: "Market and portfolio state",
      architecture: "Time-unrolled policy",
      output: "Hedge action sequence",
      use: "Risk after trading costs"
    },
    problem:
      "Predicting tomorrow's direction is not enough because the hedge itself changes cost, exposure, and future risk.",
    bottleneck:
      "The difficult relationship is sequential action under frictions: every trade changes the next state.",
    response:
      "A policy is optimized over the whole portfolio path and scored by terminal risk after transaction costs.",
    diagram: financeDiagram,
    weights: {
      inside:
        "Policy parameters learn how state features map to hedge positions through time.",
      training:
        "Scenario weights and risk-aversion terms decide which paths dominate the objective.",
      decision:
        "Transaction costs and tail-risk preferences shape whether a trade is worth making.",
      equation:
        "\\min_\\theta\\,\\rho_\\gamma(-\\mathrm{PnL}_\\theta),\\quad \\mathrm{PnL}_\\theta \\text{ includes } \\sum_t c_j|\\Delta a_t|",
      note:
        "This is decision learning, not ordinary stock-price prediction."
    },
    evidence: {
      paper: "Deep Hedging",
      organization: "J.P. Morgan research",
      year: "2018",
      result:
        "The paper reports efficient high-dimensional hedging and better terminal convex risk after costs than the standard complete-market solution in a synthetic Heston market with transaction costs.",
      metric: "Terminal convex risk after costs",
      limitation:
        "Simulator assumptions and market regime shift can make a learned policy brittle.",
      url: "https://arxiv.org/abs/1802.03042"
    }
  },
  {
    id: "materials",
    number: "04",
    name: "Inverse materials design",
    shortLabel: "Materials",
    field: "Materials science",
    organization: "Microsoft Research",
    architecture: "Conditional diffusion generator",
    accent: "cyan",
    objective: {
      sentence:
        "This conditional diffusion model generates candidate crystal structures with requested properties so researchers can reduce expensive simulation and synthesis searches.",
      input: "Noisy atoms, coordinates, lattice, target",
      architecture: "Equivariant diffusion",
      output: "Candidate crystal structures",
      use: "Simulation and synthesis triage"
    },
    problem:
      "Brute-force crystal search burns expensive simulation budgets, and most generated structures are unstable.",
    bottleneck:
      "The model must coordinate atom types, positions, lattice geometry, and desired properties in one physical object.",
    response:
      "A geometry-aware diffusion model denoises coupled crystal variables while guidance steers toward a property target.",
    diagram: matterGenDiagram,
    weights: {
      inside:
        "Score-network and adapter parameters learn geometry-aware denoising and property conditioning.",
      training:
        "Atom, coordinate, and lattice loss weights keep one part of the crystal from masking another part's failure.",
      decision:
        "Screening thresholds and DFT cost decide which generated candidates deserve expensive validation.",
      equation:
        "\\mathcal{L}=\\lambda_A\\mathcal{L}_A+\\lambda_X\\mathcal{L}_X+\\lambda_L\\mathcal{L}_L,\\quad \\hat{\\epsilon}=(1+s)\\epsilon_{cond}-s\\epsilon_{uncond}",
      note:
        "Guidance changes generation behavior but does not replace physics-based validation."
    },
    evidence: {
      paper: "A generative model for inorganic materials design (MatterGen)",
      organization: "Microsoft Research",
      year: "2025",
      result:
        "The paper reports generated structures more than twice as likely to be stable, unique, and new than prior models and more than ten times closer to a local energy minimum; one synthesized material was within 20% of its target property.",
      metric: "Stable-unique-new rate under DFT budget",
      limitation:
        "DFT and synthesis remain outside the generator and can reject plausible samples.",
      url: "https://www.nature.com/articles/s41586-025-08628-5"
    }
  },
  {
    id: "math",
    number: "05",
    name: "Formal theorem proving",
    shortLabel: "Theorems",
    field: "Formal mathematics",
    organization: "DeepSeek",
    architecture: "Language model plus verifier search",
    accent: "rose",
    objective: {
      sentence:
        "This language-model and verifier system generates Lean proof steps and searches branches until a complete proof is formally accepted.",
      input: "Theorem, proof state, lemmas",
      architecture: "LM plus verifier search",
      output: "Accepted proof branch",
      use: "Formal proof artifact"
    },
    problem:
      "Thousands of plausible tokens can lead to one invalid formal step, and sparse verifier success makes search expensive.",
    bottleneck:
      "The difficult relationship is proposal versus correctness: language likelihood is not formal verification.",
    response:
      "The model proposes proof branches while Lean verifies steps and search reallocates attempts from feedback.",
    diagram: theoremDiagram,
    weights: {
      inside:
        "Model parameters and attention weights rank tactics, lemmas, and proof continuations.",
      training:
        "Verifier reward, advantage weights, and KL control shape reinforcement updates.",
      decision:
        "Branch budget decides which proof path receives the next attempt.",
      equation:
        "\\mathcal{L}=\\mathcal{L}_{SFT}-\\beta\\,\\mathbb{E}_{\\tau}[A_\\tau\\log p_\\theta(\\tau)]+\\kappa\\,\\mathrm{KL}(p_\\theta\\lVert p_{ref})",
      note:
        "The model proposes plausible steps; the verifier determines formal correctness."
    },
    evidence: {
      paper:
        "DeepSeek-Prover-V2: Advancing Formal Mathematical Reasoning via Reinforcement Learning for Subgoal Decomposition",
      organization: "DeepSeek",
      year: "2025",
      result:
        "The paper reports an 88.9% pass ratio on MiniF2F-test and 49 of 658 PutnamBench problems solved.",
      metric: "Verified pass@k and solved formal benchmark problems",
      limitation:
        "Verifier success depends on formalization, search budget, and benchmark scope.",
      url: "https://arxiv.org/abs/2504.21801"
    }
  },
  {
    id: "business",
    number: "06",
    name: "Probabilistic demand forecasting",
    shortLabel: "Demand",
    field: "Supply chains",
    organization: "Amazon",
    architecture: "Global autoregressive recurrent model",
    accent: "blue",
    objective: {
      sentence:
        "This shared recurrent model predicts a distribution of future demand across many products so inventory decisions can account for uncertainty and unequal business costs.",
      input: "Product histories and covariates",
      architecture: "Shared recurrent model",
      output: "Forecast distribution",
      use: "Inventory quantile"
    },
    problem:
      "One model per item wastes shared patterns, while a point forecast hides uncertainty and asymmetric costs.",
    bottleneck:
      "The hard relationship is shared sequence memory across many sparse products plus calibrated future uncertainty.",
    response:
      "A global recurrent model shares statistical strength and outputs a distribution that decisions can query.",
    diagram: deepARDiagram,
    weights: {
      inside:
        "Shared recurrent weights and distribution-head parameters learn sequence patterns across products.",
      training:
        "Likelihood and horizon weights decide how the forecast distribution is scored.",
      decision:
        "Shortage and overstock costs choose the inventory quantile after the model predicts uncertainty.",
      equation:
        "\\mathcal{L}=-\\sum_{i,t}\\lambda_t\\log p(y_{i,t}\\mid h_{i,t};\\theta),\\quad q=\\frac{C_u}{C_u+C_o}",
      note:
        "The model output is a distribution. The business decision is the selected quantity."
    },
    evidence: {
      paper: "DeepAR: Probabilistic Forecasting with Autoregressive Recurrent Networks",
      organization: "Amazon",
      year: "2017",
      result:
        "The paper reports forecasting-accuracy improvements of around 15% over then-state-of-the-art methods across several real-world datasets.",
      metric: "Probabilistic forecast accuracy plus decision cost framing",
      limitation:
        "Distribution choice, covariate quality, and regime changes affect tail calibration.",
      url: "https://arxiv.org/abs/1704.04110"
    }
  },
  {
    id: "graphcast",
    number: "07",
    name: "GraphCast weather forecasting",
    shortLabel: "GraphCast",
    field: "Weather forecasting",
    organization: "Google DeepMind",
    architecture: "Message-passing graph neural network",
    accent: "teal",
    objective: {
      sentence:
        "This graph neural network predicts the next six-hour global atmospheric state and repeatedly rolls forecasts forward.",
      input: "Two recent weather states and graph geometry",
      architecture: "Multimesh GNN",
      output: "Next six-hour weather grid",
      use: "Medium-range rollout"
    },
    problem:
      "Weather is a curved-Earth, long-range, multiscale system; flat local grids move information poorly and physics simulation is expensive.",
    bottleneck:
      "The difficult relationship is distant atmospheric coupling across a spherical multiscale domain.",
    response:
      "GraphCast encodes weather onto a spherical multimesh, passes messages, decodes the next grid, and rolls forward.",
    diagram: graphCastDiagram,
    weights: {
      inside:
        "Node, edge, message, aggregation, and decoder parameters learn how atmospheric fields move through the graph.",
      training:
        "Variable and latitude weights keep the loss from being dominated by easy variables or dense grid regions.",
      decision:
        "Missed-warning and false-alarm costs belong to downstream operational decisions, not the core forecast loss.",
      equation:
        "\\mathcal{L}(\\theta)=\\sum_t\\sum_v\\lambda_v\\sum_g\\omega_{lat(g)}\\lVert\\hat{y}_{t,v,g}(\\theta)-y_{t,v,g}\\rVert_2^2",
      note:
        "lambda_v and omega_lat are selected objective weights. Gradients update theta; operational costs are downstream."
    },
    evidence: {
      paper: "GraphCast: Learning skillful medium-range global weather forecasting",
      organization: "Google DeepMind",
      year: "2023",
      result:
        "The Science paper reports lower error than HRES on more than 90% of 1380 verification targets and a 10-day global forecast at 0.25 degree resolution in under one minute.",
      metric: "Share of variables and lead times with lower forecast error than HRES",
      limitation:
        "GraphCast is deterministic and trained from reanalysis, so operational uncertainty still needs ensembles or calibration.",
      url: "https://www.science.org/doi/10.1126/science.adi2336",
      openUrl: "https://arxiv.org/abs/2212.12794"
    }
  }
];

export const getCaseById = (id: string) =>
  caseLessons.find((lesson) => lesson.id === id) ?? caseLessons[0];
