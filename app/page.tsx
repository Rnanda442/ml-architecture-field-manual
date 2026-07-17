"use client";

import { useMemo, useState, type ReactNode } from "react";
import katex from "katex";
import "katex/dist/katex.min.css";
import architectureRegistry from "../content/architecture-registry.json";

type Sector = {
  id: string;
  number: string;
  name: string;
  field: string;
  company: string;
  objective: string;
  decision: string;
  bottleneck: string;
  hypothesis: string;
  architecture: string;
  architectureFamily?: string;
  paradigm?: string;
  dataType?: string;
  outputType?: string;
  evidence?: string;
  dataSummary?: string;
  paper: string;
  url: string;
  openUrl?: string;
  year?: string;
  result: string;
  metric: string;
  limitation?: string;
  accent: string;
  inputs: string[];
  pipeline: { label: string; plain: string; weight: string }[];
  weights: { type: string; symbol: string; role: string; failure: string }[];
  loss: string;
  lossNote: string;
  companies: string[];
  organizationShelf?: {
    org: string;
    system: string;
    primaryPublication: string;
    year: string;
    architecture: string;
    bottleneck: string;
    evidence: string;
    relation: string;
    sourceType: string;
    url: string;
    secondaryUrl?: string;
  }[];
};

type ObjectiveInfo = {
  field: string;
  taskType: string;
  target: string;
  practicalUse: string;
  purpose: string;
  input: string;
  architecture: string;
  output: string;
  use: string;
};

type ResultEvidence = {
  measured: string;
  comparison: string;
  improved: string;
  wording: string;
  limitation: string;
};

type Supplement = {
  id: string;
  name: string;
  accent: string;
  objectiveInfo: ObjectiveInfo;
  bottleneck: string;
  mechanism: string;
  equation: string;
  weights: { type: string; symbol: string; role: string }[];
  result: string;
  paper: string;
  organization: string;
  year: string;
  url: string;
  limitation: string;
};

type RegistryEntry = {
  architecture_id: string;
  canonical_name: string;
  aliases: string[];
  architecture_family: string;
  chapter_group: string;
  sector: string[];
  data_type: string[];
  output_type: string[];
  learning_paradigm: string[];
  coverage_status: string;
  chapter_status: string;
  visual_status: string;
  interaction_status: string;
  source_verification_status: string;
  dominant_bottleneck: string[];
  weighting_mechanisms: string[];
  primary_paper: { title: string; year: string; url: string };
  featured_organization: string;
  relationship_classification: string;
  last_reviewed: string;
};

const registry = architectureRegistry as RegistryEntry[];

type LibraryFilterKey = "status" | "family" | "sector" | "bottleneck" | "paradigm" | "dataType";
type LibraryFilters = Record<LibraryFilterKey, string>;

const defaultLibraryFilters: LibraryFilters = {
  status: "ALL",
  family: "ALL",
  sector: "ALL",
  bottleneck: "ALL",
  paradigm: "ALL",
  dataType: "ALL"
};

const coverageRank: Record<string, number> = {
  COMPLETE: 0,
  PARTIAL: 1,
  OVERLAPPING: 2,
  "LIBRARY ONLY": 3,
  BLOCKED: 4
};

const chapterTargets: Record<string, string> = {
  "case-01-quantum-error-correction": "quantum",
  "case-02-critical-mineral-prospectivity": "minerals",
  "case-03-deep-hedging": "finance",
  "case-04-inverse-materials-design": "materials",
  "case-05-formal-theorem-proving": "math",
  "case-06-probabilistic-demand-forecasting": "business",
  "case-07-graphcast-weather-forecasting": "graphcast"
};

const supplementTargets: Record<string, string> = {
  "supplement-vanilla-rnn": "supplement-vanilla-rnn",
  "supplement-lstm": "supplement-lstm",
  "supplement-gru": "supplement-gru",
  "supplement-actor-critic": "supplement-actor-critic",
  "supplement-llm-guided-formal-search": "supplement-llm-guided-formal-search",
  "supplement-self-supervised-pretraining": "supplement-self-supervised-pretraining"
};

const chapterNames: Record<string, string> = {
  "case-01-quantum-error-correction": "Quantum error correction",
  "case-02-critical-mineral-prospectivity": "Critical-mineral prospectivity",
  "case-03-deep-hedging": "Deep hedging",
  "case-04-inverse-materials-design": "Inverse materials design",
  "case-05-formal-theorem-proving": "Formal theorem proving",
  "case-06-probabilistic-demand-forecasting": "Probabilistic demand forecasting",
  "case-07-graphcast-weather-forecasting": "GraphCast weather forecasting",
  "supplement-vanilla-rnn": "Vanilla RNN supplement",
  "supplement-lstm": "LSTM supplement",
  "supplement-gru": "GRU supplement",
  "supplement-actor-critic": "Actor-Critic supplement",
  "supplement-llm-guided-formal-search": "LLM-guided formal search supplement",
  "supplement-self-supervised-pretraining": "Self-supervised pretraining supplement"
};

const uniqueSorted = (values: string[]) =>
  Array.from(new Set(values.filter(Boolean))).sort((a,b)=>a.localeCompare(b));

