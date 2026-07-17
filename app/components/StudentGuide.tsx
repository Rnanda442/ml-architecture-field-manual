import type { CaseLesson } from "../data/types";

export function StudentGuide({ lesson }: { lesson: CaseLesson }) {
  return (
    <section className="paper-brief" aria-label="Paper question and bottleneck">
      <article>
        <span>RESEARCH QUESTION</span>
        <p>{lesson.problem}</p>
      </article>
      <article>
        <span>INFORMATION BOTTLENECK</span>
        <p>{lesson.bottleneck}</p>
      </article>
      <article>
        <span>WHY THIS ARCHITECTURE</span>
        <p>{lesson.response}</p>
      </article>
    </section>
  );
}
