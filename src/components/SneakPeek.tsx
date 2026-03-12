import { motion, useReducedMotion } from 'framer-motion';

const REPOS = [
  {
    name: 'Continuum',
    description: 'Core backend — API server, worker framework, shared Parquet/S3 libraries',
    href: 'https://github.com/projectcontinuum/Continuum',
    tags: ['Kotlin', 'Spring Boot', 'Temporal'],
  },
  {
    name: 'continuum-workbench',
    description: 'Browser IDE — Eclipse Theia + React Flow drag-and-drop workflow editor',
    href: 'https://github.com/projectcontinuum/continuum-workbench',
    tags: ['React', 'TypeScript', 'Theia'],
  },
  {
    name: 'continuum-feature-base',
    description: '16 analytics nodes — transforms, REST client, Kotlin scripting, anomaly detection',
    href: 'https://github.com/projectcontinuum/continuum-feature-base',
    tags: ['16 Nodes', 'Kotlin'],
  },
  {
    name: 'continuum-feature-ai',
    description: 'LLM fine-tuning with Unsloth + LoRA. Inference and evaluation nodes coming soon',
    href: 'https://github.com/projectcontinuum/continuum-feature-ai',
    tags: ['Unsloth', 'Python', 'LoRA'],
  },
  {
    name: 'continuum-feature-template',
    description: 'Scaffold your own worker with custom nodes. Fork, rename, and start building',
    href: 'https://github.com/projectcontinuum/continuum-feature-template',
    tags: ['Template', 'Start Here'],
  },
] as const;

const WANTED = [
  { area: 'Cheminformatics nodes', detail: 'RDKit integration — molecular descriptors, fingerprints, substructure search, SMILES processing' },
  { area: 'PyTorch nodes', detail: 'Training, inference, and model management natively in workflows' },
  { area: 'AI inference node', detail: 'Run trained models (Unsloth/HuggingFace) for prediction inside pipelines' },
  { area: 'Loop control flow', detail: 'True while/for loops with condition builder for iterative workflows' },
] as const;

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

export default function SneakPeek() {
  const reducedMotion = useReducedMotion() ?? false;

  return (
    <>
      {/* Ecosystem section */}
      <section id="ecosystem" aria-labelledby="ecosystem-heading" className="py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <motion.div
            className="mb-12 text-center"
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: reducedMotion ? 0 : 0.6 }}
          >
            <h2 id="ecosystem-heading" className="text-3xl font-bold sm:text-4xl">
              The <span className="text-gradient">ecosystem</span>
            </h2>
            <p className="mt-4 text-fg-muted">
              Five focused repos. Independent workers. One shared registry. Pick what interests you.
            </p>
          </motion.div>

          <motion.div
            className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
          >
            {REPOS.map((repo) => (
              <motion.a
                key={repo.name}
                href={repo.href}
                target="_blank"
                rel="noopener noreferrer"
                variants={fadeInUp}
                transition={{ duration: reducedMotion ? 0 : 0.4 }}
                whileHover={reducedMotion ? undefined : { y: -4 }}
                className="group block rounded-xl border border-divider bg-card p-5 transition-shadow hover:glow-accent"
              >
                <h3 className="font-mono text-sm font-semibold text-accent">{repo.name}</h3>
                <p className="mt-2 text-sm leading-relaxed text-fg-muted">{repo.description}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {repo.tags.map((tag) => (
                    <span key={tag} className="rounded-full bg-overlay/10 px-2 py-0.5 text-xs text-fg-muted">
                      {tag}
                    </span>
                  ))}
                </div>
              </motion.a>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Contribute section */}
      <section id="contribute" aria-labelledby="contribute-heading" className="py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <motion.div
            className="mb-12 text-center"
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: reducedMotion ? 0 : 0.6 }}
          >
            <h2 id="contribute-heading" className="text-3xl font-bold sm:text-4xl">
              <span className="text-gradient">Looking for contributors</span>
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-fg-muted">
              Continuum is in beta. We need developers and data analysts to build new nodes,
              improve the canvas, and expand the platform. Here&apos;s what&apos;s most wanted:
            </p>
          </motion.div>

          <motion.div
            className="grid gap-4 sm:grid-cols-2"
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
          >
            {WANTED.map((item) => (
              <motion.div
                key={item.area}
                variants={fadeInUp}
                transition={{ duration: reducedMotion ? 0 : 0.4 }}
                className="rounded-xl border border-divider bg-card p-5"
              >
                <h3 className="text-sm font-semibold text-accent">{item.area}</h3>
                <p className="mt-2 text-sm leading-relaxed text-fg-muted">{item.detail}</p>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            className="mt-10 text-center"
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: reducedMotion ? 0 : 0.6 }}
          >
            <motion.a
              href="https://github.com/projectcontinuum/continuum-feature-template"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className="inline-block rounded-full bg-accent px-8 py-3 font-semibold text-on-accent transition-colors hover:bg-accent/90 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-base"
            >
              Use the Feature Template
            </motion.a>
            <p className="mt-3 text-sm text-fg-muted">
              Fork it, rename it, build your nodes. One repo = one worker.
            </p>
          </motion.div>
        </div>
      </section>
    </>
  );
}