const sectors: Sector[] = [
  {
    id: "quantum", number: "01", name: "Quantum error correction", field: "Quantum computing", company: "Google Quantum AI",
    objective: "Detect which quantum error occurred and choose a correction before the stored information becomes unusable.",
    decision: "Given a stream of warning signals, which logical correction should the controller apply?",
    bottleneck: "Real hardware noise is correlated across qubits and time. Hand-built decoders simplify leakage, cross-talk, and analog readout—and can miss the pattern that matters.",
    hypothesis: "A recurrent transformer can learn spatial and temporal error correlations directly from hardware data better than a fixed algorithmic decoder.",
    architecture: "Recurrent transformer decoder", paper: "Learning to Decode the Surface Code with a Recurrent, Transformer-Based Neural Network", url: "https://arxiv.org/abs/2310.05900",
    result: "Outperformed leading algorithmic decoders on real Sycamore data for distance-3 and distance-5 surface codes; generalized beyond the 25 cycles used for training.", metric: "Lower logical error rate", accent: "violet",
    inputs: ["syndrome changes", "analog readout", "qubit coordinates", "cycle index"],
    pipeline: [
      {label:"Measure", plain:"Read repeated warning signals without reading the protected quantum state.", weight:"No learned weights yet; measurement quality determines the signal-to-noise ceiling."},
      {label:"Embed", plain:"Turn each event, location, and cycle into a vector the network can compare.", weight:"Embedding matrix Wₑ learns which event attributes should be close in representation space."},
      {label:"Attend", plain:"Ask which other qubits in this cycle help explain each warning.", weight:"Attention αᵢⱼ = softmax(qᵢ·kⱼ/√d) dynamically weights every event-to-event relationship."},
      {label:"Remember", plain:"Carry unresolved evidence forward across repeated cycles.", weight:"Recurrent gates weight what to keep, overwrite, or forget in hidden state hₜ."},
      {label:"Decode", plain:"Estimate the chance that each logical error class occurred.", weight:"Output weights Wₒ map hidden evidence to calibrated error probabilities."},
      {label:"Correct", plain:"Choose the repair with the lowest expected logical failure cost.", weight:"A decision-cost matrix weights false corrections against missed errors."},
    ],
    weights: [
      {type:"Representation",symbol:"Wₑ",role:"Which raw signals become similar",failure:"Bad embeddings erase useful hardware context."},
      {type:"Relationship",symbol:"αᵢⱼ",role:"Which qubits influence one another now",failure:"Diffuse attention treats local noise as global."},
      {type:"Memory",symbol:"gₜ",role:"Which evidence survives across cycles",failure:"Short memory misses slow leakage patterns."},
      {type:"Objective",symbol:"λₖ",role:"How training errors are traded off",failure:"A dominant easy term can starve the real goal."},
      {type:"Decision",symbol:"Cᵢⱼ",role:"Which operational mistake costs more",failure:"Accurate probabilities can still yield a bad action."},
    ],
    loss:"\\mathcal{L}=\\lambda_{\\mathrm{logical}}\\,\\mathrm{BCE}(y,p_\\theta)+\\lambda_{\\mathrm{reg}}\\lVert\\theta\\rVert_2^2", lossNote:"The neural parameters θ are learned inside the model; λ values are chosen outside it to define what ‘good’ means.",
    companies:["Google Quantum AI","IBM Quantum","Microsoft Quantum","Quantinuum","IonQ"]
  },
  {
    id:"minerals", number:"02", name:"Critical-mineral prospectivity", field:"Rare earths & minerals", company:"Viridien / industry analogue",
    objective:"Rank unexplored locations by the probability that a valuable deposit is present, while spending field and drilling budgets intelligently.",
    decision:"Which map cells should geologists investigate first?", bottleneck:"There are huge volumes of unlabeled geospatial layers but very few confirmed deposits. Positive labels are rare, spatially biased, and expensive to obtain.",
    hypothesis:"Masked self-supervision can learn general geospatial structure from unlabeled maps before the scarce deposit labels are introduced.", architecture:"Masked geospatial foundation model + supervised prospectivity head", paper:"GFM4MPM: Towards Geospatial Foundation Models for Mineral Prospectivity Mapping", url:"https://arxiv.org/abs/2406.12756",
    result:"Self-supervised pretraining produced more robust features and improved lead–zinc prospectivity predictions across North America and Australia, with geologically interpretable predictions.", metric:"Recall at a fixed exploration area", accent:"amber",
    inputs:["geology rasters","geophysics","geochemistry","known deposits"],
    pipeline:[
      {label:"Align",plain:"Place every map layer on the same grid and scale.",weight:"Channel normalization and reliability weights prevent one sensor from dominating by units alone."},
      {label:"Mask",plain:"Hide map patches and ask the model to reconstruct them.",weight:"Mask sampling weights decide which spatial patterns the model practices recovering."},
      {label:"Encode",plain:"Compress multimodal map patches into geological features.",weight:"Backbone filters and attention weights learn cross-layer associations without deposit labels."},
      {label:"Fine-tune",plain:"Use the few known deposits to specialize the general map model.",weight:"Class weights counter the overwhelming number of non-deposit cells."},
      {label:"Calibrate",plain:"Turn scores into usable probabilities.",weight:"Calibration rescales confidence so 0.8 means roughly 80% in comparable cases."},
      {label:"Rank",plain:"Combine prospectivity with cost, access, and uncertainty.",weight:"Decision weights trade geological promise against survey cost and risk."},
    ],
    weights:[
      {type:"Modality",symbol:"mₖ",role:"Trust geology vs. gravity vs. geochemistry",failure:"A noisy layer overwhelms weak but useful evidence."},
      {type:"Patch",symbol:"aₚ",role:"Emphasize spatial context",failure:"Resolution mismatch creates artificial patterns."},
      {type:"Class",symbol:"w₊",role:"Make rare deposits matter in loss",failure:"The model wins by predicting ‘no deposit’ everywhere."},
      {type:"Transfer",symbol:"ηlayer",role:"Control how much pretrained layers change",failure:"Aggressive tuning forgets general geospatial structure."},
      {type:"Decision",symbol:"vₖ",role:"Blend probability, uncertainty, and cost",failure:"A good map becomes a poor drilling plan."},
    ],
    loss:"\\mathcal{L}=\\lambda_{\\mathrm{mask}}\\mathcal{L}_{\\mathrm{reconstruct}}+\\lambda_{\\mathrm{prospect}}\\,\\mathrm{weightedBCE}+\\lambda_{\\mathrm{cal}}\\mathcal{L}_{\\mathrm{calibration}}", lossNote:"Three objectives act at different times: learn the world, learn the rare target, then make confidence operationally honest.",
    companies:["Viridien","Rio Tinto","BHP","KoBold Metals","Fleet Space Technologies"]
  },
  {
    id:"finance", number:"03", name:"Deep hedging", field:"Stocks & quantitative finance", company:"J.P. Morgan research",
    objective:"Choose a sequence of trades that protects a portfolio after transaction costs, liquidity limits, and risk constraints.", decision:"How much of each hedging instrument should be held at every time step?",
    bottleneck:"A forecast can be directionally right and still lose money. Classical formulas often assume frictionless, complete markets; real actions change cost and risk over time.", hypothesis:"A neural policy trained on the final risk-adjusted outcome can learn hedges under realistic frictions without assuming a specific market model.",
    architecture:"Time-unrolled neural policy / deep reinforcement learning", paper:"Deep Hedging", url:"https://arxiv.org/abs/1802.03042", result:"Efficient in high-dimensional settings and outperformed the standard complete-market solution in a synthetic Heston market with transaction costs.", metric:"Lower terminal convex risk after costs", accent:"emerald",
    inputs:["prices & volatility","portfolio state","positions","cost & risk limits"],
    pipeline:[
      {label:"Observe",plain:"Describe the market and current portfolio state.",weight:"Feature scaling and state encoders set the model’s usable view of risk."},
      {label:"Encode",plain:"Compress history into a market-state representation.",weight:"Hidden weights learn nonlinear relationships between volatility, time, and exposure."},
      {label:"Act",plain:"Output the next hedge position.",weight:"Policy weights map state to positions, with constraints clipping infeasible actions."},
      {label:"Charge",plain:"Subtract transaction cost and market impact.",weight:"Cost coefficients penalize turnover differently by instrument and liquidity."},
      {label:"Roll",plain:"Repeat through the life of the portfolio.",weight:"Shared policy weights learn a consistent rule across time."},
      {label:"Optimize",plain:"Judge the whole path by terminal risk, not next-day accuracy.",weight:"Risk-aversion γ determines the trade between average profit and tail loss."},
    ],
    weights:[
      {type:"Feature",symbol:"Wstate",role:"Translate market state into latent risk",failure:"Leakage or poor scaling creates fake predictability."},
      {type:"Policy",symbol:"θ",role:"Map state to hedge positions",failure:"Overfit policies exploit simulator quirks."},
      {type:"Friction",symbol:"cⱼ",role:"Price turnover and market impact",failure:"Ignoring costs rewards impossible trading."},
      {type:"Risk",symbol:"γ",role:"Penalize bad tail outcomes",failure:"Low γ chases return; high γ over-hedges."},
      {type:"Scenario",symbol:"ωₛ",role:"Stress rare market paths",failure:"Average scenarios hide regime failure."},
    ],
    loss:"\\min_\\theta\\,\\rho_\\gamma(-\\mathrm{PnL}_\\theta),\\quad \\mathrm{PnL}_\\theta\\text{ includes }\\sum_t c_j|\\Delta a_t|", lossNote:"This is decision learning, not stock-price prediction. The loss evaluates the economic consequence of the entire trading path.",
    companies:["J.P. Morgan","Goldman Sachs","Bloomberg","BlackRock","Two Sigma"]
  },
  {
    id:"materials", number:"04", name:"Inverse materials design", field:"Science & rare-earth alternatives", company:"Microsoft Research",
    objective:"Generate new stable crystals that meet target physical properties—including strong magnets with lower supply-chain risk.", decision:"Which atom types, coordinates, and lattice should be proposed for expensive simulation and synthesis?",
    bottleneck:"Screening is limited to known candidates; brute-force structure search consumes enormous DFT budgets, and most generated crystals are unstable.", hypothesis:"A geometry-aware diffusion model can learn the distribution of stable crystals, then adapters can steer generation toward multiple desired properties.",
    architecture:"Equivariant diffusion model + property adapters + classifier-free guidance", paper:"A generative model for inorganic materials design (MatterGen)", url:"https://www.nature.com/articles/s41586-025-08628-5", result:"Generated structures were more than twice as likely to be stable, unique, and new than prior models and over ten times closer to a local energy minimum; one synthesized material was within 20% of its target property.", metric:"Stable–unique–new rate under DFT budget", accent:"cyan",
    inputs:["atom types A","coordinates X","periodic lattice L","target property c"],
    pipeline:[
      {label:"Corrupt",plain:"Add structured noise to known stable crystals.",weight:"Separate noise schedules weight atom, coordinate, and lattice corruption."},
      {label:"Denoise",plain:"Learn how to reverse each small corruption step.",weight:"An equivariant score network shares geometric rules across rotations and translations."},
      {label:"Condition",plain:"Tell the generator the desired property.",weight:"Adapter weights alter each layer while preserving the pretrained base."},
      {label:"Guide",plain:"Push samples toward the property target during generation.",weight:"Guidance scale s trades target strength against diversity and stability."},
      {label:"Relax",plain:"Use ML force fields and DFT to test physical stability.",weight:"Screening thresholds allocate expensive calculations to the best candidates."},
      {label:"Validate",plain:"Synthesize and measure the most promising material.",weight:"A multi-objective score balances property, stability, novelty, and supply risk."},
    ],
    weights:[
      {type:"Noise",symbol:"βt",role:"Set difficulty at every diffusion step",failure:"A poor schedule destroys structure too fast."},
      {type:"Geometry",symbol:"θscore",role:"Denoise while respecting crystal symmetry",failure:"Ordinary coordinates waste data relearning invariance."},
      {type:"Component",symbol:"λA, λX, λL",role:"Balance atoms, positions, and lattice",failure:"One accurate component masks another’s failure."},
      {type:"Condition",symbol:"φadapter",role:"Steer frozen general knowledge",failure:"Full retraining can overfit scarce property labels."},
      {type:"Guidance",symbol:"s",role:"Trade diversity for target compliance",failure:"Excess guidance collapses to narrow candidates."},
    ],
    loss:"\\mathcal{L}=\\lambda_A\\mathcal{L}_A+\\lambda_X\\mathcal{L}_X+\\lambda_L\\mathcal{L}_L,\\quad \\hat{\\epsilon}=(1+s)\\epsilon_{\\mathrm{cond}}-s\\epsilon_{\\mathrm{uncond}}", lossNote:"The model learns three coupled denoising tasks. Guidance then reweights conditional and unconditional predictions at generation time.",
    companies:["Microsoft Research","Google DeepMind","Schrödinger","BASF","Toyota Research Institute"]
  },
  {
    id:"math", number:"05", name:"Formal theorem proving", field:"Mathematics & computer science", company:"DeepSeek",
    objective:"Turn a difficult theorem into checkable subgoals and produce a proof that a formal verifier accepts.", decision:"Which next tactic or subgoal is most likely to move the proof toward completion?",
    bottleneck:"Long proofs have sparse feedback: thousands of plausible tokens can lead to one invalid step. Informal reasoning helps plan, but a proof assistant demands exact formal syntax.", hypothesis:"A large model can transfer informal reasoning into formal proof by learning recursive subgoal decomposition, then improving with verifier-grounded reinforcement learning.",
    architecture:"Transformer language model + recursive proving pipeline + verifier reward", paper:"DeepSeek-Prover-V2: Advancing Formal Mathematical Reasoning via Reinforcement Learning for Subgoal Decomposition", url:"https://arxiv.org/abs/2504.21801", result:"The 671B model reported an 88.9% pass ratio on MiniF2F-test and solved 49 of 658 PutnamBench problems.", metric:"Verified pass@k", accent:"rose",
    inputs:["formal statement","Lean state","retrieved lemmas","generated subgoals"],
    pipeline:[
      {label:"Read",plain:"Encode the theorem, context, and current proof state.",weight:"Token embeddings and attention learn which symbols and lemmas interact."},
      {label:"Decompose",plain:"Break the theorem into smaller subgoals.",weight:"Planning probabilities weight candidate decompositions before formal search."},
      {label:"Generate",plain:"Propose Lean tactics for one subgoal.",weight:"Decoder logits rank every possible next token."},
      {label:"Verify",plain:"Let Lean accept or reject the proposed step.",weight:"The verifier supplies exact outcome signals rather than human preference guesses."},
      {label:"Reward",plain:"Credit trajectories that finish valid proofs.",weight:"Reward shaping assigns value across long sequences with sparse success."},
      {label:"Search",plain:"Spend compute on the most promising proof branches.",weight:"Search scores combine model probability, novelty, and verifier progress."},
    ],
    weights:[
      {type:"Attention",symbol:"αᵢⱼ",role:"Connect symbols, hypotheses, and lemmas",failure:"Surface similarity replaces logical relevance."},
      {type:"Token",symbol:"pθ(t|s)",role:"Rank next tactics and arguments",failure:"A locally likely token can ruin a global proof."},
      {type:"Reward",symbol:"rτ",role:"Value verifier-approved trajectories",failure:"Sparse reward gives little credit assignment."},
      {type:"RL",symbol:"Aτ",role:"Upweight better-than-expected proofs",failure:"Unstable updates erase useful language skill."},
      {type:"Search",symbol:"bₖ",role:"Allocate attempts across branches",failure:"Greedy search misses low-probability breakthroughs."},
    ],
    loss:"\\mathcal{L}=\\mathcal{L}_{\\mathrm{SFT}}-\\beta\\,\\mathbb{E}_{\\tau}[A_\\tau\\log p_\\theta(\\tau)]+\\kappa\\,\\mathrm{KL}(p_\\theta\\lVert p_{\\mathrm{ref}})", lossNote:"Supervised learning teaches syntax, verifier reward teaches correctness, and KL control keeps reinforcement updates from destabilizing the base model.",
    companies:["DeepSeek","Google DeepMind","Meta AI","Microsoft Research","Amazon Web Services"]
  },
  {
    id:"business", number:"06", name:"Probabilistic demand forecasting", field:"Business & supply chains", company:"Amazon",
    objective:"Forecast a probability distribution for future demand so inventory decisions can account for both the expected value and uncertainty.", decision:"How much inventory should be placed, and where, given asymmetric shortage and holding costs?",
    bottleneck:"Each product has little history, intermittent demand, promotions, and seasonality. One model per item wastes information; a point forecast hides uncertainty.", hypothesis:"A single autoregressive recurrent network trained across many related series can share statistical strength and output a calibrated distribution for each future step.",
    architecture:"Global autoregressive recurrent network with probabilistic likelihood head", paper:"DeepAR: Probabilistic Forecasting with Autoregressive Recurrent Networks", url:"https://arxiv.org/abs/1704.04110", result:"Reported forecasting-accuracy improvements of around 15% over then-state-of-the-art methods across several real-world datasets.", metric:"Probabilistic forecast accuracy + decision cost", accent:"blue",
    inputs:["past demand","calendar","price & promotion","item metadata"],
    pipeline:[
      {label:"Scale",plain:"Normalize each item without losing its demand magnitude.",weight:"Series scale νᵢ keeps high-volume items from dominating training."},
      {label:"Share",plain:"Train one model across thousands of related products.",weight:"Global recurrent weights transfer seasonal patterns between sparse series."},
      {label:"Remember",plain:"Update hidden state as each observation arrives.",weight:"Recurrent gates weight recent shocks against long seasonal memory."},
      {label:"Distribute",plain:"Predict distribution parameters, not one number.",weight:"Output heads produce μ and σ or count-distribution parameters."},
      {label:"Sample",plain:"Roll many plausible futures forward autoregressively.",weight:"Sampling propagates uncertainty through later time steps."},
      {label:"Order",plain:"Convert the distribution into an inventory action.",weight:"Underage and overage costs select the economically correct quantile."},
    ],
    weights:[
      {type:"Series",symbol:"νᵢ",role:"Normalize magnitude across products",failure:"Popular items drown out the long tail."},
      {type:"Recurrent",symbol:"θRNN",role:"Share patterns across related histories",failure:"A global model ignores item-specific regimes."},
      {type:"Likelihood",symbol:"−log p(y|μ,σ)",role:"Reward calibrated distributions",failure:"Wrong distribution family distorts tails."},
      {type:"Horizon",symbol:"λh",role:"Value near vs. distant forecast steps",failure:"One average score hides horizon decay."},
      {type:"Decision",symbol:"Cu/Co",role:"Price stockouts vs. excess inventory",failure:"The median forecast is not always the right order."},
    ],
    loss:"\\mathcal{L}=-\\sum_{i,t}\\lambda_t\\log p(y_{i,t}\\mid h_{i,t};\\theta),\\quad q=\\frac{C_u}{C_u+C_o}", lossNote:"Training weights make the distribution accurate; business costs choose which point on that distribution becomes the action.",
    companies:["Amazon","Walmart","UPS","Maersk","Siemens"]
  },
  {
    id:"graphcast", number:"07", name:"GraphCast weather forecasting", field:"Climate & environmental science", company:"Google DeepMind",
    objective:"Predict the evolving global weather state quickly enough that forecasters, grid operators, emergency planners, and logistics teams can act before hazardous conditions arrive.",
    decision:"Given weather observations and the latest global state estimate, what forecast-dependent action should be issued, adjusted, or escalated for the next hours to 10 days?",
    bottleneck:"Weather is a curved-Earth, long-range, multiscale system. A latitude-longitude image grid distorts the poles, while numerical physics is expensive and a plain local CNN struggles to move information along atmospheric connections.",
    hypothesis:"A message-passing graph neural network on an icosahedral multimesh can learn how weather systems exchange information across Earth-scale neighborhoods, then roll that learned state forward much faster than a traditional deterministic forecast.",
    architecture:"Message-passing graph neural network on a multimesh Earth graph",
    architectureFamily:"Graph and structural architectures",
    paradigm:"Supervised autoregressive spatiotemporal forecasting",
    dataType:"Global gridded atmospheric fields",
    outputType:"Six-hour-ahead weather state rolled into a 10-day forecast",
    evidence:"Weather observations are assimilated into ERA5 reanalysis states. GraphCast uses the state at t-6h, the state at t, static Earth fields, and graph connectivity to forecast t+6h. The verifying future state is only the training target and stays out of the inputs.",
    dataSummary:"GraphCast uses ERA5 reanalysis at 0.25 degree global resolution and 6-hour steps. The development protocol trained on 1979-2015, validated on 2016-2017, and tested on held-out later years. It predicts surface fields plus pressure-level atmospheric variables, normalizes inputs and targets, weights variables and latitude in the loss, and rolls forecasts autoregressively toward day 10.",
    paper:"GraphCast: Learning skillful medium-range global weather forecasting", url:"https://www.science.org/doi/10.1126/science.adi2336", openUrl:"https://arxiv.org/abs/2212.12794", year:"2023",
    result:"GraphCast predicted hundreds of variables globally at 0.25 degree resolution for 10 days in under one minute and outperformed HRES on more than 90% of 1380 verification targets; the paper separately reports stronger tropospheric comparisons.",
    metric:"Share of variables and lead times with lower forecast error than HRES",
    limitation:"GraphCast is deterministic and trained from reanalysis, so operational uncertainty still needs ensembles or calibration. Future climate distribution shift and rare extremes remain important validation risks.",
    accent:"teal",
    inputs:["state at t-6h","state at t","grid-to-mesh edges","static Earth fields"],
    pipeline:[
      {label:"Ingest",plain:"Start from two recent global weather snapshots and static Earth fields.",weight:"Input embeddings and variable normalization weight which atmospheric fields enter the graph before message passing."},
      {label:"Encode graph",plain:"Move gridded weather data onto a multiresolution mesh wrapped around the globe.",weight:"Node and edge encoders learn how grid points, mesh nodes, distance, and direction become message features."},
      {label:"Pass messages",plain:"Let neighboring mesh regions exchange information repeatedly.",weight:"Message MLPs calculate m_ij(x); aggregation weights determine how neighboring regions update each node."},
      {label:"Decode grid",plain:"Project the learned mesh representation back to every forecast grid cell.",weight:"Grid decoder weights and edge-to-grid aggregation decide how mesh state becomes local weather increments."},
      {label:"Roll forward",plain:"Feed the prediction back in as the next input to forecast farther ahead.",weight:"Shared weights run autoregressively; rollout length is a human-selected inference choice that exposes compounding error."},
      {label:"Score",plain:"Compare forecasts to verifying data and operational baselines.",weight:"Latitude and variable weights shape the loss so the score is not dominated by grid density or easy variables."},
      {label:"Act",plain:"Translate forecast improvement into a weather-dependent action.",weight:"Decision costs C_miss and C_false weight missed warnings against false alarms for each operational use case."},
    ],
    weights:[
      {type:"Node encoder",symbol:"W_node",role:"Which atmospheric variables become comparable node features",failure:"Important pressure-level signals can be washed out."},
      {type:"Edge encoder",symbol:"W_edge",role:"How distance, direction, and graph type shape messages",failure:"Bad edge features make the sphere behave like a flat image."},
      {type:"Message",symbol:"m_ij(x)",role:"What each neighboring region sends now",failure:"Weak messages miss fronts; overly strong messages smear them."},
      {type:"Aggregation",symbol:"sum_j m_ij",role:"How incoming spatial evidence updates a region",failure:"Oversmoothing erases sharp cyclones and atmospheric rivers."},
      {type:"Latitude",symbol:"omega_lat",role:"Prevent high-latitude grid density from dominating errors",failure:"The model optimizes the wrong geography."},
      {type:"Variable",symbol:"lambda_v",role:"Balance winds, temperature, pressure, humidity, and precipitation",failure:"A dominant variable can starve rarer hazards."},
      {type:"Decision",symbol:"C_miss/C_false",role:"Trade missed warnings against false alarms",failure:"A skillful forecast can be operationally timid or noisy."},
    ],
    loss:"\\mathcal{L}(\\theta)=\\sum_t\\sum_v\\lambda_v\\sum_g\\omega_{\\mathrm{lat}(g)}\\lVert\\hat{y}_{t,v,g}(\\theta)-y_{t,v,g}\\rVert_2^2",
    lossNote:"lambda_v and omega_lat are selected objective weights, not neural parameters. Gradients update theta, while missed-warning, false-alarm, energy-grid, and transport costs are downstream decision weights.",
    companies:["Google DeepMind","NVIDIA / LBNL","Huawei Cloud","Microsoft Research","ECMWF"],
    organizationShelf:[
      {org:"Google DeepMind",system:"GraphCast",primaryPublication:"Learning skillful medium-range global weather forecasting",year:"2023",architecture:"Message-passing graph neural network",bottleneck:"Global spatial dependence and compute cost",evidence:"More than 90% of 1380 targets better than HRES; 10-day global forecasts at 0.25 degree resolution in under one minute.",relation:"Authored by organization researchers",sourceType:"Peer-reviewed Science paper with arXiv version",url:"https://www.science.org/doi/10.1126/science.adi2336",secondaryUrl:"https://arxiv.org/abs/2212.12794"},
      {org:"NVIDIA / LBNL",system:"FourCastNet3",primaryPublication:"FourCastNet 3: A geometric approach to probabilistic machine-learning weather forecasting at scale",year:"2025",architecture:"Convolutional geometric ML model on the sphere",bottleneck:"Probabilistic ensemble speed and spherical fidelity",evidence:"Paper reports 0.25 degree, 6-hourly, 60-day global forecasts in under 4 minutes and 8 to 60x speedups over leading ensemble approaches.",relation:"Coauthored by organization researchers",sourceType:"arXiv primary research paper",url:"https://arxiv.org/abs/2507.12144"},
      {org:"Huawei Cloud",system:"Pangu-Weather",primaryPublication:"Accurate medium-range global weather forecasting with 3D neural networks",year:"2023",architecture:"3D Earth-specific transformer",bottleneck:"Vertical atmospheric structure and inference speed",evidence:"Nature paper reports deterministic forecast skill on ERA5 and more than 10,000x speed improvement over operational IFS.",relation:"Authored by organization researchers",sourceType:"Peer-reviewed Nature paper",url:"https://www.nature.com/articles/s41586-023-06185-3",secondaryUrl:"https://arxiv.org/abs/2211.02556"},
      {org:"Microsoft Research",system:"Aurora",primaryPublication:"A foundation model for the Earth system",year:"2025",architecture:"3D Swin Transformer processor with Perceiver encoder and decoder",bottleneck:"Heterogeneous Earth-system variables and task adaptation",evidence:"Nature paper reports advantages across high-resolution weather, air pollution, waves, and cyclone-track targets after pretraining on more than one million hours.",relation:"Published by organization research laboratory",sourceType:"Peer-reviewed Nature paper",url:"https://www.nature.com/articles/s41586-025-09005-y",secondaryUrl:"https://www.microsoft.com/en-us/research/publication/aurora-a-foundation-model-for-the-earth-system/"},
      {org:"ECMWF",system:"AIFS",primaryPublication:"ECMWF's AI forecasts become operational",year:"2025",architecture:"Operational AI forecasting system",bottleneck:"Operational speed, energy, and national-service integration",evidence:"Official ECMWF announcement reports AIFS operational on 25 February 2025, tropical-cyclone track gains up to 20%, and about 1,000x energy reduction.",relation:"Officially implemented and documented",sourceType:"Official operational documentation",url:"https://www.ecmwf.int/en/about/media-centre/news/2025/ecmwfs-ai-forecasts-become-operational"},
    ]
  }
];

