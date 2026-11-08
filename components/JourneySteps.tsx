import { BadgeCheck, BookOpen, Hammer, Network, type LucideIcon } from "lucide-react";
import { IconTile } from "@/components/IconTile";
import { Eyebrow, H3 } from "@/components/ui/typography";
import { journeyText } from "@/content/ui";

/*
  Journey step (spec 4.2.11). Four steps with one consistent icon set. No arrows: the journey
  describes Bridge's intended service model and must not imply every student automatically
  goes through every stage.
*/

const icons: LucideIcon[] = [BookOpen, Hammer, BadgeCheck, Network];

type Step = { number: number; title: string; description: string };

export function JourneyStep({ step, icon }: { step: Step; icon: LucideIcon }) {
  return (
    <div className="relative">
      <IconTile icon={icon} className="relative z-10" />
      <Eyebrow className="mt-5">{journeyText.step.replace("{number}", String(step.number))}</Eyebrow>
      <H3 className="mt-2">{step.title}</H3>
      <p className="mt-2 text-muted-foreground">{step.description}</p>
    </div>
  );
}

export function JourneySteps({ steps }: { steps: Step[] }) {
  return (
    <ol className="relative grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
      {/* A quiet line linking the steps on wide screens; decoration only. */}
      <span aria-hidden className="absolute top-6 right-6 left-6 hidden h-px bg-border lg:block" />
      {steps.map((s, i) => (
        <li key={s.number}>
          <JourneyStep step={s} icon={icons[i % icons.length]} />
        </li>
      ))}
    </ol>
  );
}
