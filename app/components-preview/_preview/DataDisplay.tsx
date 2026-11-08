"use client";

import {
  type ColumnDef, type SortingState, flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable,
} from "@tanstack/react-table";
import { ArrowRight, ArrowUpDown, BadgeCheck, BookOpen, Clock, MoreHorizontal, Search, Users } from "lucide-react";
import { Fragment, useState } from "react";
import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis } from "recharts";
import { Avatar, AvatarFallback, AvatarGroup, AvatarGroupCount } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Item, ItemActions, ItemContent, ItemDescription, ItemGroup, ItemMedia, ItemSeparator, ItemTitle } from "@/components/ui/item";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Caption } from "@/components/ui/typography";
import { reports } from "@/data/admin";
import { courses } from "@/data/student";
import { type TalentProfile, talentProfiles } from "@/data/talent";
import { Demo, Section } from "./Section";

const initials = (name: string) => name.split(" ").map((p) => p[0]).join("").slice(0, 2);

const columns: ColumnDef<TalentProfile>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <Button variant="ghost" size="sm" className="-ml-2.5" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Name <ArrowUpDown data-icon="inline-end" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        <Avatar size="sm">
          <AvatarFallback>{initials(row.original.name)}</AvatarFallback>
        </Avatar>
        <span className="font-medium text-heading">{row.original.name}</span>
      </div>
    ),
  },
  { accessorKey: "discipline", header: "Discipline" },
  { accessorKey: "level", header: "Level" },
  {
    accessorKey: "verification",
    header: "Verification",
    cell: ({ row }) =>
      row.original.verification === "verified" ? (
        <Badge variant="verified">
          <BadgeCheck data-icon="inline-start" /> Verified
        </Badge>
      ) : (
        <Badge variant="outline">
          <Clock data-icon="inline-start" /> In progress
        </Badge>
      ),
  },
  {
    id: "skills",
    header: () => <span className="block text-right">Skills</span>,
    cell: ({ row }) => <span className="block text-right tabular-nums">{row.original.skills.length}</span>,
  },
  {
    id: "actions",
    header: () => <span className="sr-only">Actions</span>,
    cell: ({ row }) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon-sm" aria-label={`Actions for ${row.original.name}`}>
            <MoreHorizontal />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>{row.original.name}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>View profile</DropdownMenuItem>
          <DropdownMenuItem>Add to shortlist</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];

