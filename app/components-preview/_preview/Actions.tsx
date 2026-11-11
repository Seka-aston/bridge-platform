"use client";

import { ArrowRight, BadgeCheck, Bold, CalendarDays, Clock, Download, Italic, LayoutGrid, List, PenLine, Plus, Sparkles, Trash2, Underline } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { Spinner } from "@/components/ui/spinner";
import { Toggle } from "@/components/ui/toggle";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Demo, Section } from "./Section";

const variants = ["default", "secondary", "outline", "navy", "ghost", "destructive", "link"] as const;
const names: Record<(typeof variants)[number], string> = {
  default: "Primary",
  secondary: "Secondary",
  outline: "Outline",
  navy: "Navy",
  ghost: "Ghost",
  destructive: "Destructive",
  link: "Text link",
};

export function Actions() {
  const [saving, setSaving] = useState(false);
  return (
    <>
      <Section
        id="buttons"
        eyebrow="Components"
        title="Buttons"
        note="Hover, press (moves down 1px) and Tab through each row to see every state. Dashboards use the default and small sizes (14px text); marketing pages use large and extra large (16px text)."
      >
        <Demo label="Variants" className="flex flex-wrap items-center gap-3">
          {variants.map((v) => (
            <Button key={v} variant={v}>
              {names[v]}
            </Button>
          ))}
        </Demo>
        <Demo label="Disabled" className="flex flex-wrap items-center gap-3">
          {variants.map((v) => (
            <Button key={v} variant={v} disabled>
              {names[v]}
            </Button>
          ))}
        </Demo>
        <Demo label="Sizes" className="flex flex-wrap items-center gap-3">
          <Button size="xs">Extra small</Button>
          <Button size="sm">Small</Button>
          <Button>Default</Button>
          <Button size="lg">Large · marketing</Button>
          <Button size="xl">Extra large · hero</Button>
        </Demo>
        <Demo label="With icons, icon-only and loading" className="flex flex-wrap items-center gap-3">
          <Button>
            <Plus data-icon="inline-start" /> Add new skill
          </Button>
          <Button variant="link">
            Explore all programmes <ArrowRight data-icon="inline-end" />
          </Button>
          <Button variant="outline" size="icon" aria-label="Download">
            <Download />
          </Button>
          <Button variant="ghost" size="icon" aria-label="Delete">
            <Trash2 />
          </Button>
          <Button
            disabled={saving}
            onClick={() => {
              setSaving(true);
              setTimeout(() => {
                setSaving(false);
                toast.success("Changes saved", { description: "This is a prototype: nothing was sent." });
              }, 1200);
            }}
          >
            {saving && <Spinner data-icon="inline-start" />}
            {saving ? "Saving…" : "Save changes"}
          </Button>
        </Demo>
        <Demo label="On navy sections" className="surface-navy flex flex-wrap items-center gap-3 rounded-xl p-6">
          <Button size="lg">Join a Programme</Button>
          <Button size="lg" variant="on-navy">
            Hire Vetted Talent
          </Button>
          <Button size="lg" variant="link">
            Book a Discovery Call <ArrowRight data-icon="inline-end" />
          </Button>
        </Demo>
        <Demo label="On the green homepage hero" className="surface-green flex flex-wrap items-center gap-3 rounded-xl p-6">
          <Button size="lg" variant="inverse">
            Join a Programme <ArrowRight data-icon="inline-end" />
          </Button>
          <Button size="lg" variant="on-navy">
            Hire Vetted Talent <ArrowRight data-icon="inline-end" />
          </Button>
          <Button size="lg" variant="link">
            Book a Discovery Call
          </Button>
        </Demo>
        <Demo label="Button group, toggle and toggle group" className="flex flex-wrap items-center gap-6">
          <ButtonGroup aria-label="Export">
            <Button variant="outline">Export CSV</Button>
            <Button variant="outline">Export PDF</Button>
          </ButtonGroup>
          <Toggle aria-label="Bold" variant="outline">
            <Bold />
          </Toggle>
          <ToggleGroup type="multiple" variant="outline" aria-label="Text style">
            <ToggleGroupItem value="bold" aria-label="Bold">
              <Bold />
            </ToggleGroupItem>
            <ToggleGroupItem value="italic" aria-label="Italic">
              <Italic />
            </ToggleGroupItem>
            <ToggleGroupItem value="underline" aria-label="Underline">
              <Underline />
            </ToggleGroupItem>
          </ToggleGroup>
          <ToggleGroup type="single" defaultValue="grid" variant="outline" aria-label="Layout">
            <ToggleGroupItem value="grid" aria-label="Grid view">
              <LayoutGrid />
            </ToggleGroupItem>
            <ToggleGroupItem value="list" aria-label="List view">
              <List />
            </ToggleGroupItem>
          </ToggleGroup>
        </Demo>
      </Section>

      <Section
        id="badges"
        eyebrow="Components"
        title="Badges"
        note="Every status is a word, never colour alone. Programme status is always calculated from the dates."
      >
        <Demo label="Programme status" className="flex flex-wrap items-center gap-3">
          <Badge variant="open">Open</Badge>
          <Badge variant="upcoming">Upcoming</Badge>
          <Badge variant="closed">Closed</Badge>
          <Badge variant="archived">Archived</Badge>
          <Badge variant="featured">Featured</Badge>
        </Demo>
        <Demo label="Content labels" className="flex flex-wrap items-center gap-3">
          {/* Draft: amber tint with a pencil (Aston chose option A, 8 Nov 2026). */}
          <Badge variant="draft">
            <PenLine data-icon="inline-start" /> Draft
          </Badge>
          <Badge variant="preview">
            <Sparkles data-icon="inline-start" /> Coming soon
          </Badge>
          <Badge variant="preview">Preview · In development</Badge>
          <Badge variant="sample">Sample profile</Badge>
          <Badge variant="verified">
            <BadgeCheck data-icon="inline-start" /> Skills verified
          </Badge>
          <Badge variant="outline">
            <Clock data-icon="inline-start" /> Verification in progress
          </Badge>
        </Demo>
        <Demo label="General" className="flex flex-wrap items-center gap-3">
          <Badge>Default</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="outline">
            <CalendarDays data-icon="inline-start" /> Thursday, 10:00
          </Badge>
          <Badge variant="destructive">Not progressing</Badge>
        </Demo>
      </Section>
    </>
  );
}
