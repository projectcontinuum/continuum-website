import { type ReactNode } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

/* Inline SVG icons — stroke-based, 24x24 viewBox */

function BrainIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-8 w-8">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 2a7 7 0 0 0-5 2.1A5 5 0 0 0 3 9c0 2 1 3.5 2.5 4.5C4 15 3 17 3 19a3 3 0 0 0 3 3c1.5 0 3-1 4-2.5" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 2a7 7 0 0 1 5 2.1A5 5 0 0 1 21 9c0 2-1 3.5-2.5 4.5C20 15 21 17 21 19a3 3 0 0 1-3 3c-1.5 0-3-1-4-2.5" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 2v17.5M8 8h8M9 12h6" />
    </svg>
  );
}

function FlaskIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-8 w-8">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 3h6M10 3v6.5L4.5 18a2 2 0 0 0 1.7 3h11.6a2 2 0 0 0 1.7-3L14 9.5V3" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M7 15h10" />
    </svg>
  );
}

function RocketIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-8 w-8">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09zM12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-8 w-8">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4" />
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
    icon: <BrainIcon />,
    title: 'AI-Native Nodes',
    description:
      'Drag ML models, molecular transformers, and property predictors directly into your workflow. Every node speaks Parquet.',
    glowClass: 'hover:glow-accent',
  },
  {
    icon: <FlaskIcon />,
    title: 'Chemistry-First',
    description:
      'Built-in RDKit, Open Babel, and SMILES tooling. No boilerplate — just connect, configure, and run.',
    glowClass: 'hover:glow-purple',
  },
  {
    icon: <RocketIcon />,
    title: 'GPU-Scale Execution',
    description:
      'Temporal orchestrates your DAG across GPU workers. Scale from laptop to cluster without changing a single node.',
    glowClass: 'hover:glow-accent',
  },
  {
    icon: <ShieldIcon />,
    title: 'Enterprise Security',
    description:
      'Google SSO, Pomerium zero-trust proxy, per-tenant isolation. Your data never leaves your infrastructure.',
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
            Everything you need to <span className="text-gradient">accelerate discovery</span>
          </h2>
          <p className="mt-4 text-fg-muted">
            From molecule to model, Continuum handles the entire computational chemistry pipeline.
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
