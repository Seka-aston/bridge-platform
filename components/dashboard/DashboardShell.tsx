"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Award, BarChart3, Bell, BookOpen, Briefcase, Building2, ChevronDown, ClipboardCheck, FileCheck2, LayoutGrid,
  Library, LogOut, Menu, MessageSquare, Search, Settings, Sparkles, Star, Users, X, type LucideIcon,
} from "lucide-react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { Logo } from "@/components/Logo";
import { dashboardText as t, type IconKey, type NavLink } from "@/content/dashboard";

/*
  Dashboard frame from Aston's student dashboard design (7 Nov 2026), used for all four roles:
  - white rounded top bar: logo, pill menu (centre), search, notifications, account
  - white icon rail on the left (1024px+), each icon with a tooltip and an accessible name
  - light grey-green page background
  Below 1024px the pill menu and rail fold into one menu (native <dialog>: focus trapped,
  Escape closes). Search is a dialog; notifications and account are small menus.
*/

const icons: Record<IconKey, LucideIcon> = {
  grid: LayoutGrid, book: BookOpen, clipboard: ClipboardCheck, briefcase: Briefcase, award: Award,
  message: MessageSquare, sparkles: Sparkles, users: Users, building: Building2, star: Star, search: Search,
  file: FileCheck2, chart: BarChart3, settings: Settings, library: Library,
};

export type SearchItem = { label: string; meta: string; href: string };
export type Notice = { id: string; text: string; daysAgo: number; unread: boolean };

type Props = {
  base: string;
  title: string;
  roleLabel: string;
  user: { name: string; detail: string };
  nav: NavLink[];
  searchItems: SearchItem[];
  notifications: Notice[];
  children: ReactNode;
};

const ring = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy-900";
const roundBtn = `inline-flex size-12 shrink-0 items-center justify-center rounded-full bg-gray-50 text-navy-900 hover:bg-green-50 ${ring}`;

function hrefFor(base: string, slug: string) {
  return slug ? `${base}/${slug}` : base;
}

function when(daysAgo: number) {
  return t.daysAgo[String(daysAgo)] ?? t.daysAgo.n.replace("{n}", String(daysAgo));
}

// Small dropdown that closes on Escape or a click elsewhere.
function useDisclosure() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => !ref.current?.contains(e.target as Node) && setOpen(false);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        (ref.current?.querySelector("button") as HTMLButtonElement | null)?.focus();
      }
    };
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);
  return { open, setOpen, ref };
}

function SearchDialog({ items }: { items: SearchItem[] }) {
  const ref = useRef<HTMLDialogElement>(null);
  const [q, setQ] = useState("");
  const query = q.trim().toLowerCase();
  const results = query ? items.filter((i) => `${i.label} ${i.meta}`.toLowerCase().includes(query)).slice(0, 8) : items.slice(0, 6);
  return (
    <>
      <button type="button" aria-label={t.search} onClick={() => ref.current?.showModal()} className={roundBtn}>
        <Search aria-hidden className="size-5" />
      </button>
      <dialog
        ref={ref}
        aria-label={t.searchTitle}
        onClick={(e) => e.target === ref.current && ref.current?.close()}
        className="mx-auto mt-24 w-[calc(100%-2rem)] max-w-xl rounded-panel bg-white p-0 backdrop:bg-navy-900/60"
      >
        <div className="p-5">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-h3 text-navy-900">{t.searchTitle}</h2>
            <button type="button" onClick={() => ref.current?.close()} aria-label={t.close} className={`inline-flex size-10 items-center justify-center rounded-full hover:bg-green-50 ${ring}`}>
              <X aria-hidden className="size-5" />
            </button>
          </div>
          <label className="mt-4 block">
            <span className="sr-only">{t.search}</span>
            <input
              type="search"
              autoFocus
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={t.searchPlaceholder}
              className={`w-full rounded-full border border-gray-500 px-4 py-3 text-gray-800 ${ring}`}
            />
          </label>
          <ul className="mt-4 max-h-80 overflow-y-auto" aria-live="polite">
            {results.length === 0 ? (
              <li className="px-3 py-4 text-gray-700">{t.searchEmpty}</li>
            ) : (
              results.map((r) => (
                <li key={r.href + r.label}>
                  <Link href={r.href} onClick={() => ref.current?.close()} className={`block rounded-tile px-3 py-2.5 hover:bg-gray-50 ${ring}`}>
                    <span className="block font-semibold text-navy-900">{r.label}</span>
                    <span className="block text-sm text-gray-700">{r.meta}</span>
                  </Link>
                </li>
              ))
            )}
          </ul>
        </div>
      </dialog>
    </>
  );
}

