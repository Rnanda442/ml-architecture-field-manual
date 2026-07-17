import type { Evidence } from "../data/types";

export function EvidencePanel({ evidence }: { evidence: Evidence }) {
  return (
    <section className="evidence-panel" aria-label="Primary paper evidence">
      <div>
        <span>PRIMARY PAPER</span>
        <a href={evidence.url} target="_blank" rel="noreferrer">
          {evidence.paper}
        </a>
        {evidence.openUrl ? (
          <a className="secondary-link" href={evidence.openUrl} target="_blank" rel="noreferrer">
            Open arXiv version
          </a>
        ) : null}
      </div>
      <div>
        <span>ORGANIZATION</span>
        <p>{evidence.organization}</p>
      </div>
      <div>
        <span>YEAR</span>
        <p>{evidence.year}</p>
      </div>
      <div>
        <span>REPORTED RESULT</span>
        <p>{evidence.result}</p>
      </div>
      <div>
        <span>METRIC</span>
        <p>{evidence.metric}</p>
      </div>
      <div>
        <span>LIMITATION</span>
        <p>{evidence.limitation}</p>
      </div>
    </section>
  );
}
