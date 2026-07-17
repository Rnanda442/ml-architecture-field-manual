import type { CaseScript, PresentationStageId, ScriptCue, SupplementScript } from "./types";

const say = (
  stage: PresentationStageId,
  text: string,
  cue?: ScriptCue["cue"],
  extra: Omit<ScriptCue, "stage" | "text" | "cue"> = {},
): ScriptCue => ({ stage, text, cue, ...extra });

export const caseScripts: Record<string, CaseScript> = {
  quantum: {
    title: "Decoding quantum-error evidence across space and time",
    quick: [
      say("objective", "A normal bit is read as zero or one. A qubit is a fragile quantum information unit, so the goal is to protect one logical qubit by spreading it across several physical qubits."),
      say("bottleneck", "The repeated checks produce syndrome events. Those events are evidence that something changed; they do not identify the error by themselves."),
      say("architecture", "The decoder connects events across qubits with attention, carries unresolved evidence across measurement cycles with recurrence, and outputs logical-error probabilities."),
      say("vocabulary", "Keep the distinction clear: the model estimates probabilities, while the controller applies a correction rule."),
      say("weights", "Attention relationships are dynamic, network parameters are learned by gradients, and correction costs or thresholds are selected outside the model."),
      say("lab", "This classroom lab asks what happens when earlier syndrome evidence fades too quickly. It illustrates the idea; it does not reproduce the paper's experiment."),
      say("result", "The paper reports lower logical error rate than leading algorithmic decoders on the evaluated Sycamore data, with hardware-specific and small-code limitations."),
    ],
    full: {
      objective: [
        say("objective", "Let me start with the information we are trying to protect. An ordinary digital bit is recorded as zero or one. A qubit is different: it is a quantum information unit whose measurement probabilities can be disturbed by very small physical errors."),
        say("objective", "A physical qubit is the real hardware element. A logical qubit is the protected information encoded across several physical qubits. The reason for using several imperfect physical qubits is that their repeated relationships can reveal error evidence without directly reading and destroying the protected logical state.", "POINT", { relatedVocabularyTerm: "Logical qubit" }),
        say("objective", "The surface code is the grid-like error-correction scheme that organizes those physical and measurement qubits. Measurement qubits repeatedly check relationships among data qubits. One full round of checks is a measurement cycle."),
      ],
      bottleneck: [
        say("bottleneck", "Here is the scientific bottleneck: a syndrome event is a change in a check measurement. It is like a smoke alarm. It tells us there is evidence of a disturbance, but it does not tell us exactly where the fault started or which correction is correct."),
        say("bottleneck", "The decoder therefore has to connect evidence in two directions. Spatially, it asks which qubits are participating in one pattern. Temporally, it asks whether events from several measurement cycles belong to the same unfolding error."),
        say("bottleneck", "If we treat every event independently, we can miss a correlated error. If we connect everything to everything, random noise can look like one global failure.", "PAUSE"),
      ],
      architecture: [
        say("architecture", "Follow the boxes from left to right. Syndrome events enter first. Spatial attention compares events within the current cycle. Event A may receive an attention relationship of 0.8 with Event B but only 0.1 with Event C. Those numbers are calculated for the current pattern, so they are dynamic weights.", "CLICK", { relatedNodeId: "spatial" }),
        say("architecture", "Recurrent memory then carries unresolved evidence into later cycles. That is recurrence: the current hidden state is updated using both new evidence and retained information from the previous cycle.", "CLICK", { relatedNodeId: "memory" }),
        say("architecture", "The decoder head converts the hidden representation into logical-error probabilities. The model is not directly pressing a correction button. It produces probabilities; the controller applies decision rules.", "CLICK", { relatedNodeId: "probability" }),
        say("architecture", "If the operational threshold is 70%, a prediction of 85% would trigger the selected correction rule. That threshold is an operational choice, not a neural-network parameter learned by the paper's gradient updates.", "POINT", { relatedNodeId: "correction" }),
      ],
      vocabulary: [
        say("vocabulary", "Use the term selector to connect a word to its physical place in the diagram. Physical qubit means the hardware. Logical qubit means the protected encoded information. Syndrome event means evidence. Decoder means the system that turns that evidence into estimated error probabilities.", "CLICK", { relatedVocabularyTerm: "Syndrome event" }),
        say("vocabulary", "Logical error rate is the rate at which the protected logical information fails. A false correction means acting on an error that was not present; a missed error means failing to act on a real one. Those consequences matter after prediction."),
      ],
      weights: [
        say("weights", "The purple learned parameters include embeddings, attention projections, recurrent-state parameters, and decoder-head weights. Gradients update those stored values because changing them can reduce the training loss."),
        say("weights", "The teal attention relationships are dynamic weights calculated from the current syndrome pattern. The blue and orange terms represent researcher choices, including how examples or loss terms contribute. The red correction cost and threshold belong to the controller."),
        say("weights", "In the displayed loss, theta represents learned neural-network parameters. Lambda logical and lambda regularization are researcher-selected coefficients. Increasing lambda logical makes logical-error mistakes contribute more strongly; increasing regularization discourages extreme parameters. This compact equation is a teaching summary, not every detail of the paper's implementation.", "POINT", { technicalNote: "Explain coefficients by ownership rather than reading the symbols aloud." }),
      ],
      lab: [
        say("lab", "The lab asks: what changes if old syndrome evidence fades too quickly? Start with memory retention near seventy percent, then reduce it toward twenty percent.", "ADJUST", { relatedLabControl: "Memory retention" }),
        say("lab", "Notice that older evidence fades before the pattern is complete. A model can then react to only the newest event and miss the temporal relationship. Attention concentration changes the spatial relationship, while the false-correction versus missed-error control changes the downstream decision.", "OBSERVE"),
        say("lab", "This is an illustrative classroom example. The slider values are not measurements from Sycamore and do not reproduce the paper's reported logical error rates."),
      ],
      result: [
        say("result", "Reported by the paper: the recurrent transformer decoder achieved lower logical error rate than leading algorithmic decoders on the evaluated real Sycamore surface-code data and generalized beyond the twenty-five-cycle training setting."),
        say("result", "Operationally, that means learned probability estimates may help a controller choose corrections under the evaluated conditions. It does not prove broad deployment readiness. The demonstrations use small code distances and hardware-specific data, so new hardware, larger codes, and different noise require external validation.", "PAUSE"),
      ],
    },
    deeperNotes: [
      "Measurement qubits provide repeated parity-check evidence; they do not reveal the protected logical state directly.",
      "The correction threshold and false-correction cost are downstream controls unless a specific controller explicitly learns them.",
    ],
  },

  minerals: {
    title: "Learning geospatial structure before scarce deposit labels",
    quick: [
      say("objective", "Mineral prospectivity is the estimated favorability of a location, not proof that a deposit is present."),
      say("bottleneck", "The model must combine geology, geophysics, and geochemistry even though confirmed deposits are rare and spatially biased."),
      say("architecture", "Aligned map patches are masked for self-supervised pretraining, then scarce deposit labels fine-tune the encoder."),
      say("vocabulary", "A foundation model learns reusable geospatial structure; fine-tuning adapts that representation to prospectivity."),
      say("weights", "Rare-positive weights protect scarce deposits during training, while survey cost changes operational ranking after prediction."),
      say("lab", "The lab is an illustrative test of evidence reliability, rare-class emphasis, uncertainty, and survey cost."),
      say("result", "The paper reports stronger prospectivity features across its evaluated regions, but field mapping and drilling still validate targets."),
    ],
    full: {
      objective: [
        say("objective", "Mineral prospectivity means how promising a map location is for containing a deposit. The inputs are geospatial layers: geology describes rocks and structures, geophysics measures physical contrasts such as magnetics, and geochemistry records chemical evidence."),
        say("objective", "These are multimodal data because each layer measures a different aspect of the same location. The output is a prospectivity and uncertainty map that helps geoscientists rank where limited fieldwork or drilling should go next."),
      ],
      bottleneck: [
        say("bottleneck", "The difficult part is not just stacking maps. The layers have different units, coverage, resolution, and reliability, and the positive deposit labels are extremely rare."),
        say("bottleneck", "Imagine twenty deposit cells and 9,980 background cells. A useless classifier that predicts background everywhere would appear 99.8% accurate. That is class imbalance: ordinary accuracy can reward a model that never finds the thing we care about.", "ASK"),
        say("bottleneck", "Known deposits are also spatially biased toward places people already surveyed. The model may otherwise learn the history of exploration effort instead of transferable geology."),
      ],
      architecture: [
        say("architecture", "The first step aligns geology, geophysics, and geochemistry into common map patches. During masked pretraining, part of a patch is hidden and the encoder predicts the missing structure from what remains.", "CLICK", { relatedNodeId: "mask" }),
        say("architecture", "That is self-supervised learning: the data creates the training task, so broad unlabeled maps can teach a reusable representation. The pretrained encoder acts as a geospatial foundation model."),
        say("architecture", "Fine-tuning then introduces the scarce known-deposit labels. The output separates prospectivity from uncertainty, and an exploration-ranking step combines those estimates with access and survey cost.", "POINT", { relatedNodeId: "rank" }),
      ],
      vocabulary: [
        say("vocabulary", "Select map patch, masking, and fine-tuning in order. A map patch is one local training tile. Masking hides part of it. Fine-tuning adapts the broad representation to the labeled deposit task.", "CLICK", { relatedVocabularyTerm: "Masking" }),
        say("vocabulary", "Geological probability and operational ranking are not the same. A remote cell may have high prospectivity but rank below a slightly lower-probability target that is cheaper and safer to survey."),
      ],
      weights: [
        say("weights", "The encoder parameters are learned. Mask sampling, variable scaling, and rare-positive class weights are researcher choices. A larger rare-positive weight makes missing a deposit contribute more strongly to training loss."),
        say("weights", "The reconstruction, prospectivity, and calibration loss coefficients decide how the training errors compete. Survey cost is different: it belongs to the operational ranking after the geological prediction."),
        say("weights", "The displayed equation is a teaching decomposition. Increasing lambda mask emphasizes reconstruction; increasing lambda prospect emphasizes labeled prospectivity; increasing lambda calibration emphasizes honest probabilities. None of those coefficients is automatically the final field budget."),
      ],
      lab: [
        say("lab", "The question is: which evidence layer should the model trust most? Change geology, magnetics, or geochemistry reliability, then observe how both priority and uncertainty respond.", "ADJUST", { relatedLabControl: "Geology reliability" }),
        say("lab", "Now raise the rare-deposit class weight. Rare targets become harder for the training objective to ignore. Finally raise survey cost and notice that operational priority can drop even when geological prospectivity stays high.", "OBSERVE"),
        say("lab", "These heat-map values are illustrative classroom outputs, not a reconstruction of the paper's regional maps."),
      ],
      result: [
        say("result", "Reported by the paper: self-supervised pretraining produced more robust features and improved lead-zinc prospectivity predictions across the evaluated North American and Australian settings."),
        say("result", "Operationally, the model helps order investigation, but it cannot confirm an ore body. Sparse labels, spatial sampling bias, uncertain layer quality, field mapping, sampling, and drilling remain decisive external checks."),
      ],
    },
    deeperNotes: ["Uncertainty is not simply one minus prospectivity.", "A field target should retain source-layer provenance so geologists can challenge the ranking."],
  },

  finance: {
    title: "Choosing a hedge path after repeated trading costs",
    quick: [
      say("objective", "Deep hedging learns a sequence of risk-reducing actions, not tomorrow's stock direction."),
      say("bottleneck", "Each hedge changes cost, exposure, and the next portfolio state."),
      say("architecture", "State enters a policy, the policy chooses an action, transaction cost updates the portfolio, and the sequence repeats."),
      say("vocabulary", "Turnover measures position changes; terminal risk evaluates the final cost-adjusted outcome."),
      say("weights", "Policy parameters are learned, scenario and risk terms shape training, and market costs define the decision environment."),
      say("lab", "The classroom sliders show why higher trading cost can reduce turnover even when risk aversion stays high."),
      say("result", "The paper reports better terminal convex risk after costs in its synthetic setting, with simulator and regime-shift limitations."),
    ],
    full: {
      objective: [
        say("objective", "A hedge is a position taken to reduce an unwanted market exposure. Deep hedging is not ordinary stock-direction prediction. The model is judged by the final portfolio distribution after a sequence of actions and costs."),
        say("objective", "The input state includes market conditions, time, holdings, cash, and the current hedge. The output is a hedge action that changes the next state."),
      ],
      bottleneck: [
        say("bottleneck", "This is a sequential decision problem. A trade that looks attractive now changes tomorrow's exposure and creates transaction cost today."),
        say("bottleneck", "For example, suppose ten small hedge adjustments each appear to save one dollar of local risk but each costs two dollars to trade. The sequence looks active and responsive, yet it destroys ten dollars after repeated costs."),
        say("bottleneck", "That is why the objective evaluates terminal P&L and tail risk rather than rewarding each local move separately."),
      ],
      architecture: [
        say("architecture", "Read the diagram as a loop. Market and portfolio state enter the learned policy. The policy proposes a hedge action. Transaction cost is deducted, the portfolio state updates, and that new state becomes the next input.", "POINT", { relatedNodeId: "policy" }),
        say("architecture", "After the final step, the system examines the terminal P&L distribution. A terminal-risk objective scores the full path, including quiet scenarios and severe tail events.", "CLICK", { relatedNodeId: "risk" }),
      ],
      vocabulary: [
        say("vocabulary", "Policy means a state-to-action rule. Turnover means how much positions change. Risk aversion controls how strongly damaging uncertainty is penalized. Tail risk means rare but severe loss."),
        say("vocabulary", "Stress scenarios keep extreme paths visible, but they remain modeling assumptions. They do not guarantee the next crisis will resemble the simulated one."),
      ],
      weights: [
        say("weights", "The policy's stored neural-network parameters are learned by gradients. Scenario weights and risk-aversion settings are researcher choices that determine which paths dominate training."),
        say("weights", "Transaction-cost coefficients and operational limits are not predictions. They define the environment in which an action becomes worthwhile."),
        say("weights", "In the equation, theta is learned. Gamma represents the chosen risk preference, and c multiplies turnover cost. Increasing c discourages frequent adjustments; increasing risk aversion can justify paying more cost to reduce severe terminal losses. The equation is a compact teaching form."),
      ],
      lab: [
        say("lab", "Raise transaction cost and observe trading frequency fall. Then raise risk aversion or stress-scenario weight and watch the policy tolerate some cost when stronger protection is valuable.", "ADJUST", { relatedLabControl: "Transaction cost" }),
        say("lab", "This classroom relationship is illustrative. It does not replay the paper's Heston simulation or reproduce its reported risk values.", "OBSERVE"),
      ],
      result: [
        say("result", "Reported by the paper: in its synthetic Heston-market experiments with transaction costs, deep hedging produced efficient high-dimensional strategies and better terminal convex risk than the standard complete-market solution."),
        say("result", "Operationally, the architecture teaches us to optimize the whole action path after frictions. It does not prove live-market robustness; simulator mismatch, changing regimes, liquidity, and execution constraints can make a learned policy brittle."),
      ],
    },
    deeperNotes: ["A policy action can be continuous rather than a buy/sell class.", "Risk preference is part of the objective; it is not discovered as a universal market truth."],
  },

  materials: {
    title: "Generating crystals by reversing structured noise",
    quick: [
      say("objective", "Forward prediction asks what a known crystal will do; inverse design asks what crystal could satisfy a requested property."),
      say("bottleneck", "Atom types, coordinates, and the repeating lattice must remain one physically coherent structure."),
      say("architecture", "MatterGen denoises a noisy crystal with an equivariant score network and property guidance."),
      say("vocabulary", "Equivariance preserves consistent geometric reasoning under rotation or translation."),
      say("weights", "Learned denoising parameters differ from researcher-chosen channel losses and sampling guidance."),
      say("lab", "Stronger guidance can improve target compliance while reducing candidate diversity."),
      say("result", "Generation narrows candidates; DFT and experimental synthesis remain external validation."),
    ],
    full: {
      objective: [
        say("objective", "Forward property prediction begins with a known crystal and estimates its properties. Inverse design reverses the question: begin with a desired property and generate a possible crystal that could satisfy it."),
        say("objective", "A crystal contains atom types, atomic coordinates, and a lattice—the repeating three-dimensional cell. MatterGen must produce all three together."),
      ],
      bottleneck: [
        say("bottleneck", "Changing an atom without adjusting coordinates or lattice can create a physically nonsensical structure. The channels are different, but they describe one coupled object."),
        say("bottleneck", "The model also needs geometric consistency. Rotating or translating the same crystal should not make it appear to be a different physical material. That property is equivariance."),
      ],
      architecture: [
        say("architecture", "Sampling starts with a noisy crystal. Artificial noise means deliberate disorder introduced during training, not laboratory contamination. The score network predicts one denoising update at a time.", "CLICK", { relatedNodeId: "score" }),
        say("architecture", "Each step balances atom identity, coordinate, and lattice updates. Conditioning supplies the requested property, and guidance strength determines how firmly sampling is pushed toward that condition.", "POINT", { relatedNodeId: "guidance" }),
        say("architecture", "The output is a candidate crystal. DFT screening then evaluates energy and stability, and experimental synthesis asks whether the material can actually be made. Those are external validation stages."),
      ],
      vocabulary: [
        say("vocabulary", "A denoising step removes part of the artificial disorder. Stability asks whether a candidate is energetically plausible. Synthesizability asks whether a real experimental route can produce it. Generation alone proves neither."),
        say("vocabulary", "Diversity is the range of distinct candidates. Target compliance is how closely candidates match the requested property. Strong guidance can improve one while hurting the other."),
      ],
      weights: [
        say("weights", "The score-network and conditioning parameters are learned. Lambda A, lambda X, and lambda L are researcher-selected loss coefficients for atom, coordinate, and lattice errors."),
        say("weights", "Increasing one coefficient tells the optimizer to prioritize that channel more strongly. Guidance strength is a sampling control calculated from conditioned and unconditioned predictions; screening thresholds and DFT budget are downstream research decisions."),
        say("weights", "The displayed equation is a teaching summary of balanced channel losses and classifier-free-style guidance. It should not be read as every implementation detail of MatterGen."),
      ],
      lab: [
        say("lab", "Raise guidance strength and observe target compliance increase while diversity narrows. Then unbalance the atom, coordinate, or lattice channel and notice how one part of the structure can dominate the update.", "ADJUST", { relatedLabControl: "Guidance strength" }),
        say("lab", "The displayed compliance and diversity values are illustrative classroom consequences, not MatterGen paper measurements.", "OBSERVE"),
      ],
      result: [
        say("result", "Reported by the paper: MatterGen generated structures more than twice as likely to be stable, unique, and new than prior models and more than ten times closer to a local energy minimum; a synthesized example was within twenty percent of its target property."),
        say("result", "Operationally, the generator reduces the search space. It does not prove stability, synthesizability, economic value, or safe deployment. DFT and laboratory work remain decisive."),
      ],
    },
    deeperNotes: ["Guidance affects sampling behavior; it is not the same as a stored learned parameter.", "DFT stability is computational evidence, not experimental synthesis."],
  },

  math: {
    title: "Separating plausible proof proposals from formal validity",
    quick: [
      say("objective", "The language model proposes proof steps; Lean determines whether those steps are formally valid."),
      say("bottleneck", "A plausible sentence is not enough: every tactic must transform the exact proof state correctly."),
      say("architecture", "The model proposes branches, search allocates attempts, and Lean accepts or rejects each step."),
      say("vocabulary", "A proof state contains known assumptions and the remaining goal; a tactic changes that state."),
      say("weights", "Model parameters are learned, verifier feedback shapes training, and branch budget controls search."),
      say("lab", "Spending every attempt on one attractive but wrong branch can hide the correct proof."),
      say("result", "The paper reports benchmark gains under finite search budgets, not universal mathematical reasoning."),
    ],
    full: {
      objective: [
        say("objective", "A theorem is a statement that must be proved. A formal proof records every logical step in a language precise enough for software to check. Here that language and proof assistant is Lean."),
        say("objective", "The central distinction is worth saying twice: The language model proposes plausible steps. Lean determines whether those steps are formally valid."),
      ],
      bottleneck: [
        say("bottleneck", "The current proof state contains assumptions, available context, and one or more remaining goals. A tactic transforms that state. A lemma is a previously established result that may help, and a subgoal is a smaller statement created on the way to the theorem."),
        say("bottleneck", "Language likelihood and formal correctness are different. A step can sound mathematically persuasive and still fail because its type, assumptions, or exact rule do not match Lean."),
      ],
      architecture: [
        say("architecture", "Start at the theorem and proof state. The language model proposes tactics or lemmas. Each proposal creates a possible search branch.", "CLICK", { relatedNodeId: "model" }),
        say("architecture", "Lean verifies the proposed step. Accepted steps create a new proof state; rejected steps are pruned. Search continues until one branch becomes a complete verified proof.", "CLICK", { relatedNodeId: "verifier" }),
        say("architecture", "The language model proposes plausible steps. Lean determines whether those steps are formally valid.", "PAUSE"),
      ],
      vocabulary: [
        say("vocabulary", "Pass at k means success if at least one of k attempts verifies. It measures the combined proposal-and-search system under a stated attempt budget, not the probability that the first answer is correct."),
        say("vocabulary", "Reinforcement learning uses verifier-grounded outcomes to strengthen productive trajectories. KL control discourages the updated model from moving too far from a reference model."),
      ],
      weights: [
        say("weights", "The language model's stored parameters are learned. Verifier reward and advantage weighting shape reinforcement updates. Beta or kappa coefficients controlling KL behavior are researcher-selected."),
        say("weights", "Branch budget is a search decision. Suppose we have eight attempts and spend all eight on one plausible but incorrect branch. The correct proof on another branch is never tested, even if the model could have proposed it."),
        say("weights", "In the displayed teaching equation, supervised loss, advantage-weighted policy updates, and KL control are combined. Increasing KL control keeps the updated model closer to the reference but may slow adaptation."),
      ],
      lab: [
        say("lab", "Choose a branch strategy and reduce the attempt budget. Observe how an early attractive branch can consume the search before another valid path is explored.", "ADJUST", { relatedLabControl: "Branch budget" }),
        say("lab", "This toy tree illustrates allocation pressure. It does not reproduce MiniF2F or PutnamBench search traces.", "OBSERVE"),
      ],
      result: [
        say("result", "Reported by the paper: DeepSeek-Prover-V2 achieved an 88.9 percent pass ratio on MiniF2F-test and solved 49 of 658 PutnamBench problems under its evaluated system and budget."),
        say("result", "Operationally, formal verification gives an exact acceptance boundary for a fully specified Lean problem. The result does not show that every informal theorem is formalized correctly or that finite search will find every valid proof."),
      ],
    },
    deeperNotes: ["Verifier correctness is conditional on the formal statement and trusted kernel.", "Search failure does not prove that no proof exists."],
  },

  business: {
    title: "Forecasting a distribution before choosing inventory",
    quick: [
      say("objective", "DeepAR predicts a demand distribution across many related products, not one number per item."),
      say("bottleneck", "Sparse product histories need shared sequence memory and honest uncertainty."),
      say("architecture", "Histories and covariates enter a shared recurrent model, which outputs distribution parameters and rolls forward."),
      say("vocabulary", "A point forecast says 100 units; a probabilistic forecast says demand centers near 100 but may range from 70 to 145."),
      say("weights", "Shared parameters are learned, likelihood and horizon weights shape training, and shortage versus overstock cost selects a quantile."),
      say("lab", "The classroom sliders show why the median is not always the correct order quantity."),
      say("result", "The paper reports accuracy improvements across evaluated datasets, with distribution and tail-calibration limitations."),
    ],
    full: {
      objective: [
        say("objective", "A demand forecast estimates future units. A point forecast says, 'Next week will be 100 units.' A probabilistic forecast says, 'Demand centers near 100 but could reasonably range from 70 to 145.'"),
        say("objective", "DeepAR produces the second kind. The output is a distribution, and the inventory decision selects a quantity from that distribution."),
      ],
      bottleneck: [
        say("bottleneck", "A time series is a chronological sequence of observations. Many products have sparse or intermittent histories, so training one model per product wastes shared patterns."),
        say("bottleneck", "The architecture must remember each product's recent sequence, share statistical strength across products, include covariates such as price or holiday, and represent future uncertainty."),
      ],
      architecture: [
        say("architecture", "Product histories and covariates enter one global recurrent model. Global means the recurrent parameters are shared across many series, while each product still carries its own hidden state.", "CLICK", { relatedNodeId: "rnn" }),
        say("architecture", "The distribution head outputs parameters for the next step. Autoregression means the sequence then rolls forward, using earlier observations or predictions to produce later ones.", "CLICK", { relatedNodeId: "likelihood" }),
        say("architecture", "The uncertainty fan visualizes possible outcomes. A selected quantile becomes the inventory quantity only after shortage and overstock costs are considered."),
      ],
      vocabulary: [
        say("vocabulary", "A quantile is a position in the forecast distribution. The median is the fiftieth percentile, but it is not automatically the correct order quantity."),
        say("vocabulary", "If shortage is much more costly than overstock, the decision may use a higher quantile. Calibration asks whether the predicted probabilities match observed frequencies over many comparable forecasts."),
      ],
      weights: [
        say("weights", "Shared recurrent connections and distribution-head parameters are learned. Likelihood design and horizon weights are researcher choices. Shortage and overstock costs are operational values."),
        say("weights", "In the equation, theta is learned by maximizing likelihood, while lambda time-step weights are selected. The cost ratio q equals shortage cost divided by total shortage and overstock cost. Raising shortage cost moves q upward and raises the inventory quantity."),
        say("weights", "That newsvendor-style quantile rule is an operational teaching connection; it is not itself a hidden neural-network output."),
      ],
      lab: [
        say("lab", "Set shortage cost to seven and overstock cost to three. The selected quantile rises above the median because stocking out is more expensive. Reverse the costs and watch the decision move lower.", "ADJUST", { relatedLabControl: "Shortage cost" }),
        say("lab", "The forecast fan and quantities are illustrative. They do not reproduce one of the paper's exact product series.", "OBSERVE"),
      ],
      result: [
        say("result", "Reported by the paper: DeepAR improved forecasting accuracy by around fifteen percent over then-state-of-the-art methods across several evaluated real-world datasets."),
        say("result", "Operationally, the distribution supports cost-sensitive inventory decisions. The result does not guarantee calibrated tails under regime change, poor covariates, promotion shocks, or a mismatched distribution family."),
      ],
    },
    deeperNotes: ["The recurrent model is global, but scale and item identity still matter.", "A calibrated median does not imply calibrated extreme quantiles."],
  },

  graphcast: {
    title: "Moving weather information across a spherical multimesh",
    quick: [
      say("objective", "GraphCast predicts the next six-hour global weather state and repeatedly rolls that state forward."),
      say("bottleneck", "Weather combines local detail with long-range relationships on a curved Earth."),
      say("architecture", "Two recent grids are encoded to a spherical multimesh, processed by message passing, and decoded back to the next grid."),
      say("vocabulary", "Fine edges preserve local detail; coarse edges move information farther in fewer steps."),
      say("weights", "Network parameters are learned, while variable and latitude weights balance the forecast loss."),
      say("lab", "The classroom lab illustrates depth, connection scale, rollout, and possible over-smoothing."),
      say("result", "The paper reports lower error than HRES on over 90 percent of evaluated targets, while GraphCast remains deterministic."),
    ],
    full: {
      objective: [
        say("objective", "A weather state is the collection of atmospheric variables—such as wind, pressure, temperature, and humidity—across the globe at one time. GraphCast reads two recent states and predicts the next state six hours ahead."),
        say("objective", "A rollout repeats that one-step forecast to produce a medium-range trajectory."),
      ],
      bottleneck: [
        say("bottleneck", "A latitude-longitude grid is convenient for storing weather, but the Earth is spherical and atmospheric influence is multiscale. A front needs fine local detail, while planetary waves connect distant regions."),
        say("bottleneck", "A purely local grid would need many processing steps for information to travel far. Too many steps can also cause over-smoothing, where sharp regional differences blur together."),
      ],
      architecture: [
        say("architecture", "Two recent weather grids enter the grid-to-mesh encoder. The encoder turns grid values into node and edge features on a spherical multimesh.", "CLICK", { relatedNodeId: "encode" }),
        say("architecture", "A graph contains nodes connected by edges. Message passing lets each node receive, transform, and aggregate information from connected nodes. Fine-mesh edges preserve nearby structure; coarse-mesh edges move information farther with fewer message-passing steps.", "CLICK", { relatedNodeId: "messages" }),
        say("architecture", "The mesh-to-grid decoder produces the next six-hour state. That output enters the rollout loop, so four steps advance one day and repeated steps build the medium-range forecast.", "POINT", { relatedNodeId: "rollout" }),
      ],
      vocabulary: [
        say("vocabulary", "Node means one computational location. Edge means an allowed information path. Processor means the repeated message-passing core. Multiscale means the graph represents both local and long-range relationships."),
        say("vocabulary", "Over-smoothing is the risk that repeated mixing makes locations too similar. Deterministic means GraphCast produces one forecast trajectory rather than a full probability distribution or ensemble."),
      ],
      weights: [
        say("weights", "Node, edge, message, aggregation, and decoder parameters are learned by gradients. Variable weights are researcher-selected so one variable or unit scale does not dominate the loss."),
        say("weights", "Latitude weighting corrects a geometric imbalance. Latitude-longitude rows contain the same number of cells, but cells near the poles cover much less physical area than cells near the equator. Without area-aware weighting, many small polar cells could count too strongly."),
        say("weights", "In the equation, theta is learned. Lambda v balances variables, and omega latitude balances grid-cell area. Increasing one variable's lambda makes its error contribute more. Missed-warning and false-alarm costs remain downstream operational choices."),
      ],
      lab: [
        say("lab", "Compare local-only and multiscale connections. With coarse links, information travels farther at the same message-passing depth. Increase depth too far and the illustration warns about over-smoothing.", "ADJUST", { relatedLabControl: "Message-passing depth" }),
        say("lab", "Extend the rollout and notice how one-step errors can accumulate. The displayed values are conceptual classroom outputs, not GraphCast benchmark results.", "OBSERVE"),
      ],
      result: [
        say("result", "Reported by the paper: GraphCast had lower error than HRES on more than ninety percent of 1,380 evaluated targets and produced a ten-day global forecast at quarter-degree resolution in under one minute."),
        say("result", "Operationally, the architecture provides a fast deterministic trajectory. It does not supply a complete uncertainty distribution, and reanalysis training, rare extremes, changing climate, warning thresholds, and ensemble calibration remain limitations or downstream requirements."),
      ],
    },
    deeperNotes: ["The multimesh is a computational representation, not a literal atmospheric mesh.", "A deterministic forecast can be highly accurate while still understating uncertainty."],
  },
};

