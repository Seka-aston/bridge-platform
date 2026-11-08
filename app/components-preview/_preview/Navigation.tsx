"use client";

import Link from "next/link";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Badge } from "@/components/ui/badge";
import {
  NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger, navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Caption } from "@/components/ui/typography";
import { Demo, Section } from "./Section";

const talentLinks = [
  { title: "Learning", href: "/learning", text: "Courses, projects and practical training." },
  { title: "Skills Passport", href: "/skills-passport", text: "Show verified skills and project evidence." },
  { title: "Opportunities", href: "/opportunities", text: "Internships, jobs and venture pathways." },
];

export function Navigation() {
  return (
    <Section
      id="navigation"
      eyebrow="Components"
      title="Navigation"
      note="The header menu opens on hover or with the keyboard (Enter, arrow keys, Escape). Bridge has not supplied the dropdown contents yet, so the first menu shows sample links to existing pages."
    >
      <Demo label="Header menu (Navigation Menu)" hint="Desktop only; phones get the drawer menu" className="max-md:overflow-x-auto rounded-xl border p-3">
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger>For Talents</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-80 gap-1 p-1">
                  {talentLinks.map((l) => (
                    <li key={l.href}>
                      <NavigationMenuLink asChild>
                        <Link href={l.href}>
                          <span className="font-semibold text-heading">{l.title}</span>
                          <span className="text-muted-foreground">{l.text}</span>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                  ))}
                  <li className="px-2 pt-1 pb-2">
                    <Badge variant="sample">Sample links until Bridge supplies the menu</Badge>
                  </li>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
            {["For Schools", "For Companies", "Ventures Lab"].map((label) => (
              <NavigationMenuItem key={label}>
                <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                  <Link href={`/${label.toLowerCase().replace(" ", "-")}`}>{label}</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>
      </Demo>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
        <Demo label="Breadcrumb" hint="Top of every dashboard page">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/dashboard/student">Dashboard</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/dashboard/student/courses">Courses</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Back-End Development</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </Demo>
        <Demo label="Pagination">
          <Pagination className="justify-start">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious href="#navigation" />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#navigation">1</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#navigation" isActive>
                  2
                </PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#navigation">3</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
              <PaginationItem>
                <PaginationNext href="#navigation" />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </Demo>
      </div>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
        <Demo label="Tabs">
          <Tabs defaultValue="today">
            <TabsList>
              <TabsTrigger value="today">Today</TabsTrigger>
              <TabsTrigger value="week">This week</TabsTrigger>
              <TabsTrigger value="done">Done</TabsTrigger>
            </TabsList>
            <TabsContent value="today" className="pt-3 text-sm">
              Finish lesson 9: Building a REST endpoint (12 min).
            </TabsContent>
            <TabsContent value="week" className="pt-3 text-sm">
              Submit the REST endpoint assignment by Friday.
            </TabsContent>
            <TabsContent value="done" className="pt-3 text-sm">
              Database Design, lesson 4.
            </TabsContent>
          </Tabs>
          <Tabs defaultValue="all" className="mt-6">
            <TabsList variant="line">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="open">Open</TabsTrigger>
              <TabsTrigger value="closed">Closed</TabsTrigger>
            </TabsList>
            <TabsContent value="all" className="pt-3 text-sm">4 programmes</TabsContent>
            <TabsContent value="open" className="pt-3 text-sm">1 programme</TabsContent>
            <TabsContent value="closed" className="pt-3 text-sm">1 programme</TabsContent>
          </Tabs>
          <Caption className="mt-2">Line style, for filters above lists.</Caption>
        </Demo>
        <Demo label="Accordion">
          <Accordion type="single" collapsible defaultValue="who">
            <AccordionItem value="who">
              <AccordionTrigger>Who can apply?</AccordionTrigger>
              <AccordionContent>TVET graduates or current advanced-level TVET students.</AccordionContent>
            </AccordionItem>
            <AccordionItem value="format">
              <AccordionTrigger>How is the programme run?</AccordionTrigger>
              <AccordionContent>In person in Kigali, over six weeks.</AccordionContent>
            </AccordionItem>
            <AccordionItem value="laptop">
              <AccordionTrigger>Do I need my own laptop?</AccordionTrigger>
              <AccordionContent>Yes, for the duration of the programme.</AccordionContent>
            </AccordionItem>
          </Accordion>
        </Demo>
      </div>

      <Demo label="Separator" className="flex h-5 items-center gap-4 text-sm">
        <span>Kigali, Rwanda</span>
        <Separator orientation="vertical" />
        <span>In person</span>
        <Separator orientation="vertical" />
        <span>6 weeks</span>
      </Demo>
    </Section>
  );
}
