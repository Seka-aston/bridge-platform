import { Badge } from "@/components/Badge";
import { prototypeMode } from "@/content/site";

/*
  Stat item (CLAUDE.md section 7, component 5).
  Short brand-green bar, large navy number, grey label underneath.
  Figures not yet approved by Bridge show a "Draft" badge in prototype mode,
  and are hidden entirely when prototype mode is off.
*/

export type Stat = { value: string; label: string; approved: boolean };

export function StatItem({ value, label, approved }: Stat) {
  if (!approved && !prototypeMode) return null;
  return (
    <div>
      <span aria-hidden className="block h-1 w-8 rounded-full bg-green-500" />
      {/* 30px on phones so "1,000+" fits two to a row at 320px; 40px from 768px up. */}
      <p className="mt-4 text-h2-mobile text-navy-900 md:text-display-mobile">{value}</p>
      <p className="mt-2 text-gray-700">{label}</p>
      {!approved && <Badge kind="draft" className="mt-3" />}
    </div>
  );
}

// Four across on large screens, two by two below.
export function StatList({ stats }: { stats: Stat[] }) {
  const visible = stats.filter((s) => s.approved || prototypeMode);
  if (visible.length === 0) return null;
  return (
    <ul className="grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-4 lg:gap-x-8">
      {visible.map((s) => (
        <li key={s.value + s.label}>
          <StatItem {...s} />
        </li>
      ))}
    </ul>
  );
}
