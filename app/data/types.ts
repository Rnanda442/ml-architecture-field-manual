export type WeightClass =
  | "LEARNED PARAMETER"
  | "DYNAMIC WEIGHT"
  | "DATA WEIGHT"
  | "HUMAN-SELECTED OBJECTIVE"
  | "DECISION COST";

export type Accent =
  | "violet"
  | "amber"
  | "emerald"
  | "cyan"
  | "rose"
  | "blue"
  | "teal";

export type DiagramNode = {
  id: string;
  label: string;
  shortLabel: string;
  role: "input" | "mechanism" | "output" | "use" | "feedback";
  x: number;
  y: number;
  input: string;
  output: string;
  description: string;
  weight: string;
  weightClass: WeightClass;
  failure: string;
};

export type DiagramEdge = {
  from: string;
  to: string;
  label?: string;
  feedback?: boolean;
};

export type DiagramSpec = {
  id: string;
  accent: Accent;
  nodes: DiagramNode[];
  edges: DiagramEdge[];
  feedbackLabel: string;
  technicalDrawer?: string[];
};

export type ObjectiveInfo = {
  sentence: string;
  input: string;
  architecture: string;
  output: string;
  use: string;
};

export type Evidence = {
  paper: string;
  organization: string;
  year: string;
  result: string;
  metric: string;
  limitation: string;
  url: string;
  openUrl?: string;
};

export type WeightsInfo = {
  inside: string;
  training: string;
  decision: string;
  equation: string;
  note: string;
};

export type CaseLesson = {
  id: string;
  number: string;
  name: string;
  shortLabel: string;
  field: string;
  organization: string;
  architecture: string;
  accent: Accent;
  objective: ObjectiveInfo;
  problem: string;
  bottleneck: string;
  response: string;
  diagram: DiagramSpec;
  weights: WeightsInfo;
  evidence: Evidence;
};

export type SupplementLesson = {
  id: string;
  name: string;
  shortName: string;
  accent: Accent;
  purpose: string;
  mechanism: string;
  diagramSteps: string[];
  equation: string;
  weights: { label: string; symbol: string; role: string }[];
  result: string;
  paper: string;
  organization: string;
  year: string;
  url: string;
  limitation: string;
};
