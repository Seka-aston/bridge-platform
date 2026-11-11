"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { useEffect, useState } from "react";
import { Logo } from "@/components/Logo";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger, navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { header as headerContent, type NavItem } from "@/content/home";
import { cn } from "@/lib/utils";

/*
  Site header (spec 4.2.2), built on the shadcn Navigation Menu and Sheet.

  - 1024px and wider: logo · menu · Login (text) · Book a Discovery Call (button)
  - 768–1023px: logo · Book a Discovery Call · menu button
  - Below 768px: logo · menu button (everything else is in the slide-in menu)

  Menu items become dropdowns automatically when they have `children` in content/home.ts
  (Bridge has not supplied the dropdown contents yet). Keyboard: Tab, Enter, arrow keys, Escape.

  Integrated header: on the homepage the header is see-through over the green hero (white links,
  white "inverse" button) until the visitor scrolls; then it turns white. The hero slides up
  under it (Hero.tsx).
*/

function isCurrent(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

function DesktopItem({ item, current, onHero }: { item: NavItem; current: boolean; onHero: boolean }) {
  if (item.children?.length) {
    return (
      <NavigationMenuItem>
        <NavigationMenuTrigger className={cn("bg-transparent", current && "text-heading")}>{item.label}</NavigationMenuTrigger>
        <NavigationMenuContent>
          <ul className="grid w-72 gap-1 p-1">
            {item.children.map((child) => (
              <li key={child.href}>
                <NavigationMenuLink asChild>
                  <Link href={child.href} className="font-medium">
                    {child.label}
                  </Link>
                </NavigationMenuLink>
              </li>
            ))}
          </ul>
        </NavigationMenuContent>
      </NavigationMenuItem>
    );
  }
  return (
    <NavigationMenuItem>
      <NavigationMenuLink asChild active={current} className={cn(navigationMenuTriggerStyle(), "bg-transparent px-3", current || onHero ? "text-foreground" : "text-foreground/80")}>
        <Link href={item.href} aria-current={current ? "page" : undefined}>
          {item.label}
        </Link>
      </NavigationMenuLink>
    </NavigationMenuItem>
  );
}

function MobileMenu({ nav, pathname }: { nav: NavItem[]; pathname: string }) {
  const row = "flex w-full items-center rounded-md px-3 py-3 text-base font-medium hover:bg-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring";
  return (
    <nav aria-label={headerContent.navLabel} className="flex flex-1 flex-col overflow-y-auto px-4 pb-6">
      <ul className="space-y-1">
        {nav.map((item) => {
          const current = isCurrent(pathname, item.href);
          if (item.children?.length) {
            return (
              <li key={item.href}>
                <Accordion type="single" collapsible>
                  <AccordionItem value={item.href} className="border-0">
                    <AccordionTrigger className="px-3 py-3 text-base hover:no-underline">{item.label}</AccordionTrigger>
                    <AccordionContent className="pb-2 pl-3">
                      {item.children.map((child) => (
                        <SheetClose asChild key={child.href}>
                          <Link href={child.href} className={row}>
                            {child.label}
                          </Link>
                        </SheetClose>
                      ))}
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </li>
            );
          }
          return (
            <li key={item.href}>
              <SheetClose asChild>
                <Link href={item.href} aria-current={current ? "page" : undefined} className={cn(row, current && "bg-secondary text-secondary-foreground")}>
                  {item.label}
                </Link>
              </SheetClose>
            </li>
          );
        })}
      </ul>
      <Separator className="my-6" />
      <div className="mt-auto flex flex-col gap-3">
        <SheetClose asChild>
          <Button asChild variant="outline" size="lg">
            <Link href={headerContent.login.href}>{headerContent.login.label}</Link>
          </Button>
        </SheetClose>
        <SheetClose asChild>
          <Button asChild size="lg">
            <Link href={headerContent.primary.href}>{headerContent.primary.label}</Link>
          </Button>
        </SheetClose>
      </div>
    </nav>
  );
}

export function Header({ nav = headerContent.nav }: { nav?: NavItem[] }) {
  const pathname = usePathname() ?? "/";

  // See-through over the hero at the top of the homepage; white once the visitor scrolls.
  const [atTop, setAtTop] = useState(true);
  useEffect(() => {
    const onScroll = () => setAtTop(window.scrollY < 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  const dark = pathname === "/" && atTop;
  const loginCurrent = isCurrent(pathname, headerContent.login.href);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b transition-colors duration-200",
        dark ? "tokens-green border-transparent bg-transparent" : "border-border bg-background",
      )}
    >
      <a
        href="#main"
        className="sr-only rounded-md bg-white px-4 py-2 text-sm font-semibold text-brand-navy focus:not-sr-only focus:absolute focus:top-3 focus:left-4 focus:z-50 focus:outline-2 focus:outline-ring"
      >
        {headerContent.skipLink}
      </a>

      <div className="mx-auto flex h-16 max-w-content items-center justify-between gap-4 px-gutter">
        <Link href="/" aria-label={headerContent.homeLabel} className="shrink-0 rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring">
          <Logo variant={dark ? "white" : "green"} size={32} priority />
        </Link>

        <NavigationMenu aria-label={headerContent.navLabel} className="hidden lg:flex">
          <NavigationMenuList className="gap-0">
            {nav.map((item) => (
              <DesktopItem key={item.href} item={item} current={isCurrent(pathname, item.href)} onHero={dark} />
            ))}
          </NavigationMenuList>
        </NavigationMenu>

        <div className="flex items-center gap-2">
          <Button asChild variant="ghost" className={cn("hidden lg:inline-flex", loginCurrent || dark ? "text-foreground" : "text-foreground/80")}>
            <Link href={headerContent.login.href} aria-current={loginCurrent ? "page" : undefined}>
              {headerContent.login.label}
            </Link>
          </Button>
          <Button asChild variant={dark ? "inverse" : "default"} className="hidden md:inline-flex">
            <Link href={headerContent.primary.href}>{headerContent.primary.label}</Link>
          </Button>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon-lg" className="-mr-2 lg:hidden" aria-label={headerContent.menuOpen}>
                <Menu />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full max-w-sm gap-0">
              <SheetHeader className="pb-6">
                <SheetTitle asChild>
                  <div>
                    <Logo size={32} />
                    <span className="sr-only">{headerContent.navLabel}</span>
                  </div>
                </SheetTitle>
                <SheetDescription className="sr-only">{headerContent.navLabel}</SheetDescription>
              </SheetHeader>
              <MobileMenu nav={nav} pathname={pathname} />
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
