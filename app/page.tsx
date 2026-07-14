"use client";

/* eslint-disable react-hooks/static-components, react/no-unescaped-entities */

import { useMemo, useState } from "react";
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

const chapterNames: Record<string, string> = {
  "case-01-quantum-error-correction": "Quantum error correction",
  "case-02-critical-mineral-prospectivity": "Critical-mineral prospectivity",
  "case-03-deep-hedging": "Deep hedging",
  "case-04-inverse-materials-design": "Inverse materials design",
  "case-05-formal-theorem-proving": "Formal theorem proving",
  "case-06-probabilistic-demand-forecasting": "Probabilistic demand forecasting",
  "case-07-graphcast-weather-forecasting": "GraphCast weather forecasting"
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

function Latex({children,className=""}:{children:string;className?:string}) {
  return <code className={`latex ${className}`}>{children}</code>;
}

function ArchitectureVisual({active}:{active:Sector}) {
  const [layer,setLayer] = useState<"flow"|"weights"|"training">("flow");
  const showWeights = layer !== "flow";
  const showTraining = layer === "training";
  const W = ({x,y,s,label}:{x:number;y:number;s:string;label:string}) => showWeights ? <g className="svgWeight" transform={`translate(${x} ${y})`}><rect width="138" height="38" rx="10"/><text x="12" y="16">{s}</text><text className="svgSmall" x="12" y="30">{label}</text></g> : null;
  const Box = ({x,y,w=170,h=74,title,sub,tone=""}:{x:number;y:number;w?:number;h?:number;title:string;sub:string;tone?:string}) => <g className={`svgBox ${tone}`}><rect x={x} y={y} width={w} height={h} rx="14"/><text x={x+14} y={y+27}>{title}</text><text className="svgSmall" x={x+14} y={y+49}>{sub}</text></g>;
  const Arrow = ({d,label}:{d:string;label?:string}) => <g className="svgArrow"><path d={d} markerEnd="url(#arrow)"/>{label&&<text><textPath href="#never">{label}</textPath></text>}</g>;
  const defs = <defs><marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z"/></marker><pattern id="grid" width="18" height="18" patternUnits="userSpaceOnUse"><path d="M18 0H0V18" fill="none" stroke="currentColor" strokeOpacity=".18"/></pattern></defs>;
  return <article className={`visual3 visual3-${active.id}`} aria-label={`${active.name} main architecture visual`}>
    <div className="visual3Header">
      <span className="cardLabel">ARCHITECTURE MAP · FOLLOW THE ARROWS</span>
      <div><h3>{active.architecture}</h3><p>{architectureTeachingLine(active.id)}</p></div>
      <div className="diagramControls" role="group" aria-label="Diagram detail"><button className={layer==="flow"?"on":""} onClick={()=>setLayer("flow")}>1 · Flow</button><button className={layer==="weights"?"on":""} onClick={()=>setLayer("weights")}>2 · Weights</button><button className={layer==="training"?"on":""} onClick={()=>setLayer("training")}>3 · Training</button></div>
    </div>
    <div className="diagramViewport"><svg className="architectureSvg" viewBox="0 0 1100 560" role="img" aria-label={`${active.name}: connected model architecture`}>{defs}
      {active.id==="quantum"&&<>
        <text className="svgSection" x="34" y="34">SYNDROME EVENTS ACROSS SPACE + TIME</text>
        {[0,1,2].map(c=><g key={c} transform={`translate(${45+c*230} 72)`}><rect className="qubitPlane" width="185" height="185" rx="18"/><text x="14" y="25">cycle t{c?`+${c}`:""}</text>{Array.from({length:9}).map((_,i)=><circle key={i} className={(i+c)%4===0?"hotNode":"quietNode"} cx={38+(i%3)*54} cy={62+Math.floor(i/3)*48} r="8"/>)}<path className="attentionEdge" d="M38 62L146 158M92 62L38 158M38 110L146 110"/></g>)}
        <Arrow d="M230 164H266"/><Arrow d="M460 164H496"/><path className="memoryRail" d="M80 290 C250 350 480 350 690 290" markerEnd="url(#arrow)"/><text className="svgLabel" x="272" y="345">recurrent memory carries unresolved evidence</text>
        <Box x={760} y={88} title="Decoder head" sub="logical error probabilities"/><Arrow d="M690 164H750"/><Box x={760} y={225} title="Correction rule" sub="lowest expected failure cost" tone="output"/><Arrow d="M845 164V215"/><W x={80} y={375} s="αᵢⱼ" label="spatial attention"/><W x={270} y={375} s="gₜ" label="memory gates"/><W x={460} y={375} s="Wₒ" label="output weights"/><W x={760} y={330} s="Cᵢⱼ" label="decision cost"/>
        {showTraining&&<><path className="feedback" d="M845 310 C845 500 350 510 180 270" markerEnd="url(#arrow)"/><text className="feedbackText" x="410" y="500">logical-error loss updates embeddings, attention, memory, and decoder</text></>}
      </>}
      {active.id==="minerals"&&<>
        <text className="svgSection" x="30" y="34">ALIGNED GEOSPATIAL EVIDENCE</text>
        {[["GEOLOGY",65,"fault"],["MAGNETICS",125,"bands"],["GRAVITY",185,"rings"],["GEOCHEMISTRY",245,"dots"]].map(([n,y,p],i)=><g key={n}><rect className={`geoLayer ${p}`} x={50+i*13} y={Number(y)} width="230" height="100" rx="10"/><text x={70+i*13} y={Number(y)+28}>{n}</text></g>)}
        <Arrow d="M330 205H420"/><Box x={430} y={145} w={205} h={120} title="Masked map encoder" sub="learn structure without labels"/><g className="patchMask">{Array.from({length:12}).map((_,i)=><rect key={i} x={452+(i%4)*40} y={195+Math.floor(i/4)*20} width="28" height="13" className={i%5===0?"masked":""}/>)}</g>
        <Arrow d="M645 205H715"/><g><rect className="heatmap" x="730" y="105" width="280" height="210" rx="18"/><circle cx="810" cy="190" r="46"/><circle cx="930" cy="245" r="31"/><text x="750" y="138">PROSPECTIVITY + UNCERTAINTY</text><text className="svgSmall" x="750" y="295">rank cells for field investigation</text></g>
        <W x={62} y={385} s="mₖ" label="modality trust"/><W x={430} y={300} s="aₚ" label="patch importance"/><W x={605} y={385} s="w₊" label="rare deposit class"/><W x={790} y={385} s="Csurvey" label="survey cost"/>
        {showTraining&&<><path className="feedback" d="M860 335 C780 510 470 505 520 275" markerEnd="url(#arrow)"/><text className="feedbackText" x="560" y="480">confirmed deposits fine-tune the pretrained geological representation</text></>}
      </>}
      {active.id==="finance"&&<>
        <text className="svgSection" x="30" y="34">ONE POLICY, UNROLLED THROUGH THE ENTIRE TRADING PATH</text>
        <path className="marketLine" d="M55 128 C145 45 220 205 310 112 S470 190 560 95 S720 155 810 78"/>
        {[80,285,490,695].map((x,i)=><g key={x}><circle className="timeNode" cx={x} cy="205" r="20"/><text x={x-10} y="211">t{i+1}</text><Box x={x-55} y={245} w={150} h={78} title={i<3?"Policy action":"Terminal P&L"} sub={i<3?"choose hedge position":"after all costs"}/>{i<3&&<Arrow d={`M${x+95} 284H${x+140}`}/>}</g>)}
        <Box x={860} y={150} w={190} h={105} title="Convex risk ργ" sub="judge the full path" tone="output"/><Arrow d="M845 284Q930 300 945 265"/><W x={95} y={365} s="πθ(sₜ)" label="shared policy"/><W x={300} y={365} s="cⱼ|Δaₜ|" label="trading friction"/><W x={505} y={365} s="ωₛ" label="stress scenarios"/><W x={860} y={300} s="γ" label="risk aversion"/>
        {showTraining&&<><path className="feedback" d="M950 275 C930 500 300 500 155 330" markerEnd="url(#arrow)"/><text className="feedbackText" x="430" y="485">backpropagate terminal economic risk through every action</text></>}
      </>}
      {active.id==="materials"&&<>
        <text className="svgSection" x="30" y="34">REVERSE DIFFUSION: NOISE → PHYSICALLY PLAUSIBLE CRYSTAL</text>
        {[85,315,545,775].map((x,i)=><g key={x}><rect className="crystalFrame" x={x} y="100" width="155" height="190" rx="20"/>{Array.from({length:9}).map((_,j)=><circle key={j} className={`atom atom${j%3}`} cx={x+24+(j%3)*52+(3-i)*((j%2)*5)} cy={135+Math.floor(j/3)*53+(3-i)*((j%3)*3)} r={7+i*1.3}/>)}<text x={x+16} y="322">{["random state","coarse structure","refined lattice","candidate crystal"][i]}</text>{i<3&&<Arrow d={`M${x+165} 195H${x+215}`}/>}</g>)}
        <path className="conditionLine" d="M510 430 C630 350 720 345 835 300" markerEnd="url(#arrow)"/><Box x={370} y={400} w={210} h={82} title="Property condition c" sub="strength, stability, supply risk"/>
        <W x={85} y={355} s="βₜ" label="noise schedule"/><W x={250} y={355} s="λA, λX, λL" label="channel balance"/><W x={625} y={400} s="s" label="guidance strength"/><W x={850} y={355} s="θscore" label="denoiser"/>
        {showTraining&&<><path className="feedback" d="M930 345 C930 515 270 520 160 300" markerEnd="url(#arrow)"/><text className="feedbackText" x="470" y="510">known crystals teach the model to reverse structured corruption</text></>}
      </>}
      {active.id==="math"&&<>
        <text className="svgSection" x="30" y="34">PROOF SEARCH: GENERATE BRANCHES, VERIFY EVERY STEP</text><Box x={440} y={60} w={220} h={72} title="Formal theorem" sub="Lean state + retrieved lemmas"/>
        <path className="treeEdge" d="M550 132V175M550 175L210 230M550 175L550 230M550 175L890 230"/>
        {[150,490,830].map((x,i)=><g key={x}><Box x={x} y={230} w={220} h={76} title={`Candidate subgoal ${String.fromCharCode(65+i)}`} sub="model proposes next tactic"/><Arrow d={`M${x+110} 306V350`}/><g className={i===1?"verifyGate reject":"verifyGate"}><rect x={x+22} y={355} width="176" height="50" rx="12"/><text x={x+50} y={386}>{i===1?"LEAN: REJECT":"LEAN: VERIFIED"}</text></g></g>)}
        <path className="treeEdge" d="M260 410Q500 470 550 505M940 410Q690 470 550 505"/><text className="svgLabel" x="475" y="535">verified proof</text>
        <W x={155} y={430} s="pθ(tactic)" label="proposal score"/><W x={490} y={430} s="bᵢ" label="branch budget"/><W x={830} y={430} s="rτ" label="verifier reward"/>
        {showTraining&&<><path className="feedback" d="M550 510 C1040 540 1040 70 670 95" markerEnd="url(#arrow)"/><text className="feedbackText" x="765" y="520">reward successful proof paths</text></>}
      </>}
      {active.id==="business"&&<>
        <text className="svgSection" x="30" y="34">MANY PRODUCT HISTORIES → ONE SHARED MODEL → MANY FORECAST DISTRIBUTIONS</text>
        {[80,145,210,275,340].map((y,i)=><g key={y}><text x="35" y={y+7}>item {String.fromCharCode(65+i)}</text><path className="seriesLine" d={`M100 ${y} l35 ${i%2?-12:10} l35 ${i%3?18:-8} l35 -22 l35 ${i%2?8:18}`}/><Arrow d={`M250 ${y} C320 ${y} 330 245 405 245`}/></g>)}
        <g className="rnnCore"><rect x="420" y="145" width="240" height="205" rx="32"/><path d="M485 220Q540 165 595 220Q540 275 485 220"/><text x="470" y="305">SHARED RECURRENT CORE</text><text className="svgSmall" x="485" y="328">item-specific hidden state</text></g>
        {[105,205,305].map((y,i)=><g key={y}><Arrow d={`M660 245 C720 245 720 ${y} 785 ${y}`}/><path className={`fan fan${i}`} d={`M790 ${y} C850 ${y-35} 920 ${y-25} 1015 ${y-42} L1015 ${y+42} C920 ${y+25} 850 ${y+35} 790 ${y}Z`}/><text x="820" y={y+5}>{["P10","P50","P90"][i]} forecast</text></g>)}
        <W x={130} y={390} s="νᵢ" label="series scaling"/><W x={430} y={390} s="θRNN, gₜ" label="shared memory"/><W x={790} y={390} s="μ, σ" label="distribution head"/>
        {showTraining&&<><path className="feedback" d="M950 430 C790 515 430 515 520 355" markerEnd="url(#arrow)"/><text className="feedbackText" x="575" y="500">likelihood across all series updates shared parameters</text></>}
      </>}
      {active.id==="graphcast"&&<>
        <text className="svgSection" x="30" y="34">GLOBAL WEATHER GRID → MULTIMESH MESSAGE PASSING → NEXT WEATHER GRID</text>
        <g><rect className="weatherMap" x="38" y="105" width="220" height="250" rx="22"/><path d="M55 170Q145 90 240 180M55 255Q145 335 240 250M100 112V348M180 112V348"/><text x="65" y="390">analyzed weather at t</text></g><Arrow d="M270 225H345"/>
        <g className="meshGlobe"><circle cx="550" cy="225" r="145"/><ellipse cx="550" cy="225" rx="72" ry="145"/><ellipse cx="550" cy="225" rx="145" ry="58"/>{[[455,155],[550,95],[645,155],[430,225],[520,205],[610,225],[470,300],[550,350],[640,300]].map(([x,y],i)=><circle key={i} cx={x} cy={y} r="8"/>)}<path d="M455 155L550 95L645 155L610 225L640 300L550 350L470 300L430 225L455 155M455 155L520 205L610 225M430 225L520 205L470 300M520 205L550 350M610 225L470 300"/><text x="470" y="420">spherical multimesh</text></g>
        <Arrow d="M705 225H780"/><g><rect className="weatherMap outputMap" x="795" y="105" width="250" height="250" rx="22"/><path d="M810 165Q900 110 1025 190M815 275Q915 320 1020 245M855 112V348M955 112V348"/><text x="820" y="390">forecast at t + 6h</text></g>
        <W x={45} y={430} s="Wnode" label="grid encoder"/><W x={390} y={430} s="mᵢⱼ, Σⱼ" label="messages + aggregation"/><W x={800} y={430} s="Wdecode" label="grid decoder"/>
        {showTraining&&<><path className="feedback" d="M925 410 C920 535 340 535 145 365" markerEnd="url(#arrow)"/><text className="feedbackText" x="430" y="520">weighted forecast error updates encoder, processor, and decoder</text></>}
      </>}
    </svg></div>
    <div className="diagramLegend"><span><i className="legendFlow"/>information flow</span><span><i className="legendLearned"/>learned / dynamic weights</span><span><i className="legendHuman"/>human-selected objective or cost</span>{showTraining&&<span><i className="legendTraining"/>training feedback</span>}</div>
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

export default function Home() {
  const [activeId,setActiveId] = useState("quantum");
  const [stage,setStage] = useState(0);
  const [depth,setDepth] = useState<"plain"|"technical">("plain");
  const [guide,setGuide] = useState(55);
  const [messageSteps,setMessageSteps] = useState(8);
  const [libraryQuery,setLibraryQuery] = useState("");
  const [libraryFilters,setLibraryFilters] = useState<LibraryFilters>(defaultLibraryFilters);
  const [visibleRegistryCount,setVisibleRegistryCount] = useState(24);
  const active = useMemo(()=>sectors.find(s=>s.id===activeId)!,[activeId]);
  const registryCounts = useMemo(()=>({
    total: registry.length,
    complete: registry.filter(r=>r.coverage_status==="COMPLETE").length,
    partial: registry.filter(r=>r.coverage_status==="PARTIAL").length,
    overlapping: registry.filter(r=>r.coverage_status==="OVERLAPPING").length,
    library: registry.filter(r=>r.coverage_status==="LIBRARY ONLY").length,
  }),[]);
  const libraryOptions = useMemo(()=>({
    family: uniqueSorted(registry.map(r=>r.architecture_family)),
    sector: uniqueSorted(registry.flatMap(r=>r.sector)),
    bottleneck: uniqueSorted(registry.flatMap(r=>r.dominant_bottleneck)),
    paradigm: uniqueSorted(registry.flatMap(r=>r.learning_paradigm)),
    dataType: uniqueSorted(registry.flatMap(r=>r.data_type))
  }),[]);
  const filteredRegistry = useMemo(()=>{
    const query = libraryQuery.trim().toLowerCase();
    return registry
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
        const matchesStatus = libraryFilters.status === "ALL" || entry.coverage_status === libraryFilters.status;
        const matchesFamily = libraryFilters.family === "ALL" || entry.architecture_family === libraryFilters.family;
        const matchesSector = libraryFilters.sector === "ALL" || entry.sector.includes(libraryFilters.sector);
        const matchesBottleneck = libraryFilters.bottleneck === "ALL" || entry.dominant_bottleneck.includes(libraryFilters.bottleneck);
        const matchesParadigm = libraryFilters.paradigm === "ALL" || entry.learning_paradigm.includes(libraryFilters.paradigm);
        const matchesData = libraryFilters.dataType === "ALL" || entry.data_type.includes(libraryFilters.dataType);
        return matchesQuery && matchesStatus && matchesFamily && matchesSector && matchesBottleneck && matchesParadigm && matchesData;
      })
      .sort((a,b)=>(coverageRank[a.coverage_status] ?? 9) - (coverageRank[b.coverage_status] ?? 9) || a.architecture_id.localeCompare(b.architecture_id));
  },[libraryQuery,libraryFilters]);
  const visibleRegistryCards = filteredRegistry.slice(0,visibleRegistryCount);
  const filtersActive = libraryQuery.trim().length>0 || Object.values(libraryFilters).some(value=>value!=="ALL");
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

  return <main>
    <header className="topbar">
      <a className="brand" href="#top"><span className="brandMark">ML</span><span>Architecture Field Manual</span></a>
      <nav aria-label="Primary navigation"><a href="#method">Method</a><a href="#chapters">Chapters</a><a href="#library">Library</a><a href="#weights">Weight lab</a><a href="#sources">Sources</a></nav>
      <span className="edition">DOE fellowship · field edition</span>
    </header>

    <section id="top" className="hero">
      <div className="heroCopy">
        <p className="eyebrow">An interactive instruction manual</p>
        <h1>Architecture follows the <em>bottleneck.</em></h1>
        <p className="dek">The same neural network is not right for every problem. Learn to move from a real decision → to the data constraint → to the architecture → to the layers of weighting that make it useful.</p>
        <div className="heroActions"><a className="primary" href="#method">Start with the reasoning <span>↓</span></a><a className="secondary" href="#chapter" onClick={()=>selectSector("graphcast")}>Open GraphCast</a><span className="reading">7 cases · 45-60 min guided session</span></div>
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
      <div className="sectionIntro"><p className="eyebrow">Architecture registry</p><h2>A searchable coverage map for the manual.</h2><p>The registry keeps the full architecture backlog visible while the featured chapters teach the highest-value patterns in depth.</p></div>
      <div className="registryStats" aria-label="Registry coverage summary">
        <article><span>Total</span><b>{registryCounts.total}</b><small>architecture records</small></article>
        <article><span>Complete</span><b>{registryCounts.complete}</b><small>full interactive chapters</small></article>
        <article><span>Partial + overlap</span><b>{registryCounts.partial + registryCounts.overlapping}</b><small>covered or consolidated</small></article>
        <article><span>Backlog</span><b>{registryCounts.library}</b><small>library-only cards</small></article>
      </div>
      <div className="librarySearch">
        <label htmlFor="architecture-search">Search every registry field</label>
        <input id="architecture-search" value={libraryQuery} onChange={event=>{setLibraryQuery(event.target.value);setVisibleRegistryCount(24);}} placeholder="Try GraphCast, GAT, masked, pressure, energy, DeepAR..." />
      </div>
      <div className="filterGrid" aria-label="Registry filters">
        <label>Coverage status<select value={libraryFilters.status} onChange={event=>updateLibraryFilter("status",event.target.value)}><option value="ALL">All statuses</option>{["COMPLETE","PARTIAL","LIBRARY ONLY","OVERLAPPING","BLOCKED"].map(value=><option key={value} value={value}>{value}</option>)}</select></label>
        <label>Architecture family<select value={libraryFilters.family} onChange={event=>updateLibraryFilter("family",event.target.value)}><option value="ALL">All families</option>{libraryOptions.family.map(value=><option key={value} value={value}>{value}</option>)}</select></label>
        <label>Sector<select value={libraryFilters.sector} onChange={event=>updateLibraryFilter("sector",event.target.value)}><option value="ALL">All sectors</option>{libraryOptions.sector.map(value=><option key={value} value={value}>{value}</option>)}</select></label>
        <label>Bottleneck<select value={libraryFilters.bottleneck} onChange={event=>updateLibraryFilter("bottleneck",event.target.value)}><option value="ALL">All bottlenecks</option>{libraryOptions.bottleneck.map(value=><option key={value} value={value}>{value}</option>)}</select></label>
        <label>Learning paradigm<select value={libraryFilters.paradigm} onChange={event=>updateLibraryFilter("paradigm",event.target.value)}><option value="ALL">All paradigms</option>{libraryOptions.paradigm.map(value=><option key={value} value={value}>{value}</option>)}</select></label>
        <label>Data type<select value={libraryFilters.dataType} onChange={event=>updateLibraryFilter("dataType",event.target.value)}><option value="ALL">All data types</option>{libraryOptions.dataType.map(value=><option key={value} value={value}>{value}</option>)}</select></label>
      </div>
      <div className="libraryMeta" aria-live="polite">
        <p>Showing {visibleRegistryCards.length} of {filteredRegistry.length} matching records from {registryCounts.total} searchable architectures.</p>
        <button className="clearButton" disabled={!filtersActive} onClick={clearLibraryFilters}>Clear filters</button>
      </div>
      <div className="libraryGrid">
        {visibleRegistryCards.map(entry=>{
          const chapterTarget = chapterTargets[entry.chapter_group];
          const consolidated = chapterTarget && entry.coverage_status !== "COMPLETE";
          return <article key={entry.architecture_id}>
          <span>{entry.coverage_status}</span>
          <h3>{entry.canonical_name}</h3>
          <p>{entry.architecture_family}</p>
          {entry.aliases.length>0&&<small>Aliases: {entry.aliases.join(", ")}</small>}
          <small>{chapterNames[entry.chapter_group] || "Searchable library card"}</small>
          {entry.weighting_mechanisms.length>0&&<div>{entry.weighting_mechanisms.slice(0,3).map(w=><b key={w}>{w}</b>)}</div>}
          {consolidated&&<em className="consolidatedLabel">Consolidated in {chapterNames[entry.chapter_group]}; not a standalone chapter.</em>}
          {entry.coverage_status==="COMPLETE" && chapterTarget
            ? <button className="openChapterButton" onClick={()=>selectSector(chapterTarget)}>Open chapter</button>
            : <em className="consolidatedLabel">{entry.coverage_status==="LIBRARY ONLY"?"Library-only backlog card":entry.chapter_status}</em>}
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
      <div className="stageExplain"><span className="stageIndex">{String(stage+1).padStart(2,'0')}</span><div><p>{depth==='plain'?active.pipeline[stage].plain:active.pipeline[stage].weight}</p><small>{depth==='plain'?'WHY THIS STAGE EXISTS':'WHERE THE WEIGHTING HAPPENS'}</small></div></div>

      <ArchitectureVisual active={active} />

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
          <p className="sliderNote">Illustrative teaching model--not a reproduction of GraphCast's experimental system.</p>
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

      <div className="weightTable"><div className="tableHead"><span>Weight layer</span><span>Symbol</span><span>What it prioritizes</span><span>Failure if misweighted</span></div>{active.weights.map(w=><div className="tableRow" key={w.type}><b>{w.type}</b><code>{w.symbol}</code><span>{w.role}</span><span>{w.failure}</span></div>)}</div>

      {active.id==='graphcast'&&<div className="graphcastWeights">
        <div className="weightDetailsHead"><span className="cardLabel">DETAILED GRAPHCAST WEIGHTS</span><h3>Learned parameters, dynamic calculations, objective weights, data choices, and decision costs are different things.</h3></div>
        <div className="weightDetails">{graphcastWeightDetails.map(([symbol,where,kind,staticness,up,down,tooHigh,tooLow])=><article key={symbol}>
          <code>{symbol}</code><b>{where}</b><p><strong>Kind:</strong> {kind}</p><p><strong>Static or input-dependent:</strong> {staticness}</p><p><strong>Increasing:</strong> {up}</p><p><strong>Decreasing:</strong> {down}</p><small>Too high: {tooHigh}. Too low: {tooLow}.</small>
        </article>)}</div>
        <details className="equationDetails">
          <summary>Step through the GraphCast loss equation</summary>
          <div className="equationExplain">
            <code>{active.loss}</code>
            {graphcastEquationSteps.map(([symbol,text])=><p key={symbol}><b>{symbol}</b> {text}</p>)}
            <p><b>Forecast-training objective:</b> minimize weighted forecast error against verifying ERA5 future states; gradients update theta.</p>
            <p><b>Operational decision objective:</b> convert a forecast into an action under costs such as missed warnings, false alarms, energy-grid imbalance, or transportation disruption. Those costs are downstream and are not necessarily part of GraphCast's training loss.</p>
          </div>
        </details>
      </div>}

      {active.id==='materials'&&<div className="miniLab"><div><span className="cardLabel">MINI LAB · GUIDANCE WEIGHT</span><h3>Target compliance vs. discovery diversity</h3><p>Move the generation-time guidance weight. This is not a trained parameter—it is a human-selected control over model behavior.</p></div><div className="sliderWrap"><input aria-label="Guidance weight" type="range" min="0" max="100" value={guide} onChange={e=>setGuide(Number(e.target.value))}/><div className="sliderLabels"><span>Diverse / exploratory</span><b>s = {(guide/20).toFixed(1)}</b><span>Targeted / narrow</span></div><div className="outcomeBars"><label>Property match<i style={{width:`${30+guide*.65}%`}}/></label><label>Diversity<i style={{width:`${95-guide*.65}%`}}/></label></div></div></div>}

      <div className="resultBand"><div><span>REPORTED RESULT</span><p>{active.result}</p></div><div><span>METRIC THAT MATTERS</span><b>{active.metric}</b></div></div>
      {active.limitation&&<aside className="limitation"><span>IMPORTANT LIMITATION</span><p>{active.limitation}</p></aside>}
      {active.organizationShelf&&<div className="shelf"><div className="shelfHead"><span>FIVE-ORGANIZATION RESEARCH STATUS</span><b>Weather and Earth-system AI is now a multi-lab architecture race.</b></div>{active.organizationShelf.map(item=><a href={item.url} target="_blank" rel="noreferrer" className="shelfRow" aria-label={`${item.system} primary source: ${item.primaryPublication}`} key={item.system}><b>{item.org}</b><span>{item.system}</span><span>{item.year}</span><span>{item.architecture}</span><p><strong>{item.primaryPublication}</strong><br/>{item.evidence}</p><small><b>{item.sourceType}</b><br/>{item.relation}<br/>Bottleneck: {item.bottleneck}</small></a>)}</div>}
      <div className="companyRow"><span>Organizations to compare next</span>{active.companies.map(c=><b key={c}>{c}</b>)}</div>
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
      <div className="sourceGrid">{sectors.map(s=><a href={s.url} target="_blank" rel="noreferrer" key={s.id}><span>{s.number} · {s.field}</span><b>{s.paper}</b><small>{s.company} ↗</small></a>)}</div>
    </section>

    <footer><div><span className="brandMark">ML</span><b>Architecture Field Manual</b></div><p>Built for an interactive DOE fellowship discussion · Start with the objective. Make every weight earn its place.</p><a href="#top">Back to top ↑</a></footer>
  </main>
}
