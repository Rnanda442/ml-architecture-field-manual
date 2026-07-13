"use client";

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
  organizationShelf?: { org: string; system: string; year: string; architecture: string; bottleneck: string; evidence: string; relation: string; url: string }[];
};

type RegistryEntry = {
  architecture_id: string;
  canonical_name: string;
  architecture_family: string;
  chapter_group: string;
  coverage_status: string;
  dominant_bottleneck: string[];
  weighting_mechanisms: string[];
  primary_paper: { title: string; year: string; url: string };
  featured_organization: string;
};

const registry = architectureRegistry as RegistryEntry[];

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
    loss:"L = λlogical · BCE(y, pθ) + λreg · ‖θ‖²", lossNote:"The neural parameters θ are learned inside the model; λ values are chosen outside it to define what ‘good’ means.",
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
    loss:"L = λmask · Lreconstruct + λprospect · weighted-BCE + λcal · Lcalibration", lossNote:"Three objectives act at different times: learn the world, learn the rare target, then make confidence operationally honest.",
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
    loss:"minθ  ρᵧ(−PnLθ)  where PnL includes Σt costs(Δpositionₜ)", lossNote:"This is decision learning, not stock-price prediction. The loss evaluates the economic consequence of the entire trading path.",
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
    loss:"L = λA·LA + λX·LX + λL·LL  ;  score = (1+s)εcond − sεuncond", lossNote:"The model learns three coupled denoising tasks. Guidance then reweights conditional and unconditional predictions at generation time.",
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
    loss:"L = LSFT − β · Eτ[Aτ log pθ(τ)] + κ · KL(pθ ‖ pref)", lossNote:"Supervised learning teaches syntax, verifier reward teaches correctness, and KL control keeps reinforcement updates from destabilizing the base model.",
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
    loss:"L = − Σi,t λt log p(yᵢ,t | hᵢ,t; θ)  →  order at quantile q = Cu/(Cu+Co)", lossNote:"Training weights make the distribution accurate; business costs choose which point on that distribution becomes the action.",
    companies:["Amazon","Walmart","UPS","Maersk","Siemens"]
  },
  {
    id:"graphcast", number:"07", name:"GraphCast weather forecasting", field:"Climate & environmental science", company:"Google DeepMind",
    objective:"Predict the evolving global weather state quickly enough that forecasters, grid operators, emergency planners, and logistics teams can act before hazardous conditions arrive.",
    decision:"Should a weather-dependent action be issued, adjusted, or escalated for the next hours to 10 days?",
    bottleneck:"Weather is a curved-Earth, long-range, multiscale system. A latitude-longitude image grid distorts the poles, while numerical physics is expensive and a plain local CNN struggles to move information along atmospheric connections.",
    hypothesis:"A message-passing graph neural network on an icosahedral multimesh can learn how weather systems exchange information across Earth-scale neighborhoods, then roll that learned state forward much faster than a traditional deterministic forecast.",
    architecture:"Message-passing graph neural network on a multimesh Earth graph",
    architectureFamily:"Graph and structural architectures",
    paradigm:"Supervised autoregressive spatiotemporal forecasting",
    dataType:"Global gridded atmospheric fields",
    outputType:"Six-hour-ahead weather state rolled into a 10-day forecast",
    evidence:"The model sees the current weather state, the state six hours earlier, static Earth fields, and graph connectivity. The verifying future state is the target and must stay out of the inputs.",
    dataSummary:"GraphCast is trained on ERA5 reanalysis. Each example pairs two atmospheric states six hours apart with the next six-hour state, then forecasts are rolled forward autoregressively at 0.25 degree global resolution.",
    paper:"GraphCast: Learning skillful medium-range global weather forecasting", url:"https://www.science.org/doi/10.1126/science.adi2336", openUrl:"https://arxiv.org/abs/2212.12794", year:"2023",
    result:"GraphCast predicted hundreds of variables globally at 0.25 degree resolution for 10 days in under one minute and outperformed HRES on more than 90% of 1380 verification targets; in the troposphere comparison it outperformed HRES on 99.7% of targets.",
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
    loss:"L = sum_t sum_v lambda_v * omega_lat * ||y_hat_t,v - y_t,v||_2^2",
    lossNote:"The paper optimizes forecast accuracy, while many real decisions optimize asymmetric costs such as missed cyclone warnings, grid imbalance, or unnecessary shutdowns.",
    companies:["Google DeepMind","NVIDIA / LBNL","Huawei Cloud","Microsoft Research","ECMWF"],
    organizationShelf:[
      {org:"Google DeepMind",system:"GraphCast",year:"2023",architecture:"Message-passing graph neural network",bottleneck:"Global spatial dependence and compute cost",evidence:">90% of 1380 targets better than HRES; under one minute for a 10-day forecast",relation:"Authored by organization researchers",url:"https://www.science.org/doi/10.1126/science.adi2336"},
      {org:"NVIDIA / LBNL",system:"FourCastNet3",year:"2025",architecture:"Spherical neural operator",bottleneck:"Probabilistic ensemble speed and spherical fidelity",evidence:"15-day forecast in about one minute on one H100; reported 60x speedup over IFS-ENS",relation:"Coauthored by organization researchers",url:"https://developer.nvidia.com/blog/fourcastnet-3-enables-fast-and-accurate-large-ensemble-weather-forecasting-with-scalable-geometric-ml/"},
      {org:"Huawei Cloud",system:"Pangu-Weather",year:"2023",architecture:"3D neural network weather model",bottleneck:"Vertical atmospheric structure and inference speed",evidence:"Reported more than 10,000x speed improvement over operational IFS",relation:"Authored by organization researchers",url:"https://www.nature.com/articles/s41586-023-06185-3"},
      {org:"Microsoft Research",system:"Aurora",year:"2025",architecture:"3D Swin Transformer with Perceiver encoders/decoders",bottleneck:"Heterogeneous Earth-system variables and task adaptation",evidence:"Reported 92% target advantage for 10-day high-resolution weather and 100% for cyclone-track targets",relation:"Published by organization research lab",url:"https://www.nature.com/articles/s41586-025-09005-y"},
      {org:"ECMWF",system:"AIFS",year:"2025",architecture:"Operational AI forecasting system",bottleneck:"Operational speed, energy, and national-service integration",evidence:"Reported tropical-cyclone track gains up to 20% and about 1,000x energy reduction",relation:"Officially implemented and documented",url:"https://www.ecmwf.int/en/about/media-centre/news/2025/ecmwfs-ai-forecasts-become-operational"},
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

export default function Home() {
  const [activeId,setActiveId] = useState("quantum");
  const [stage,setStage] = useState(0);
  const [depth,setDepth] = useState<"plain"|"technical">("plain");
  const [guide,setGuide] = useState(55);
  const [messageSteps,setMessageSteps] = useState(8);
  const [registryFilter,setRegistryFilter] = useState<"complete"|"graph"|"all">("complete");
  const active = useMemo(()=>sectors.find(s=>s.id===activeId)!,[activeId]);
  const registryCounts = useMemo(()=>({
    total: registry.length,
    complete: registry.filter(r=>r.coverage_status==="COMPLETE").length,
    partial: registry.filter(r=>r.coverage_status==="PARTIAL").length,
    overlapping: registry.filter(r=>r.coverage_status==="OVERLAPPING").length,
    library: registry.filter(r=>r.coverage_status==="LIBRARY ONLY").length,
  }),[]);
  const registryCards = useMemo(()=>{
    const filtered = registry.filter(entry => {
      if (registryFilter === "complete") return entry.coverage_status === "COMPLETE";
      if (registryFilter === "graph") return entry.architecture_family.includes("Graph");
      return true;
    });
    return filtered
      .sort((a,b)=>Number(b.coverage_status==="COMPLETE")-Number(a.coverage_status==="COMPLETE") || a.architecture_id.localeCompare(b.architecture_id))
      .slice(0,12);
  },[registryFilter]);
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
        <article><span>Partial</span><b>{registryCounts.partial + registryCounts.overlapping}</b><small>covered or overlapping</small></article>
        <article><span>Backlog</span><b>{registryCounts.library}</b><small>library-only cards</small></article>
      </div>
      <div className="libraryControls" role="group" aria-label="Registry filters">
        <button className={registryFilter==="complete"?"on":""} onClick={()=>setRegistryFilter("complete")}>Complete</button>
        <button className={registryFilter==="graph"?"on":""} onClick={()=>setRegistryFilter("graph")}>Graph family</button>
        <button className={registryFilter==="all"?"on":""} onClick={()=>setRegistryFilter("all")}>All</button>
      </div>
      <div className="libraryGrid">
        {registryCards.map(entry=><article key={entry.architecture_id}>
          <span>{entry.coverage_status}</span>
          <h3>{entry.canonical_name}</h3>
          <p>{entry.architecture_family}</p>
          <small>{entry.chapter_group}</small>
          {entry.weighting_mechanisms.length>0&&<div>{entry.weighting_mechanisms.slice(0,3).map(w=><b key={w}>{w}</b>)}</div>}
        </article>)}
      </div>
    </section>

    <section id="chapter" className={`chapter ${active.accent}`}>
      <div className="chapterHeader">
        <div><p className="eyebrow">Case {active.number} · {active.company}</p><h2>{active.name}</h2><p className="chapterObjective"><span>Main objective</span>{active.objective}</p></div>
        <a className="paperLink" href={active.url} target="_blank" rel="noreferrer"><span>Primary paper ↗</span><b>{active.paper}</b></a>
      </div>

      <div className="reasonCards">
        <article><span>THE DECISION</span><p>{active.decision}</p></article>
        <article><span>THE BOTTLENECK</span><p>{active.bottleneck}</p></article>
        <article><span>THE HYPOTHESIS</span><p>{active.hypothesis}</p></article>
      </div>

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

      <div className="architectureGrid">
        <article className="inputMap"><span className="cardLabel">INFORMATION ENTERING</span><div>{active.inputs.map((x,i)=><div key={x}><i style={{width:`${42+i*14}%`}}></i><b>{x}</b></div>)}</div><p>Architecture: <strong>{active.architecture}</strong></p></article>
        <article className="lossCard"><span className="cardLabel">TRAINING OBJECTIVE</span><code>{active.loss}</code><p>{active.lossNote}</p></article>
      </div>

      {active.id==='graphcast'&&<div className="graphLab">
        <div>
          <span className="cardLabel">GRAPHCAST VISUAL</span>
          <h3>Weather becomes messages on an Earth mesh.</h3>
          <p>A grid snapshot is encoded onto a multiresolution graph, message-passing steps move information across neighboring mesh regions, and the decoded forecast is fed back in for the next six-hour step.</p>
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
          <input aria-label="Message passing depth" type="range" min="2" max="16" value={messageSteps} onChange={e=>setMessageSteps(Number(e.target.value))}/>
          <div className="sliderLabels"><span>local exchange</span><b>{messageSteps} steps</b><span>farther reach</span></div>
          <div className="outcomeBars">
            <label>Information reach<i style={{width:`${20+messageSteps*4.5}%`}}/></label>
            <label>Sharp-front retention<i style={{width:`${104-messageSteps*3.4}%`}}/></label>
          </div>
        </div>
      </div>}

      <div className="weightTable"><div className="tableHead"><span>Weight layer</span><span>Symbol</span><span>What it prioritizes</span><span>Failure if misweighted</span></div>{active.weights.map(w=><div className="tableRow" key={w.type}><b>{w.type}</b><code>{w.symbol}</code><span>{w.role}</span><span>{w.failure}</span></div>)}</div>

      {active.id==='materials'&&<div className="miniLab"><div><span className="cardLabel">MINI LAB · GUIDANCE WEIGHT</span><h3>Target compliance vs. discovery diversity</h3><p>Move the generation-time guidance weight. This is not a trained parameter—it is a human-selected control over model behavior.</p></div><div className="sliderWrap"><input aria-label="Guidance weight" type="range" min="0" max="100" value={guide} onChange={e=>setGuide(Number(e.target.value))}/><div className="sliderLabels"><span>Diverse / exploratory</span><b>s = {(guide/20).toFixed(1)}</b><span>Targeted / narrow</span></div><div className="outcomeBars"><label>Property match<i style={{width:`${30+guide*.65}%`}}/></label><label>Diversity<i style={{width:`${95-guide*.65}%`}}/></label></div></div></div>}

      <div className="resultBand"><div><span>REPORTED RESULT</span><p>{active.result}</p></div><div><span>METRIC THAT MATTERS</span><b>{active.metric}</b></div></div>
      {active.limitation&&<aside className="limitation"><span>IMPORTANT LIMITATION</span><p>{active.limitation}</p></aside>}
      {active.organizationShelf&&<div className="shelf"><div className="shelfHead"><span>FIVE-ORGANIZATION RESEARCH STATUS</span><b>Weather and Earth-system AI is now a multi-lab architecture race.</b></div>{active.organizationShelf.map(item=><a href={item.url} target="_blank" rel="noreferrer" className="shelfRow" key={item.system}><b>{item.org}</b><span>{item.system}</span><span>{item.year}</span><span>{item.architecture}</span><p>{item.evidence}</p><small>{item.relation}</small></a>)}</div>}
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