export const weightDictionaryScript = [
  "A weight can live in three different places, so I first ask who controls it. A learned parameter is stored inside the model and updated by gradients. A dynamic weight, such as attention, is calculated again for the current input.",
  "A data weight controls how strongly an example, class, location, variable, or time step contributes. A loss measures training error. A loss weight is a researcher-selected coefficient that balances one training error against another.",
  "The gradient indicates how each learned parameter should move to reduce the loss. The optimizer applies those parameter updates. Regularization adds pressure against memorization or extreme values; its strength is normally selected by the researcher.",
  "After the model predicts, decision cost represents the consequence of an action, and a threshold converts a score into an action. Calibration checks whether probabilities correspond to observed frequencies before those probabilities are trusted.",
  "The model uses stored parameters to produce a prediction. The loss measures how wrong that prediction was. Researcher-selected loss weights determine which errors matter most. Gradients tell the optimizer how to update the learned parameters. After training, calibrated predictions are combined with operational costs and thresholds to produce actions.",
  "So purple and teal describe what the model stores or calculates. Blue and orange describe how researchers shape data and training. Red describes the consequence-aware decision after prediction. Mixing these categories is how a technical diagram accidentally claims that the neural network learned a field budget, warning policy, inventory cost, or correction rule that people actually selected.",
];

