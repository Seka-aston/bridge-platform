"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Menu, X } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import { Button } from "@/components/Button";
import { Logo } from "@/components/Logo";
import { header as headerContent, type NavItem } from "@/content/home";

/*
  Site header (CLAUDE.md section 7, component 4; spec 4.2.2).

  - 1280px and wider: logo · menu links · Login (text) · Book a Discovery Call (button)
  - 768–1279px: logo · Book a Discovery Call · menu button
  - Below 768px: logo · menu button (everything else is inside the menu)

  Menu items become dropdowns automatically when they have `children` in
  content/home.ts. Dropdowns open with Enter or Space, close with Escape
  (focus returns to the menu item), or by clicking or tabbing away.

  `demo` is for /components-preview only: no sticky position, no skip link.
*/

type HeaderProps = {
  nav?: NavItem[];
  demo?: boolean;
};

const focusRing = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy-900";

// Desktop menu items stay on one line. Spacing is tight so all five items fit at 1280px
// even once they all have dropdown arrows.
const navLinkBase = `inline-flex items-center gap-1 whitespace-nowrap rounded-control px-2.5 py-2 font-semibold transition-colors duration-150 ${focusRing}`;

function isCurrent(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

function DesktopDropdown({
  item,
  open,
  onToggle,
  onClose,
  current,
}: {
  item: NavItem;
  open: boolean;
  onToggle: () => void;
  onClose: () => void;
  current: boolean;
}) {
  const panelId = useId();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const wrapperRef = useRef<HTMLLIElement>(null);

  return (
    <li
      ref={wrapperRef}
      className="relative"
      onKeyDown={(e) => {
        if (e.key === "Escape" && open) {
          onClose();
          buttonRef.current?.focus();
        }
      }}
      onBlur={(e) => {
        // Close when keyboard focus leaves the item and its dropdown.
        if (open && !wrapperRef.current?.contains(e.relatedTarget as Node | null)) onClose();
      }}
    >
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={onToggle}
        className={`${navLinkBase} ${
          open || current ? "text-green-700" : "text-gray-700 hover:text-green-700"
        }`}
      >
        {item.label}
        <ChevronDown aria-hidden className={`size-4 transition-transform duration-150 ${open ? "rotate-180" : ""}`} />
      </button>
      <div
        id={panelId}
        hidden={!open}
        className="absolute left-0 top-full z-10 mt-2 w-72 rounded-card border border-gray-200 bg-white p-2 shadow-card-hover"
      >
        <ul>
          {item.children?.map((child) => (
            <li key={child.href}>
              <Link
                href={child.href}
                onClick={onClose}
                className={`block rounded-control px-3 py-2 font-semibold text-gray-700 hover:bg-green-50 hover:text-green-800 ${focusRing}`}
              >
                {child.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </li>
  );
}

function MobileItem({ item, onNavigate, current }: { item: NavItem; onNavigate: () => void; current: boolean }) {
  const [open, setOpen] = useState(false);
  const listId = useId();
  const rowClass = `flex w-full items-center justify-between rounded-control px-3 py-3 text-body-lg font-semibold ${focusRing}`;

  if (!item.children?.length) {
    return (
      <li>
        <Link
          href={item.href}
          onClick={onNavigate}
          aria-current={current ? "page" : undefined}
          className={`${rowClass} ${current ? "bg-green-50 text-green-700" : "text-navy-900 hover:bg-green-50"}`}
        >
          {item.label}
        </Link>
      </li>
    );
  }

  return (
    <li>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={listId}
        onClick={() => setOpen((o) => !o)}
        className={`${rowClass} text-navy-900 hover:bg-green-50`}
      >
        {item.label}
        <ChevronDown aria-hidden className={`size-5 transition-transform duration-150 ${open ? "rotate-180" : ""}`} />
      </button>
      <ul id={listId} hidden={!open} className="pb-2 pl-3">
        {item.children.map((child) => (
          <li key={child.href}>
            <Link
              href={child.href}
              onClick={onNavigate}
              className={`block rounded-control px-3 py-2 font-semibold text-gray-700 hover:bg-green-50 hover:text-green-800 ${focusRing}`}
            >
              {child.label}
            </Link>
          </li>
        ))}
      </ul>
    </li>
  );
}

export function Header({ nav = headerContent.nav, demo = false }: HeaderProps) {
  const pathname = usePathname() ?? "/";
  const [menuOpen, setMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const menuId = useId();
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const navRef = useRef<HTMLUListElement>(null);

  // Close everything after moving to another page.
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setMenuOpen(false);
    setOpenDropdown(null);
  }

  // Mobile menu: Escape closes it; the page behind doesn't scroll; it closes if the window grows to desktop width.
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    };
    const wide = window.matchMedia("(min-width: 1280px)");
    const onWide = () => wide.matches && setMenuOpen(false);
    document.addEventListener("keydown", onKey);
    wide.addEventListener("change", onWide);
    const previousOverflow = document.documentElement.style.overflow;
    if (!demo) document.documentElement.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      wide.removeEventListener("change", onWide);
      document.documentElement.style.overflow = previousOverflow;
    };
  }, [menuOpen, demo]);

  // Desktop dropdowns close when clicking anywhere else.
  useEffect(() => {
    if (!openDropdown) return;
    const onPointer = (e: PointerEvent) => {
      if (!navRef.current?.contains(e.target as Node)) setOpenDropdown(null);
    };
    document.addEventListener("pointerdown", onPointer);
    return () => document.removeEventListener("pointerdown", onPointer);
  }, [openDropdown]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className={`${demo ? "relative" : "sticky top-0"} z-50 border-b border-gray-200 bg-white`}>
      {!demo && (
        <a
          href="#main"
          className="sr-only rounded-control bg-white px-4 py-2 font-semibold text-navy-900 focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-50 focus:outline-2 focus:outline-navy-900"
        >
          {headerContent.skipLink}
        </a>
      )}

      <div className="mx-auto flex h-16 max-w-content items-center justify-between gap-4 px-gutter xl:h-18">
        <Link
          href="/"
          onClick={closeMenu}
          aria-label={headerContent.homeLabel}
          className={`shrink-0 rounded-sm ${focusRing}`}
        >
          <Logo priority={!demo} />
        </Link>

        {/* Desktop menu */}
        <nav aria-label={headerContent.navLabel} className="hidden xl:block">
          <ul ref={navRef} className="flex items-center gap-0.5">
            {nav.map((item) => {
              const current = isCurrent(pathname, item.href);
              return item.children?.length ? (
                <DesktopDropdown
                  key={item.href}
                  item={item}
                  current={current}
                  open={openDropdown === item.href}
                  onToggle={() => setOpenDropdown((o) => (o === item.href ? null : item.href))}
                  onClose={() => setOpenDropdown(null)}
                />
              ) : (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={current ? "page" : undefined}
                    className={`${navLinkBase} ${current ? "text-green-700" : "text-gray-700 hover:text-green-700"}`}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          {/* Wrappers carry the show/hide rules so they can't clash with the links' own display style. */}
          <div className="hidden xl:block">
            <Link
              href={headerContent.login.href}
              aria-current={isCurrent(pathname, headerContent.login.href) ? "page" : undefined}
              className={`${navLinkBase} text-gray-700 hover:text-green-700`}
            >
              {headerContent.login.label}
            </Link>
          </div>
          <div className="hidden md:block">
            <Button href={headerContent.primary.href} className="whitespace-nowrap">
              {headerContent.primary.label}
            </Button>
          </div>

          <button
            ref={menuButtonRef}
            type="button"
            aria-expanded={menuOpen}
            aria-controls={menuId}
            aria-label={menuOpen ? headerContent.menuClose : headerContent.menuOpen}
            onClick={() => setMenuOpen((o) => !o)}
            className={`-mr-2 inline-flex size-11 items-center justify-center rounded-control text-navy-900 hover:bg-green-50 xl:hidden ${focusRing}`}
          >
            {menuOpen ? <X aria-hidden className="size-6" /> : <Menu aria-hidden className="size-6" />}
          </button>
        </div>
      </div>

      {/* Mobile and tablet menu */}
      <div
        id={menuId}
        hidden={!menuOpen}
        className={`${
          demo ? "relative" : "absolute inset-x-0 top-full h-[calc(100dvh-100%)]"
        } overflow-y-auto border-t border-gray-200 bg-white xl:hidden`}
      >
        <nav aria-label={headerContent.navLabel} className="mx-auto max-w-content px-gutter py-6">
          <ul className="space-y-1">
            {nav.map((item) => (
              <MobileItem key={item.href} item={item} onNavigate={closeMenu} current={isCurrent(pathname, item.href)} />
            ))}
          </ul>
          <div className="mt-6 flex flex-col gap-3 border-t border-gray-200 pt-6">
            <Link
              href={headerContent.login.href}
              onClick={closeMenu}
              className={`rounded-control px-3 py-3 text-body-lg font-semibold text-gray-700 hover:bg-green-50 ${focusRing}`}
            >
              {headerContent.login.label}
            </Link>
            <Button href={headerContent.primary.href} size="lg" className="w-full">
              {headerContent.primary.label}
            </Button>
          </div>
        </nav>
      </div>
    </header>
  );
}
