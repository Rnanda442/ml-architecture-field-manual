"use client";

import { useState, type CSSProperties, type ReactNode } from "react";
import { Latex } from "./Latex";

type LabValues = {
  quantumMemory: number;
  quantumAttention: number;
  quantumCost: number;
  mineralsGeology: number;
  mineralsMagnetics: number;
  mineralsGeochemistry: number;
  mineralsRare: number;
  mineralsCost: number;
  financeCost: number;
  financeRisk: number;
  financeStress: number;
  materialsGuidance: number;
  materialsAtom: number;
  materialsCoordinate: number;
  materialsLattice: number;
  mathBranch: string;
  mathStrategy: string;
  mathBudget: number;
  businessShortage: number;
  businessOverstock: number;
  businessProduct: string;
  graphDepth: number;
  graphConnections: string;
  graphRollout: number;
};

const defaults: LabValues = {
  quantumMemory: 62,
  quantumAttention: 56,
  quantumCost: 48,
  mineralsGeology: 72,
  mineralsMagnetics: 55,
  mineralsGeochemistry: 64,
  mineralsRare: 70,
  mineralsCost: 38,
  financeCost: 35,
  financeRisk: 62,
  financeStress: 48,
  materialsGuidance: 52,
  materialsAtom: 60,
  materialsCoordinate: 56,
  materialsLattice: 52,
  mathBranch: "lemma",
  mathStrategy: "balanced",
  mathBudget: 6,
  businessShortage: 7,
  businessOverstock: 3,
  businessProduct: "Seasonal item",
  graphDepth: 8,
  graphConnections: "multiscale",
  graphRollout: 5
};

const pct = (value: number) => `${Math.round(value)}%`;

function Slider({
  label,
  value,
  min = 0,
  max = 100,
  onChange
}: {
  label: string;
  value: number;
  min?: number;
  max?: number;
  onChange: (value: number) => void;
}) {
  return (
    <label className="lab-control">
      <span>
        {label}
        <b>{value}</b>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
      />
    </label>
  );
}

