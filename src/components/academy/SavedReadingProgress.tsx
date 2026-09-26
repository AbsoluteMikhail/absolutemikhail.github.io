import { useAcademyProgress } from "@/lib/academyProgress";

export const ProgressLabel = ({ percent }: { percent: number }) => (
  <span className="mt-4 block text-xs text-accent">
    <span className="mb-2 flex justify-between gap-3"><span>{percent === 100 ? "Прочитано полностью" : "Прочитано"}</span><span className="tabular-nums">{percent}%</span></span>
    <span aria-hidden="true" className="block h-0.5 overflow-hidden bg-border"><span className="block h-full origin-left bg-gradient-to-r from-primary to-accent" style={{ transform: `scaleX(${percent / 100})` }} /></span>
  </span>
);

export const SavedReadingProgress = ({ path }: { path: string }) => {
  const record = useAcademyProgress()[path];
  return record ? <ProgressLabel percent={record.percent} /> : null;
};
