// Small labelled block inside a talent card (also used by the availability row).
export function TalentField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <h4 className="text-sm font-semibold text-heading">{label}</h4>
      <div className="mt-1.5 text-sm">{children}</div>
    </div>
  );
}
