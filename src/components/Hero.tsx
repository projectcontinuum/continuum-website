import { motion, useReducedMotion } from 'framer-motion';

const CENTER = { x: 100, y: 100 };
const HEX_RADIUS = 50;
const BRANCH_LENGTH = 30;

/* Six vertices of a regular hexagon */
const HEXAGON_POINTS = Array.from({ length: 6 }, (_, i) => ({
  x: CENTER.x + HEX_RADIUS * Math.cos((Math.PI / 3) * i - Math.PI / 2),
  y: CENTER.y + HEX_RADIUS * Math.sin((Math.PI / 3) * i - Math.PI / 2),
}));

/* Branch atoms extending outward from alternating vertices */
const BRANCHES = [0, 2, 4].map((i) => {
  const vertex = HEXAGON_POINTS[i];
  const dx = vertex.x - CENTER.x;
  const dy = vertex.y - CENTER.y;
  const len = Math.sqrt(dx * dx + dy * dy);
  return {
    x: vertex.x + (dx / len) * BRANCH_LENGTH,
    y: vertex.y + (dy / len) * BRANCH_LENGTH,
    fromX: vertex.x,
    fromY: vertex.y,
  };
});

const hexPointsStr = HEXAGON_POINTS.map((p) => `${p.x},${p.y}`).join(' ');

const CTA_HREF = 'https://github.com/projectcontinuum/Continuum';
const TEMPLATE_HREF = 'https://github.com/projectcontinuum/continuum-feature-template';

function MoleculeSVG({ reducedMotion }: { reducedMotion: boolean }) {
  return (
    <motion.svg
      viewBox="0 0 200 200"
      className="h-64 w-64 md:h-80 md:w-80"
      role="img"
      aria-label="Animated molecule representing chemical workflows"
      animate={reducedMotion ? undefined : { rotate: 360 }}
      transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
    >
      <polygon points={hexPointsStr} fill="none" stroke="var(--svg-accent)" strokeWidth="1.5" opacity="0.5" />

      {/* Branch lines */}
      {BRANCHES.map((b, i) => (
        <line
          key={`branch-${i}`}
          x1={b.fromX}
          y1={b.fromY}
          x2={b.x}
          y2={b.y}
          stroke="var(--svg-purple)"
          strokeWidth="1.5"
          opacity="0.6"
        />
      ))}

      {/* Atom nodes at hexagon vertices */}
      {HEXAGON_POINTS.map((p, i) => (
        <motion.circle
          key={`atom-${i}`}
          cx={p.x}
          cy={p.y}
          r="5"
          fill="var(--svg-accent)"
          animate={reducedMotion ? undefined : { scale: [1, 1.3, 1], opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
        />
      ))}

      {/* Branch atom nodes */}
      {BRANCHES.map((b, i) => (
        <motion.circle
          key={`branch-atom-${i}`}
          cx={b.x}
          cy={b.y}
          r="4"
          fill="var(--svg-purple)"
          animate={reducedMotion ? undefined : { scale: [1, 1.4, 1], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.5 }}
        />
      ))}

      {/* Glow effect around center */}
      <circle cx={CENTER.x} cy={CENTER.y} r="70" fill="url(#glow)" opacity="0.15" />
      <defs>
        <radialGradient id="glow">
          <stop offset="0%" stopColor="var(--svg-accent)" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
      </defs>
    </motion.svg>
  );
}

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

export default function Hero() {
  const reducedMotion = useReducedMotion() ?? false;

  return (
    <section className="relative overflow-hidden py-20 sm:py-28 lg:py-36">
      <div className="mx-auto flex max-w-6xl flex-col-reverse items-center gap-12 px-4 sm:px-6 md:flex-row lg:px-8">
        {/* Text content */}
        <motion.div
          className="flex-1 text-center md:text-left"
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          transition={{ duration: reducedMotion ? 0 : 0.6 }}
        >
          <div className="mb-4">
            <span className="inline-block rounded-full bg-accent/10 px-4 py-1 text-sm font-medium text-accent">
              Open Source &middot; Apache 2.0 &middot; Beta
            </span>
          </div>
          <h1 className="text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
            <span className="text-gradient">Project Continuum</span>
            <br />
            Visual Workflows That Never Die
          </h1>
          <p className="mt-6 max-w-lg text-lg text-fg-muted">
            An open-source, cloud-native workflow platform for data analytics, big data, science,
            cheminformatics, and business automation. Inspired by KNIME — built for the browser,
            crash-proof by design.
          </p>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center md:justify-start">
            <motion.a
              href={CTA_HREF}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className="rounded-full bg-accent px-8 py-3 text-center font-semibold text-on-accent transition-colors hover:bg-accent/90 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-base"
            >
              Star on GitHub
            </motion.a>
            <motion.a
              href={TEMPLATE_HREF}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className="rounded-full border border-divider px-8 py-3 text-center font-semibold text-fg transition-colors hover:border-accent/40 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-base"
            >
              Build a Node
            </motion.a>
          </div>
        </motion.div>

        {/* Molecule animation */}
        <motion.div
          className="flex-shrink-0"
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          transition={{ duration: reducedMotion ? 0 : 0.6, delay: 0.2 }}
        >
          <MoleculeSVG reducedMotion={reducedMotion} />
        </motion.div>
      </div>
    </section>
  );
}