function Notifications({ items }: { items: Notice[] }) {
  const { open, setOpen, ref } = useDisclosure();
  const [read, setRead] = useState(false);
  const unread = read ? 0 : items.filter((i) => i.unread).length;
  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-expanded={open}
        aria-label={`${t.notifications}${unread ? `, ${t.unread.replace("{n}", String(unread))}` : ""}`}
        onClick={() => {
          setOpen(!open);
          setRead(true);
        }}
        className={roundBtn}
      >
        <Bell aria-hidden className="size-5" />
        {unread > 0 && <span aria-hidden className="absolute right-3 top-3 size-2.5 rounded-full bg-amber-500 ring-2 ring-gray-50" />}
      </button>
      {open && (
        <div className="absolute right-0 top-full z-40 mt-2 w-80 max-w-[calc(100vw-2rem)] rounded-tile border border-gray-200 bg-white p-2 shadow-card-hover">
          <p className="px-3 py-2 font-bold text-navy-900">{t.notifications}</p>
          <ul>
            {items.map((n) => (
              <li key={n.id} className="rounded-control px-3 py-2.5">
                <p className="text-gray-800">{n.text}</p>
                <p className="text-sm text-gray-500">{when(n.daysAgo)}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function AccountMenu({ user, roleLabel }: { user: { name: string }; roleLabel: string }) {
  const { open, setOpen, ref } = useDisclosure();
  return (
    <div ref={ref} className="relative">
      <button type="button" aria-expanded={open} aria-label={t.accountMenu} onClick={() => setOpen(!open)} className={`flex items-center gap-1 rounded-full ${ring}`}>
        <span aria-hidden className="inline-flex size-12 items-center justify-center rounded-full bg-green-700 text-lg font-bold text-white">
          {user.name[0]}
        </span>
        <ChevronDown aria-hidden className="hidden size-5 text-navy-900 sm:block lg:hidden xl:block" />
      </button>
      {open && (
        <div className="absolute right-0 top-full z-40 mt-2 w-64 rounded-tile border border-gray-200 bg-white p-2 shadow-card-hover">
          <div className="px-3 py-2">
            <p className="font-bold text-navy-900">{user.name}</p>
            <p className="text-sm text-gray-700">
              {t.sampleUser} · {roleLabel}
            </p>
          </div>
          <Link href="/sign-in" className={`block rounded-control px-3 py-2 font-semibold text-gray-800 hover:bg-gray-50 ${ring}`}>
            {t.switchUser}
          </Link>
          <Link href="/" className={`block rounded-control px-3 py-2 font-semibold text-gray-800 hover:bg-gray-50 ${ring}`}>
            {t.signOut}
          </Link>
        </div>
      )}
    </div>
  );
}

function RailButton({ href, label, icon: Icon, active }: { href: string; label: string; icon: LucideIcon; active: boolean }) {
  return (
    <li className="group relative">
      <Link
        href={href}
        aria-label={label}
        aria-current={active ? "page" : undefined}
        className={`inline-flex size-14 items-center justify-center rounded-full transition-colors duration-150 ${ring} ${
          active ? "bg-green-700 text-white" : "text-navy-900 hover:bg-green-50"
        }`}
      >
        <Icon aria-hidden className="size-6" />
      </Link>
      {/* Tooltip on hover and keyboard focus */}
      <span
        aria-hidden
        className="pointer-events-none absolute left-full top-1/2 z-20 ml-3 hidden -translate-y-1/2 whitespace-nowrap rounded-control bg-navy-900 px-3 py-1.5 text-sm font-semibold text-white group-focus-within:block group-hover:block"
      >
        {label}
      </span>
    </li>
  );
}

export function DashboardShell({ base, title, roleLabel, user, nav, searchItems, notifications, children }: Props) {
  const pathname = usePathname();
  const menuRef = useRef<HTMLDialogElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const isActive = (slug: string) => pathname === hrefFor(base, slug);
  const top = nav.filter((n) => n.top);
  const rail1 = nav.filter((n) => n.rail === 1);
  const rail2 = nav.filter((n) => n.rail === 2);
  const settings = nav.find((n) => n.slug === "settings");

  return (
    <div className="min-h-dvh bg-gray-50 px-3 py-4 sm:px-6 sm:py-6">
      <a
        href="#main"
        className="sr-only rounded-control bg-white px-4 py-2 font-semibold text-navy-900 focus:not-sr-only focus:fixed focus:left-4 focus:top-3 focus:z-50 focus:outline-2 focus:outline-navy-900"
      >
        {t.skipLink}
      </a>

      {/* Top bar */}
      <header className="sticky top-3 z-30 mx-auto flex max-w-[90rem] items-center gap-3 rounded-panel bg-white px-3 py-3 shadow-soft sm:px-5">
        <button
          ref={menuButtonRef}
          type="button"
          onClick={() => menuRef.current?.showModal()}
          aria-label={t.openMenu}
          className={`${roundBtn} lg:hidden`}
        >
          <Menu aria-hidden className="size-5" />
        </button>
        <Link href={base} aria-label={`${title}: ${t.overview}`} className={`shrink-0 rounded-sm ${ring}`}>
          <Logo size={36} className="h-8 w-auto sm:h-9" />
        </Link>
        <span
          title={t.prototypeHint}
          className="hidden shrink-0 whitespace-nowrap rounded-full border border-dashed border-gray-500 px-2.5 py-0.5 text-eyebrow uppercase text-gray-700 md:inline-flex 2xl:hidden"
        >
          {t.prototypeShort}
        </span>

        <nav aria-label={t.navLabel} className="mx-auto hidden lg:block">
          <ul className="flex items-center gap-1 rounded-full bg-gray-50 p-1.5">
            {top.map((n) => {
              const active = isActive(n.slug);
              return (
                <li key={n.slug}>
                  <Link
                    href={hrefFor(base, n.slug)}
                    aria-current={active ? "page" : undefined}
                    className={`inline-flex whitespace-nowrap rounded-full px-4 py-2.5 font-semibold transition-colors duration-150 xl:px-5 ${ring} ${
                      active ? "bg-white text-navy-900 shadow-soft" : "text-gray-700 hover:text-navy-900"
                    }`}
                  >
                    {n.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="ml-auto flex items-center gap-2 lg:ml-0">
          <span
            title={t.prototypeHint}
            className="mr-1 hidden shrink-0 whitespace-nowrap rounded-full border border-dashed border-gray-500 px-2.5 py-0.5 text-eyebrow uppercase text-gray-700 2xl:inline-flex"
          >
            {t.prototypeLabel}
          </span>
          <SearchDialog items={searchItems} />
          <Notifications items={notifications} />
          <AccountMenu user={user} roleLabel={roleLabel} />
        </div>
      </header>

      {/* Menu for screens below 1024px */}
      <dialog
        ref={menuRef}
        aria-label={t.navLabel}
        onClick={(e) => e.target === menuRef.current && menuRef.current?.close()}
        onClose={() => menuButtonRef.current?.focus()}
        className="m-0 h-dvh max-h-dvh w-80 max-w-[85vw] bg-white p-0 backdrop:bg-navy-900/60 lg:hidden"
      >
        <div className="flex h-full flex-col gap-6 p-5">
          <div className="flex items-center justify-between">
            <Logo size={32} />
            <button type="button" onClick={() => menuRef.current?.close()} aria-label={t.closeMenu} className={roundBtn}>
              <X aria-hidden className="size-5" />
            </button>
          </div>
          <span className="self-start rounded-full border border-dashed border-gray-500 px-2.5 py-0.5 text-eyebrow uppercase text-gray-700">
            {t.prototypeLabel}
          </span>
          <nav aria-label={t.navLabel} className="flex-1 overflow-y-auto">
            <ul className="space-y-1">
              {nav.map((n) => {
                const Icon = icons[n.icon];
                const active = isActive(n.slug);
                return (
                  <li key={n.slug}>
                    <Link
                      href={hrefFor(base, n.slug)}
                      onClick={() => menuRef.current?.close()}
                      aria-current={active ? "page" : undefined}
                      className={`flex items-center gap-3 rounded-full px-4 py-3 font-semibold ${ring} ${
                        active ? "bg-green-700 text-white" : "text-navy-900 hover:bg-gray-50"
                      }`}
                    >
                      <Icon aria-hidden className="size-5" /> {n.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
          <div className="space-y-1 border-t border-gray-200 pt-4">
            <Link href="/sign-in" className={`block rounded-full px-4 py-2.5 font-semibold text-navy-900 hover:bg-gray-50 ${ring}`}>
              {t.switchUser}
            </Link>
            <Link href="/" className={`block rounded-full px-4 py-2.5 font-semibold text-navy-900 hover:bg-gray-50 ${ring}`}>
              {t.signOut}
            </Link>
          </div>
        </div>
      </dialog>

      <div className="mx-auto mt-6 max-w-[90rem] lg:grid lg:grid-cols-[5.5rem_1fr] lg:gap-6">
        {/* Icon rail */}
        <aside className="hidden lg:block">
          <nav aria-label={t.railLabel} className="sticky top-32 flex flex-col items-center gap-4">
            {[rail1, rail2].map((group, i) => (
              <ul key={i} className="flex flex-col gap-2 rounded-full bg-white p-2 shadow-soft">
                {group.map((n) => (
                  <RailButton key={n.slug} href={hrefFor(base, n.slug)} label={n.label} icon={icons[n.icon]} active={isActive(n.slug)} />
                ))}
              </ul>
            ))}
            {settings && (
              <ul className="rounded-full bg-white p-2 shadow-soft">
                <RailButton href={hrefFor(base, settings.slug)} label={settings.label} icon={Settings} active={isActive(settings.slug)} />
              </ul>
            )}
            <ul className="rounded-full bg-white p-2 shadow-soft">
              <RailButton href="/sign-in" label={t.switchUser} icon={LogOut} active={false} />
            </ul>
          </nav>
        </aside>

        <main id="main" className="min-w-0">
          {children}
        </main>
      </div>
    </div>
  );
}
