import { type ReactNode } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

/* Inline SVG icons — stroke-based, 24x24 viewBox */

function CanvasIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-8 w-8">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path strokeLinecap="round" d="M3 9h18M9 9v12" />
    </svg>
  );
}

function BoltIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-8 w-8">
      <path strokeLinecap="round" strokeLinejoin="round" d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
    </svg>
  );
}

function PuzzleIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-8 w-8">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 2a3 3 0 0 0-3 3H5a2 2 0 0 0-2 2v4a3 3 0 1 1 0 6v4a2 2 0 0 0 2 2h4a3 3 0 1 1 6 0h4a2 2 0 0 0 2-2v-4a3 3 0 1 1 0-6V7a2 2 0 0 0-2-2h-4a3 3 0 0 0-3-3z" />
    </svg>
  );
}

function StreamIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-8 w-8">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12h15M4.5 12l4-4M4.5 12l4 4" />
      <path strokeLinecap="round" d="M12 4v4M12 16v4M8 6v2M8 16v2M16 6v2M16 16v2" opacity="0.5" />
    </svg>
  );
}

interface FeatureCard {
  icon: ReactNode;
  title: string;
  description: string;
  glowClass: string;
}

const FEATURES: FeatureCard[] = [
  {
    icon: <CanvasIcon />,
    title: 'Browser-Native Canvas',
    description:
      'Eclipse Theia IDE + React Flow editor. Drag-and-drop workflow building with a real IDE feel — zero install, runs in your browser.',
    glowClass: 'hover:glow-accent',
  },
  {
    icon: <BoltIcon />,
    title: 'Crash-Proof Execution',
    description:
      'Powered by Temporal. Workflows survive process crashes, network failures, and restarts. Every step retries automatically.',
    glowClass: 'hover:glow-purple',
  },
  {
    icon: <PuzzleIcon />,
    title: 'Extensible by Design',
    description:
      'Add capabilities by deploying new workers — not by touching existing ones. Use the feature template to scaffold your own nodes in minutes.',
    glowClass: 'hover:glow-accent',
  },
  {
    icon: <StreamIcon />,
    title: 'Real-Time Streaming',
    description:
      'Watch workflows execute step-by-step. Kafka streams events to your browser via MQTT over WebSockets. No polling, no refresh.',
    glowClass: 'hover:glow-purple',
  },
];

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
};

export default function Features() {
  const reducedMotion = useReducedMotion() ?? false;

  return (
    <section id="features" aria-labelledby="features-heading" className="py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <motion.div
          className="mb-16 text-center"
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: reducedMotion ? 0 : 0.6 }}
        >
          <h2 id="features-heading" className="text-3xl font-bold sm:text-4xl">
            Built for <span className="text-gradient">anyone who builds with data</span>
          </h2>
          <p className="mt-4 text-fg-muted">
            Data analysts, scientists, cheminformatics researchers, and developers — drag, drop,
            and let Temporal keep it running. 17+ nodes and growing.
          </p>
        </motion.div>

        <motion.div
          className="grid gap-6 sm:grid-cols-2"
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
        >
          {FEATURES.map((card) => (
            <motion.article
              key={card.title}
              variants={fadeInUp}
              transition={{ duration: reducedMotion ? 0 : 0.5 }}
              whileHover={reducedMotion ? undefined : { y: -8 }}
              className={`group rounded-2xl border border-divider bg-card p-6 transition-shadow ${card.glowClass}`}
            >
              <div className="mb-4 text-accent group-hover:text-highlight transition-colors">{card.icon}</div>
              <h3 className="mb-2 text-lg font-semibold">{card.title}</h3>
              <p className="text-sm leading-relaxed text-fg-muted">{card.description}</p>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
