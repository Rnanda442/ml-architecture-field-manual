"use client";

import { useState, type CSSProperties } from "react";
import { supplementLessons } from "../data/supplements";
import type { SupplementLesson } from "../data/types";
import { Latex } from "./Latex";

function SupplementDiagram({ lesson }: { lesson: SupplementLesson }) {
  return (
    <div className={`supplement-diagram accent-${lesson.accent}`} aria-label={`${lesson.name} mechanism`}>
      {lesson.diagramSteps.map((step, index) => (
        <div className="supplement-step" key={step}>
          <b>{step}</b>
          {index < lesson.diagramSteps.length - 1 ? <i aria-hidden="true">-&gt;</i> : null}
        </div>
      ))}
    </div>
  );
}

function SupplementInteraction({ lesson }: { lesson: SupplementLesson }) {
  const [level, setLevel] = useState(55);
  const [mode, setMode] = useState("memory");
  const label =
    lesson.shortName === "RNN"
      ? "Memory strength"
      : lesson.shortName === "LSTM"
        ? "Gate strength"
        : lesson.shortName === "GRU"
          ? "Update strength"
          : lesson.shortName === "Actor-Critic"
            ? "Advantage strength"
            : lesson.shortName === "Formal Search"
              ? "Branch priority"
              : "Mask ratio";

  return (
    <section className="supplement-interaction" aria-label={`${lesson.name} short interaction`}>
      <div>
        <span>SHORT INTERACTION</span>
        <p>{lesson.mechanism}</p>
      </div>
      <label className="lab-control">
        <span>
          {label}
          <b>{level}</b>
        </span>
        <input type="range" min="0" max="100" value={level} onChange={(event) => setLevel(Number(event.target.value))} />
      </label>
      <label className="lab-select">
        <span>Focus</span>
        <select value={mode} onChange={(event) => setMode(event.target.value)}>
          <option value="memory">memory</option>
          <option value="training">training</option>
          <option value="decision">decision</option>
        </select>
      </label>
      <div className="supplement-meter" style={{ "--level": `${level}%` } as CSSProperties}>
        <i />
        <b>{mode}</b>
      </div>
    </section>
  );
}

function RnnComparison() {
  return (
    <section className="rnn-comparison" aria-label="RNN LSTM GRU comparison">
      <article>
        <span>RNN</span>
        <b>simple carried hidden state</b>
        <p>One hidden state carries compressed history and is prone to fading long-term information.</p>
      </article>
      <article>
        <span>LSTM</span>
        <b>separate memory cell with input, forget, and output gates</b>
        <p>Separate gates decide what to write, retain, and expose from the cell state.</p>
      </article>
      <article>
        <span>GRU</span>
        <b>reset and update gates with a more compact state</b>
        <p>Compact gating blends previous memory with a candidate replacement.</p>
      </article>
    </section>
  );
}

export function SupplementWorkspace({
  activeId,
  onSelect
}: {
  activeId: string;
  onSelect: (id: string) => void;
}) {
  const [compare, setCompare] = useState(false);
  const lesson =
    supplementLessons.find((item) => item.id === activeId) ?? supplementLessons[0];

  return (
    <section className="supplement-workspace" aria-labelledby="supplement-title">
      <div className="workspace-intro">
        <span className="eyebrow">Architecture supplements</span>
        <h1 id="supplement-title">One supplement at a time</h1>
        <p>Use the tabs to compare compact mechanisms without scrolling through six full chapters.</p>
      </div>

      <div className="supplement-tabs" role="tablist" aria-label="Supplement tabs">
        {supplementLessons.map((item) => (
          <button
            key={item.id}
            role="tab"
            aria-selected={lesson.id === item.id}
            className={lesson.id === item.id ? "active" : ""}
            onClick={() => {
              setCompare(false);
              onSelect(item.id);
            }}
          >
            {item.shortName}
          </button>
        ))}
        <button className={compare ? "active" : ""} onClick={() => setCompare((value) => !value)}>
          RNN/LSTM/GRU compare
        </button>
      </div>

      {compare ? (
        <RnnComparison />
      ) : (
        <article className={`supplement-card accent-${lesson.accent}`}>
          <div className="supplement-purpose">
            <span>ONE-SENTENCE PURPOSE</span>
            <h2>{lesson.name}</h2>
            <p>{lesson.purpose}</p>
          </div>
          <SupplementDiagram lesson={lesson} />
          <SupplementInteraction lesson={lesson} />
          <div className="supplement-equation">
            <span>CORE EQUATION</span>
            <Latex block>{lesson.equation}</Latex>
            <div className="supplement-equation-note"><b>What the equation says</b><p>The terms show how this mechanism transforms its current input and retained state. Learned symbols are adjusted during training; settings such as horizons, loss balance, and decision rules are chosen by people.</p></div>
          </div>
          <div className="supplement-weight-list">
            <span>THREE IMPORTANT WEIGHTS</span>
            {lesson.weights.map((weight) => (
              <article key={weight.label}>
                <b>{weight.label}</b>
                <Latex>{weight.symbol}</Latex>
                <p>{weight.role}</p>
              </article>
            ))}
          </div>
          <div className="supplement-source">
            <div>
              <span>REPORTED RESULT</span>
              <p>{lesson.result}</p>
            </div>
            <div>
              <span>PAPER</span>
              <a href={lesson.url} target="_blank" rel="noreferrer">
                {lesson.paper}
              </a>
            </div>
            <div>
              <span>ORGANIZATION / YEAR</span>
              <p>
                {lesson.organization} - {lesson.year}
              </p>
            </div>
            <div>
              <span>LIMITATION</span>
              <p>{lesson.limitation}</p>
            </div>
          </div>
        </article>
      )}
    </section>
  );
}
