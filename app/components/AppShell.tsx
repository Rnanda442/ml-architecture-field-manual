"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { caseLessons } from "../data/cases";
import { supplementLessons } from "../data/supplements";
import { CaseNavigation } from "./CaseNavigation";
import { CaseWorkspace } from "./CaseWorkspace";
import { CompletedLessonsDrawer } from "./CompletedLessonsDrawer";
import { HomeView } from "./HomeView";
import { SourceDrawer } from "./SourceDrawer";
import { SupplementWorkspace } from "./SupplementWorkspace";
import { WeightHelpDrawer } from "./WeightHelpDrawer";

type View = "home" | "cases" | "supplements" | "sources";

export function AppShell() {
  const [view, setView] = useState<View>("home");
  const [activeCaseId, setActiveCaseId] = useState(caseLessons[0].id);
  const [activeSupplementId, setActiveSupplementId] = useState(supplementLessons[0].id);
  const [presentationMode, setPresentationMode] = useState(true);
  const [technicalDetail, setTechnicalDetail] = useState(false);
  const [weightHelpOpen, setWeightHelpOpen] = useState(false);
  const [completedOpen, setCompletedOpen] = useState(false);

  const activeCase = useMemo(
    () => caseLessons.find((lesson) => lesson.id === activeCaseId) ?? caseLessons[0],
    [activeCaseId],
  );
  const activeIndex = caseLessons.findIndex((lesson) => lesson.id === activeCaseId);

  const openCase = useCallback((id: string) => {
    setActiveCaseId(id);
    setView("cases");
  }, []);

  const openSupplement = useCallback((id: string) => {
    setActiveSupplementId(id);
    setView("supplements");
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setWeightHelpOpen(false);
        setCompletedOpen(false);
      }
      if (view !== "cases") return;
      if (event.key === "ArrowRight") {
        event.preventDefault();
        openCase(caseLessons[(activeIndex + 1) % caseLessons.length].id);
      }
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        openCase(caseLessons[(activeIndex - 1 + caseLessons.length) % caseLessons.length].id);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [activeIndex, openCase, view]);

  const setPresentation = (value: boolean) => {
    setPresentationMode(value);
    if (value) setTechnicalDetail(false);
  };

  const requestFullscreen = async () => {
    if (!document.fullscreenElement && document.documentElement.requestFullscreen) {
      await document.documentElement.requestFullscreen();
    } else if (document.exitFullscreen) {
      await document.exitFullscreen();
    }
  };

  return (
    <main className={`app-shell ${presentationMode ? "presentation-mode" : "explore-mode"}`}>
      <header className="top-bar">
        <button className="brand-button" onClick={() => setView("home")} aria-label="Open home">
          <span>ML</span>
          <b>Architecture Field Manual</b>
        </button>
        <nav className="top-nav" aria-label="Primary navigation">
          {[
            ["home", "Home"],
            ["cases", "Cases"],
            ["supplements", "Supplements"],
            ["sources", "Sources"],
          ].map(([id, label]) => (
            <button
              key={id}
              className={view === id ? "active" : ""}
              onClick={() => setView(id as View)}
              aria-current={view === id ? "page" : undefined}
            >
              {label}
            </button>
          ))}
        </nav>
        <div className="top-actions">
          <button onClick={() => setCompletedOpen(true)}>Completed lessons</button>
          <label className="switch-control compact">
            <input
              type="checkbox"
              checked={presentationMode}
              onChange={(event) => setPresentation(event.target.checked)}
            />
            <span>Presentation mode</span>
          </label>
          <label className="switch-control compact">
            <input
              type="checkbox"
              checked={technicalDetail}
              onChange={(event) => {
                setTechnicalDetail(event.target.checked);
                if (event.target.checked) setPresentationMode(false);
              }}
            />
            <span>Explore full technical detail</span>
          </label>
          <button onClick={requestFullscreen}>Full-screen</button>
        </div>
      </header>

      {view === "home" ? (
        <HomeView
          cases={caseLessons}
          presentationMode={presentationMode}
          onPresentationMode={setPresentation}
          onOpenCase={openCase}
          onStartTour={() => openCase(caseLessons[0].id)}
        />
      ) : null}

      {view === "cases" ? (
        <div className="case-shell">
          <CaseNavigation cases={caseLessons} activeId={activeCaseId} onSelect={openCase} />
          <CaseWorkspace
            key={activeCase.id}
            lesson={activeCase}
            cases={caseLessons}
            presentationMode={presentationMode}
            technicalDetail={technicalDetail}
            onSelectCase={openCase}
            onOpenWeightHelp={() => setWeightHelpOpen(true)}
          />
        </div>
      ) : null}

      {view === "supplements" ? (
        <SupplementWorkspace activeId={activeSupplementId} onSelect={setActiveSupplementId} />
      ) : null}

      {view === "sources" ? (
        <SourceDrawer onOpenCase={openCase} onOpenSupplement={openSupplement} />
      ) : null}

      <button className="floating-weight-help" onClick={() => setWeightHelpOpen(true)}>
        What does weight mean?
      </button>
      <WeightHelpDrawer open={weightHelpOpen} onClose={() => setWeightHelpOpen(false)} />
      <CompletedLessonsDrawer
        open={completedOpen}
        onClose={() => setCompletedOpen(false)}
        onOpenCase={(id) => {
          setCompletedOpen(false);
          openCase(id);
        }}
        onOpenSupplement={(id) => {
          setCompletedOpen(false);
          openSupplement(id);
        }}
      />
    </main>
  );
}
