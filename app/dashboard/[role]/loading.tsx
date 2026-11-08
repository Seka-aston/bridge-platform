import { Skeleton } from "@/components/ui/skeleton";
import { dashboardText as t } from "@/content/dashboard";

// Shown inside the dashboard frame while a screen loads: the page header, stat cards and a panel.
export default function DashboardLoading() {
  return (
    <div role="status" aria-busy="true" aria-label={t.loading} className="space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-7 w-56" />
        <Skeleton className="h-4 w-80 max-w-full" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[0, 1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-24 rounded-xl" />
        ))}
      </div>
      <div className="space-y-4 rounded-xl border p-6">
        <Skeleton className="h-5 w-40" />
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="flex items-center gap-4">
            <Skeleton className="size-9 rounded-md" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-3 w-1/3" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