const objectiveInfo: Record<string, ObjectiveInfo> = {
  quantum: {
    field: "quantum computing",
    taskType: "predict and decide",
    target: "the likely logical error and correction action",
    practicalUse: "keep encoded quantum information usable across noisy measurement cycles",
    purpose: "This architecture is used in quantum computing to predict the likely logical error and decide a correction, helping quantum hardware teams protect encoded information from correlated noise.",
    input: "syndrome changes, analog readout, cycle index",
    architecture: "recurrent transformer decoder",
    output: "logical error probabilities",
    use: "choose the lowest-risk correction"
  },
  minerals: {
    field: "critical-mineral exploration",
    taskType: "rank",
    target: "prospective map cells",
    practicalUse: "spend field survey budgets on the most informative locations",
    purpose: "This architecture is used in critical-mineral exploration to rank prospective map cells, helping geoscience teams prioritize scarce survey and drilling resources.",
    input: "multimodal geospatial layers and known deposits",
    architecture: "masked geospatial foundation model",
    output: "prospectivity and uncertainty scores",
    use: "choose top cells for field investigation"
  },
  finance: {
    field: "quantitative finance",
    taskType: "decide",
    target: "the next hedge position",
    practicalUse: "control portfolio risk after transaction costs and market frictions",
    purpose: "This architecture is used in quantitative finance to decide the next hedge position, helping risk teams protect portfolios when trading costs make simple formulas brittle.",
    input: "market state, portfolio state, costs, limits",
    architecture: "time-unrolled neural policy",
    output: "hedge action sequence",
    use: "trade only when risk reduction justifies cost"
  },
  materials: {
    field: "materials science",
    taskType: "generate",
    target: "stable crystal candidates with requested properties",
    practicalUse: "reduce expensive simulation and synthesis search",
    purpose: "This architecture is used in materials science to generate stable crystal candidates with requested properties, helping researchers search for useful compounds under laboratory and supply constraints.",
    input: "atom types, coordinates, lattice, property target",
    architecture: "equivariant conditional diffusion model",
    output: "candidate crystal structures",
    use: "send promising candidates to screening and synthesis"
  },
  math: {
    field: "formal mathematics",
    taskType: "rank and verify",
    target: "proof branches and next tactics",
    practicalUse: "spend compute on branches that can become verifier-accepted proofs",
    purpose: "This architecture is used in formal mathematics to rank and verify proof branches, helping researchers turn difficult statements into checkable proof attempts.",
    input: "formal statement, proof state, retrieved lemmas",
    architecture: "transformer plus verifier-guided search",
    output: "candidate tactics and verified branches",
    use: "continue, prune, or retry proof paths"
  },
  business: {
    field: "supply-chain forecasting",
    taskType: "predict",
    target: "a future demand distribution",
    practicalUse: "set inventory quantities under asymmetric shortage and holding costs",
    purpose: "This architecture is used in supply-chain forecasting to predict a future demand distribution, helping planners choose inventory levels when uncertainty matters more than a single point forecast.",
    input: "past demand, calendar signals, item metadata",
    architecture: "global autoregressive recurrent network",
    output: "forecast distribution by horizon",
    use: "choose the business-cost quantile"
  },
  graphcast: {
    field: "weather forecasting",
    taskType: "predict",
    target: "global weather fields up to medium-range lead times",
    practicalUse: "inform warnings, grid planning, logistics, and emergency preparation",
    purpose: "This architecture is used in weather forecasting to predict global weather fields, helping forecasters and operators act before hazardous conditions arrive.",
    input: "two recent global weather states and Earth graph geometry",
    architecture: "message-passing graph neural network",
    output: "six-hour forecast increments rolled to 10 days",
    use: "inform weather-dependent actions"
  }
};

const resultEvidence: Record<string, ResultEvidence> = {
  quantum: {
    measured: "Logical error performance on real Sycamore surface-code data.",
    comparison: "Compared with leading algorithmic decoders in the paper.",
    improved: "Reported lower logical error rate and generalization beyond the 25-cycle training setting.",
    wording: "Summary preserves the paper-level claim without inventing a new percentage or bar chart.",
    limitation: "Small-code, hardware-specific demonstrations still require validation before broad operational deployment."
  },
  minerals: {
    measured: "Prospectivity performance and geological interpretability across reported regions.",
    comparison: "Compared against supervised-only and non-foundation mineral prospectivity baselines.",
    improved: "Reported more robust features and better lead-zinc prospectivity predictions.",
    wording: "Result is stated qualitatively here because the audience card avoids unsupported invented metrics.",
    limitation: "Known deposits are sparse and spatially biased; predictions still need field validation."
  },
  finance: {
    measured: "Terminal convex risk after transaction costs in the deep-hedging experiments.",
    comparison: "Compared with standard complete-market hedging under a synthetic Heston market with costs.",
    improved: "Reported better risk-cost tradeoffs in high-dimensional hedging settings.",
    wording: "No fake profit amounts are shown; the paper result is framed as risk reduction after costs.",
    limitation: "Simulator assumptions and market regime shift can make a learned policy brittle."
  },
  materials: {
    measured: "Stable, unique, novel generation rate and distance to local energy minimum.",
    comparison: "Compared with prior generative materials models in the MatterGen paper.",
    improved: "Reported more than twice the stable-unique-new rate and more than ten times closer local-minimum proximity.",
    wording: "The synthesized-material target-property claim is kept to the paper wording.",
    limitation: "DFT and synthesis remain outside the generator and can reject plausible samples."
  },
  math: {
    measured: "Verified pass ratio on MiniF2F-test and solved PutnamBench problems.",
    comparison: "Compared against formal-proving benchmarks used by the paper.",
    improved: "Reported 88.9% pass ratio on MiniF2F-test and 49 of 658 PutnamBench problems solved.",
    wording: "Only exact reported benchmark values are shown.",
    limitation: "Verifier success depends on formalization, search budget, and benchmark scope."
  },
  business: {
    measured: "Probabilistic forecasting accuracy across real-world datasets.",
    comparison: "Compared with then-state-of-the-art forecasting methods in the DeepAR paper.",
    improved: "Reported around 15% forecasting-accuracy improvement across several datasets.",
    wording: "Inventory effects are shown conceptually; no fake dollar or unit profit is added.",
    limitation: "Distribution choice, covariate quality, and regime changes affect tail calibration."
  },
  graphcast: {
    measured: "Forecast error across 1380 verification targets and 10-day rollout speed.",
    comparison: "Compared with HRES in the Science paper.",
    improved: "Reported lower error than HRES on more than 90% of 1380 targets and under-one-minute rollout.",
    wording: "The exact paper-scale comparison is used; no extra bar values are invented.",
    limitation: "Deterministic forecasts need uncertainty calibration or ensembles for many operational uses."
  }
};

const supplementLessons: Supplement[] = [
  {
    id: "supplement-vanilla-rnn",
    name: "Vanilla RNN",
    accent: "blue",
    objectiveInfo: {
      field: "sequence modeling",
      taskType: "predict",
      target: "the next sequence state from recent history",
      practicalUse: "teach the basic memory loop before gates are added",
      purpose: "This architecture is used in sequence modeling to predict the next state from recent history, helping analysts understand how neural memory can help or fail over time.",
      input: "x_{t-2}, x_{t-1}, x_t",
      architecture: "shared recurrent transition",
      output: "hidden state h_t and prediction",
      use: "compare short-memory and long-memory behavior"
    },
    bottleneck: "Plain recurrence can reuse the same weights at every time step, but gradients can vanish or explode across long histories.",
    mechanism: "Step through x_{t-2}, x_{t-1}, and x_t. The hidden state carries a compressed memory forward.",
    equation: "h_t=\\tanh(W_xx_t+W_hh_{t-1}+b)",
    weights: [
      {type:"Input",symbol:"W_x",role:"How new input enters memory"},
      {type:"Recurrent",symbol:"W_h",role:"How much previous memory persists"},
      {type:"Output",symbol:"W_y",role:"How hidden state becomes a prediction"}
    ],
    result: "Foundational architecture used to show why sequence memory matters and why later gated models were needed.",
    paper: "Learning representations by back-propagating errors",
    organization: "Foundational neural-network research",
    year: "1986",
    url: "https://www.nature.com/articles/323533a0",
    limitation: "Long dependencies can fade or blow up without careful training or gating."
  },
  {
    id: "supplement-lstm",
    name: "LSTM",
    accent: "emerald",
    objectiveInfo: {
      field: "sequence modeling",
      taskType: "predict",
      target: "longer-range sequence dependencies",
      practicalUse: "separate write, forget, and expose memory operations",
      purpose: "This architecture is used in sequence modeling to predict longer-range dependencies, helping teams keep useful memory while discarding stale evidence.",
      input: "sequence input and prior cell state",
      architecture: "input, forget, and output gates",
      output: "cell state c_t and hidden state h_t",
      use: "control stale-memory versus premature-forgetting risk"
    },
    bottleneck: "A plain RNN has one memory channel; LSTM adds explicit gates so memory can be retained, overwritten, or exposed.",
    mechanism: "Choose input, forget, or output gate and adjust its strength to see how the cell state changes.",
    equation: "c_t=f_t\\odot c_{t-1}+i_t\\odot \\tilde{c}_t",
    weights: [
      {type:"Forget gate",symbol:"f_t",role:"Retain or clear prior cell memory"},
      {type:"Input gate",symbol:"i_t",role:"Write candidate information"},
      {type:"Output gate",symbol:"o_t",role:"Expose memory to the hidden state"}
    ],
    result: "The LSTM paper introduced gates and constant-error flow as a response to long-lag learning failures.",
    paper: "Long Short-Term Memory",
    organization: "Foundational neural-network research",
    year: "1997",
    url: "https://www.bioinf.jku.at/publications/older/2604.pdf",
    limitation: "More gates improve control but add parameters and can still forget if gate behavior is poorly learned."
  },
  {
    id: "supplement-gru",
    name: "GRU",
    accent: "teal",
    objectiveInfo: {
      field: "sequence modeling",
      taskType: "predict",
      target: "compact recurrent state updates",
      practicalUse: "use gated memory with fewer moving parts than an LSTM",
      purpose: "This architecture is used in sequence modeling to predict compact recurrent state updates, helping teams trade detailed memory control for a smaller gated model.",
      input: "sequence input and previous hidden state",
      architecture: "update and reset gates",
      output: "new hidden state h_t",
      use: "choose retention versus candidate replacement"
    },
    bottleneck: "GRU keeps gating but merges the cell and hidden state, making the memory mechanism compact.",
    mechanism: "Adjust update z_t and reset r_t to balance previous retention against candidate replacement.",
    equation: "h_t=(1-z_t)\\odot h_{t-1}+z_t\\odot \\tilde{h}_t",
    weights: [
      {type:"Update gate",symbol:"z_t",role:"Choose old memory versus candidate"},
      {type:"Reset gate",symbol:"r_t",role:"Control how much history builds the candidate"},
      {type:"Candidate",symbol:"\\tilde{h}_t",role:"Propose replacement memory"}
    ],
    result: "The GRU became a compact gated alternative introduced in neural machine translation experiments.",
    paper: "Learning Phrase Representations using RNN Encoder-Decoder for Statistical Machine Translation",
    organization: "Foundational neural-network research",
    year: "2014",
    url: "https://arxiv.org/abs/1406.1078",
    limitation: "Compact gates can be easier to train, but less explicit memory control can hurt some tasks."
  },
  {
    id: "supplement-actor-critic",
    name: "Actor-Critic",
    accent: "rose",
    objectiveInfo: {
      field: "reinforcement learning",
      taskType: "decide",
      target: "an action and a value estimate",
      practicalUse: "learn what to do while estimating whether the outcome was better than expected",
      purpose: "This architecture is used in reinforcement learning to decide an action and estimate its value, helping agents improve behavior from delayed rewards.",
      input: "state, action, reward, next state",
      architecture: "actor policy plus critic value model",
      output: "policy action and advantage signal",
      use: "increase actions that beat the critic's expectation"
    },
    bottleneck: "Policy gradients are noisy; a critic reduces variance by estimating what reward was expected.",
    mechanism: "Pick an actor action, compare reward to critic value, compute advantage, then update the actor.",
    equation: "A_t=r_t+\\gamma V(s_{t+1})-V(s_t)",
    weights: [
      {type:"Actor",symbol:"\\theta_\\pi",role:"Map states to actions"},
      {type:"Critic",symbol:"\\theta_V",role:"Estimate future value"},
      {type:"Exploration",symbol:"\\beta",role:"Keep the policy from collapsing too early"}
    ],
    result: "Actor-critic methods underpin many deep reinforcement-learning systems, including asynchronous deep RL variants.",
    paper: "Asynchronous Methods for Deep Reinforcement Learning",
    organization: "Google DeepMind",
    year: "2016",
    url: "https://arxiv.org/abs/1602.01783",
    limitation: "A biased critic can confidently push the actor in the wrong direction."
  },
  {
    id: "supplement-llm-guided-formal-search",
    name: "LLM-Guided Formal Search",
    accent: "violet",
    objectiveInfo: {
      field: "formal mathematics",
      taskType: "rank",
      target: "candidate proof branches",
      practicalUse: "spend verifier attempts on branches with the best chance of completion",
      purpose: "This architecture is used in formal mathematics to rank candidate proof branches, helping proof systems allocate limited verification attempts.",
      input: "proof state and candidate branches",
      architecture: "language model plus verifier loop",
      output: "ranked tactics and accepted/rejected branches",
      use: "prune, retry, or expand proof paths"
    },
    bottleneck: "Model probability and verifier outcome are different signals; a likely tactic can fail formal checking.",
    mechanism: "Rank branches, allocate attempt budget, verify each branch, then prune or retry from feedback.",
    equation: "score=b_k\\,p_\\theta(branch)+\\mathbb{1}_{verified}",
    weights: [
      {type:"Probability",symbol:"p_\\theta",role:"Rank likely next proof moves"},
      {type:"Budget",symbol:"b_k",role:"Allocate attempts across branches"},
      {type:"Verifier",symbol:"v",role:"Accept only formally valid steps"}
    ],
    result: "DeepSeek-Prover-V2 reports verifier-grounded gains on formal mathematics benchmarks.",
    paper: "DeepSeek-Prover-V2: Advancing Formal Mathematical Reasoning via Reinforcement Learning for Subgoal Decomposition",
    organization: "DeepSeek",
    year: "2025",
    url: "https://arxiv.org/abs/2504.21801",
    limitation: "The verifier is exact, but search can still miss valid low-probability branches."
  },
  {
    id: "supplement-self-supervised-pretraining",
    name: "Self-Supervised Pretraining",
    accent: "amber",
    objectiveInfo: {
      field: "limited-label learning",
      taskType: "predict",
      target: "hidden input structure before labels are available",
      practicalUse: "learn reusable representations from unlabeled data",
      purpose: "This architecture is used in limited-label learning to predict hidden input structure, helping teams reuse unlabeled data before scarce labels are introduced.",
      input: "masked unlabeled examples",
      architecture: "encoder-decoder pretraining then fine-tuning",
      output: "pretrained encoder and task head",
      use: "retain useful encoder features and discard task-specific reconstruction pieces"
    },
    bottleneck: "Labels are scarce, but raw data is abundant; pretraining asks the model to learn structure before a supervised target is available.",
    mechanism: "Mask 25, 50, or 75 percent of input; encode visible patches; decode hidden areas; then switch to fine-tuning.",
    equation: "L=L_{reconstruct}+\\lambda_{task}L_{supervised}",
    weights: [
      {type:"Mask",symbol:"m",role:"Choose which patches become the training signal"},
      {type:"Encoder",symbol:"\\theta_E",role:"Retain reusable representation"},
      {type:"Task head",symbol:"\\theta_T",role:"Adapt representation to labels"}
    ],
    result: "Masked autoencoder-style pretraining showed scalable representation learning for vision encoders.",
    paper: "Masked Autoencoders Are Scalable Vision Learners",
    organization: "Meta AI",
    year: "2021",
    url: "https://arxiv.org/abs/2111.06377",
    limitation: "The pretext task must align with the downstream task; reconstruction skill alone is not enough."
  }
];

