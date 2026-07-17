"use client";

import { completeLessonLinks } from "../data/completeLessons";

export function CompletedLessonsDrawer({
  open,
  onClose,
  onOpenCase,
  onOpenSupplement
}: {
  open: boolean;
  onClose: () => void;
  onOpenCase: (id: string) => void;
  onOpenSupplement: (id: string) => void;
}) {
  if (!open) return null;

  return (
    <aside className="drawer completed-drawer open">
      <div className="drawer-head">
        <div>
          <span className="eyebrow">Completed lessons</span>
          <h2>13 complete architecture lessons</h2>
        </div>
        <button className="icon-button" onClick={onClose} aria-label="Close completed lessons">
          x
        </button>
      </div>
      <div className="completed-list">
        {completeLessonLinks.map((item) => (
          <button
            key={`${item.type}-${item.id}`}
            onClick={() => {
              if (item.type === "case") onOpenCase(item.id);
              else onOpenSupplement(item.id);
            }}
          >
            <span>{item.type === "case" ? "Case" : "Supplement"}</span>
            <b>{item.title}</b>
            <small>
              {item.organization} - {item.year}
            </small>
          </button>
        ))}
      </div>
    </aside>
  );
}
