import Link from "next/link";
import { connection } from "next/server";
import { Suspense } from "react";
import { Mail, MapPin, Phone } from "lucide-react";
import { Badge } from "@/components/Badge";
import { InstagramIcon } from "@/components/InstagramIcon";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Eyebrow } from "@/components/ui/typography";
import { footer, header } from "@/content/home";
import { prototypeMode, showDraftLabels } from "@/content/site";
import { footerText as t } from "@/content/ui";

/*
  Footer (spec 4.2.14). Navy. Logo and mission statement, audience links, About / Programmes /
  Resources, official contact details, official social links, legal links.
  Missing Bridge-supplied items show a Draft placeholder line only while Draft labels are on.
  Nothing is invented. Social links open in a new tab, which their names say.
*/

const linkClass =
  "rounded-sm text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring";

// Worked out when the page is requested, so the year is never stuck at build time.
async function Copyright() {
  await connection();
  return <p className="text-sm text-muted-foreground">{t.copyright.replace("{year}", String(new Date().getFullYear()))}</p>;
}

function Placeholder({ children }: { children: string }) {
  if (!prototypeMode || !showDraftLabels) return null;
  return (
    <p className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
      <Badge kind="draft" /> {children}
    </p>
  );
}

function LinkColumn({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  return (
    <nav aria-label={title}>
      <Eyebrow as="h2">{title}</Eyebrow>
      <ul className="mt-5 space-y-3">
        {links.map((l) => (
          <li key={l.href}>
            <Link href={l.href} className={linkClass}>
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export function Footer() {
  const contact = footer.contact;
  const showContact = contact && (contact.approved || prototypeMode);

  return (
    <footer className="surface-navy">
      <div className="mx-auto max-w-content px-gutter pt-section-mobile pb-10 md:pt-section">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.4fr]">
          <div className="space-y-5">
            <Link href="/" aria-label={header.homeLabel} className="inline-block rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring">
              <Logo variant="white" />
            </Link>
            {footer.missionStatement ? (
              <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">{footer.missionStatement}</p>
            ) : (
              <Placeholder>{t.missionPlaceholder}</Placeholder>
            )}
          </div>

          <LinkColumn title={t.columns.pathways} links={footer.audienceLinks} />
          <LinkColumn title={t.columns.explore} links={footer.otherLinks} />

          <div>
            <Eyebrow as="h2">{t.columns.contact}</Eyebrow>
            {showContact ? (
              <address className="mt-5 space-y-3 text-sm not-italic">
                {!contact.approved && <Badge kind="draft" approvalKey="contact:footer" />}
                {contact.address && (
                  <p className="flex gap-3 text-muted-foreground">
                    <MapPin aria-hidden className="mt-0.5 size-4 shrink-0 text-brand-green" />
                    <span>{contact.address}</span>
                  </p>
                )}
                {contact.phone && (
                  <p className="flex gap-3">
                    <Phone aria-hidden className="mt-0.5 size-4 shrink-0 text-brand-green" />
                    <a href={`tel:${contact.phone.replace(/\s/g, "")}`} className={linkClass}>
                      {contact.phone}
                    </a>
                  </p>
                )}
                {contact.email && (
                  <p className="flex gap-3">
                    <Mail aria-hidden className="mt-0.5 size-4 shrink-0 text-brand-green" />
                    <a href={`mailto:${contact.email}`} className={`break-all ${linkClass}`}>
                      {contact.email}
                    </a>
                  </p>
                )}
              </address>
            ) : null}
            <div className="mt-6">
              {footer.social.length > 0 ? (
                <ul className="flex gap-3">
                  {footer.social.map((s) => (
                    <li key={s.href}>
                      <Button asChild variant="on-navy" size="icon-lg">
                        <a href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label}>
                          <InstagramIcon className="size-5" />
                        </a>
                      </Button>
                    </li>
                  ))}
                </ul>
              ) : (
                <Placeholder>{t.socialPlaceholder}</Placeholder>
              )}
            </div>
          </div>
        </div>

        <Separator className="mt-14 mb-8" />
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <Suspense fallback={<p className="text-sm">&nbsp;</p>}>
            <Copyright />
          </Suspense>
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {footer.legal.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className={linkClass}>
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
