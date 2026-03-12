import { motion, useReducedMotion } from 'framer-motion';

const WORKFLOW_NODES = [
  { label: 'SMILES Input', x: '8%', y: '25%', color: 'accent' },
  { label: 'RDKit Transform', x: '35%', y: '15%', color: 'purple' },
  { label: 'ML Predictor', x: '35%', y: '55%', color: 'purple' },
  { label: 'Parquet Output', x: '68%', y: '35%', color: 'accent' },
] as const;

/* SVG connection lines between nodes */
const CONNECTIONS = [
  { from: { x: 19, y: 32 }, to: { x: 35, y: 22 } },
  { from: { x: 19, y: 32 }, to: { x: 35, y: 62 } },
  { from: { x: 52, y: 22 }, to: { x: 68, y: 42 } },
  { from: { x: 52, y: 62 }, to: { x: 68, y: 42 } },
] as const;

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

export default function SneakPeek() {
  const reducedMotion = useReducedMotion() ?? false;

  return (
    <section id="preview" aria-labelledby="preview-heading" className="py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <motion.div
          className="mb-12 text-center"
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: reducedMotion ? 0 : 0.6 }}
        >
          <h2 id="preview-heading" className="text-3xl font-bold sm:text-4xl">
            See the <span className="text-gradient">workflow editor</span> in action
          </h2>
          <p className="mt-4 text-fg-muted">
            Theia-powered IDE meets visual DAG builder. Design pipelines as naturally as drawing on a whiteboard.
          </p>
        </motion.div>

        <motion.div
          className="relative overflow-hidden rounded-2xl border border-divider bg-gradient-to-br from-base via-accent/5 to-purple/5"
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: reducedMotion ? 0 : 0.6, delay: 0.2 }}
        >
          {/* Mock workflow canvas */}
          <div className="relative h-72 sm:h-96">
            {/* Connection lines */}
            <svg className="absolute inset-0 h-full w-full" aria-hidden="true">
              {CONNECTIONS.map((c, i) => (
                <line
                  key={i}
                  x1={`${c.from.x}%`}
                  y1={`${c.from.y}%`}
                  x2={`${c.to.x}%`}
                  y2={`${c.to.y}%`}
                  stroke="var(--svg-accent)"
                  strokeWidth="1.5"
                  strokeDasharray="6 4"
                  opacity="0.4"
                />
              ))}
            </svg>

            {/* Workflow nodes */}
            {WORKFLOW_NODES.map((node) => (
              <div
                key={node.label}
                className={`absolute rounded-lg border px-3 py-2 text-xs font-mono sm:text-sm ${
                  node.color === 'accent'
                    ? 'border-accent/40 bg-accent/10 text-accent'
                    : 'border-purple/40 bg-purple/10 text-purple'
                }`}
                style={{ left: node.x, top: node.y }}
              >
                {node.label}
              </div>
            ))}

            {/* Center overlay with CTA */}
            <div className="absolute inset-0 flex items-center justify-center bg-base/40">
              <motion.button
                type="button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => window.open('https://github.com/projectcontinuum', '_blank')}
                className="flex items-center gap-3 rounded-full bg-overlay/10 px-6 py-3 font-semibold text-fg backdrop-blur transition-colors hover:bg-overlay/20 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-base"
                aria-label="Watch demo video of Theia workflow editor"
              >
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8 5v14l11-7z" />
                </svg>
                Watch Demo
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
