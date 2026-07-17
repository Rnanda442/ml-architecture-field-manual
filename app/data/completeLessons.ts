import { caseLessons } from "./cases";
import { supplementLessons } from "./supplements";

export const completeLessonLinks = [
  ...caseLessons.map((lesson) => ({
    id: lesson.id,
    type: "case" as const,
    title: lesson.name,
    label: lesson.shortLabel,
    organization: lesson.organization,
    year: lesson.evidence.year,
    paper: lesson.evidence.paper,
    url: lesson.evidence.url
  })),
  ...supplementLessons.map((lesson) => ({
    id: lesson.id,
    type: "supplement" as const,
    title: lesson.name,
    label: lesson.shortName,
    organization: lesson.organization,
    year: lesson.year,
    paper: lesson.paper,
    url: lesson.url
  }))
];