function Select({
  label,
  value,
  options,
  onChange
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}) {
  return (
    <label className="lab-select">
      <span>{label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value)}>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

function LabShell({
  ask,
  controls,
  observe,
  why,
  visual,
  onReset
}: {
  ask: string;
  controls: ReactNode;
  observe: ReactNode;
  why: string;
  visual: ReactNode;
  onReset: () => void;
}) {
  return (
    <section className="lab-panel" aria-label="Interactive teaching model">
      <div className="lab-topline">
        <div><span className="section-kicker">TRY THE IDEA</span><h2>Change a weighting decision</h2></div>
        <button onClick={onReset}>Reset</button>
      </div>
      <p className="lab-disclaimer"><b>ILLUSTRATIVE CLASSROOM EXAMPLE</b> This interaction explains the paper&apos;s reasoning. It does not reproduce the researchers&apos; data, fitted parameters, or reported experiment.</p>
      <div className="lab-grid">
        <div className="lab-card ask">
          <span>QUESTION</span>
          <p>{ask}</p>
        </div>
        <div className="lab-card adjust">
          <span>CONTROL + SETTING</span>
          {controls}
        </div>
        <div className="lab-card observe">
          <span>VISIBLE CONSEQUENCE</span>
          {visual}
          <p>{observe}</p>
        </div>
        <div className="lab-card why">
          <span>EXPLANATION + PAPER CONNECTION</span>
          <p>{why}</p>
          <small>LIMITATION: the control demonstrates a qualitative relationship only; it is not a paper-reported sensitivity test.</small>
        </div>
      </div>
    </section>
  );
}

export function InteractiveLab({ caseId }: { caseId: string }) {
  const [values, setValues] = useState<LabValues>(defaults);
  const update = <K extends keyof LabValues>(key: K, value: LabValues[K]) =>
    setValues((current) => ({ ...current, [key]: value }));
  const reset = () => setValues(defaults);

  if (caseId === "quantum") {
    const remembered = values.quantumMemory;
    const focus = values.quantumAttention;
    const conservative = values.quantumCost > 58;
    return (
      <LabShell
        ask="How much previous evidence should the decoder remember?"
        onReset={reset}
        controls={
          <>
            <Slider
              label="Memory retention"
              value={values.quantumMemory}
              onChange={(value) => update("quantumMemory", value)}
            />
            <Slider
              label="Attention concentration"
              value={values.quantumAttention}
              onChange={(value) => update("quantumAttention", value)}
            />
            <Slider
              label="False-correction vs missed-error cost"
              value={values.quantumCost}
              onChange={(value) => update("quantumCost", value)}
            />
          </>
        }
        visual={
          <div className="quantum-lab-visual">
            {[0, 1, 2, 3, 4].map((index) => (
              <i
                key={index}
                style={{ opacity: Math.max(0.2, (remembered - index * 9) / 100) }}
              />
            ))}
            <span style={{ width: `${Math.max(18, focus)}%` }} />
            <b>{conservative ? "wait for stronger evidence" : "apply correction now"}</b>
          </div>
        }
        observe={
          <>
            Temporal evidence is {remembered > 65 ? "persistent" : "fading"}; spatial attention is{" "}
            {focus > 65 ? "narrow" : focus < 35 ? "diffuse" : "balanced"}.
          </>
        }
        why="Memory changes how long warning events remain influential, attention changes which qubits explain one another, and the cost setting changes the chosen correction threshold."
      />
    );
  }

  if (caseId === "minerals") {
    const trust =
      (values.mineralsGeology + values.mineralsMagnetics + values.mineralsGeochemistry) / 3;
    const priority = Math.max(8, trust * 0.55 + values.mineralsRare * 0.35 - values.mineralsCost * 0.22);
    const uncertainty = Math.max(10, 100 - trust + values.mineralsCost * 0.2);
    const cells = Array.from({ length: 20 }, (_, index) =>
      Math.max(8, Math.min(96, priority + ((index * 17) % 43) - 22))
    );
    return (
      <LabShell
        ask="Which evidence layer should the model trust most?"
        onReset={reset}
        controls={
          <>
            <Slider
              label="Geology reliability"
              value={values.mineralsGeology}
              onChange={(value) => update("mineralsGeology", value)}
            />
            <Slider
              label="Magnetic reliability"
              value={values.mineralsMagnetics}
              onChange={(value) => update("mineralsMagnetics", value)}
            />
            <Slider
              label="Geochemistry reliability"
              value={values.mineralsGeochemistry}
              onChange={(value) => update("mineralsGeochemistry", value)}
            />
            <Slider
              label="Rare-deposit class weight"
              value={values.mineralsRare}
              onChange={(value) => update("mineralsRare", value)}
            />
            <Slider
              label="Survey-cost weight"
              value={values.mineralsCost}
              onChange={(value) => update("mineralsCost", value)}
            />
          </>
        }
        visual={
          <div className="minerals-lab-visual">
            <div className="heatmap" aria-label="Prospectivity heatmap">
              {cells.map((cell, index) => (
                <i
                  key={index}
                  style={{ "--heat": `${cell}%` } as CSSProperties}
                  className={index === 7 || index === 13 || index === 17 ? "target" : ""}
                />
              ))}
            </div>
            <ol>
              <li>B7</li>
              <li>H3</li>
              <li>E9</li>
            </ol>
          </div>
        }
        observe={`Operational priority is ${pct(priority)} while uncertainty is ${pct(uncertainty)}; the top-three targets are shown separately from raw geological probability.`}
        why="Layer reliability shapes the probability map, rare-class weighting keeps deposits from disappearing, and survey cost converts probability into an action ranking."
      />
    );
  }

  if (caseId === "finance") {
    const frequency = Math.max(8, 100 - values.financeCost + values.financeStress * 0.12);
    const intensity = Math.max(10, values.financeRisk * 0.65 + values.financeStress * 0.22);
    return (
      <LabShell
        ask="What happens to trading behavior when transaction costs rise?"
        onReset={reset}
        controls={
          <>
            <Slider
              label="Transaction cost"
              value={values.financeCost}
              onChange={(value) => update("financeCost", value)}
            />
            <Slider
              label="Risk aversion"
              value={values.financeRisk}
              onChange={(value) => update("financeRisk", value)}
            />
            <Slider
              label="Stress-scenario weight"
              value={values.financeStress}
              onChange={(value) => update("financeStress", value)}
            />
          </>
        }
        visual={
          <div className="finance-lab-visual">
            <div>
              <span style={{ height: `${frequency}%` }} />
              <span style={{ height: `${intensity}%` }} />
              <span style={{ height: `${Math.max(12, values.financeStress)}%` }} />
            </div>
            <b>MARKET STATE -&gt; POLICY -&gt; HEDGE ACTION -&gt; COST -&gt; PORTFOLIO</b>
          </div>
        }
        observe={`Trading frequency trends ${frequency > 65 ? "high" : frequency < 35 ? "low" : "moderate"}; hedge intensity is ${pct(intensity)}.`}
        why="Higher transaction cost discourages turnover, while risk aversion and stress weight make the policy tolerate cost when tail-risk protection is worth it."
      />
    );
  }

  if (caseId === "materials") {
    const balance =
      (values.materialsAtom + values.materialsCoordinate + values.materialsLattice) / 3;
    const compliance = Math.min(96, values.materialsGuidance * 0.68 + balance * 0.28);
    const diversity = Math.max(8, 100 - values.materialsGuidance * 0.7 + balance * 0.1);
    return (
      <LabShell
        ask="How strongly should the generator be pushed toward one target property?"
        onReset={reset}
        controls={
          <>
            <Slider
              label="Guidance strength"
              value={values.materialsGuidance}
              onChange={(value) => update("materialsGuidance", value)}
            />
            <Slider
              label="Atom-channel weight"
              value={values.materialsAtom}
              onChange={(value) => update("materialsAtom", value)}
            />
            <Slider
              label="Coordinate-channel weight"
              value={values.materialsCoordinate}
              onChange={(value) => update("materialsCoordinate", value)}
            />
            <Slider
              label="Lattice-channel weight"
              value={values.materialsLattice}
              onChange={(value) => update("materialsLattice", value)}
            />
          </>
        }
        visual={
          <div className="materials-lab-visual">
            {["noise", "partial", "ordered"].map((label, index) => (
              <i key={label} className={label} style={{ "--order": index + 1 } as CSSProperties}>
                {label}
              </i>
            ))}
            <span style={{ width: `${compliance}%` }}>property</span>
            <span style={{ width: `${diversity}%` }}>diversity</span>
          </div>
        }
        observe={`Target compliance is ${pct(compliance)} and diversity is ${pct(diversity)}; stability risk rises if guidance overwhelms balanced denoising.`}
        why="Guidance increases target pressure, but atom, coordinate, and lattice losses must stay balanced so the generated crystal remains physically plausible."
      />
    );
  }

  if (caseId === "math") {
    const probability =
      values.mathStrategy === "greedy" ? 78 : values.mathStrategy === "exploratory" ? 43 : 61;
    const accepted = values.mathBranch === "lemma" && values.mathBudget > 5;
    return (
      <LabShell
        ask="Which proof branch should receive the next attempt?"
        onReset={reset}
        controls={
          <>
            <Select
              label="Branch selection"
              value={values.mathBranch}
              options={["direct", "lemma", "cases"]}
              onChange={(value) => update("mathBranch", value)}
            />
            <Select
              label="Search posture"
              value={values.mathStrategy}
              options={["greedy", "balanced", "exploratory"]}
              onChange={(value) => update("mathStrategy", value)}
            />
            <Slider
              label="Proof-attempt budget"
              value={values.mathBudget}
              min={1}
              max={12}
              onChange={(value) => update("mathBudget", value)}
            />
          </>
        }
        visual={
          <div className="math-lab-visual">
            <b>theorem</b>
            <span className={values.mathBranch === "direct" ? "chosen rejected" : ""}>direct</span>
            <span className={values.mathBranch === "lemma" ? "chosen accepted" : ""}>lemma</span>
            <span className={values.mathBranch === "cases" ? "chosen pending" : ""}>cases</span>
          </div>
        }
        observe={`Model probability for the selected posture is ${probability}%. Verifier result: ${accepted ? "accepted branch" : "rejected or still searching"}.`}
        why="The model ranks plausible proof moves, but the verifier decides correctness; branch budget controls whether lower-probability paths survive long enough to be tried."
      />
    );
  }

  if (caseId === "business") {
    const q = values.businessShortage / (values.businessShortage + values.businessOverstock);
    const width =
      values.businessProduct === "Slow mover"
        ? 72
        : values.businessProduct === "Promotion item"
          ? 82
          : 58;
    return (
      <LabShell
        ask="Which demand quantile should the business stock for?"
        onReset={reset}
        controls={
          <>
            <Slider
              label="Shortage cost"
              value={values.businessShortage}
              min={1}
              max={10}
              onChange={(value) => update("businessShortage", value)}
            />
            <Slider
              label="Overstock cost"
              value={values.businessOverstock}
              min={1}
              max={10}
              onChange={(value) => update("businessOverstock", value)}
            />
            <Select
              label="Product selector"
              value={values.businessProduct}
              options={["Seasonal item", "Slow mover", "Promotion item"]}
              onChange={(value) => update("businessProduct", value)}
            />
          </>
        }
        visual={
          <div className="business-lab-visual">
            <div className="forecast-fan" style={{ "--q": `${q * 100}%`, "--width": `${width}%` } as CSSProperties}>
              <i />
              <span className="p10">P10</span>
              <span className="p50">P50</span>
              <span className="p90">P90</span>
              <b>selected q</b>
            </div>
            <Latex>{`q=\\frac{C_u}{C_u+C_o}=${q.toFixed(2)}`}</Latex>
          </div>
        }
        observe={`The selected inventory quantile is ${q.toFixed(2)} for ${values.businessProduct}.`}
        why="The recurrent model outputs a distribution; shortage and overstock costs choose which point on that distribution becomes the inventory decision."
      />
    );
  }

  const reach = values.graphDepth * (values.graphConnections === "multiscale" ? 8 : 5);
  const smoothRisk = values.graphDepth > 12 ? "high" : values.graphDepth > 7 ? "moderate" : "low";
  return (
    <LabShell
      ask="How much message passing is needed for distant regions to influence one another?"
      onReset={reset}
      controls={
        <>
          <Slider
            label="Message-passing depth"
            value={values.graphDepth}
            min={2}
            max={16}
            onChange={(value) => update("graphDepth", value)}
          />
          <Select
            label="Connection type"
            value={values.graphConnections}
            options={["local", "multiscale"]}
            onChange={(value) => update("graphConnections", value)}
          />
          <Slider
            label="Rollout step"
            value={values.graphRollout}
            min={1}
            max={10}
            onChange={(value) => update("graphRollout", value)}
          />
        </>
      }
      visual={
        <div className="graphcast-lab-visual">
          {Array.from({ length: 9 }, (_, index) => (
            <i key={index} className={index < values.graphDepth / 2 ? "lit" : ""} />
          ))}
          <span>{values.graphConnections}</span>
          <b>rollout day {values.graphRollout}</b>
        </div>
      }
      observe={`Conceptual information reach is ${reach}; oversmoothing risk is ${smoothRisk}.`}
      why="More message-passing steps expand spatial reach, multiscale edges move information farther, and longer rollouts expose feedback error as predictions feed later predictions."
    />
  );
}
