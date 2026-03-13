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
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M16.206 7.794C15.64 3.546 14.204 0 12 0 9.796 0 8.361 3.546 7.794 7.794 3.546 8.36 0 9.796 0 12c0 2.204 3.546 3.639 7.794 4.206C8.36 20.453 9.796 24 12 24c2.204 0 3.639-3.546 4.206-7.794C20.454 15.64 24 14.204 24 12c0-2.204-3.547-3.64-7.794-4.206Zm-8.55 7.174c-4.069-.587-6.44-1.932-6.44-2.969 0-1.036 2.372-2.381 6.44-2.969-.09.98-.137 1.98-.137 2.97 0 .99.047 1.99.137 2.968zM12 1.215c1.036 0 2.381 2.372 2.969 6.44a32.718 32.718 0 0 0-5.938 0c.587-4.068 1.932-6.44 2.969-6.44Zm4.344 13.753c-.2.03-1.022.126-1.23.146-.02.209-.117 1.03-.145 1.23-.588 4.068-1.933 6.44-2.97 6.44-1.036 0-2.38-2.372-2.968-6.44-.03-.2-.126-1.022-.147-1.23a31.833 31.833 0 0 1 0-6.23 31.813 31.813 0 0 1 7.46.146c4.068.587 6.442 1.933 6.442 2.969-.001 1.036-2.374 2.382-6.442 2.97z" />
    </svg>
  );
}

function KafkaIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M9.71 2.136a1.43 1.43 0 0 0-2.047 0h-.007a1.48 1.48 0 0 0-.421 1.042c0 .41.161.777.422 1.039l.007.007c.257.264.616.426 1.019.426.404 0 .766-.162 1.027-.426l.003-.007c.261-.262.421-.629.421-1.039 0-.408-.159-.777-.421-1.042H9.71zM8.683 22.295c.404 0 .766-.167 1.027-.429l.003-.008c.261-.261.421-.631.421-1.036 0-.41-.159-.778-.421-1.044H9.71a1.42 1.42 0 0 0-1.027-.432 1.4 1.4 0 0 0-1.02.432h-.007c-.26.266-.422.634-.422 1.044 0 .406.161.775.422 1.036l.007.008c.258.262.617.429 1.02.429zm7.89-4.462c.359-.096.683-.33.882-.684l.027-.052a1.47 1.47 0 0 0 .114-1.067 1.454 1.454 0 0 0-.675-.896l-.021-.014a1.425 1.425 0 0 0-1.078-.132c-.36.091-.684.335-.881.686-.2.349-.241.75-.146 1.119.099.363.33.691.675.896h.002c.346.203.737.239 1.101.144zm-6.405-7.342a2.083 2.083 0 0 0-1.485-.627c-.58 0-1.103.242-1.482.627-.378.385-.612.916-.612 1.507s.233 1.124.612 1.514a2.08 2.08 0 0 0 2.967 0c.379-.39.612-.923.612-1.514s-.233-1.122-.612-1.507zm-.835-2.51c.843.141 1.6.552 2.178 1.144h.004c.092.093.182.196.265.299l1.446-.851a3.176 3.176 0 0 1-.047-1.808 3.149 3.149 0 0 1 1.456-1.926l.025-.016a3.062 3.062 0 0 1 2.345-.306c.77.21 1.465.721 1.898 1.482v.002c.431.757.518 1.626.313 2.408a3.145 3.145 0 0 1-1.456 1.928l-.198.118h-.02a3.095 3.095 0 0 1-2.154.201 3.127 3.127 0 0 1-1.514-.944l-1.444.848a4.162 4.162 0 0 1 0 2.879l1.444.846c.413-.47.939-.789 1.514-.944a3.041 3.041 0 0 1 2.371.319l.048.023v.002a3.17 3.17 0 0 1 1.408 1.906 3.215 3.215 0 0 1-.313 2.405l-.026.053-.003-.005a3.147 3.147 0 0 1-1.867 1.436 3.096 3.096 0 0 1-2.371-.318v-.006a3.156 3.156 0 0 1-1.456-1.927 3.175 3.175 0 0 1 .047-1.805l-1.446-.848a3.905 3.905 0 0 1-.265.294l-.004.005a3.938 3.938 0 0 1-2.178 1.138v1.699a3.09 3.09 0 0 1 1.56.862l.002.004c.565.572.914 1.368.914 2.243 0 .873-.35 1.664-.914 2.239l-.002.009a3.1 3.1 0 0 1-2.21.931 3.1 3.1 0 0 1-2.206-.93h-.002v-.009a3.186 3.186 0 0 1-.916-2.239c0-.875.35-1.672.916-2.243v-.004h.002a3.1 3.1 0 0 1 1.558-.862v-1.699a3.926 3.926 0 0 1-2.176-1.138l-.006-.005a4.098 4.098 0 0 1-1.173-2.874c0-1.122.452-2.136 1.173-2.872h.006a3.947 3.947 0 0 1 2.176-1.144V6.289a3.137 3.137 0 0 1-1.558-.864h-.002v-.004a3.192 3.192 0 0 1-.916-2.243c0-.871.35-1.669.916-2.243l.002-.002A3.084 3.084 0 0 1 8.683 0c.861 0 1.641.355 2.21.932v.002h.002c.565.574.914 1.372.914 2.243 0 .876-.35 1.667-.914 2.243l-.002.005a3.142 3.142 0 0 1-1.56.864v1.692zm8.121-1.129l-.012-.019a1.452 1.452 0 0 0-.87-.668 1.43 1.43 0 0 0-1.103.146h.002c-.347.2-.58.529-.677.896-.095.365-.054.768.146 1.119l.007.009c.2.347.519.579.874.673.357.103.755.059 1.098-.144l.019-.009a1.47 1.47 0 0 0 .657-.885 1.493 1.493 0 0 0-.141-1.118" />
    </svg>
  );
}

function ReactFlowIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M2 0a2 2 0 0 0-2 2v6.667a2 2 0 0 0 2 2h6.667a2 2 0 0 0 2-2V7.22a2 2 0 0 1-1.334 0v1.447a.667.667 0 0 1-.666.666H2a.667.667 0 0 1-.667-.666V2c0-.368.299-.667.667-.667h6.667c.368 0 .666.299.666.667v1.447a2 2 0 0 1 1.334 0V2a2 2 0 0 0-2-2zm11.333 2a2 2 0 0 1 2-2H22a2 2 0 0 1 2 2v6.667a2 2 0 0 1-2 2h-1.447a2 2 0 0 0 0-1.334H22a.667.667 0 0 0 .667-.666V2A.667.667 0 0 0 22 1.333h-6.667a.667.667 0 0 0-.666.667v1.447a2 2 0 0 0-1.334 0zm3.448 7.333h-1.448a.667.667 0 0 1-.666-.666V7.22a2 2 0 0 1-1.334 0v1.447a2 2 0 0 0 2 2h1.447a2 2 0 0 1 0-1.334M0 15.333a2 2 0 0 1 2-2h6.667a2 2 0 0 1 2 2v1.447a2 2 0 0 0-1.334 0v-1.447a.667.667 0 0 0-.666-.666H2a.667.667 0 0 0-.667.666V22c0 .368.299.667.667.667h6.667A.667.667 0 0 0 9.333 22v-1.447a2 2 0 0 0 1.334 0V22a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm22-.666h-1.447a2 2 0 0 0 0-1.334H22a2 2 0 0 1 2 2V22a2 2 0 0 1-2 2h-6.667a2 2 0 0 1-2-2v-1.447a2 2 0 0 0 1.334 0V22c0 .368.298.667.666.667H22a.667.667 0 0 0 .667-.667v-6.667a.667.667 0 0 0-.667-.666m-7.333 2.114v-1.448c0-.368.298-.666.666-.666h1.447a2 2 0 0 1 0-1.334h-1.447a2 2 0 0 0-2 2v1.447a2 2 0 0 1 1.334 0M20 14a1.333 1.333 0 1 1-1.667-1.291V11.29a1.334 1.334 0 1 1 .667 0v1.418c.575.148 1 .67 1 1.291m-10 6c.621 0 1.143-.425 1.291-1h1.418a1.334 1.334 0 1 0 0-.667H11.29A1.334 1.334 0 1 0 10 20m1.291-14.333a1.334 1.334 0 1 1 0-.667h1.418a1.334 1.334 0 1 1 0 .667z" />
    </svg>
  );
}

const TECH_STACK: TechBadge[] = [
  { name: 'Theia IDE', icon: <TheiaIcon /> },
  { name: 'React Flow', icon: <ReactFlowIcon /> },
  { name: 'Temporal', icon: <TemporalIcon /> },
  { name: 'Kafka', icon: <KafkaIcon /> },
];

const FOOTER_LINKS = [
  { label: 'GitHub Org', href: 'https://github.com/projectcontinuum', external: true },
  { label: 'Core Repo', href: 'https://github.com/projectcontinuum/continuum-platform-core', external: true },
  { label: 'Feature Template', href: 'https://github.com/projectcontinuum/continuum-feature-template', external: true },
  { label: 'Issues', href: 'https://github.com/projectcontinuum/continuum-platform-core/issues', external: true },
] as const;

export default function Footer() {
  return (
    <footer className="border-t border-divider bg-base" role="contentinfo">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-3">
          {/* About */}
          <div>
            <span className="text-gradient text-lg font-bold">Project Continuum</span>
            <p className="mt-3 text-sm leading-relaxed text-fg-muted">
              Open-source visual workflow platform for data analytics, science, cheminformatics,
              and business automation. Inspired by KNIME — built for the browser. Apache 2.0.
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
          Apache 2.0 License &middot; &copy; {new Date().getFullYear()} Project Continuum contributors.
        </div>
      </div>
    </footer>
  );
}
