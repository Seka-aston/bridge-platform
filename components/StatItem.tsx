import { Badge } from "@/components/Badge";
import { prototypeMode } from "@/content/site";

/*
  Stat item: short brand-green bar, large navy number, label underneath.
  Figures not yet approved by Bridge show a Draft badge in prototype mode,
  and are hidden entirely when prototype mode is off.
*/

export type Stat = { value: string; label: string; approved: boolean };

export function StatItem({ value, label, approved }: Stat) {
  if (!approved && !prototypeMode) return null;
  return (
    <div className="border-l-2 border-brand-green pl-5">
      <p className="text-3xl leading-none font-bold tracking-tight text-heading tabular-nums md:text-4xl">{value}</p>
      <p className="mt-3 text-base text-muted-foreground">{label}</p>
      {!approved && <Badge kind="draft" className="mt-3" approvalKey={`stat:${value}`} />}
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
