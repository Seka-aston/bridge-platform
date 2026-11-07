"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowLeftRight, LogOut, Menu, X } from "lucide-react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { Logo } from "@/components/Logo";
import { dashboardText as t, type NavLink } from "@/content/dashboard";

/*
  Shared dashboard frame (Checkpoint 6): navy sidebar (Aston, 7 Nov 2026), white top bar,
  white work area. Below 1024px the sidebar becomes a slide-in menu (a native <dialog>,
  so focus is trapped, Escape closes it and the page behind is inert).
*/

type Props = {
  base: string; // e.g. /dashboard/student
  title: string;
  roleLabel: string;
  user: { name: string; detail: string };
  nav: NavLink[];
  children: ReactNode;
};

const ringDark = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white";
const ringLight = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy-900";

function initials(name: string) {
  return name.split(" ").map((p) => p[0]).join("").slice(0, 2);
}

function SideNav({ base, nav, onNavigate }: { base: string; nav: NavLink[]; onNavigate?: () => void }) {
  const pathname = usePathname();
  const links = [{ label: t.overview, href: base }, ...nav.map((n) => ({ label: n.label, href: `${base}/${n.slug}` }))];
  return (
    <nav aria-label={t.navLabel}>
      <ul className="space-y-1">
        {links.map((l) => {
          const active = pathname === l.href;
          return (
            <li key={l.href}>
              <Link
                href={l.href}
                onClick={onNavigate}
                aria-current={active ? "page" : undefined}
                className={`flex items-center rounded-control border-l-4 px-3 py-2.5 font-semibold text-white transition-colors duration-150 hover:bg-white/10 ${ringDark} ${
                  active ? "border-green-500 bg-white/10" : "border-transparent"
                }`}
              >
                {l.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

function SidebarFooter({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <div className="space-y-1 border-t border-white/20 pt-4">
      <Link href="/sign-in" onClick={onNavigate} className={`flex items-center gap-2 rounded-control px-3 py-2 text-white hover:bg-white/10 ${ringDark}`}>
        <ArrowLeftRight aria-hidden className="size-4" /> {t.switchUser}
      </Link>
      <Link href="/" onClick={onNavigate} className={`flex items-center gap-2 rounded-control px-3 py-2 text-white hover:bg-white/10 ${ringDark}`}>
        <LogOut aria-hidden className="size-4" /> {t.signOut}
      </Link>
    </div>
  );
}

export function DashboardShell({ base, title, roleLabel, user, nav, children }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const d = dialogRef.current;
    if (!d) return;
    if (menuOpen && !d.open) d.showModal();
    if (!menuOpen && d.open) d.close();
  }, [menuOpen]);

  const closeMenu = () => {
    setMenuOpen(false);
    menuButtonRef.current?.focus();
  };

  return (
    <div className="min-h-dvh bg-white lg:grid lg:grid-cols-[16rem_1fr]">
      <a
        href="#main"
        className="sr-only rounded-control bg-white px-4 py-2 font-semibold text-navy-900 focus:not-sr-only focus:fixed focus:left-4 focus:top-3 focus:z-50 focus:outline-2 focus:outline-navy-900"
      >
        {t.skipLink}
      </a>

      {/* Desktop sidebar */}
      <aside className="sticky top-0 hidden h-dvh flex-col gap-8 overflow-y-auto bg-navy-900 p-4 lg:flex">
        <Link href={base} aria-label={`${title}: ${t.overview}`} className={`inline-block self-start rounded-sm px-2 pt-2 ${ringDark}`}>
          <Logo variant="white" size={36} />
        </Link>
        <div className="flex-1">
          <SideNav base={base} nav={nav} />
        </div>
        <SidebarFooter />
      </aside>

      {/* Mobile and tablet sidebar */}
      <dialog
        ref={dialogRef}
        onClose={() => setMenuOpen(false)}
        onClick={(e) => e.target === dialogRef.current && closeMenu()}
        aria-label={t.navLabel}
        className="m-0 h-dvh max-h-dvh w-72 max-w-[85vw] bg-navy-900 p-0 backdrop:bg-navy-900/60 lg:hidden"
      >
        <div className="flex h-full flex-col gap-8 p-4">
          <div className="flex items-center justify-between">
            <Logo variant="white" size={32} />
            <button
              type="button"
              onClick={closeMenu}
              aria-label={t.closeMenu}
              className={`inline-flex size-11 items-center justify-center rounded-control text-white hover:bg-white/10 ${ringDark}`}
            >
              <X aria-hidden className="size-6" />
            </button>
          </div>
          <div className="flex-1">
            <SideNav base={base} nav={nav} onNavigate={() => setMenuOpen(false)} />
          </div>
          <SidebarFooter onNavigate={() => setMenuOpen(false)} />
        </div>
      </dialog>

      <div className="flex min-w-0 flex-col">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-gray-200 bg-white px-gutter">
          <button
            ref={menuButtonRef}
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-label={t.openMenu}
            aria-expanded={menuOpen}
            className={`-ml-2 inline-flex size-11 items-center justify-center rounded-control text-navy-900 hover:bg-green-50 lg:hidden ${ringLight}`}
          >
            <Menu aria-hidden className="size-6" />
          </button>
          <p className="min-w-0 truncate font-bold text-navy-900">{title}</p>
          <span
            title={t.prototypeHint}
            className="hidden shrink-0 whitespace-nowrap rounded-control border border-dashed border-gray-500 px-2 py-0.5 text-eyebrow uppercase text-gray-700 sm:inline-flex"
          >
            {t.prototypeLabel}
          </span>
          {/* Phones: shorter label so it always fits */}
          <span
            title={`${t.prototypeLabel}. ${t.prototypeHint}`}
            className="inline-flex shrink-0 whitespace-nowrap rounded-control border border-dashed border-gray-500 px-2 py-0.5 text-eyebrow uppercase text-gray-700 sm:hidden"
          >
            {t.prototypeShort}
          </span>
          <div className="ml-auto flex items-center gap-3">
            <div className="hidden text-right md:block">
              <p className="font-semibold text-navy-900">{user.name}</p>
              <p className="text-sm text-gray-500">
                {t.sampleUser} · {roleLabel}
              </p>
            </div>
            <span aria-hidden className="inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-green-50 font-bold text-green-700">
              {initials(user.name)}
            </span>
          </div>
        </header>
        <main id="main" className="flex-1 px-gutter py-8 md:py-10">
          <div className="mx-auto max-w-content">{children}</div>
        </main>
      </div>
    </div>
  );
}
