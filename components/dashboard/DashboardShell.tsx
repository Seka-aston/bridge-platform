"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Award, BarChart3, Bell, BookOpen, Briefcase, Building2, ChevronsUpDown, ClipboardCheck, FileCheck2, Globe, LayoutGrid,
  Library, LogOut, MessageSquare, Search, Settings, Sparkles, Star, Users, type LucideIcon,
} from "lucide-react";
import { Fragment, useEffect, useState, type ReactNode } from "react";
import { Logo } from "@/components/Logo";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Command, CommandDialog, CommandEmpty, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Kbd } from "@/components/ui/kbd";
import { Popover, PopoverContent, PopoverDescription, PopoverHeader, PopoverTitle, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import {
  Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarHeader, SidebarInset, SidebarMenu, SidebarMenuButton,
  SidebarMenuItem, SidebarProvider, SidebarRail, SidebarSeparator, SidebarTrigger, useSidebar,
} from "@/components/ui/sidebar";
import { dashboardText as t, noticeText, type IconKey, type NavLink } from "@/content/dashboard";
import { readNotices } from "@/lib/prototypeStore";

/*
  Dashboard frame for all four roles (redesign Step 6), built on the shadcn Sidebar:
  - light grey sidebar: logo, the role's menu in two groups, Settings and the account menu at
    the foot; collapses to icons (with tooltips) with the panel button or Ctrl/⌘+B; on phones
    it opens as a slide-in panel
  - slim top bar: panel button, breadcrumb, search (Ctrl/⌘+K) and notifications
  Aston's student dashboard design defines what each dashboard contains, not how it looks
  (8 Nov 2026).
*/

const icons: Record<IconKey, LucideIcon> = {
  grid: LayoutGrid, book: BookOpen, clipboard: ClipboardCheck, briefcase: Briefcase, award: Award,
  message: MessageSquare, sparkles: Sparkles, users: Users, building: Building2, star: Star, search: Search,
  file: FileCheck2, chart: BarChart3, settings: Settings, library: Library,
};

export type SearchItem = { label: string; meta: string; href: string };
export type Notice = { id: string; text: string; daysAgo: number; unread: boolean };

type Props = {
  role: string;
  base: string;
  title: string;
  roleLabel: string;
  user: { name: string; detail: string };
  nav: NavLink[];
  searchItems: SearchItem[];
  notifications: Notice[];
  children: ReactNode;
};

function hrefFor(base: string, slug: string) {
  return slug ? `${base}/${slug}` : base;
}

function when(daysAgo: number) {
  return t.daysAgo[String(daysAgo)] ?? t.daysAgo.n.replace("{n}", String(daysAgo));
}

const initials = (name: string) =>
  name
    .split(/[\s-]+/)
    .map((p) => p[0])
    .join("")
    .slice(0, 2);

// ---------- Search (Command palette) ----------
function SearchCommand({ items }: { items: SearchItem[] }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);
  return (
    <>
      <Button variant="outline" className="hidden w-56 justify-between text-muted-foreground md:inline-flex lg:w-72" onClick={() => setOpen(true)}>
        <span className="flex items-center gap-2">
          <Search data-icon="inline-start" aria-hidden /> {t.searchShortcut}
        </span>
        <Kbd aria-hidden>Ctrl K</Kbd>
      </Button>
      <Button variant="ghost" size="icon" className="md:hidden" aria-label={t.search} onClick={() => setOpen(true)}>
        <Search />
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen} title={t.searchTitle} description={t.searchPlaceholder}>
        <Command>
          <CommandInput placeholder={t.searchPlaceholder} />
          <CommandList>
            <CommandEmpty>{t.searchEmpty}</CommandEmpty>
            {items.map((r) => (
              <CommandItem
                key={r.href + r.label}
                value={`${r.label} ${r.meta}`}
                onSelect={() => {
                  setOpen(false);
                  router.push(r.href);
                }}
              >
                <span className="flex min-w-0 flex-col">
                  <span className="truncate font-medium text-heading">{r.label}</span>
                  <span className="truncate text-xs text-muted-foreground">{r.meta}</span>
                </span>
              </CommandItem>
            ))}
          </CommandList>
        </Command>
      </CommandDialog>
    </>
  );
}