const weightLayers = [
  {n:"1",title:"Parameter weights",sym:"θ",text:"Millions or billions of learned numbers transform inputs into representations."},
  {n:"2",title:"Dynamic weights",sym:"α(x)",text:"Attention or gates change with each example: the model decides what matters now."},
  {n:"3",title:"Loss weights",sym:"λ",text:"Researchers choose how much each training objective matters."},
  {n:"4",title:"Data weights",sym:"ωᵢ",text:"Sampling and class weights decide which examples the model learns from most."},
  {n:"5",title:"Decision weights",sym:"C",text:"Operational costs convert a prediction into an action."},
];

const graphcastObjectiveFlow = [
  ["Weather observations", "Raw measurements are assimilated into a global reanalysis state."],
  ["Forecast field", "GraphCast predicts the next six-hour global weather state."],
  ["Hazard signal", "Downstream systems inspect wind, pressure, rain, heat, or renewable-energy fields."],
  ["Operational decision", "Prepare for a cyclone, reroute travel, adjust power operations, or issue a warning."],
  ["Consequence", "The forecast informs action; people and operational systems still decide the response."]
];

const graphcastBottlenecks = [
  ["Flat latitude-longitude image", "Easy to store, but grid cells crowd near the poles and local kernels move information slowly."],
  ["Numerical weather prediction", "Solves physical equations and remains essential, but high-resolution simulation is computationally expensive."],
  ["GraphCast multimesh", "Uses graph edges on a spherical multiscale mesh so distant regions can exchange learned messages efficiently."]
];

const graphcastMethodology = [
  ["ERA5 reanalysis", "The model is trained on reanalysis states: observations blended through a physical data-assimilation system, not raw station data alone."],
  ["Causal split", "Development training used 1979-2015, validation used 2016-2017, and later years were held out for testing after the protocol was frozen."],
  ["Resolution", "Inputs and targets are global 0.25 degree fields at six-hour intervals."],
  ["Variables", "The forecast covers surface variables and atmospheric variables across pressure levels; the paper describes 227 dynamic variables per grid point."],
  ["Two-state input", "Each prediction sees state at t-6h and state at t, plus static Earth fields and graph geometry."],
  ["No future leakage", "The verifying t+6h state is used only as a target during training, never as an input feature."],
  ["Autoregressive rollout", "The t+6h prediction is fed back with the current state to continue toward a 10-day trajectory."],
  ["Normalization and weights", "Variables are normalized; loss terms use variable, pressure-level, and latitude weighting so geography and variable scale do not dominate unfairly."],
  ["Distribution shift", "Because training comes from historical reanalysis, future climates, sensor changes, and rare extremes require careful validation."]
];

const graphcastPipelineDeep = [
  {plain:"Weather grid", tech:"input state x(t-6h), x(t)", input:"ERA5 fields + static fields", output:"grid-node features", learned:"normalization statistics are fixed; encoder weights are learned", human:"choose variables, grid, and history length", failure:"bad variable selection hides useful precursors"},
  {plain:"Grid-node encoder", tech:"node MLP", input:"Ngrid x Finput", output:"Ngrid x Dlatent", learned:"Wnode", human:"choose latent width and feature set", failure:"pressure-level structure can be compressed poorly"},
  {plain:"Grid-to-mesh transfer", tech:"bipartite graph encoder", input:"grid nodes + edge geometry", output:"mesh latent state", learned:"edge and node encoders", human:"choose mesh construction", failure:"geometry errors create misplaced signals"},
  {plain:"Multimesh processor", tech:"message-passing GNN", input:"Nmesh x Dlatent", output:"updated Nmesh x Dlatent", learned:"message and update functions", human:"choose graph depth and connectivity", failure:"too little exchange misses long-range coupling; too much can oversmooth"},
  {plain:"Mesh-to-grid transfer", tech:"decoder graph", input:"mesh latent state", output:"grid latent state", learned:"decoder and edge weights", human:"choose output grid", failure:"local details can be blurred"},
  {plain:"Six-hour forecast", tech:"forecast increment decoder", input:"grid latent state", output:"Ngrid x Foutput", learned:"forecast decoder weights", human:"choose target variables", failure:"easy variables can dominate objective"},
  {plain:"Autoregressive rollout", tech:"shared-weight recurrent use", input:"previous prediction", output:"trajectory toward day 10", learned:"same theta reused", human:"choose rollout horizon", failure:"errors compound with lead time"}
];

const graphcastRepresentation = [
  ["Gridded atmospheric variables", "Ngrid x Finput", "Ngrid: latitude-longitude grid points; Finput: two weather states plus static features."],
  ["Grid-node feature vectors", "Ngrid x Dlatent", "Dlatent: learned hidden width after encoding."],
  ["Mesh-node latent vectors", "Nmesh x Dlatent", "Nmesh: nodes in the multiresolution spherical mesh."],
  ["Updated mesh-node vectors", "Nmesh x Dlatent", "Message passing changes each node using neighboring latent messages."],
  ["Forecast-grid variables", "Ngrid x Foutput", "Foutput: predicted weather variables for the next six-hour state."]
];

const graphcastWeightMap = [
  ["Input normalization", "fixed mean/std statistics", "selected/static"],
  ["Node encoder", "Wnode", "learned/static after training"],
  ["Edge geometry", "edge features", "human-designed + calculated"],
  ["Edge encoder", "Wedge", "learned/static after training"],
  ["Neighbor messages", "m_ij(x)", "learned function, input-dependent value"],
  ["Node aggregation", "sum_j m_ij", "dynamic calculation"],
  ["Decoded weather variables", "decoder weights", "learned/static after training"],
  ["Variable loss", "lambda_v", "human-selected objective weight"],
  ["Geographic loss", "omega_lat", "calculated/selected latitude weight"],
  ["Operational action", "Cmiss, Cfalse", "decision-specific downstream cost"]
];

const graphcastTrainingLoop = [
  ["Training input", "ERA5 state at t-6h and t"],
  ["Prediction", "GraphCast predicts t+6h"],
  ["Future truth", "Verifying ERA5 t+6h is available only for loss"],
  ["Weighted loss", "variable, pressure, and latitude terms score the forecast"],
  ["Backpropagation", "gradients update theta"],
  ["Inference", "future truth is unknown; prediction is rolled forward"]
];

const graphcastFailures = [
  ["Too little message passing", "Long-range information exchange is insufficient for coupled weather systems."],
  ["Poor aggregation design", "Repeated averaging can oversmooth sharp fronts, cyclones, or atmospheric rivers."],
  ["Bad objective weights", "Easy variables or dense geographic sampling can dominate optimization."],
  ["Long rollout", "Small six-hour errors compound as predictions feed later predictions."]
];

const graphcastResultFacts = [
  ["More than 90% of 1380", "verification targets with lower error than HRES"],
  ["10-day", "global medium-range forecast trajectory"],
  ["0.25 degree", "global latitude-longitude output resolution"],
  ["Under one minute", "reported inference time for a 10-day forecast"]
];

const graphcastComparisons = [
  ["Local CNN", "latitude-longitude image", "slow through local kernels", "distorted near poles", "does not solve physics", "fast", "needs extra method", "simple local patterns", "global coupling and sphere geometry", "small local nowcasting baselines"],
  ["Pangu-Weather", "3D Earth-specific transformer", "attention over 3D atmospheric structure", "architecture encodes vertical/geographic structure", "data-driven, not equation-solving NWP", "very fast inference", "deterministic variants need calibration", "vertical atmosphere modeling", "not a message-passing mesh chapter", "fast deterministic global forecasts"],
  ["GraphCast", "multimesh graph on the sphere", "message passing over mesh edges", "mesh avoids treating Earth as a flat image", "data-driven, with learned dynamics", "under-one-minute reported rollout", "deterministic; ensembles separate", "curved global information flow", "rare extremes and rollout drift", "medium-range learned global forecasts"],
  ["Traditional NWP", "physical state on numerical grid", "physical equations propagate dynamics", "native geophysical grid choices", "explicit physical simulation", "computationally expensive", "ensembles common operationally", "physical consistency and data assimilation", "high compute cost", "high-stakes operations and physics-grounded baselines"]
];

const graphcastWeightDetails = [
  ["Wnode", "node encoder", "learned parameter", "static after training", "More capacity to transform local variables", "Less ability to separate variables", "Overfit or noisy features", "underfit pressure/surface signals"],
  ["Wedge", "edge encoder", "learned parameter", "static after training", "More sensitivity to geometry", "Less geometric distinction", "spurious geometry effects", "flat-image behavior"],
      ["m_ij(x)", "message function", "learned function; value calculated per input", "input-dependent", "stronger neighbor influence", "weaker spatial exchange", "oversmoothing or noise spread", "missed teleconnections"],
  ["sum_j m_ij", "aggregation", "dynamic calculation", "input-dependent", "more incoming evidence combined", "less neighbor evidence", "sharp-front loss", "local isolation"],
  ["decoder weights", "mesh-to-grid and output decoder", "learned parameter", "static after training", "richer mapping to weather variables", "simpler output mapping", "local artifacts", "blurry variables"],
  ["lambda_v", "training loss", "selected objective weight", "static during a training run", "variable v matters more in optimization", "variable v matters less", "one variable starves others", "hazard-relevant variable ignored"],
  ["omega_lat", "geographic loss contribution", "calculated/selected objective weight", "static by latitude", "latitude band contributes more", "latitude band contributes less", "geographic bias", "important regions underweighted"],
  ["Cmiss/Cfalse", "operational action", "decision-specific cost", "changes by use case", "more conservative warning posture", "fewer interventions", "false-alarm fatigue", "missed hazards"]
];

const graphcastEquationSteps = [
  ["L", "weighted forecast-training loss."],
  ["t", "forecast step in the rollout horizon."],
  ["v", "weather variable or variable/pressure-level target."],
  ["lambda_v", "selected variable weight; it is not a neural parameter."],
  ["omega_lat", "latitude weight that corrects geographic contribution."],
  ["y_hat_t,v", "GraphCast prediction produced by theta."],
  ["y_t,v", "verifying ERA5 future state used as the training target."],
  ["theta", "learned neural-network parameters updated by gradients."]
];

const defaultDemo = {
  quantumGt: 6,
  quantumAlpha: 55,
  quantumCost: 65,
  mineralsM1: 72,
  mineralsM2: 58,
  mineralsM3: 45,
  mineralsM4: 64,
  mineralsW: 70,
  mineralsCost: 42,
  financeCost: 35,
  financeGamma: 62,
  financeStress: 48,
  materialsBeta: 45,
  materialsGuidance: 55,
  materialsLambdaA: 60,
  materialsLambdaX: 55,
  materialsLambdaL: 50,
  mathBranch: "balanced",
  mathBudget: 6,
  mathStrategy: "balanced",
  businessCu: 7,
  businessCo: 3,
  businessHorizon: 60,
  businessProduct: "Seasonal item",
  graphSteps: 8,
  graphEdgeView: "multiscale",
  graphLatitude: true,
  graphRollout: 5,
  rnnMemory: 55,
  rnnStep: 2,
  lstmGate: "forget",
  lstmForget: 68,
  lstmInput: 52,
  lstmOutput: 61,
  gruUpdate: 58,
  gruReset: 42,
  actorAction: 60,
  actorReward: 50,
  actorBeta: 35,
  actorGamma: 80,
  formalBudget: 5,
  formalRank: 65,
  formalBranch: "lemma path",
  sslMask: 50,
  sslMode: "pretraining"
};

type DemoState = typeof defaultDemo;
type DemoKey = keyof DemoState;

const flagshipKeys: Record<string, DemoKey[]> = {
  quantum: ["quantumGt", "quantumAlpha", "quantumCost"],
  minerals: ["mineralsM1", "mineralsM2", "mineralsM3", "mineralsM4", "mineralsW", "mineralsCost"],
  finance: ["financeCost", "financeGamma", "financeStress"],
  materials: ["materialsBeta", "materialsGuidance", "materialsLambdaA", "materialsLambdaX", "materialsLambdaL"],
  math: ["mathBranch", "mathBudget", "mathStrategy"],
  business: ["businessCu", "businessCo", "businessHorizon", "businessProduct"],
  graphcast: ["graphSteps", "graphEdgeView", "graphLatitude", "graphRollout"]
};

const supplementKeys: Record<string, DemoKey[]> = {
  "supplement-vanilla-rnn": ["rnnMemory", "rnnStep"],
  "supplement-lstm": ["lstmGate", "lstmForget", "lstmInput", "lstmOutput"],
  "supplement-gru": ["gruUpdate", "gruReset"],
  "supplement-actor-critic": ["actorAction", "actorReward", "actorBeta", "actorGamma"],
  "supplement-llm-guided-formal-search": ["formalBudget", "formalRank", "formalBranch"],
  "supplement-self-supervised-pretraining": ["sslMask", "sslMode"]
};

const percentLabel = (value: number) => `${Math.round(value)}%`;

function Latex({children,className=""}:{children:string;className?:string}) {
  const html = katex.renderToString(children,{throwOnError:false,strict:false,output:"html"});
  return <span className={`latex mathText ${className}`} aria-label={children} dangerouslySetInnerHTML={{__html:html}} />;
}

function WeightBadge({math,label,className=""}:{math:string;label:string;className?:string}) {
  return <span className={`weightBadge ${className}`}><Latex>{math}</Latex><small>{label}</small></span>;
}

function Sparkline({bars}:{bars:number[]}) {
  return <span className="sparkline" aria-hidden="true">{bars.map((height,i)=><i key={i} style={{height:`${height}%`}} />)}</span>;
}

