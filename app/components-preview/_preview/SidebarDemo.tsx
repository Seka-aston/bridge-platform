"use client";

import {
  Award, BookOpen, Briefcase, ChevronsUpDown, ClipboardCheck, LayoutGrid, Library, LogOut, MessageSquare, Settings, Sparkles,
} from "lucide-react";
import { useState } from "react";
import { Logo } from "@/components/Logo";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import {
  Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarInset, SidebarMenu, SidebarMenuBadge,
  SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarTrigger,
} from "@/components/ui/sidebar";
import { Caption, PageTitle } from "@/components/ui/typography";
import { Demo, Section } from "./Section";

// Structure only: the real dashboard shell is rebuilt in Step 6. Labels match the student menu today.
const learn = [
  { label: "Dashboard", icon: LayoutGrid },
  { label: "Courses", icon: BookOpen },
  { label: "Assignments", icon: ClipboardCheck },
  { label: "Resources", icon: Library },
];
const grow = [
  { label: "Opportunities", icon: Briefcase },
  { label: "Skills Passport", icon: Award },
  { label: "Bridge AI", icon: Sparkles, badge: "Preview" },
  { label: "Messages", icon: MessageSquare, count: 2 },
];

export function SidebarDemo() {
  const [active, setActive] = useState("Dashboard");
  const item = (n: { label: string; icon: React.ComponentType; badge?: string; count?: number }) => (
    <SidebarMenuItem key={n.label}>
      <SidebarMenuButton isActive={active === n.label} tooltip={n.label} onClick={() => setActive(n.label)}>
        <n.icon />
        <span>{n.label}</span>
      </SidebarMenuButton>
      {n.badge && (
        <SidebarMenuBadge className="font-normal text-muted-foreground">{n.badge}</SidebarMenuBadge>
      )}
      {n.count && <SidebarMenuBadge className="tabular-nums">{n.count}</SidebarMenuBadge>}
    </SidebarMenuItem>
  );

  return (
    <Section
      id="sidebar"
      eyebrow="Components"
      title="Dashboard sidebar"
      note="Structure for all four dashboards: grouped menu, current page highlighted, user menu at the bottom. Press the panel button (or Ctrl+B) to collapse it to icons; hover an icon to see its name. On phones it opens as a drawer."
    >
      <Demo label="Sidebar and page header" hint="Student menu shown">
        <div className="h-[34rem] overflow-hidden rounded-xl border">
          <SidebarProvider className="relative h-full min-h-0">
            <Sidebar collapsible="icon" className="absolute h-full">
              <SidebarHeader>
                <div className="flex h-10 items-center gap-2 px-2 group-data-[collapsible=icon]:px-0">
                  <Logo size={24} className="group-data-[collapsible=icon]:hidden" />
                </div>
              </SidebarHeader>
              <SidebarContent>
                <SidebarGroup>
                  <SidebarGroupLabel>Learn</SidebarGroupLabel>
                  <SidebarGroupContent>
                    <SidebarMenu>{learn.map(item)}</SidebarMenu>
                  </SidebarGroupContent>
                </SidebarGroup>
                <SidebarGroup>
                  <SidebarGroupLabel>Grow</SidebarGroupLabel>
                  <SidebarGroupContent>
                    <SidebarMenu>{grow.map(item)}</SidebarMenu>
                  </SidebarGroupContent>
                </SidebarGroup>
                <SidebarGroup className="mt-auto">
                  <SidebarGroupContent>
                    <SidebarMenu>{item({ label: "Settings", icon: Settings })}</SidebarMenu>
                  </SidebarGroupContent>
                </SidebarGroup>
              </SidebarContent>
              <SidebarFooter>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <SidebarMenuButton size="lg">
                          <Avatar size="sm">
                            <AvatarFallback>DM</AvatarFallback>
                          </Avatar>
                          <span className="grid flex-1 text-left leading-tight">
                            <span className="truncate font-semibold text-heading">Diane M.</span>
                            <span className="truncate text-xs text-muted-foreground">Student · Sample user</span>
                          </span>
                          <ChevronsUpDown className="ml-auto" />
                        </SidebarMenuButton>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent side="right" align="end" className="w-56">
                        <DropdownMenuItem>
                          <Settings /> Settings
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <LogOut /> Switch role
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarFooter>
            </Sidebar>
            <SidebarInset className="min-h-0">
              <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4">
                <SidebarTrigger />
                <Separator orientation="vertical" className="mr-2 h-4!" />
                <Breadcrumb>
                  <BreadcrumbList>
                    <BreadcrumbItem>
                      <BreadcrumbPage>{active}</BreadcrumbPage>
                    </BreadcrumbItem>
                  </BreadcrumbList>
                </Breadcrumb>
                <Badge variant="sample" className="ml-auto">
                  Prototype
                </Badge>
              </header>
              <div className="flex flex-wrap items-end justify-between gap-4 p-6">
                <div>
                  <PageTitle as="p">{active}</PageTitle>
                  <Caption className="mt-1 text-sm">Short description of this page.</Caption>
                </div>
                <Button>Primary action</Button>
              </div>
              <div className="grid flex-1 grid-cols-1 gap-4 px-6 pb-6 sm:grid-cols-3">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="h-24 rounded-xl border bg-muted" />
                ))}
              </div>
            </SidebarInset>
          </SidebarProvider>
        </div>
      </Demo>
    </Section>
  );
}
