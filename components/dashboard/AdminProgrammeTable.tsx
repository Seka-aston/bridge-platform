"use client";

import { useState, type ReactNode } from "react";
import { DataTable } from "@/components/dashboard/parts";
import { DetailDrawer } from "@/components/dashboard/DetailDrawer";
import { dashboardText as d, overviewText } from "@/content/dashboard";

/*
  Admin programme table with a detail drawer. Rows arrive from the server with status and
  dates already worked out for today, and with the full card ready to show in the drawer.
*/

const t = overviewText.admin;

type Row = { id: string; name: string; status: ReactNode; opens: string; closes: string; card: ReactNode };

export function AdminProgrammeTable({ rows }: { rows: Row[] }) {
  const [openId, setOpenId] = useState<string | null>(null);
  const open = rows.find((r) => r.id === openId);
  return (
    <>
      <DataTable
        caption={t.tableTitle}
        columns={[
          { key: "name", header: t.columns.name },
          { key: "status", header: t.columns.status },
          { key: "opens", header: t.columns.opens },
          { key: "closes", header: t.columns.closes },
          { key: "action", header: "", className: "text-right" },
        ]}
        rows={rows.map((r) => ({
          key: r.id,
          cells: {
            name: r.name,
            status: r.status,
            opens: r.opens,
            closes: r.closes,
            action: (
              <button
                type="button"
                onClick={() => setOpenId(r.id)}
                className="rounded-sm font-semibold text-green-700 underline-offset-4 hover:text-green-800 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy-900"
              >
                {d.viewDetails}
                <span className="sr-only">: {r.name}</span>
              </button>
            ),
          },
        }))}
      />
      <DetailDrawer open={!!open} onClose={() => setOpenId(null)} title={open?.name ?? ""}>
        {open?.card}
      </DetailDrawer>
    </>
  );
}