function ArchitectureVisual({active,stage}:{active:Sector;stage?:number}) {
  return <article className={`visual3 visual3-${active.id} stageFocus stage-${stage ?? 0}`} aria-label={`${active.name} main architecture visual`}>
    <div className="visual3Header">
      <span className="cardLabel">VISUAL 3 · ML ARCHITECTURE</span>
      <div><h3>{active.architecture}</h3><p>{architectureTeachingLine(active.id)}</p></div>
    </div>
    {active.id==="quantum"&&<div className="quantumVisual">
      <div className="quantumCycles">
        {["Cycle 1","Cycle 2","Cycle 3"].map((cycle,index)=><div className="qubitCycle" key={cycle}>
          <b>{cycle}</b>
          <div className="qubitGrid" aria-label={`${cycle} qubit grid`}>
            {Array.from({length:9}).map((_,i)=><span key={i} className={(i+index)%4===0?"event":"quiet"} />)}
          </div>
          <WeightBadge math="\\alpha_{ij}" label="spatial attention" />
          {index<2&&<i className="cycleArrow">→</i>}
        </div>)}
      </div>
      <div className="temporalRail"><WeightBadge math="g_t" label="temporal memory gates" /><span>memory carries unresolved evidence across cycles</span></div>
      <div className="visualOutcome"><WeightBadge math="W_e" label="event embeddings" /><b>logical error probabilities</b><WeightBadge math="W_o" label="output weights" /><b>correction decision</b><WeightBadge math="C_{ij}" label="correction cost" /></div>
    </div>}

    {active.id==="minerals"&&<div className="mineralsVisual">
      <div className="gisLayers">
        {[
          ["Geology","faults","m_1"],
          ["Magnetics","bands","m_2"],
          ["Gravity","contours","m_3"],
          ["Geochemistry","samples","m_4"]
        ].map(([name,pattern,weight])=><div className={`mapLayer ${pattern}`} key={name}><b>{name}</b><span>{pattern}</span><WeightBadge math={weight} label="modality reliability" /></div>)}
      </div>
      <div className="stackConnector">multimodal patch encoder</div>
      <div className="maskedMap" aria-label="masked geospatial patches">{Array.from({length:18}).map((_,i)=><i key={i} className={i%4===1||i%7===0?"masked":""} />)}<WeightBadge math="a_p" label="patch weighting" /></div>
      <div className="visualColumn">
        <WeightBadge math="\\theta" label="self-supervised backbone" />
        <b>geological features</b>
        <WeightBadge math="w_+" label="rare-positive class weight" />
        <b>prospectivity + uncertainty map</b>
        <WeightBadge math="C_{survey}" label="survey cost ranking" />
      </div>
    </div>}

    {active.id==="finance"&&<div className="financeVisual">
      <div className="marketCurve" aria-hidden="true"><i/><i/><i/><i/></div>
      <div className="tradeTimeline">
        {["t_1","t_2","t_3","T"].map((time,i)=><div className="tradeStep" key={time}>
          <Latex>{time}</Latex>
          <span>market state</span>
          {i<3?<><WeightBadge math={`\\pi_\\theta(s_${i+1})`} label="policy action" /><b>{`a_${i+1}`}</b><WeightBadge math={`c_j|\\Delta a_${i+1}|`} label="transaction cost" className="costWeight" /></>:<><b>final market</b><WeightBadge math="\\mathrm{PnL}_\\theta" label="portfolio result" /></>}
        </div>)}
      </div>
      <div className="riskLoop"><WeightBadge math="\\rho_\\gamma" label="convex risk" /><span>update policy</span><WeightBadge math="\\theta" label="policy parameters" /><WeightBadge math="\\omega_s" label="stress scenario weight" /></div>
    </div>}

    {active.id==="materials"&&<div className="materialsVisual">
      <div className="spiralCore">
        <span className="orbitLabel outer">random crystal</span>
        <span className="spiralRing ring1" /><span className="spiralRing ring2" /><span className="spiralRing ring3" />
        <WeightBadge math="\\beta_t" label="noise schedule" className="spiralWeight beta" />
        <WeightBadge math="\\lambda_A" label="atom channel" className="spiralWeight atom" />
        <WeightBadge math="\\lambda_X" label="coordinate channel" className="spiralWeight coord" />
        <WeightBadge math="\\lambda_L" label="lattice channel" className="spiralWeight lattice" />
        <div className="crystalCore"><b>stable crystal</b><Latex>{"\\theta_{score}"}</Latex></div>
      </div>
      <div className="propertySide"><WeightBadge math="\\phi(c)" label="property adapter" /><WeightBadge math="s" label="guidance strength" /><b>targeted material candidate</b><span>DFT validation outside the loop</span></div>
    </div>}

    {active.id==="math"&&<div className="mathVisual">
      <div className="theoremRoot">THEOREM<WeightBadge math="\\alpha_{ij}" label="symbol attention" /></div>
      <div className="proofBranches">
        {[
          ["Subgoal A","valid","r_\\tau"],
          ["Subgoal B","reject","b_i"],
          ["Subgoal C","valid","A_\\tau"]
        ].map(([goal,status,weight])=><div className={`proofBranch ${status}`} key={goal}><b>{goal}</b><WeightBadge math="p_\\theta(\\mathrm{tactic})" label="next tactic probability" /><span>LEAN gate</span><em>{status==="valid"?"verified":"revise / search"}</em><WeightBadge math={weight} label={status==="valid"?"verifier reward":"branch budget"} /></div>)}
      </div>
      <div className="proofFeedback"><b>verified proof</b><WeightBadge math="\\kappa\\,\\mathrm{KL}" label="stability penalty" /><span>reward feedback updates/searches the successful path</span></div>
    </div>}

    {active.id==="business"&&<div className="businessVisual">
      <div className="productHistories">
        {[
          ["Product A",[20,36,58,28,72],"\\nu_A"],
          ["Product B",[14,18,30,66,42],"\\nu_B"],
          ["Product C",[78,64,48,31,18],"\\nu_C"],
          ["Product D",[12,15,16,28,17],"\\nu_D"],
          ["Product E",[58,72,61,84,76],"\\nu_E"]
        ].map(([name,bars,scale])=><div className="productLine" key={name as string}><b>{name}</b><Sparkline bars={bars as number[]} /><WeightBadge math={scale as string} label="series scaling" /></div>)}
      </div>
      <div className="sharedCore"><b>shared recurrent model</b><WeightBadge math="\\theta_{RNN}" label="shared parameters" /><WeightBadge math="g_t" label="memory gates" /><span>item-specific hidden state</span><Latex>{"h_{i,t}"}</Latex></div>
      <div className="forecastFan"><WeightBadge math="\\mu_{i,t},\\sigma_{i,t}" label="distribution head" /><div><span>P10</span><span>P50</span><span>P90</span></div><WeightBadge math="q=\\frac{C_u}{C_u+C_o}" label="inventory quantile" /><WeightBadge math="\\lambda_h" label="horizon weight" /></div>
    </div>}

    {active.id==="graphcast"&&<div className="graphcastVisual3">
      <div className="weatherGrid"><b>latitude-longitude weather grid</b><WeightBadge math="W_{node}" label="node encoder" /></div>
      <div className="gridToMesh"><WeightBadge math="W_{edge}" label="grid-to-mesh edges" /></div>
      <div className="sphericalMesh" aria-label="spherical multimesh graph"><span className="globeLine lat1"/><span className="globeLine lat2"/>{Array.from({length:14}).map((_,i)=><i key={i} style={{"--n":i} as React.CSSProperties} />)}<WeightBadge math="m_{ij}" label="dynamic messages" /><WeightBadge math="\\sum_j m_{ij}" label="aggregation" /></div>
      <div className="forecastGrid"><WeightBadge math="W_{decode}" label="forecast decoder" /><b>six-hour weather grid</b><WeightBadge math="\\lambda_v\\times\\omega_{lat}" label="weighted loss" /><span>autoregressive rollout</span></div>
    </div>}
    <div className="visualLoss"><span>Training objective</span><Latex>{active.loss}</Latex><p>{active.lossNote}</p></div>
  </article>;
}

function architectureTeachingLine(id:string) {
  const lines: Record<string,string> = {
    quantum: "The transformer finds spatial relationships, while recurrence remembers how those relationships evolve.",
    minerals: "The architecture learns the structure of maps without deposit labels, then specializes using scarce positives.",
    finance: "Every action changes both the portfolio and the future cost, so the whole trading path is optimized.",
    materials: "MatterGen denoises atoms, coordinates, and lattice together while steering toward a requested property.",
    math: "The model proposes proof paths, but the verifier decides whether each step is correct.",
    business: "One shared recurrent model learns across products, then business costs select the useful quantile.",
    graphcast: "GraphCast moves information across a spherical multiscale graph instead of treating Earth as a flat image."
  };
  return lines[id] || "The diagram places model weights where they operate.";
}

function ObjectiveBanner({info}:{info:ObjectiveInfo}) {
  return <aside className="objectiveBanner" aria-label="Architecture objective and flow">
    <div className="objectivePurpose">
      <span>ONE-SENTENCE MODEL PURPOSE</span>
      <p>{info.purpose}</p>
    </div>
    <div className="objectiveFacts">
      <article><b>FIELD</b><span>{info.field}</span></article>
      <article><b>TASK TYPE</b><span>{info.taskType}</span></article>
      <article><b>EXACT TARGET</b><span>{info.target}</span></article>
      <article><b>PRACTICAL USE</b><span>{info.practicalUse}</span></article>
    </div>
    <div className="objectiveFlow" aria-label="Input to architecture to output to use">
      <span><b>INPUT</b>{info.input}</span>
      <i aria-hidden="true">{"->"}</i>
      <span><b>ARCHITECTURE</b>{info.architecture}</span>
      <i aria-hidden="true">{"->"}</i>
      <span><b>OUTPUT</b>{info.output}</span>
      <i aria-hidden="true">{"->"}</i>
      <span><b>USE</b>{info.use}</span>
    </div>
  </aside>;
}

function StageBadge({active,stage}:{active:Sector;stage:number}) {
  const labels = ["DATA", "LEARNED", "DYNAMIC", "LEARNED", "DYNAMIC", "DECISION COST", "DECISION COST"];
  const kind = labels[Math.min(stage, labels.length - 1)];
  return <div className="stageBadge" aria-label={`${kind} stage metadata`}>
    <b>{kind}</b>
    <span>Input: {active.inputs[Math.min(stage, active.inputs.length - 1)]}</span>
    <span>Output: {active.pipeline[stage].label.toLowerCase()}</span>
  </div>;
}

function ResultPanel({active}:{active:Sector}) {
  const evidence = resultEvidence[active.id];
  return <div className="resultPanel" aria-label={`${active.name} reported result evidence`}>
    <article><span>MEASURED</span><p>{evidence.measured}</p></article>
    <article><span>COMPARISON</span><p>{evidence.comparison}</p></article>
    <article><span>IMPROVED</span><p>{evidence.improved}</p></article>
    <article><span>EXACT PAPER WORDING SUMMARY</span><p>{evidence.wording}</p></article>
    <article><span>LIMITATION</span><p>{evidence.limitation}</p></article>
  </div>;
}

function PrimarySourceCard({active}:{active:Sector}) {
  return <aside className="primarySourceCard" aria-label={`${active.name} primary paper`}>
    <span>PRIMARY SOURCE NEAR RESULT</span>
    <div><b>PRIMARY PAPER</b><a href={active.url} target="_blank" rel="noreferrer">{active.paper}</a></div>
    <div><b>ORGANIZATION</b><p>{active.company}</p></div>
    <div><b>YEAR</b><p>{active.year || inferYear(active.url, active.paper)}</p></div>
    <div><b>ARCHITECTURE</b><p>{active.architecture}</p></div>
    <div><b>REPORTED RESULT</b><p>{active.result}</p></div>
    <div><b>LIMITATION</b><p>{resultEvidence[active.id].limitation}</p></div>
  </aside>;
}

function inferYear(url: string, paper: string) {
  if (url.includes("2504") || paper.includes("2025")) return "2025";
  if (url.includes("2406")) return "2024";
  if (url.includes("2310") || url.includes("science.org")) return "2023";
  if (url.includes("1802")) return "2018";
  if (url.includes("1704")) return "2017";
  return "Primary paper year";
}

function SliderControl({label,value,min=0,max=100,onChange}:{label:string;value:number;min?:number;max?:number;onChange:(value:number)=>void}) {
  return <label className="demoControl"><span>{label}</span><input type="range" min={min} max={max} value={value} onChange={event=>onChange(Number(event.target.value))}/><b>{value}</b></label>;
}

function InteractionShell({title,ask,children,observe,explain,revealed,onReveal,onReset}:{title:string;ask:string;children:ReactNode;observe:string;explain:string;revealed:boolean;onReveal:()=>void;onReset:()=>void}) {
  return <section className="interactionLab" aria-label={`${title} interactive demonstration`}>
    <div className="interactionHeader">
      <div><span className="cardLabel">INTERACTIVE DEMONSTRATION</span><h3>{title}</h3><p><b>ASK:</b> {ask}</p></div>
      <div className="demoButtons"><button onClick={onReset}>Reset demonstration</button><button onClick={onReveal}>{revealed ? "Hide reveal" : "Reveal explanation"}</button></div>
    </div>
    <div className="demoGrid">
      <div className="demoChoice"><b>CHOOSE</b>{children}</div>
      <div className="demoObservation" aria-live="polite"><b>OBSERVE</b><p>{observe}</p></div>
      <div className="demoExplain" aria-live="polite"><b>EXPLAIN</b><p>{explain}</p>{revealed&&<small><strong>REVEAL:</strong> These controls are an illustrative teaching model, not a reproduction of the paper&apos;s experimental system.</small>}</div>
    </div>
  </section>;
}

