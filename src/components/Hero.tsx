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

const CTA_HREF = 'mailto:access@projectcontinuum.io';
const GITHUB_HREF = 'https://github.com/projectcontinuum';

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
      <polygon points={hexPointsStr} fill="none" stroke="#06b6d4" strokeWidth="1.5" opacity="0.5" />

      {/* Branch lines */}
      {BRANCHES.map((b, i) => (
        <line
          key={`branch-${i}`}
          x1={b.fromX}
          y1={b.fromY}
          x2={b.x}
          y2={b.y}
          stroke="#a855f7"
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
          fill="#06b6d4"
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
          fill="#a855f7"
          animate={reducedMotion ? undefined : { scale: [1, 1.4, 1], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.5 }}
        />
      ))}

      {/* Glow effect around center */}
      <circle cx={CENTER.x} cy={CENTER.y} r="70" fill="url(#glow)" opacity="0.15" />
      <defs>
        <radialGradient id="glow">
          <stop offset="0%" stopColor="#06b6d4" />
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
          <h1 className="text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
            <span className="text-gradient">Continuum</span>
            <br />
            AI-Powered Chemistry Workflows
          </h1>
          <p className="mt-6 max-w-lg text-lg text-gray-400">
            Drag-drop nodes. GPU scale. Zero setup. Build, execute, and iterate on computational
            chemistry pipelines — from RDKit to ML models — all in your browser.
          </p>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center md:justify-start">
            <motion.a
              href={CTA_HREF}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className="rounded-full bg-cyan px-8 py-3 text-center font-semibold text-navy transition-colors hover:bg-cyan/90 focus:outline-none focus:ring-2 focus:ring-cyan focus:ring-offset-2 focus:ring-offset-navy"
            >
              Request Early Access
            </motion.a>
            <motion.a
              href={GITHUB_HREF}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className="rounded-full border border-white/20 px-8 py-3 text-center font-semibold text-white transition-colors hover:border-white/40 focus:outline-none focus:ring-2 focus:ring-cyan focus:ring-offset-2 focus:ring-offset-navy"
            >
              View on GitHub
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