// ---------- Notifications ----------
function Notifications({ items: sample, role }: { items: Notice[]; role: string }) {
  const [read, setRead] = useState(false);
  // Live notifications from other roles in this browser session, newest first.
  const [live, setLive] = useState<Notice[]>([]);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- browser-only storage, read after mount
    setLive(readNotices(role).map((n, i) => ({ id: `live-${i}`, text: n.text, daysAgo: -1, unread: true })));
  }, [role]);
  const items = [...live, ...sample];
  const unread = read ? 0 : items.filter((i) => i.unread).length;
  return (
    <Popover onOpenChange={(o) => o && setRead(true)}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative" aria-label={`${t.notifications}${unread ? `, ${t.unread.replace("{n}", String(unread))}` : ""}`}>
          <Bell />
          {unread > 0 && <span aria-hidden className="absolute top-2 right-2 size-2 rounded-full bg-brand-amber ring-2 ring-background" />}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-0">
        <PopoverHeader className="border-b px-4 py-3">
          <PopoverTitle>{t.notifications}</PopoverTitle>
          {unread > 0 && <PopoverDescription>{t.unread.replace("{n}", String(unread))}</PopoverDescription>}
        </PopoverHeader>
        <ul className="max-h-96 divide-y overflow-y-auto">
          {items.map((n) => (
            <li key={n.id} className="flex gap-3 px-4 py-3 text-sm">
              <span aria-hidden className={`mt-1.5 size-2 shrink-0 rounded-full ${n.unread ? "bg-primary" : "bg-transparent"}`} />
              <div>
                <p>{n.text}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">{n.daysAgo < 0 ? noticeText.live : when(n.daysAgo)}</p>
              </div>
            </li>
          ))}
        </ul>
      </PopoverContent>
    </Popover>
  );
}