function TalentTable() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [filter, setFilter] = useState("");
  // TanStack Table manages its own state, so the React Compiler skips this component (expected).
  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: talentProfiles,
    columns,
    state: { sorting, globalFilter: filter },
    onSortingChange: setSorting,
    onGlobalFilterChange: setFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 3 } },
  });
  const rows = table.getRowModel().rows;
  const total = table.getFilteredRowModel().rows.length;
  const { pageIndex, pageSize } = table.getState().pagination;

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <InputGroup className="w-full sm:w-72">
          <InputGroupAddon>
            <Search />
          </InputGroupAddon>
          <InputGroupInput aria-label="Filter talent" placeholder="Filter by name, skill or discipline" value={filter} onChange={(e) => setFilter(e.target.value)} />
        </InputGroup>
        <Badge variant="sample">Sample profiles</Badge>
      </div>
      <div className="relative overflow-hidden rounded-xl border">
        <Table>
          <TableHeader className="bg-muted">
            {table.getHeaderGroups().map((hg) => (
              <TableRow key={hg.id}>
                {hg.headers.map((h) => (
                  <TableHead key={h.id}>{h.isPlaceholder ? null : flexRender(h.column.columnDef.header, h.getContext())}</TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {rows.length ? (
              rows.map((r) => (
                <TableRow key={r.id}>
                  {r.getVisibleCells().map((c) => (
                    <TableCell key={c.id}>{flexRender(c.column.columnDef.cell, c.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-40">
                  <Empty className="p-0">
                    <EmptyHeader>
                      <EmptyMedia variant="icon">
                        <Search />
                      </EmptyMedia>
                      <EmptyTitle>No talent matches “{filter}”</EmptyTitle>
                      <EmptyDescription>Try a skill such as SQL, or clear the filter.</EmptyDescription>
                    </EmptyHeader>
                  </Empty>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-between gap-3">
        <Caption className="tabular-nums">
          {total === 0 ? "0 results" : `Showing ${pageIndex * pageSize + 1}–${Math.min(total, (pageIndex + 1) * pageSize)} of ${total}`}
        </Caption>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
            Previous
          </Button>
          <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}

const chartConfig = { value: { label: "Sign-ups", color: "var(--chart-1)" } } satisfies ChartConfig;

function SignupsChart() {
  const [asTable, setAsTable] = useState(false);
  return (
    <Card>
      <CardHeader>
        <CardTitle>Weekly sign-ups</CardTitle>
        <CardDescription>Last 8 weeks</CardDescription>
        <CardAction>
          <Badge variant="sample">Sample figures</Badge>
        </CardAction>
      </CardHeader>
      <CardContent>
        {asTable ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Week</TableHead>
                <TableHead className="text-right">Sign-ups</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reports.weeklySignups.map((d) => (
                <TableRow key={d.label}>
                  <TableCell>{d.label}</TableCell>
                  <TableCell className="text-right tabular-nums">{d.value}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <ChartContainer config={chartConfig} className="aspect-auto h-64 w-full" role="img" aria-label="Bar chart of weekly sign-ups, rising from 12 in week 1 to 29 in week 8">
            <BarChart data={reports.weeklySignups} margin={{ top: 24, left: -16, right: 8 }}>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="label" tickLine={false} axisLine={false} tickMargin={8} />
              <YAxis tickLine={false} axisLine={false} width={40} />
              <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel={false} />} />
              <Bar dataKey="value" fill="var(--color-value)" radius={[4, 4, 0, 0]} maxBarSize={40}>
                <LabelList dataKey="value" position="top" className="fill-foreground tabular-nums" fontSize={12} />
              </Bar>
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
      <CardFooter>
        <Button variant="link" size="sm" onClick={() => setAsTable((v) => !v)} aria-pressed={asTable}>
          {asTable ? "Show as chart" : "Show as table"}
        </Button>
      </CardFooter>
    </Card>
  );
}

const stats = [
  { label: "Learners", value: reports.tiles.learners, icon: Users },
  { label: "Skills verified", value: reports.tiles.skillsVerified, icon: BadgeCheck },
  { label: "Courses in progress", value: 4, icon: BookOpen },
];

export function DataDisplay() {
  return (
    <Section
      id="data"
      eyebrow="Components"
      title="Cards, tables and data"
      note="Cards in a row share one height, with actions lined up along the bottom. Tables share one design: muted header, compact rows, actions in a menu, and an empty state when nothing matches."
    >
      <Demo label="Card anatomy" hint="Equal heights, actions aligned to the bottom" className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {[
          { t: "Learn and Build", d: "Develop practical, industry-relevant skills through structured training, practical projects, learning resources, and guided development." },
          { t: "Prove Your Skills", d: "Help learners demonstrate their capabilities through the Bridge Skills Passport." },
          { t: "Connect to Opportunity", d: "Connect talent with internships, employers, industry projects, mentorship, and entrepreneurship opportunities." },
        ].map((c) => (
          <Card key={c.t}>
            <CardHeader>
              <CardTitle>{c.t}</CardTitle>
              <CardDescription>{c.d}</CardDescription>
            </CardHeader>
            <CardFooter className="mt-auto">
              <Button variant="link">
                Explore <ArrowRight data-icon="inline-end" />
              </Button>
            </CardFooter>
          </Card>
        ))}
      </Demo>

      <Demo label="Stat cards" hint="One design for every dashboard" className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {stats.map((s) => (
          <Card key={s.label} size="sm">
            <CardHeader>
              <CardDescription>{s.label}</CardDescription>
              <CardAction>
                <s.icon aria-hidden className="size-5 text-muted-foreground" />
              </CardAction>
            </CardHeader>
            <CardContent>
              <p className="text-2xl leading-none font-semibold text-heading tabular-nums">{s.value}</p>
            </CardContent>
          </Card>
        ))}
      </Demo>

      <Demo label="Data table" hint="Sort by name, filter, page through, row actions">
        <TalentTable />
      </Demo>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <Demo label="Chart" hint="Values labelled; switch to a table">
          <SignupsChart />
        </Demo>
        <div className="space-y-8">
          <Demo label="Progress" className="space-y-4">
            {courses.slice(0, 3).map((c) => {
              const pct = Math.round((c.lessonsDone / c.lessonsTotal) * 100);
              return (
                <div key={c.id} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium text-heading">{c.title}</span>
                    <span className="text-muted-foreground tabular-nums">
                      {c.lessonsDone} / {c.lessonsTotal} lessons · {pct}%
                    </span>
                  </div>
                  <Progress value={pct} aria-label={`${c.title} progress`} />
                </div>
              );
            })}
          </Demo>
          <Demo label="People" className="flex flex-wrap items-center gap-6">
            <Avatar size="lg">
              <AvatarFallback>DM</AvatarFallback>
            </Avatar>
            <AvatarGroup>
              {talentProfiles.slice(0, 3).map((t) => (
                <Avatar key={t.id}>
                  <AvatarFallback>{initials(t.name)}</AvatarFallback>
                </Avatar>
              ))}
              <AvatarGroupCount>+{Math.max(0, talentProfiles.length - 3)}</AvatarGroupCount>
            </AvatarGroup>
          </Demo>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <Demo label="List items">
          <ItemGroup className="rounded-xl border">
            {talentProfiles.slice(0, 3).map((t, i) => (
              <Fragment key={t.id}>
                {i > 0 && <ItemSeparator />}
                <Item role="listitem">
                  <ItemMedia>
                    <Avatar>
                      <AvatarFallback>{initials(t.name)}</AvatarFallback>
                    </Avatar>
                  </ItemMedia>
                  <ItemContent>
                    <ItemTitle>{t.name}</ItemTitle>
                    <ItemDescription>{t.discipline}</ItemDescription>
                  </ItemContent>
                  <ItemActions>
                    <Button variant="outline" size="sm">
                      Review
                    </Button>
                  </ItemActions>
                </Item>
              </Fragment>
            ))}
          </ItemGroup>
        </Demo>
        <Demo label="Scroll area" hint="For long lists inside a fixed-height panel">
          <ScrollArea className="h-56 rounded-xl border">
            <ol className="p-4 text-sm">
              {Array.from({ length: 12 }, (_, i) => (
                <li key={i} className="border-b py-2 last:border-0">
                  Lesson {i + 1}
                </li>
              ))}
            </ol>
          </ScrollArea>
        </Demo>
      </div>
    </Section>
  );
}