export const supplementScripts: Record<string, SupplementScript> = {
  "supplement-vanilla-rnn": {
    quick: ["A vanilla RNN carries one hidden state through time. New input and the previous state combine through shared learned weights to produce the next state and prediction.", "The same transition is reused at every step. Researchers choose the state size, sequence window, loss, and regularization, while training learns the input, recurrent, and output matrices.", "It is simple and useful, but long-term information can fade. That limitation motivates the gates in LSTM and GRU and connects directly to the sequence memory used in DeepAR and the quantum decoder."],
    full: [
      "The problem is sequence context: the current input may not make sense without recent history. The inputs are x at the current time and h from the previous time.",
      "The same learned input and recurrent matrices are reused at every step. The output matrix converts the hidden state into a prediction. Researchers choose hidden size, sequence length, loss, and regularization.",
      "Compared directly: a vanilla RNN has a simple carried hidden state and is prone to fading long-term information. An LSTM adds a separate memory cell with input, forget, and output gates. A GRU uses reset and update gates with a more compact state.",
      "This supplement connects to DeepAR's recurrence and the quantum decoder's time memory.",
    ],
    equationNote: "The equation measures the next hidden state. W x and W h are learned; tanh is the chosen activation. Repeated multiplication can shrink or enlarge gradients.",
    failureMode: "Long dependencies fade or unstable gradients grow.",
    flagshipLinks: ["Quantum error correction", "DeepAR demand forecasting"],
  },
  "supplement-lstm": {
    quick: ["An LSTM gives recurrence a separate memory cell and three gates: input, forget, and output. Those gates learn what to write, retain, and expose.", "The inputs are the current observation and previous state; the outputs are a new cell state and hidden state. Gate parameters are learned, while researchers choose state size, horizon, objective, and regularization.", "LSTM helps information survive longer than in a vanilla RNN, but a poorly learned gate can still erase useful history or preserve noise."],
    full: [
      "The input and previous hidden state produce gate values. The cell state is the protected memory path; the hidden state is the exposed working representation.",
      "Forget, input, and output gate parameters are learned. Researchers choose state size, sequence window, loss, and regularization.",
      "Compared directly: vanilla RNN uses one simple state; LSTM uses a cell plus input, forget, and output gates; GRU uses reset and update gates in a more compact design.",
      "The common failure is a gate that learns to erase useful history or keep irrelevant history. This mechanism explains why long memory is an explicit architecture decision.",
    ],
    equationNote: "The equation updates the cell state. f and i are dynamic gate values produced by learned parameters; increasing f retains more prior memory, while increasing i writes more candidate content.",
    failureMode: "Poorly learned gates either erase useful history or preserve noise.",
    flagshipLinks: ["Quantum error correction", "DeepAR demand forecasting"],
  },
  "supplement-gru": {
    quick: ["A GRU is a compact gated recurrent model. Its reset gate controls how history shapes a candidate state, and its update gate blends that candidate with the previous state.", "The inputs are the current observation and previous hidden state; the output is the updated state. Gate and candidate parameters are learned, while the researcher chooses horizon, state width, loss, and regularization.", "Compared with LSTM, GRU has no separate cell state. That compactness can be efficient, but it may provide less explicit control for some long dependencies."],
    full: [
      "The inputs are the current observation and previous hidden state. Unlike LSTM, the GRU does not maintain a separate cell state.",
      "Reset-gate, update-gate, and candidate-state parameters are learned. Researchers select state width, horizon, objective, and training settings.",
      "Compared directly: vanilla RNN carries one simple state; LSTM adds a separate cell with three gates; GRU uses two gates and a compact combined state.",
      "GRU can be efficient, but compact control can be less expressive for some long structured dependencies.",
    ],
    equationNote: "The update equation blends old state and candidate state. z is a dynamic gate value generated from learned parameters; moving z changes the balance between retention and replacement.",
    failureMode: "The update gate can replace stable context too quickly or retain stale context too long.",
    flagshipLinks: ["Quantum error correction", "DeepAR demand forecasting"],
  },
  "supplement-actor-critic": {
    quick: ["Actor-critic separates action choice from value estimation. The actor proposes an action, the critic estimates future value, and their difference produces an advantage signal for learning.", "The state is the input; action and value are the outputs. Actor and critic parameters are learned, while reward design, discounting, exploration, and loss balance are selected by the researcher.", "A biased critic can push the actor in the wrong direction. The architecture connects to deep hedging because both reason over sequential actions and later consequences."],
    full: [
      "The input is the current state. The actor outputs an action distribution or action, while the critic outputs an estimate of expected future return.",
      "Actor and critic network parameters are learned. Researchers choose reward design, discount factor, exploration strength, and update balance.",
      "The advantage asks whether the observed outcome was better or worse than the critic expected. A biased critic can confidently push the actor in the wrong direction.",
      "This mechanism relates to sequential action and value tradeoffs in deep hedging, although the flagship paper uses its own objective and training setup.",
    ],
    equationNote: "Advantage compares reward plus discounted next value with current value. Gamma is researcher-selected; critic parameters are learned; reward encodes the task design.",
    failureMode: "A biased or unstable critic misdirects the actor.",
    flagshipLinks: ["Deep hedging"],
  },
  "supplement-llm-guided-formal-search": {
    quick: ["The language model ranks plausible proof branches, a finite budget decides which branches to expand, and Lean verifies every proposed step. Proposal and formal validity remain separate.", "The theorem and proof state are inputs; ranked proposals and accepted or rejected successor states are outputs. Model parameters are learned, while verifier-grounded reward and search strategy are research choices.", "A plausible but invalid branch can consume the budget and hide the correct proof. This is the reusable search mechanism behind the formal-theorem flagship lesson."],
    full: [
      "The input is a theorem and current proof state. The model outputs ranked tactic or lemma proposals; search creates branches; Lean returns accepted or rejected states.",
      "Language-model parameters are learned. Researchers choose search strategy, training objective, and verifier-grounded reward. The branch budget is a search allocation decision.",
      "A high-probability branch can still be wrong. If it consumes the entire budget, a lower-probability correct proof is never explored.",
      "This supplement is the reusable mechanism behind the formal-theorem flagship case.",
    ],
    equationNote: "The displayed score is a teaching abstraction. Model probability is produced by learned parameters, branch budget is allocated by search, and verifier acceptance is an external exact check.",
    failureMode: "Search collapses onto plausible but invalid branches.",
    flagshipLinks: ["Formal theorem proving"],
  },
  "supplement-self-supervised-pretraining": {
    quick: ["Self-supervised pretraining creates a learning task from unlabeled data. Part of the input is masked, the encoder reconstructs it, and the learned representation is later fine-tuned for a scarce labeled task.", "The encoder and task-head parameters are learned. Researchers choose the mask ratio, reconstruction target, data mixture, loss balance, and fine-tuning schedule.", "The output of pretraining is a reusable representation, not the final decision. A common failure is learning reconstruction patterns that do not transfer, which is why the mineral-prospectivity lesson separates pretraining from deposit fine-tuning."],
    full: [
      "The input is abundant unlabeled structure. Masking hides selected parts; the encoder processes what remains; a reconstruction head predicts the missing content.",
      "Encoder and task-head parameters are learned. Researchers choose mask ratio, reconstruction target, loss balance, data mixture, and fine-tuning schedule.",
      "The output of pretraining is a reusable representation, not the final prospectivity decision. Fine-tuning adapts it to deposit labels.",
      "A common failure is pretext-task mismatch: becoming good at reconstruction without learning features useful for the downstream problem. This connects directly to mineral prospectivity.",
    ],
    equationNote: "The equation adds reconstruction and supervised task loss. Model parameters are learned; lambda task is researcher-selected and controls how strongly labeled task error contributes.",
    failureMode: "The reconstruction task teaches patterns that do not transfer to the downstream task.",
    flagshipLinks: ["Mineral prospectivity"],
  },
};