// ---------- Account menu (sidebar footer) ----------
function AccountMenu({ user, roleLabel }: { user: { name: string }; roleLabel: string }) {
  const { isMobile } = useSidebar();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <SidebarMenuButton size="lg" aria-label={t.accountMenu} className="data-[state=open]:bg-sidebar-accent">
          <Avatar size="sm">
            <AvatarFallback className="bg-primary text-xs font-semibold text-primary-foreground">{initials(user.name)}</AvatarFallback>
          </Avatar>
          <span className="grid flex-1 text-left leading-tight">
            <span className="truncate font-semibold text-heading">{user.name}</span>
            <span className="truncate text-xs text-muted-foreground">
              {t.sampleUser} · {roleLabel}
            </span>
          </span>
          <ChevronsUpDown className="ml-auto" />
        </SidebarMenuButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent side={isMobile ? "top" : "right"} align="end" className="w-60">
        <DropdownMenuLabel className="font-normal">
          <p className="font-semibold text-heading">{user.name}</p>
          <p className="text-xs text-muted-foreground">
            {t.sampleUser} · {roleLabel}
          </p>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href="/sign-in">
              <LogOut /> {t.switchUser}
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/">
              <Globe /> {t.signOut}
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function NavItem({ n, base, active }: { n: NavLink; base: string; active: boolean }) {
  const { setOpenMobile } = useSidebar();
  const Icon = icons[n.icon];
  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild isActive={active} tooltip={n.label}>
        <Link href={hrefFor(base, n.slug)} aria-current={active ? "page" : undefined} onClick={() => setOpenMobile(false)}>
          <Icon />
          <span>{n.label}</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}

// ---------- Breadcrumb: dashboard › section › item ----------
function Crumbs({ base, title, nav, searchItems }: { base: string; title: string; nav: NavLink[]; searchItems: SearchItem[] }) {
  const pathname = usePathname() ?? base;
  const rest = pathname.slice(base.length).split("/").filter(Boolean);
  const section = rest[0] ? nav.find((n) => n.slug === rest[0]) : undefined;
  const itemLabel = rest[1] ? (searchItems.find((s) => s.href === pathname)?.label ?? rest[1]) : undefined;
  const trail: { label: string; href?: string }[] = [{ label: title, href: rest.length ? base : undefined }];
  if (section) trail.push({ label: section.label, href: itemLabel ? hrefFor(base, section.slug) : undefined });
  if (itemLabel) trail.push({ label: itemLabel });
  return (
    <Breadcrumb aria-label={t.breadcrumb} className="min-w-0">
      <BreadcrumbList className="flex-nowrap">
        {trail.map((c, i) => (
          <Fragment key={c.label + i}>
            {i > 0 && <BreadcrumbSeparator className={i < trail.length - 1 ? "hidden sm:block" : undefined} />}
            <BreadcrumbItem className={i < trail.length - 1 ? "hidden sm:inline-flex" : "min-w-0"}>
              {c.href ? (
                <BreadcrumbLink asChild>
                  <Link href={c.href}>{c.label}</Link>
                </BreadcrumbLink>
              ) : (
                <BreadcrumbPage className="truncate">{c.label}</BreadcrumbPage>
              )}
            </BreadcrumbItem>
          </Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}

export function DashboardShell({ role, base, title, roleLabel, user, nav, searchItems, notifications, children }: Props) {
  const pathname = usePathname();
  const isActive = (slug: string) => (slug ? pathname === hrefFor(base, slug) || pathname.startsWith(`${hrefFor(base, slug)}/`) : pathname === base);
  const settings = nav.find((n) => n.slug === "settings");
  const main = nav.filter((n) => n.slug !== "settings" && n.rail !== 2);
  const more = nav.filter((n) => n.slug !== "settings" && n.rail === 2);

  return (
    <SidebarProvider>
      <a
        href="#main"
        className="sr-only rounded-md bg-background px-4 py-2 text-sm font-semibold text-heading focus:not-sr-only focus:fixed focus:top-3 focus:left-4 focus:z-50 focus:outline-2 focus:outline-ring"
      >
        {t.skipLink}
      </a>
      <Sidebar collapsible="icon" aria-label={t.navLabel}>
        <SidebarHeader>
          <div className="flex h-10 items-center gap-2 px-2 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0">
            <Link href={base} aria-label={`${title}: ${t.overview}`} className="rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring">
              <Logo size={28} className="group-data-[collapsible=icon]:hidden" />
              <Image src="/brand/bridge-symbol.svg" alt="" aria-hidden width={14} height={24} unoptimized className="hidden h-6 w-auto group-data-[collapsible=icon]:block" />
            </Link>
            <Badge variant="sample" className="ml-auto group-data-[collapsible=icon]:hidden" title={t.prototypeHint}>
              {t.prototypeShort}
            </Badge>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {main.map((n) => (
                  <NavItem key={n.slug} n={n} base={base} active={isActive(n.slug)} />
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
          {more.length > 0 && (
            <>
              <SidebarSeparator className="mx-0" />
              <SidebarGroup>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {more.map((n) => (
                      <NavItem key={n.slug} n={n} base={base} active={isActive(n.slug)} />
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            </>
          )}
          {settings && (
            <SidebarGroup className="mt-auto">
              <SidebarGroupContent>
                <SidebarMenu>
                  <NavItem n={settings} base={base} active={isActive(settings.slug)} />
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          )}
        </SidebarContent>
        <SidebarFooter className="border-t">
          <SidebarMenu>
            <SidebarMenuItem>
              <AccountMenu user={user} roleLabel={roleLabel} />
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>

      <SidebarInset className="min-w-0">
        <header className="sticky top-0 z-20 flex h-14 shrink-0 items-center gap-2 border-b bg-background px-4 md:px-6">
          <SidebarTrigger className="-ml-1.5" />
          <Separator orientation="vertical" className="mr-1 h-4! self-center" />
          <Crumbs base={base} title={title} nav={nav} searchItems={searchItems} />
          <div className="ml-auto flex items-center gap-1 md:gap-2">
            <SearchCommand items={searchItems} />
            <Notifications items={notifications} role={role} />
          </div>
        </header>
        <main id="main" className="mx-auto w-full max-w-7xl min-w-0 flex-1 p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