function FlagshipInteraction({activeId,demo,setDemo,revealed,onReveal,onReset}:{activeId:string;demo:DemoState;setDemo:<K extends DemoKey>(key:K,value:DemoState[K])=>void;revealed:boolean;onReveal:()=>void;onReset:()=>void}) {
  if (activeId === "quantum") {
    const missed = Math.max(8, 92 - demo.quantumGt * 9 - demo.quantumAlpha * .25);
    const falseCorrection = Math.min(92, 18 + demo.quantumCost * .45 + (100 - demo.quantumAlpha) * .12);
    return <InteractionShell title="Decode correlated errors across cycles" ask="How should memory, attention, and correction cost change the decoder's action?" observe={`Missed-error risk trends ${missed < 35 ? "low" : missed < 60 ? "moderate" : "high"}; false-correction risk trends ${falseCorrection < 45 ? "low" : falseCorrection < 70 ? "moderate" : "high"}.`} explain={`Higher g_t keeps previous-cycle evidence alive. Higher alpha focuses the correction path. Higher C_ij makes the decision rule more conservative about false corrections.`} revealed={revealed} onReveal={onReveal} onReset={onReset}>
      <SliderControl label="Memory gate g_t" value={demo.quantumGt} min={1} max={10} onChange={value=>setDemo("quantumGt",value)} />
      <SliderControl label="Attention alpha" value={demo.quantumAlpha} onChange={value=>setDemo("quantumAlpha",value)} />
      <SliderControl label="Correction cost C_ij" value={demo.quantumCost} onChange={value=>setDemo("quantumCost",value)} />
      <div className="miniHeat"><i style={{width:`${100-missed}%`}}/><span>previous cycles {"->"} attention {"->"} correction path</span></div>
    </InteractionShell>;
  }
  if (activeId === "minerals") {
    const reliability = Math.round((demo.mineralsM1 + demo.mineralsM2 + demo.mineralsM3 + demo.mineralsM4) / 4);
    const uncertainty = Math.max(12, 100 - reliability + demo.mineralsCost * .18);
    const cells = ["B7", "H3", "E9"].map((cell,index)=>`${cell} ${(reliability + demo.mineralsW - demo.mineralsCost - index * 9) / 2 | 0}`);
    return <InteractionShell title="Rank mineral prospectivity under rare positives" ask="Which cells stay attractive after reliability, class imbalance, cost, and uncertainty are separated?" observe={`Top ranked cells: ${cells.join(", ")}. Uncertainty is ${uncertainty < 35 ? "low" : uncertainty < 60 ? "moderate" : "high"} and shown separately from prospectivity.`} explain="Reliability weights m1-m4 alter the heatmap evidence, w_+ prevents rare deposits from being ignored, and C_survey penalizes expensive field follow-up." revealed={revealed} onReveal={onReveal} onReset={onReset}>
      <SliderControl label="m1 geology" value={demo.mineralsM1} onChange={value=>setDemo("mineralsM1",value)} />
      <SliderControl label="m2 magnetics" value={demo.mineralsM2} onChange={value=>setDemo("mineralsM2",value)} />
      <SliderControl label="m3 gravity" value={demo.mineralsM3} onChange={value=>setDemo("mineralsM3",value)} />
      <SliderControl label="m4 geochemistry" value={demo.mineralsM4} onChange={value=>setDemo("mineralsM4",value)} />
      <SliderControl label="Rare-positive weight w_+" value={demo.mineralsW} onChange={value=>setDemo("mineralsW",value)} />
      <SliderControl label="Survey cost C_survey" value={demo.mineralsCost} onChange={value=>setDemo("mineralsCost",value)} />
    </InteractionShell>;
  }
  if (activeId === "finance") {
    const turnover = Math.max(5, 100 - demo.financeCost + (100 - demo.financeGamma) * .2);
    const tail = Math.max(8, 100 - demo.financeGamma * .55 + demo.financeStress * .25);
    const returnPosture = demo.financeGamma > 70 ? "defensive" : demo.financeCost > 65 ? "low-turnover" : "return-seeking";
    return <InteractionShell title="Hedge by optimizing the whole path" ask="How do cost, risk aversion, and stress weighting change a hedge policy without inventing profit numbers?" observe={`Turnover tendency: ${percentLabel(turnover)}. Tail-risk posture: ${tail < 40 ? "tight" : tail < 65 ? "balanced" : "exposed"}. Expected-return posture: ${returnPosture}.`} explain="c_j makes turnover expensive, gamma punishes bad tail outcomes, and omega_s makes stress paths count more during policy learning." revealed={revealed} onReveal={onReveal} onReset={onReset}>
      <SliderControl label="Transaction cost c_j" value={demo.financeCost} onChange={value=>setDemo("financeCost",value)} />
      <SliderControl label="Risk aversion gamma" value={demo.financeGamma} onChange={value=>setDemo("financeGamma",value)} />
      <SliderControl label="Stress weight omega_s" value={demo.financeStress} onChange={value=>setDemo("financeStress",value)} />
    </InteractionShell>;
  }
  if (activeId === "materials") {
    const denoise = Math.round((demo.materialsLambdaA + demo.materialsLambdaX + demo.materialsLambdaL) / 3);
    const compliance = Math.min(96, demo.materialsGuidance * .7 + denoise * .25);
    const diversity = Math.max(10, 100 - demo.materialsGuidance * .65 + (100 - demo.materialsBeta) * .12);
    return <InteractionShell title="Steer a diffusion generator without collapsing discovery" ask="How do noise, guidance, and component losses trade target compliance against diversity and stability?" observe={`Denoising balance: ${percentLabel(denoise)}. Target compliance: ${percentLabel(compliance)}. Diversity: ${percentLabel(diversity)}. Stability proxy: ${denoise > 55 && demo.materialsBeta < 75 ? "healthier" : "fragile"}.`} explain="beta_t controls corruption difficulty, s controls conditioning strength, and lambda_A/lambda_X/lambda_L keep atoms, coordinates, and lattice from masking each other's failure." revealed={revealed} onReveal={onReveal} onReset={onReset}>
      <SliderControl label="Noise beta_t" value={demo.materialsBeta} onChange={value=>setDemo("materialsBeta",value)} />
      <SliderControl label="Guidance s" value={demo.materialsGuidance} onChange={value=>setDemo("materialsGuidance",value)} />
      <SliderControl label="Atom loss lambda_A" value={demo.materialsLambdaA} onChange={value=>setDemo("materialsLambdaA",value)} />
      <SliderControl label="Coordinate loss lambda_X" value={demo.materialsLambdaX} onChange={value=>setDemo("materialsLambdaX",value)} />
      <SliderControl label="Lattice loss lambda_L" value={demo.materialsLambdaL} onChange={value=>setDemo("materialsLambdaL",value)} />
    </InteractionShell>;
  }
  if (activeId === "math") {
    const prob = demo.mathStrategy === "greedy" ? 78 : demo.mathStrategy === "exploratory" ? 42 : 61;
    const verifier = demo.mathBranch === "lemma" ? "accepted after subgoal split" : demo.mathBranch === "direct" ? "rejected at syntax gate" : "pending with progress";
    return <InteractionShell title="Allocate proof-search budget" ask="Which branch should the model expand when probability and verifier feedback disagree?" observe={`p_theta branch estimate: ${prob}%. Verifier progress: ${verifier}. Attempts available: ${demo.mathBudget}.`} explain="Greedy search follows the most likely branch, exploratory search preserves low-probability options, and balanced search mixes p_theta with verifier progress and branch budget b_k." revealed={revealed} onReveal={onReveal} onReset={onReset}>
      <label className="demoSelect"><span>Proof branch</span><select value={demo.mathBranch} onChange={event=>setDemo("mathBranch",event.target.value)}><option value="direct">direct</option><option value="lemma">lemma</option><option value="cases">cases</option></select></label>
      <SliderControl label="Attempt budget b_k" value={demo.mathBudget} min={1} max={12} onChange={value=>setDemo("mathBudget",value)} />
      <label className="demoSelect"><span>Strategy</span><select value={demo.mathStrategy} onChange={event=>setDemo("mathStrategy",event.target.value)}><option value="greedy">greedy</option><option value="balanced">balanced</option><option value="exploratory">exploratory</option></select></label>
    </InteractionShell>;
  }
  if (activeId === "business") {
    const q = demo.businessCu / (demo.businessCu + demo.businessCo);
    const width = Math.max(15, 88 - demo.businessHorizon * .35 + Math.abs(demo.businessCu - demo.businessCo) * 2);
    return <InteractionShell title="Convert a forecast distribution into inventory" ask="Which quantile should the planner order when shortage and overstock costs are asymmetric?" observe={`Critical fractile q = C_u/(C_u+C_o) = ${q.toFixed(2)}. Uncertainty width for ${demo.businessProduct}: ${percentLabel(width)}.`} explain="DeepAR learns the distribution. The business decision then chooses a point on that distribution using shortage cost C_u, overstock cost C_o, horizon weight lambda_h, and item behavior." revealed={revealed} onReveal={onReveal} onReset={onReset}>
      <label className="demoSelect"><span>Product</span><select value={demo.businessProduct} onChange={event=>setDemo("businessProduct",event.target.value)}><option>Seasonal item</option><option>Slow mover</option><option>Promotion item</option></select></label>
      <SliderControl label="Shortage cost C_u" value={demo.businessCu} min={1} max={10} onChange={value=>setDemo("businessCu",value)} />
      <SliderControl label="Overstock cost C_o" value={demo.businessCo} min={1} max={10} onChange={value=>setDemo("businessCo",value)} />
      <SliderControl label="Horizon weight lambda_h" value={demo.businessHorizon} onChange={value=>setDemo("businessHorizon",value)} />
    </InteractionShell>;
  }
  const reach = demo.graphSteps * (demo.graphEdgeView === "multiscale" ? 8 : 5);
  return <InteractionShell title="Pass messages on a spherical weather graph" ask="How far should weather information travel before rollout error and oversmoothing become concerns?" observe={`Information reach: ${reach} conceptual units. Oversmoothing risk: ${demo.graphSteps > 12 ? "high" : demo.graphSteps > 7 ? "moderate" : "low"}. Rollout: ${demo.graphRollout} days. Latitude weighting is ${demo.graphLatitude ? "on" : "off"}.`} explain="Message steps expand spatial reach, local versus multiscale edges change communication range, latitude weighting changes the loss contribution, and rollout length exposes forecast feedback error." revealed={revealed} onReveal={onReveal} onReset={onReset}>
    <SliderControl label="Message steps" value={demo.graphSteps} min={2} max={16} onChange={value=>setDemo("graphSteps",value)} />
    <label className="demoSelect"><span>Edge view</span><select value={demo.graphEdgeView} onChange={event=>setDemo("graphEdgeView",event.target.value)}><option value="local">local</option><option value="multiscale">multiscale</option></select></label>
    <label className="demoCheck"><input type="checkbox" checked={demo.graphLatitude} onChange={event=>setDemo("graphLatitude",event.target.checked)} /> Latitude weighting</label>
    <SliderControl label="Rollout days" value={demo.graphRollout} min={1} max={10} onChange={value=>setDemo("graphRollout",value)} />
  </InteractionShell>;
}

function SupplementCard({lesson,demo,setDemo,revealed,onReveal,onReset}:{lesson:Supplement;demo:DemoState;setDemo:<K extends DemoKey>(key:K,value:DemoState[K])=>void;revealed:boolean;onReveal:()=>void;onReset:()=>void}) {
  return <article id={lesson.id} className={`supplementCard ${lesson.accent}`}>
    <ObjectiveBanner info={lesson.objectiveInfo} />
    <div className="supplementIntro">
      <div><span className="cardLabel">GOAL</span><h3>{lesson.name}</h3><p>{lesson.objectiveInfo.purpose}</p></div>
      <div><span className="cardLabel">BOTTLENECK</span><p>{lesson.bottleneck}</p></div>
      <div><span className="cardLabel">ARCHITECTURE MECHANISM</span><p>{lesson.mechanism}</p><Latex>{lesson.equation}</Latex></div>
    </div>
    <SupplementInteraction lesson={lesson} demo={demo} setDemo={setDemo} revealed={revealed} onReveal={onReveal} onReset={onReset} />
    <div className="supplementWeights"><span className="cardLabel">IMPORTANT WEIGHTS</span>{lesson.weights.map(weight=><div key={weight.type}><b>{weight.type}</b><Latex>{weight.symbol}</Latex><p>{weight.role}</p></div>)}</div>
    <div className="primarySourceCard supplementSource">
      <span>PRIMARY PAPER</span>
      <div><b>PRIMARY PAPER</b><a href={lesson.url} target="_blank" rel="noreferrer">{lesson.paper}</a></div>
      <div><b>ORGANIZATION</b><p>{lesson.organization}</p></div>
      <div><b>YEAR</b><p>{lesson.year}</p></div>
      <div><b>REPORTED RESULT</b><p>{lesson.result}</p></div>
      <div><b>LIMITATION</b><p>{lesson.limitation}</p></div>
    </div>
  </article>;
}

function SupplementInteraction({lesson,demo,setDemo,revealed,onReveal,onReset}:{lesson:Supplement;demo:DemoState;setDemo:<K extends DemoKey>(key:K,value:DemoState[K])=>void;revealed:boolean;onReveal:()=>void;onReset:()=>void}) {
  if (lesson.id === "supplement-vanilla-rnn") {
    const influence = demo.rnnMemory * (demo.rnnStep + 1) / 3;
    return <InteractionShell title="Step through recurrent memory" ask="How much should old inputs influence the current hidden state?" observe={`Current step: x_${demo.rnnStep === 0 ? "t-2" : demo.rnnStep === 1 ? "t-1" : "t"}. Memory influence is ${influence > 70 ? "long" : influence > 40 ? "medium" : "short"}.`} explain="Higher recurrent strength keeps old signals visible but also increases vanishing/exploding influence risk." revealed={revealed} onReveal={onReveal} onReset={onReset}>
      <SliderControl label="Memory strength" value={demo.rnnMemory} onChange={value=>setDemo("rnnMemory",value)} />
      <SliderControl label="Step index" value={demo.rnnStep} min={0} max={2} onChange={value=>setDemo("rnnStep",value)} />
    </InteractionShell>;
  }
  if (lesson.id === "supplement-lstm") {
    const activeGate = demo.lstmGate === "forget" ? demo.lstmForget : demo.lstmGate === "input" ? demo.lstmInput : demo.lstmOutput;
    return <InteractionShell title="Gate the cell state" ask="Should the model remember, write, or expose information right now?" observe={`${demo.lstmGate} gate selected at ${activeGate}. Stale-memory risk rises with high forget; premature-forgetting risk rises with low forget and low input.`} explain="The forget, input, and output gates separate memory retention from update and exposure." revealed={revealed} onReveal={onReveal} onReset={onReset}>
      <label className="demoSelect"><span>Selected gate</span><select value={demo.lstmGate} onChange={event=>setDemo("lstmGate",event.target.value)}><option value="forget">forget</option><option value="input">input</option><option value="output">output</option></select></label>
      <SliderControl label="f_t forget" value={demo.lstmForget} onChange={value=>setDemo("lstmForget",value)} />
      <SliderControl label="i_t input" value={demo.lstmInput} onChange={value=>setDemo("lstmInput",value)} />
      <SliderControl label="o_t output" value={demo.lstmOutput} onChange={value=>setDemo("lstmOutput",value)} />
    </InteractionShell>;
  }
  if (lesson.id === "supplement-gru") {
    const replacement = demo.gruUpdate;
    return <InteractionShell title="Compare compact gated memory" ask="How much should the GRU keep from the previous state versus the candidate?" observe={`Previous retention: ${percentLabel(100-replacement)}. Candidate replacement: ${percentLabel(replacement)}. Reset gate r_t controls how much history shapes the candidate.`} explain="GRU combines LSTM-like control into update and reset gates, reducing moving parts while preserving gated memory." revealed={revealed} onReveal={onReveal} onReset={onReset}>
      <SliderControl label="Update z_t" value={demo.gruUpdate} onChange={value=>setDemo("gruUpdate",value)} />
      <SliderControl label="Reset r_t" value={demo.gruReset} onChange={value=>setDemo("gruReset",value)} />
    </InteractionShell>;
  }
  if (lesson.id === "supplement-actor-critic") {
    const advantage = demo.actorReward + demo.actorGamma * .2 - 50;
    return <InteractionShell title="Let the critic score the actor" ask="Was the chosen action better or worse than the critic expected?" observe={`Advantage signal is ${advantage >= 0 ? "positive" : "negative"} (${advantage.toFixed(1)} conceptual units). Actor update gets ${advantage >= 0 ? "reinforced" : "reduced"}.`} explain="The actor proposes an action; the critic estimates value; reward and gamma produce advantage; beta preserves exploration." revealed={revealed} onReveal={onReveal} onReset={onReset}>
      <SliderControl label="Actor action" value={demo.actorAction} onChange={value=>setDemo("actorAction",value)} />
      <SliderControl label="Reward" value={demo.actorReward} onChange={value=>setDemo("actorReward",value)} />
      <SliderControl label="Exploration beta" value={demo.actorBeta} onChange={value=>setDemo("actorBeta",value)} />
      <SliderControl label="Future reward gamma" value={demo.actorGamma} onChange={value=>setDemo("actorGamma",value)} />
    </InteractionShell>;
  }
  if (lesson.id === "supplement-llm-guided-formal-search") {
    const verified = demo.formalRank > 70 && demo.formalBudget > 4;
    return <InteractionShell title="Rank, verify, prune, retry" ask="How should a formal-search system spend attempts across branches?" observe={`${demo.formalBranch} receives ${demo.formalBudget} attempts. Verifier outcome: ${verified ? "accepted branch" : "continue search or prune"}.`} explain="Model probability ranks branches, but verifier outcome is the gate that determines whether a branch becomes evidence." revealed={revealed} onReveal={onReveal} onReset={onReset}>
      <label className="demoSelect"><span>Branch</span><select value={demo.formalBranch} onChange={event=>setDemo("formalBranch",event.target.value)}><option>lemma path</option><option>direct path</option><option>case split</option></select></label>
      <SliderControl label="Model branch rank" value={demo.formalRank} onChange={value=>setDemo("formalRank",value)} />
      <SliderControl label="Attempt budget" value={demo.formalBudget} min={1} max={10} onChange={value=>setDemo("formalBudget",value)} />
    </InteractionShell>;
  }
  const retained = demo.sslMode === "pretraining" ? "encoder and decoder active" : "encoder retained; decoder discarded; task head trained";
  return <InteractionShell title="Mask, reconstruct, then fine-tune" ask="How much input should be hidden during pretraining, and what is kept for the supervised task?" observe={`Masking ${demo.sslMask}% means visible patches guide the encoder while hidden areas become the reconstruction target. Mode: ${retained}.`} explain="Pretraining learns representations from missing structure. Fine-tuning keeps the encoder and replaces or adapts the task-specific head." revealed={revealed} onReveal={onReveal} onReset={onReset}>
    <SliderControl label="Masking percent" value={demo.sslMask} min={25} max={75} onChange={value=>setDemo("sslMask",value)} />
    <label className="demoSelect"><span>Mode</span><select value={demo.sslMode} onChange={event=>setDemo("sslMode",event.target.value)}><option value="pretraining">pretraining</option><option value="fine-tuning">fine-tuning</option></select></label>
  </InteractionShell>;
}

