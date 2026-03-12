import { type ReactNode } from 'react';

interface TechBadge {
  name: string;
  icon: ReactNode;
}

function TheiaIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M3 9h18M9 9v12" />
    </svg>
  );
}

function TemporalIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 3" strokeLinecap="round" />
    </svg>
  );
}

function KafkaIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <circle cx="12" cy="6" r="3" />
      <circle cx="6" cy="18" r="3" />
      <circle cx="18" cy="18" r="3" />
      <path d="M12 9v3M9.5 14.5L11 13M14.5 14.5L13 13" />
    </svg>
  );
}

const TECH_STACK: TechBadge[] = [
  { name: 'Theia IDE', icon: <TheiaIcon /> },
  { name: 'Temporal', icon: <TemporalIcon /> },
  { name: 'Kafka', icon: <KafkaIcon /> },
];

const FOOTER_LINKS = [
  { label: 'GitHub', href: 'https://github.com/projectcontinuum', external: true },
  { label: 'Documentation', href: '#features', external: false },
  { label: 'Contact', href: 'mailto:access@projectcontinuum.io', external: false },
] as const;

export default function Footer() {
  return (
    <footer className="border-t border-divider bg-base" role="contentinfo">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-3">
          {/* About */}
          <div>
            <span className="text-gradient text-lg font-bold">Continuum</span>
            <p className="mt-3 text-sm leading-relaxed text-fg-muted">
              Self-hosted, multi-tenant chemistry workflow platform. Built for pharma R&amp;D teams
              who need GPU-scale computational pipelines without the DevOps overhead.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-fg-muted">Links</h3>
            <ul className="space-y-2">
              {FOOTER_LINKS.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    {...(link.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                    className="text-sm text-fg-muted transition-colors hover:text-fg"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Tech stack badges */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-fg-muted">
              Built With
            </h3>
            <div className="flex flex-wrap gap-2">
              {TECH_STACK.map((badge) => (
                <span
                  key={badge.name}
                  className="inline-flex items-center gap-2 rounded-full bg-overlay/10 px-3 py-1 text-sm text-fg-muted"
                >
                  {badge.icon}
                  {badge.name}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-divider pt-6 text-center text-sm text-fg-muted/70">
          &copy; {new Date().getFullYear()} Continuum. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
