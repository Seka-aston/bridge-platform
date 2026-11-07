import Link from "next/link";
import { connection } from "next/server";
import { Suspense } from "react";
import { Mail, MapPin, Phone } from "lucide-react";
import { Badge } from "@/components/Badge";
import { Logo } from "@/components/Logo";
import { footer, header } from "@/content/home";
import { prototypeMode } from "@/content/site";
import { footerText as t } from "@/content/ui";

/*
  Footer (CLAUDE.md section 7, component 14; spec 4.2.14).
  Navy. Logo and mission statement, audience links, About / Programmes / Resources,
  official contact details, official social links, legal links.
  Missing Bridge-supplied items show a dashed placeholder in prototype mode and
  nothing at all otherwise. Nothing is invented.
*/

const linkClass =
  "rounded-sm text-white hover:underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white";

// Worked out when the page is requested, so the year is never stuck at build time.
async function Copyright() {
  await connection();
  return <p className="text-white">{t.copyright.replace("{year}", String(new Date().getFullYear()))}</p>;
}

function Placeholder({ children }: { children: string }) {
  if (!prototypeMode) return null;
  return (
    <p className="rounded-control border border-dashed border-white/60 px-3 py-2 text-white">
      {children} <Badge kind="draft" className="ml-1 align-middle" />
    </p>
  );
}

export function Footer() {
  const contact = footer.contact;
  const showContact = contact && (contact.approved || prototypeMode);

  return (
    <footer className="bg-navy-900 text-white">
      <div className="mx-auto max-w-content px-gutter py-section-mobile md:py-section">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_1.3fr]">
          <div className="space-y-6">
            <Link href="/" aria-label={header.homeLabel} className={`inline-block ${linkClass}`}>
              <Logo variant="white" />
            </Link>
            {footer.missionStatement ? (
              <p className="max-w-sm text-white">{footer.missionStatement}</p>
            ) : (
              <Placeholder>{t.missionPlaceholder}</Placeholder>
            )}
          </div>

          <nav aria-label={t.columns.pathways}>
            <h2 className="text-eyebrow uppercase text-white">{t.columns.pathways}</h2>
            <ul className="mt-4 space-y-3">
              {footer.audienceLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className={linkClass}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label={t.columns.explore}>
            <h2 className="text-eyebrow uppercase text-white">{t.columns.explore}</h2>
            <ul className="mt-4 space-y-3">
              {footer.otherLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className={linkClass}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="text-eyebrow uppercase text-white">{t.columns.contact}</h2>
            {showContact ? (
              <address className="mt-4 space-y-3 not-italic">
                {!contact.approved && <Badge kind="draft" />}
                {contact.address && (
                  <p className="flex gap-3">
                    <MapPin aria-hidden className="mt-0.5 size-5 shrink-0 text-green-500" />
                    <span>{contact.address}</span>
                  </p>
                )}
                {contact.phone && (
                  <p className="flex gap-3">
                    <Phone aria-hidden className="mt-0.5 size-5 shrink-0 text-green-500" />
                    <a href={`tel:${contact.phone.replace(/\s/g, "")}`} className={linkClass}>
                      {contact.phone}
                    </a>
                  </p>
                )}
                {contact.email && (
                  <p className="flex gap-3">
                    <Mail aria-hidden className="mt-0.5 size-5 shrink-0 text-green-500" />
                    <a href={`mailto:${contact.email}`} className={`break-all ${linkClass}`}>
                      {contact.email}
                    </a>
                  </p>
                )}
              </address>
            ) : null}
            <div className="mt-6">
              {footer.social.length > 0 ? (
                <ul className="flex gap-4">
                  {footer.social.map((s) => (
                    <li key={s.href}>
                      <a href={s.href} className={linkClass}>
                        {s.label}
                      </a>
                    </li>
                  ))}
                </ul>
              ) : (
                <Placeholder>{t.socialPlaceholder}</Placeholder>
              )}
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-white/20 pt-8 md:flex-row md:items-center md:justify-between">
          <Suspense fallback={<p className="text-white">&nbsp;</p>}>
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
