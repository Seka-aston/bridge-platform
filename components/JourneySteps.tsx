import { BadgeCheck, BookOpen, Hammer, Network, type LucideIcon } from "lucide-react";
import { journeyText } from "@/content/ui";

/*
  Journey step (CLAUDE.md section 7, component 10; spec 4.2.11).
  Four steps with one consistent icon set. No arrows: the journey describes Bridge's
  intended service model and must not imply every student automatically goes through every stage.
*/

const icons: LucideIcon[] = [BookOpen, Hammer, BadgeCheck, Network];

type Step = { number: number; title: string; description: string };

export function JourneyStep({ step, icon: Icon }: { step: Step; icon: LucideIcon }) {
  return (
    <div className="relative">
      <span className="relative z-10 inline-flex size-14 items-center justify-center rounded-full border-4 border-white bg-green-50">
        <Icon aria-hidden className="size-6 text-green-700" />
      </span>
      <p className="mt-4 text-eyebrow uppercase text-green-700">{journeyText.step.replace("{number}", String(step.number))}</p>
      <h3 className="mt-1 text-h3 text-navy-900">{step.title}</h3>
      <p className="mt-2 text-gray-700">{step.description}</p>
    </div>
  );
}

export function JourneySteps({ steps }: { steps: Step[] }) {
  return (
    <ol className="relative grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
      {/* A quiet line linking the steps on wide screens; decoration only. */}
      <span aria-hidden className="absolute left-7 right-7 top-7 hidden h-px bg-gray-200 lg:block" />
      {steps.map((s, i) => (
        <li key={s.number}>
          <JourneyStep step={s} icon={icons[i % icons.length]} />
        </li>
      ))}
    </ol>
  );
}
