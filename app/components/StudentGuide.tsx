import type { CaseLesson } from "../data/types";
import { TermHelp } from "./TermHelp";

export function StudentGuide({ lesson }: { lesson: CaseLesson }) {
  return (
    <section className="paper-brief" aria-label="Paper question and bottleneck">
      <article>
        <span>RESEARCH QUESTION</span>
        <p>{lesson.problem}</p>
      </article>
      <article>
        <span>INFORMATION BOTTLENECK <TermHelp term="information bottleneck" meaning="The specific information that is hard to preserve, combine, infer, or move through the problem." example="Evidence may be spread across several times or locations instead of appearing in one measurement." /></span>
        <p>{lesson.bottleneck}</p>
      </article>
      <article>
        <span>WHY THIS ARCHITECTURE <TermHelp term="architecture" meaning="The components and connections chosen to match the problem's information bottleneck." /></span>
        <p>{lesson.response}</p>
      </article>
    </section>
  );
}