export default function Home() {
  const [activeId,setActiveId] = useState("quantum");
  const [stage,setStage] = useState(0);
  const [depth,setDepth] = useState<"plain"|"technical">("plain");
  const [guide,setGuide] = useState(55);
  const [messageSteps,setMessageSteps] = useState(8);
  const [presentationMode,setPresentationMode] = useState(false);
  const [demo,setDemoState] = useState<DemoState>(defaultDemo);
  const [revealed,setRevealed] = useState<Record<string, boolean>>({});
  const [libraryQuery,setLibraryQuery] = useState("");
  const [libraryFilters,setLibraryFilters] = useState<LibraryFilters>(defaultLibraryFilters);
  const [visibleRegistryCount,setVisibleRegistryCount] = useState(24);
  const active = useMemo(()=>sectors.find(s=>s.id===activeId)!,[activeId]);
  const activeIndex = sectors.findIndex(s=>s.id===activeId);
  const registryCounts = useMemo(()=>({
    total: registry.length,
    complete: registry.filter(r=>r.coverage_status==="COMPLETE").length,
    partial: registry.filter(r=>r.coverage_status==="PARTIAL").length,
    overlapping: registry.filter(r=>r.coverage_status==="OVERLAPPING").length,
    library: registry.filter(r=>r.coverage_status==="LIBRARY ONLY").length,
  }),[]);
  const audienceRegistry = useMemo(()=>registry.filter(entry=>entry.coverage_status==="COMPLETE"),[]);
  const libraryOptions = useMemo(()=>({
    family: uniqueSorted(audienceRegistry.map(r=>r.architecture_family)),
    sector: uniqueSorted(audienceRegistry.flatMap(r=>r.sector)),
    bottleneck: uniqueSorted(audienceRegistry.flatMap(r=>r.dominant_bottleneck)),
    paradigm: uniqueSorted(audienceRegistry.flatMap(r=>r.learning_paradigm)),
    dataType: uniqueSorted(audienceRegistry.flatMap(r=>r.data_type))
  }),[audienceRegistry]);
  const filteredRegistry = useMemo(()=>{
    const query = libraryQuery.trim().toLowerCase();
    return audienceRegistry
      .filter(entry => {
        const searchParts = [
          entry.canonical_name,
          ...entry.aliases,
          entry.architecture_family,
          entry.chapter_group,
          ...entry.sector,
          ...entry.dominant_bottleneck,
          ...entry.weighting_mechanisms,
          entry.featured_organization,
          entry.primary_paper.title,
          entry.primary_paper.year,
          entry.primary_paper.url
        ].map(value=>value.toLowerCase());
        const searchText = searchParts.join(" ");
        const queryTerms = query.split(/\s+/).filter(Boolean);
        const matchesQuery = !query || queryTerms.every(term => {
          if (term.length <= 3) {
            return searchParts.some(part => part === term || part.split(/[^a-z0-9]+/).includes(term));
          }
          return searchText.includes(term);
        });
        const matchesStatus = entry.coverage_status === "COMPLETE";
        const matchesFamily = libraryFilters.family === "ALL" || entry.architecture_family === libraryFilters.family;
        const matchesSector = libraryFilters.sector === "ALL" || entry.sector.includes(libraryFilters.sector);
        const matchesBottleneck = libraryFilters.bottleneck === "ALL" || entry.dominant_bottleneck.includes(libraryFilters.bottleneck);
        const matchesParadigm = libraryFilters.paradigm === "ALL" || entry.learning_paradigm.includes(libraryFilters.paradigm);
        const matchesData = libraryFilters.dataType === "ALL" || entry.data_type.includes(libraryFilters.dataType);
        return matchesQuery && matchesStatus && matchesFamily && matchesSector && matchesBottleneck && matchesParadigm && matchesData;
      })
      .sort((a,b)=>(coverageRank[a.coverage_status] ?? 9) - (coverageRank[b.coverage_status] ?? 9) || a.architecture_id.localeCompare(b.architecture_id));
  },[audienceRegistry,libraryQuery,libraryFilters]);
  const visibleRegistryCards = filteredRegistry.slice(0,visibleRegistryCount);
  const filtersActive = libraryQuery.trim().length>0 || Object.entries(libraryFilters).some(([key,value])=>key !== "status" && value!=="ALL");
  const updateLibraryFilter = (key: LibraryFilterKey, value: string) => {
    setLibraryFilters(current=>({...current,[key]:value}));
    setVisibleRegistryCount(24);
  };
  const clearLibraryFilters = () => {
    setLibraryQuery("");
    setLibraryFilters(defaultLibraryFilters);
    setVisibleRegistryCount(24);
  };
  const selectSector = (id:string) => { setActiveId(id); setStage(0); document.getElementById("chapter")?.scrollIntoView({behavior:"smooth",block:"start"}); };
  const updateDemo = <K extends DemoKey>(key:K,value:DemoState[K]) => setDemoState(current=>({...current,[key]:value}));
  const resetDemo = (id:string) => {
    const keys = flagshipKeys[id] || supplementKeys[id] || [];
    setDemoState(current=>keys.reduce((next,key)=>({...next,[key]:defaultDemo[key]}),current));
    setRevealed(current=>({...current,[id]:false}));
  };
  const toggleReveal = (id:string) => setRevealed(current=>({...current,[id]:!current[id]}));
  const jumpCase = (delta:number) => {
    const next = sectors[(activeIndex + delta + sectors.length) % sectors.length];
    selectSector(next.id);
  };

  return <main className={presentationMode ? "presentationMode" : ""}>
    <header className="topbar">
      <a className="brand" href="#top"><span className="brandMark">ML</span><span>Architecture Field Manual</span></a>
      <nav aria-label="Primary navigation"><a href="#method">Method</a><a href="#chapters">Chapters</a><a href="#library">Library</a><a href="#weights">Weight lab</a><a href="#sources">Sources</a></nav>
      <button className="modeSwitch" type="button" aria-pressed={presentationMode} onClick={()=>setPresentationMode(value=>!value)}><span>{presentationMode ? "Presentation on" : "Presentation off"}</span><b aria-hidden="true" /></button>
      <span className="edition">DOE fellowship · field edition</span>
    </header>

    <section id="top" className="hero">
      <div className="heroCopy">
        <p className="eyebrow">An interactive instruction manual</p>
        <h1>Architecture follows the <em>bottleneck.</em></h1>
        <p className="dek">The same neural network is not right for every problem. Learn to move from a real decision → to the data constraint → to the architecture → to the layers of weighting that make it useful.</p>
        <div className="heroActions"><a className="primary" href="#method">Start with the reasoning <span>down</span></a><a className="secondary" href="#chapter" onClick={()=>selectSector("graphcast")}>Open GraphCast</a><span className="reading">13 completed architecture lessons: 7 flagship cases + 6 complete supplements</span></div>
      </div>
      <div className="heroVisual" aria-label="Decision to architecture reasoning loop">
        <div className="orbit orbit1"><span>01</span><b>Decision</b><small>What action must improve?</small></div>
        <div className="orbit orbit2"><span>02</span><b>Bottleneck</b><small>Why does the obvious method fail?</small></div>
        <div className="orbit orbit3"><span>03</span><b>Architecture</b><small>What information flow fits?</small></div>
        <div className="orbit orbit4"><span>04</span><b>Weights</b><small>What does “important” mean?</small></div>
        <div className="centerPulse">ML<br/><small>is a learned decision system</small></div>
      </div>
    </section>

    <section id="method" className="method section">
      <div className="sectionIntro"><p className="eyebrow">The reusable method</p><h2>Do not begin with a model name.</h2><p>Begin with the failure of the current decision process. The architecture is a response to that failure.</p></div>
      <div className="reasoningRail">
        {[['1','Objective','State the action, not “use AI.”'],['2','Evidence','List what is known at decision time.'],['3','Bottleneck','Name scarcity, scale, noise, time, or physics.'],['4','Architecture','Choose an information-flow bias.'],['5','Weights','Define learning and decision priorities.'],['6','Result','Measure the operational outcome.']].map((x,i)=><div className="reason" key={x[0]}><span>{x[0]}</span><b>{x[1]}</b><small>{x[2]}</small>{i<5&&<i>→</i>}</div>)}
      </div>
      <aside className="callout"><b>The central distinction</b><p>A prediction answers “what is likely?” A decision pipeline answers “what should we do, given uncertainty and cost?” High-impact ML connects both.</p></aside>
    </section>

    <section id="weights" className="weights section darkSection">
      <div className="sectionIntro"><p className="eyebrow">Weights on weights on weights</p><h2>“Weights” means five different things.</h2><p>Confusion disappears when you separate what the model learns from what people choose.</p></div>
      <div className="weightStack">{weightLayers.map((w,i)=><article key={w.n} style={{'--i':i} as React.CSSProperties}><span>{w.n}</span><div><b>{w.title}</b><p>{w.text}</p></div><code>{w.sym}</code></article>)}</div>
      <div className="equationStrip"><span>data</span><i>ωᵢ</i><b>→</b><span>model</span><i>θ, α</i><b>→</b><span>loss</span><i>λ</i><b>→</b><span>prediction</span><i>p</i><b>→</b><span>decision</span><i>C</i></div>
    </section>

    <section id="chapters" className="chapters section">
      <div className="sectionIntro"><p className="eyebrow">Seven cutting-edge cases</p><h2>Same questions. Different information flow.</h2><p>Select a sector, then click through its pipeline. Use the depth switch when the reasoning is clear.</p></div>
      <div className="sectorTabs" role="tablist">{sectors.map(s=><button role="tab" aria-selected={activeId===s.id} className={activeId===s.id?"active":""} key={s.id} onClick={()=>selectSector(s.id)}><span>{s.number}</span><b>{s.field}</b><small>{s.architecture}</small></button>)}</div>
    </section>

    <section id="library" className="library section">
      <div className="sectionIntro"><p className="eyebrow">Architecture registry</p><h2>13 completed architecture lessons.</h2><p>The audience view shows only complete lessons: seven flagship cases and six complete supplements. Incomplete and overlapping records stay hidden from this interface.</p></div>
      <div className="registryStats" aria-label="Registry coverage summary">
        <article><span>Visible</span><b>{registryCounts.complete}</b><small>completed architecture lessons</small></article>
        <article><span>Flagship</span><b>7</b><small>presentation-ready cases</small></article>
        <article><span>Supplements</span><b>6</b><small>complete supporting lessons</small></article>
        <article><span>Audience filter</span><b>ON</b><small>only COMPLETE records appear</small></article>
      </div>
      <details className="developerNote">
        <summary>Developer registry note</summary>
        <p>Hidden from the audience card grid: {registryCounts.library} library-only records, {registryCounts.overlapping} overlapping records, and {registryCounts.partial} partial records. Total records retained in data: {registryCounts.total}.</p>
      </details>
      <div className="librarySearch">
        <label htmlFor="architecture-search">Search completed lessons</label>
        <input id="architecture-search" value={libraryQuery} onChange={event=>{setLibraryQuery(event.target.value);setVisibleRegistryCount(24);}} placeholder="Try GraphCast, GAT, masked, pressure, energy, DeepAR..." />
      </div>
      <div className="filterGrid" aria-label="Registry filters">
        <label>Architecture family<select value={libraryFilters.family} onChange={event=>updateLibraryFilter("family",event.target.value)}><option value="ALL">All families</option>{libraryOptions.family.map(value=><option key={value} value={value}>{value}</option>)}</select></label>
        <label>Sector<select value={libraryFilters.sector} onChange={event=>updateLibraryFilter("sector",event.target.value)}><option value="ALL">All sectors</option>{libraryOptions.sector.map(value=><option key={value} value={value}>{value}</option>)}</select></label>
        <label>Bottleneck<select value={libraryFilters.bottleneck} onChange={event=>updateLibraryFilter("bottleneck",event.target.value)}><option value="ALL">All bottlenecks</option>{libraryOptions.bottleneck.map(value=><option key={value} value={value}>{value}</option>)}</select></label>
        <label>Learning paradigm<select value={libraryFilters.paradigm} onChange={event=>updateLibraryFilter("paradigm",event.target.value)}><option value="ALL">All paradigms</option>{libraryOptions.paradigm.map(value=><option key={value} value={value}>{value}</option>)}</select></label>
        <label>Data type<select value={libraryFilters.dataType} onChange={event=>updateLibraryFilter("dataType",event.target.value)}><option value="ALL">All data types</option>{libraryOptions.dataType.map(value=><option key={value} value={value}>{value}</option>)}</select></label>
      </div>
      <div className="libraryMeta" aria-live="polite">
        <p>Showing {visibleRegistryCards.length} of {filteredRegistry.length} matching completed lessons.</p>
        <button className="clearButton" disabled={!filtersActive} onClick={clearLibraryFilters}>Clear filters</button>
      </div>
      <div className="libraryGrid">
        {visibleRegistryCards.map(entry=>{
          const chapterTarget = chapterTargets[entry.chapter_group];
          const supplementTarget = supplementTargets[entry.chapter_group];
          return <article key={entry.architecture_id}>
          <span>Complete lesson</span>
          <h3>{entry.canonical_name}</h3>
          <p>{entry.architecture_family}</p>
          {entry.aliases.length>0&&<small>Aliases: {entry.aliases.join(", ")}</small>}
          <small>{chapterNames[entry.chapter_group] || "Searchable library card"}</small>
          {entry.weighting_mechanisms.length>0&&<div>{entry.weighting_mechanisms.slice(0,3).map(w=><b key={w}>{w}</b>)}</div>}
          {chapterTarget
            ? <button className="openChapterButton" onClick={()=>selectSector(chapterTarget)}>Open flagship case</button>
            : <button className="openChapterButton" onClick={()=>document.getElementById(supplementTarget || "supplements")?.scrollIntoView({behavior:"smooth",block:"start"})}>Open supplement</button>}
        </article>})}
      </div>
      {filteredRegistry.length===0&&<div className="emptyState"><b>No architecture records match those filters.</b><p>Clear one filter or search a broader architecture family, bottleneck, sector, organization, or paper title.</p></div>}
      {visibleRegistryCards.length<filteredRegistry.length&&<button className="showMore" onClick={()=>setVisibleRegistryCount(count=>count+24)}>Show more records</button>}
    </section>

    <section id="chapter" className={`chapter ${active.accent}`}>
      <div className="chapterHeader">
        <div><p className="eyebrow">Case {active.number} · {active.company}</p><h2>{active.name}</h2><p className="chapterObjective"><span>Main objective</span>{active.objective}</p></div>
        <div className="paperStack">
          <a className="paperLink" href={active.url} target="_blank" rel="noreferrer"><span>Primary paper ↗</span><b>{active.paper}</b></a>
          {active.openUrl&&<a className="paperLink openVersion" href={active.openUrl} target="_blank" rel="noreferrer"><span>Accessible version ↗</span><b>arXiv open-access paper</b></a>}
        </div>
      </div>

      {presentationMode&&<div className="presentationControls" aria-label="Presentation case controls">
        <button onClick={()=>jumpCase(-1)}>Previous Case</button>
        <b>Case {activeIndex + 1} of 7</b>
        <button onClick={()=>jumpCase(1)}>Next Case</button>
      </div>}

      <ObjectiveBanner info={objectiveInfo[active.id]} />

      <div className="lessonOrder" aria-label="Lesson structure">
        {["Goal","Bottleneck","Model Input","Architecture Mechanism","Model Output","Operational Decision or Use","Interactive Demonstration","Important Weights","Reported Result","Primary Paper","Limitation"].map(item=><span key={item}>{item}</span>)}
      </div>

      <div className="reasonCards">
        <article><span>THE DECISION</span><p>{active.decision}</p></article>
        <article><span>THE BOTTLENECK</span><p>{active.bottleneck}</p></article>
        <article><span>THE HYPOTHESIS</span><p>{active.hypothesis}</p></article>
      </div>

      {active.id==='graphcast'&&<aside className="graphcastUniqueness"><b>This chapter is different because it teaches how message passing represents a curved, globally connected physical system without treating Earth as a flat image.</b><p>Weather observations become an analyzed global state; the model forecasts future fields; downstream teams translate those fields into warnings, power-grid choices, route changes, or preparation decisions; the real-world consequence depends on that operational layer.</p></aside>}

      {(active.architectureFamily || active.evidence) && <div className="metaGrid">
        <article><span>ARCHITECTURE FAMILY</span><b>{active.architectureFamily}</b><small>{active.paradigm}</small></article>
        <article><span>DATA AT DECISION TIME</span><p>{active.evidence}</p></article>
        <article><span>TRAINING DATA SHAPE</span><p>{active.dataSummary}</p></article>
        <article><span>OUTPUT</span><b>{active.outputType}</b><small>{active.dataType}</small></article>
      </div>}

      <div className="depthBar"><div><b>Architecture explorer</b><span>Click each stage to follow the information.</span></div><div className="toggle" role="group" aria-label="Explanation depth"><button className={depth==='plain'?'on':''} onClick={()=>setDepth('plain')}>Plain language</button><button className={depth==='technical'?'on':''} onClick={()=>setDepth('technical')}>Technical weights</button></div></div>

      <div className="pipeline" role="list" aria-label={`${active.name} pipeline`}>
        {active.pipeline.map((p,i)=><button role="listitem" key={p.label} className={stage===i?'selected':''} onClick={()=>setStage(i)}><span>{String(i+1).padStart(2,'0')}</span><b>{p.label}</b>{i<active.pipeline.length-1&&<i>→</i>}</button>)}
      </div>
      <div className="stageExplain"><span className="stageIndex">{String(stage+1).padStart(2,'0')}</span><div><p>{depth==='plain'?active.pipeline[stage].plain:active.pipeline[stage].weight}</p><small>{depth==='plain'?'WHY THIS STAGE EXISTS':'WHERE THE WEIGHTING HAPPENS'}</small></div><StageBadge active={active} stage={stage} /></div>

      <ArchitectureVisual active={active} stage={stage} />

      <FlagshipInteraction activeId={active.id} demo={demo} setDemo={updateDemo} revealed={Boolean(revealed[active.id])} onReveal={()=>toggleReveal(active.id)} onReset={()=>resetDemo(active.id)} />

      {active.id==='graphcast'&&<div className="graphcastDeep">
        <article className="objectiveVisual" aria-label="GraphCast objective flow from observations to consequence">
          <span className="cardLabel">OBJECTIVE VISUAL</span>
          <h3>Forecasts inform action; they do not choose the action alone.</h3>
          <div className="flowDiagram">{graphcastObjectiveFlow.map((item,i)=><div className="flowStep" key={item[0]}><b>{item[0]}</b><p>{item[1]}</p>{i<graphcastObjectiveFlow.length-1&&<i>→</i>}</div>)}</div>
        </article>

        <article aria-label="GraphCast bottleneck comparison">
          <span className="cardLabel">BOTTLENECK VISUAL</span>
          <h3>Three ways to represent global weather</h3>
          <div className="compareStrip">{graphcastBottlenecks.map(item=><div key={item[0]}><b>{item[0]}</b><p>{item[1]}</p></div>)}</div>
          <small className="sourceNote">No universal winner: NWP, transformers, graph models, and operators make different tradeoffs in physics, compute, uncertainty, and geometry.</small>
        </article>

        <article aria-label="GraphCast data methodology">
          <span className="cardLabel">DATA METHODOLOGY</span>
          <h3>How the training examples are built</h3>
          <div className="methodologyGrid">{graphcastMethodology.map(item=><div key={item[0]}><b>{item[0]}</b><p>{item[1]}</p></div>)}</div>
          <div className="timeFlow" aria-label="Autoregressive time relationship">
            <span>state at t-6h</span><b>+</b><span>state at t</span><b>→</b><span>predict t+6h</span><b>→</b><span>feed back</span><b>→</b><span>continue toward day 10</span>
          </div>
        </article>

        <article aria-label="GraphCast architecture pipeline details">
          <span className="cardLabel">ARCHITECTURE PIPELINE VISUAL</span>
          <h3>Every stage has learned weights and human-selected choices.</h3>
          <div className="pipelineDeep">{graphcastPipelineDeep.map(step=><div key={step.tech}><b>{step.plain}</b><code>{step.tech}</code><p><strong>Input:</strong> {step.input}</p><p><strong>Output:</strong> {step.output}</p><p><strong>Learned:</strong> {step.learned}</p><p><strong>Selected:</strong> {step.human}</p><small>{step.failure}</small></div>)}</div>
        </article>

        <article aria-label="GraphCast tensor and representation changes">
          <span className="cardLabel">TENSOR AND REPRESENTATION VISUAL</span>
          <h3>The same weather state changes representation as it moves through the model.</h3>
          <div className="tensorFlow">{graphcastRepresentation.map((item,i)=><div key={item[0]}><b>{item[0]}</b><code>{item[1]}</code><p>{item[2]}</p>{i<graphcastRepresentation.length-1&&<i>→</i>}</div>)}</div>
        </article>

        <article aria-label="GraphCast weight locations">
          <span className="cardLabel">WEIGHT-LOCATION VISUAL</span>
          <h3>Where each kind of weight enters</h3>
          <div className="weightMap">{graphcastWeightMap.map(item=><div key={item[0]}><b>{item[0]}</b><code>{item[1]}</code><span>{item[2]}</span></div>)}</div>
        </article>

        <article aria-label="GraphCast training loop">
          <span className="cardLabel">TRAINING-LOOP VISUAL</span>
          <h3>Training can compare to future truth; inference cannot.</h3>
          <div className="trainingLoop">{graphcastTrainingLoop.map((item,i)=><div key={item[0]}><b>{item[0]}</b><p>{item[1]}</p>{i<graphcastTrainingLoop.length-1&&<i>→</i>}</div>)}</div>
        </article>

        <article aria-label="GraphCast failure modes">
          <span className="cardLabel">FAILURE-MODE VISUAL</span>
          <h3>Four ways the architecture can fail</h3>
          <div className="failureGrid">{graphcastFailures.map(item=><div key={item[0]}><b>{item[0]}</b><p>{item[1]}</p></div>)}</div>
        </article>

        <article aria-label="GraphCast reported results">
          <span className="cardLabel">RESULTS VISUAL</span>
          <h3>Confirmed paper values, without invented bars.</h3>
          <div className="resultFacts">{graphcastResultFacts.map(item=><div key={item[0]}><b>{item[0]}</b><span>{item[1]}</span></div>)}</div>
          <a className="sourceNote" href="https://arxiv.org/abs/2212.12794" target="_blank" rel="noreferrer">Source: GraphCast primary paper, arXiv open version.</a>
        </article>

        <article aria-label="GraphCast architecture comparison">
          <span className="cardLabel">ARCHITECTURE COMPARISON VISUAL</span>
          <h3>GraphCast is one tradeoff, not a universal winner.</h3>
          <div className="comparisonTable">
            <div className="comparisonHead"><span>Approach</span><span>Representation</span><span>Long-range communication</span><span>Best use</span></div>
            {graphcastComparisons.map(([name,representation,longRange,sphere,physics,compute,uncertainty,strength,limit,prefer])=><div className="comparisonRow" key={name}>
              <b>{name}</b><span>{representation}</span><span>{longRange}</span><span>{prefer}</span>
              <small>Geometry: {sphere}. Physics: {physics}. Compute: {compute}. Uncertainty: {uncertainty}. Strength: {strength}. Limitation: {limit}.</small>
            </div>)}
          </div>
        </article>
      </div>}

      {active.id==='graphcast'&&<div className="graphLab">
        <div>
          <span className="cardLabel">GRAPHCAST VISUAL</span>
          <h3>Weather becomes messages on an Earth mesh.</h3>
          <p>A grid snapshot is encoded onto a multiresolution graph, message-passing steps move information across neighboring mesh regions, and the decoded forecast is fed back in for the next six-hour step.</p>
          <p className="sliderNote">Illustrative teaching model--not a reproduction of GraphCast&apos;s experimental system.</p>
          <div className="forecastFacts">
            <b>0.25 degree global grid</b><b>10-day rollout</b><b>Under one minute inference</b>
          </div>
        </div>
        <div className="meshPanel" aria-label="GraphCast message passing concept">
          <div className="meshStage gridIn">grid t-6h</div>
          <div className="meshStage gridNow">grid t</div>
          <div className="earthMesh">
            {Array.from({length:12}).map((_,i)=><i key={i} style={{"--n":i,"--reach":messageSteps} as React.CSSProperties}/>)}
            <b>{messageSteps}</b>
            <span>message steps</span>
          </div>
          <div className="meshStage gridOut">grid t+6h</div>
          <div className="meshStage rollout">rollout</div>
        </div>
        <div className="sliderWrap graphSlider">
          <p id="message-slider-note">Increasing conceptual message-passing depth expands information reach, but excessive or poorly designed aggregation can contribute to oversmoothing. Actual behavior depends on architecture, training, resolution, connectivity, and learned parameters; this slider does not reproduce reported GraphCast metrics.</p>
          <input aria-label="Conceptual message-passing depth" aria-describedby="message-slider-note" type="range" min="2" max="16" value={messageSteps} onChange={e=>setMessageSteps(Number(e.target.value))}/>
          <div className="sliderLabels"><span>local exchange</span><b>{messageSteps} steps</b><span>farther reach</span></div>
          <div className="outcomeBars">
            <label>Information reach<i style={{width:`${20+messageSteps*4.5}%`}}/><em>{messageSteps<6?"local":messageSteps<12?"broader":"global tendency"}</em></label>
            <label>Oversmoothing tendency<i style={{width:`${messageSteps<6?28:messageSteps<12?58:82}%`}}/><em>{messageSteps<6?"low":messageSteps<12?"moderate":"high conceptual risk"}</em></label>
          </div>
        </div>
      </div>}

      <details className="weightCollapse" open={!presentationMode}>
        <summary>Important weights</summary>
        <div className="weightTable"><div className="tableHead"><span>Weight layer</span><span>Symbol</span><span>What it prioritizes</span><span>Failure if misweighted</span></div>{active.weights.map(w=><div className="tableRow" key={w.type}><b>{w.type}</b><code>{w.symbol}</code><span>{w.role}</span><span>{w.failure}</span></div>)}</div>
      </details>

      {active.id==='graphcast'&&<div className="graphcastWeights">
        <div className="weightDetailsHead"><span className="cardLabel">DETAILED GRAPHCAST WEIGHTS</span><h3>Learned parameters, dynamic calculations, objective weights, data choices, and decision costs are different things.</h3></div>
        <div className="weightDetails">{graphcastWeightDetails.map(([symbol,where,kind,staticness,up,down,tooHigh,tooLow])=><article key={symbol}>
          <code>{symbol}</code><b>{where}</b><p><strong>Kind:</strong> {kind}</p><p><strong>Static or input-dependent:</strong> {staticness}</p><p><strong>Increasing:</strong> {up}</p><p><strong>Decreasing:</strong> {down}</p><small>Too high: {tooHigh}. Too low: {tooLow}.</small>
        </article>)}</div>
        <details className="equationDetails">
          <summary>Step through the GraphCast loss equation</summary>
          <div className="equationExplain">
            <Latex>{active.loss}</Latex>
            {graphcastEquationSteps.map(([symbol,text])=><p key={symbol}><b>{symbol}</b> {text}</p>)}
            <p><b>Forecast-training objective:</b> minimize weighted forecast error against verifying ERA5 future states; gradients update theta.</p>
            <p><b>Operational decision objective:</b> convert a forecast into an action under costs such as missed warnings, false alarms, energy-grid imbalance, or transportation disruption. Those costs are downstream and are not necessarily part of GraphCast&apos;s training loss.</p>
          </div>
        </details>
      </div>}

      {active.id==='materials'&&<div className="miniLab"><div><span className="cardLabel">MINI LAB · GUIDANCE WEIGHT</span><h3>Target compliance vs. discovery diversity</h3><p>Move the generation-time guidance weight. This is not a trained parameter—it is a human-selected control over model behavior.</p></div><div className="sliderWrap"><input aria-label="Guidance weight" type="range" min="0" max="100" value={guide} onChange={e=>setGuide(Number(e.target.value))}/><div className="sliderLabels"><span>Diverse / exploratory</span><b>s = {(guide/20).toFixed(1)}</b><span>Targeted / narrow</span></div><div className="outcomeBars"><label>Property match<i style={{width:`${30+guide*.65}%`}}/></label><label>Diversity<i style={{width:`${95-guide*.65}%`}}/></label></div></div></div>}

      <div className="resultBand"><div><span>REPORTED RESULT</span><p>{active.result}</p></div><div><span>METRIC THAT MATTERS</span><b>{active.metric}</b></div></div>
      <ResultPanel active={active} />
      <PrimarySourceCard active={active} />
      {active.limitation&&<aside className="limitation"><span>IMPORTANT LIMITATION</span><p>{active.limitation}</p></aside>}
      {active.organizationShelf&&<div className="shelf"><div className="shelfHead"><span>FIVE-ORGANIZATION RESEARCH STATUS</span><b>Weather and Earth-system AI is now a multi-lab architecture race.</b></div>{active.organizationShelf.map(item=><a href={item.url} target="_blank" rel="noreferrer" className="shelfRow" aria-label={`${item.system} primary source: ${item.primaryPublication}`} key={item.system}><b>{item.org}</b><span>{item.system}</span><span>{item.year}</span><span>{item.architecture}</span><p><strong>{item.primaryPublication}</strong><br/>{item.evidence}</p><small><b>{item.sourceType}</b><br/>{item.relation}<br/>Bottleneck: {item.bottleneck}</small></a>)}</div>}
      <div className="companyRow"><span>Organizations to compare next</span>{active.companies.map(c=><b key={c}>{c}</b>)}</div>
    </section>

    <section id="supplements" className="supplements section">
      <div className="sectionIntro"><p className="eyebrow">Complete supplements</p><h2>Six supporting architecture lessons.</h2><p>These complete supplements are visible because they have objectives, mechanisms, interactions, equations, weights, results, primary papers, and limitations.</p></div>
      <div className="supplementGrid">
        {supplementLessons.map(lesson=><SupplementCard key={lesson.id} lesson={lesson} demo={demo} setDemo={updateDemo} revealed={Boolean(revealed[lesson.id])} onReveal={()=>toggleReveal(lesson.id)} onReset={()=>resetDemo(lesson.id)} />)}
      </div>
    </section>

    <section className="compare section">
      <div className="sectionIntro"><p className="eyebrow">Architecture selection map</p><h2>Match the bottleneck to the inductive bias.</h2></div>
      <div className="matrix"><div className="matrixHead"><span>When the hard part is…</span><span>Architecture bias</span><span>Seen in this manual</span></div>{[
        ["relationships across many entities","attention / transformers","quantum · theorem proving"],
        ["memory across time","recurrence / autoregression","quantum · finance · demand"],
        ["few labels, much raw data","self-supervised pretraining","critical minerals"],
        ["creating candidates, not scoring them","diffusion / generative modeling","materials design"],
        ["actions change future cost","policy optimization / RL","deep hedging · theorem search"],
        ["hard physical symmetries","equivariant networks","crystal generation"],
        ["spatial dependence is not a flat image","message passing on a graph","GraphCast weather forecasting"],
      ].map(r=><div className="matrixRow" key={r[0]}><b>{r[0]}</b><span>{r[1]}</span><span>{r[2]}</span></div>)}</div>
    </section>

    <section id="sources" className="sources section darkSection">
      <div className="sectionIntro"><p className="eyebrow">Research shelf</p><h2>Read the primary sources.</h2><p>Results here summarize the linked papers. Company lists are research directions, not claims that every company uses the exact featured architecture.</p></div>
      <div className="sourceGrid">{sectors.map(s=><a href={s.url} target="_blank" rel="noreferrer" key={s.id}><span>{s.number} · {s.field}</span><b>{s.paper}</b><small>{s.company} ↗</small></a>)}{supplementLessons.map(s=><a href={s.url} target="_blank" rel="noreferrer" key={s.id}><span>Supplement · {s.name}</span><b>{s.paper}</b><small>{s.organization} ↗</small></a>)}</div>
    </section>

    <footer><div><span className="brandMark">ML</span><b>Architecture Field Manual</b></div><p>Built for an interactive DOE fellowship discussion · Start with the objective. Make every weight earn its place.</p><a href="#top">Back to top ↑</a></footer>
  </main>
}
