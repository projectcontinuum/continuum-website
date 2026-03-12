import { useState, useEffect } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

const CTA_HREF = 'https://github.com/projectcontinuum/Continuum';
const TEMPLATE_HREF = 'https://github.com/projectcontinuum/continuum-feature-template';

/* ── Layout constants ── */
const NW = 44;  // workflow node width
const NH = 20;  // workflow node height
const RW = 48;  // server rack width
const RH = 38;  // server rack height

/* ── Workflow DAG (top layer) with branching ──
 *
 *                   ┌── ML Train ──┐
 *  Ingest → Transform               Merge → Deploy
 *                   └── Analyze  ──┘
 */
const NODES = [
  { id: 'a', x: 15,  y: 14, label: 'Ingest',    requires: 'cpu' },
  { id: 'b', x: 88,  y: 14, label: 'Transform',  requires: 'cpu' },
  { id: 'c', x: 168, y: -4, label: 'ML Train',   requires: 'gpu:cuda' },
  { id: 'd', x: 168, y: 32, label: 'Analyze',    requires: 'cpu' },
  { id: 'e', x: 245, y: 14, label: 'Merge',      requires: 'cpu' },
  { id: 'f', x: 315, y: 14, label: 'Deploy',     requires: 'cpu' },
] as const;

const nMap = Object.fromEntries(NODES.map((n) => [n.id, n]));

/* Pre-computed edge SVG paths (bezier curves for branches, lines for straight) */
function edgePath(fromId: string, toId: string) {
  const s = nMap[fromId];
  const t = nMap[toId];
  const sx = s.x + NW;
  const sy = s.y + NH / 2;
  const tx = t.x;
  const ty = t.y + NH / 2;
  if (Math.abs(sy - ty) < 4) return `M${sx},${sy} L${tx},${ty}`;
  // Cubic bezier for diagonal branches
  const cx1 = sx + (tx - sx) * 0.4;
  const cx2 = tx - (tx - sx) * 0.4;
  return `M${sx},${sy} C${cx1},${sy} ${cx2},${ty} ${tx},${ty}`;
}

const EDGES = [
  { from: 'a', to: 'b' },
  { from: 'b', to: 'c' },
  { from: 'b', to: 'd' },
  { from: 'c', to: 'e' },
  { from: 'd', to: 'e' },
  { from: 'e', to: 'f' },
] as const;

const EDGE_PATHS = EDGES.map((e, i) => ({
  ...e,
  idx: i,
  d: edgePath(e.from, e.to),
}));

/* ── Worker cluster (bottom layer — server racks with capabilities) ── */
const WORKERS = [
  { id: 'w1', x: 8,   y: 105, label: 'worker-1', caps: ['cpu'] },
  { id: 'w2', x: 74,  y: 105, label: 'worker-2', caps: ['cpu'] },
  { id: 'w3', x: 140, y: 105, label: 'worker-3', caps: ['gpu:cuda'] },
  { id: 'w4', x: 206, y: 105, label: 'worker-4', caps: ['gpu:cuda'] },
  { id: 'w5', x: 272, y: 105, label: 'worker-5', caps: ['cpu'] },
] as const;


/* ── Execution timeline ── */
type TimelineStep = {
  /** nodeId → workerId: which nodes are actively executing and where */
  active: Record<string, string>;
  duration: number;
  /** Worker that has crashed this step */
  crashed?: string;
  /** Worker that is the reassignment target */
  reassigned?: string;
};

const TIMELINE: TimelineStep[] = [
  { active: { a: 'w1' }, duration: 1500 },
  { active: { b: 'w2' }, duration: 1500 },
  { active: { c: 'w3', d: 'w5' }, duration: 1200 },
  { active: { c: 'w4', d: 'w5' }, duration: 1600, crashed: 'w3', reassigned: 'w4' },
  { active: { e: 'w2' }, duration: 1500 },
  { active: { f: 'w1' }, duration: 1500 },
  { active: {}, duration: 900 },
];

function useTimeline(enabled: boolean) {
  const [stepIdx, setStepIdx] = useState(0);
  useEffect(() => {
    if (!enabled) return;
    const timer = setTimeout(() => {
      setStepIdx((i) => (i + 1) % TIMELINE.length);
    }, TIMELINE[stepIdx].duration);
    return () => clearTimeout(timer);
  }, [stepIdx, enabled]);
  return TIMELINE[stepIdx];
}

/* ── Server Rack SVG component ── */
function ServerRack({ x, y, label, caps, color, bgOpacity, crashed, reassignTarget, active }: {
  x: number; y: number; label: string; caps: readonly string[];
  color: string; bgOpacity: number; crashed: boolean; reassignTarget: boolean; active: boolean;
}) {
  const sh = RH / 5; // shelf spacing
  return (
    <g>
      {/* Active glow behind rack */}
      {active && !crashed && (
        <rect x={x - 3} y={y - 3} width={RW + 6} height={RH + 6} rx="5"
          fill={reassignTarget ? '#22c55e' : 'var(--svg-accent)'} opacity="0.12" />
      )}
      {/* Rack body */}
      <rect x={x} y={y} width={RW} height={RH} rx="3"
        fill={color} opacity={bgOpacity}
        stroke={color} strokeWidth={active ? 1.2 : 0.7} />
      {/* Shelf lines */}
      {[1, 2, 3, 4].map((i) => (
        <line key={i}
          x1={x + 3} y1={y + sh * i} x2={x + RW - 3} y2={y + sh * i}
          stroke={color} strokeWidth="0.5" opacity={0.2} />
      ))}
      {/* LED indicator dots */}
      {[1, 2, 3].map((i) => (
        <circle key={`led-${i}`}
          cx={x + RW - 6} cy={y + sh * i - sh / 2 + 1} r="1.2"
          fill={crashed ? '#ef4444' : active ? '#22c55e' : color}
          opacity={crashed ? 0.9 : active ? 0.8 : 0.3} />
      ))}
      {/* Worker name */}
      <text x={x + RW / 2} y={y + 8} textAnchor="middle" fill={color}
        fontSize="4.5" fontFamily="Inter,system-ui,sans-serif" fontWeight="700" opacity="0.85">
        {label}
      </text>
      {/* Capability tag */}
      {caps.map((cap, i) => (
        <text key={cap} x={x + RW / 2} y={y + RH - 3 + i * 5} textAnchor="middle"
          fill={color} fontSize="3.8" fontFamily="Inter,system-ui,sans-serif"
          fontWeight="500" opacity="0.55">
          {cap}
        </text>
      ))}
      {/* Crash X */}
      {crashed && (
        <g opacity="0.85">
          <line x1={x + 5} y1={y + 5} x2={x + RW - 5} y2={y + RH - 5}
            stroke="#ef4444" strokeWidth="2" strokeLinecap="round" />
          <line x1={x + RW - 5} y1={y + 5} x2={x + 5} y2={y + RH - 5}
            stroke="#ef4444" strokeWidth="2" strokeLinecap="round" />
        </g>
      )}
      {/* Reassign checkmark */}
      {reassignTarget && (
        <path d={`M${x + RW - 11},${y + RH / 2} l3,3 5,-5`}
          stroke="#22c55e" strokeWidth="1.5" fill="none"
          strokeLinecap="round" strokeLinejoin="round" opacity="0.9" />
      )}
    </g>
  );
}

/* ── Static workflow node (always at home position, rendered last → on top) ── */
function WorkflowNode({ homeX, homeY, label, requires, executing, border, reducedMotion }: {
  homeX: number; homeY: number; label: string; requires: string;
  executing: boolean; border: string; reducedMotion: boolean;
}) {
  return (
    <g>
      {/* Node background */}
      <rect x={homeX} y={homeY} width={NW} height={NH} rx="4"
        fill={border} opacity={executing ? 0.22 : 0.1} />
      {/* Node border */}
      <motion.rect
        x={homeX} y={homeY} width={NW} height={NH} rx="4"
        fill="none" stroke={border}
        strokeWidth={executing ? 2 : 1.2}
        animate={reducedMotion ? undefined : { opacity: executing ? [0.7, 1, 0.7] : [0.3, 0.6, 0.3] }}
        transition={{ duration: executing ? 0.8 : 3, repeat: Infinity }}
      />
      {/* Main label */}
      <text x={homeX + NW / 2} y={homeY + 9} textAnchor="middle" fill={border}
        fontSize="5.2" fontFamily="Inter,system-ui,sans-serif" fontWeight="600" opacity="0.95">
        {label}
      </text>
      {/* Requires tag */}
      <text x={homeX + NW / 2} y={homeY + 16.5} textAnchor="middle" fill={border}
        fontSize="3.2" fontFamily="Inter,system-ui,sans-serif" fontWeight="500" opacity="0.5">
        {requires}
      </text>
    </g>
  );
}

/* ── Main SVG ── */
function PipelineSVG({ reducedMotion }: { reducedMotion: boolean }) {
  const step = useTimeline(!reducedMotion);

  // Invert active map: workerId → nodeId (which node is this worker serving?)
  const workerToNode: Record<string, string> = {};
  for (const [nodeId, workerId] of Object.entries(step.active)) {
    workerToNode[workerId] = nodeId;
  }
  const activeWorkers = new Set(Object.values(step.active));

  return (
    <svg
      viewBox="0 -10 368 165"
      className="h-52 w-full max-w-xl sm:h-60 md:h-68 lg:h-76"
      role="img"
      aria-label="Branching workflow DAG: worker racks slide up to execute matching nodes, then return. Demonstrates crash recovery via capability-based reassignment."
    >
      <defs>
        <radialGradient id="hero-glow">
          <stop offset="0%" stopColor="var(--svg-accent)" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
      </defs>

      <circle cx="184" cy="75" r="120" fill="url(#hero-glow)" opacity="0.05" />

      {/* ── DAG edges (fixed in place) ── */}
      {EDGE_PATHS.map((e) => (
        <g key={`edge-${e.idx}`}>
          <motion.path
            d={e.d} fill="none"
            stroke="var(--svg-accent)" strokeWidth="1.5" strokeDasharray="5 3"
            opacity="0.25"
            animate={reducedMotion ? undefined : { strokeDashoffset: [0, -16] }}
            transition={{ duration: 1.2, repeat: Infinity, ease: 'linear', delay: e.idx * 0.12 }}
          />
          {!reducedMotion && (
            <>
              <path id={`ep-${e.idx}`} d={e.d} fill="none" stroke="none" />
              <circle r="2" fill="var(--svg-accent)" opacity="0.6">
                <animateMotion dur={`${1.6 + e.idx * 0.1}s`} repeatCount="indefinite" begin={`${e.idx * 0.18}s`}>
                  <mpath href={`#ep-${e.idx}`} />
                </animateMotion>
              </circle>
            </>
          )}
        </g>
      ))}

      {/* ── Worker racks (animate up behind executing nodes) ── */}
      {WORKERS.map((w) => {
        const isCrashed = w.id === step.crashed;
        const isReassigned = w.id === step.reassigned;
        const isActive = activeWorkers.has(w.id);
        const wColor =
          isCrashed ? '#ef4444' :
          isReassigned ? '#22c55e' :
          'var(--svg-accent)';
        const bgOp = isCrashed ? 0.15 : isActive ? 0.22 : 0.06;

        // Compute translation to slide rack behind the target node
        let dx = 0;
        let dy = 0;
        const targetNodeId = workerToNode[w.id];
        if (targetNodeId) {
          const n = nMap[targetNodeId];
          if (n) {
            dx = (n.x - (RW - NW) / 2) - w.x;
            dy = (n.y - (RH - NH) / 2) - w.y;
          }
        }

        return (
          <g
            key={w.id}
            style={{
              transform: `translate(${dx}px, ${dy}px)`,
              transition: reducedMotion ? 'none' : 'transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
            }}
          >
            <ServerRack
              x={w.x} y={w.y} label={w.label} caps={w.caps}
              color={wColor} bgOpacity={bgOp}
              crashed={isCrashed} reassignTarget={isReassigned} active={isActive} />
          </g>
        );
      })}

      {/* ── Workflow nodes (fixed, rendered last → on top of racks) ── */}
      {NODES.map((n) => {
        const executing = !!step.active[n.id];
        const workerId = step.active[n.id];
        const border = executing && step.reassigned && workerId === step.reassigned
          ? '#22c55e'
          : 'var(--svg-accent)';

        return (
          <WorkflowNode key={n.id}
            homeX={n.x} homeY={n.y}
            label={n.label} requires={n.requires}
            executing={executing} border={border}
            reducedMotion={reducedMotion} />
        );
      })}

      {/* ── Phase labels ── */}
      {step.crashed && !step.reassigned && (
        <g>
          <rect x="130" y="60" width="100" height="12" rx="6" fill="#ef4444" />
          <text x="180" y="68.5" textAnchor="middle" fill="white" fontSize="5"
            fontWeight="700" fontFamily="Inter,system-ui,sans-serif">
            worker-3 crashed!
          </text>
        </g>
      )}
      {step.reassigned && (
        <g>
          <rect x="115" y="60" width="130" height="12" rx="6" fill="#22c55e" />
          <text x="180" y="68.5" textAnchor="middle" fill="white" fontSize="5"
            fontWeight="700" fontFamily="Inter,system-ui,sans-serif">
            → reassigned to worker-4 (gpu:cuda)
          </text>
        </g>
      )}

      {/* ── Orchestration label ── */}
      <text x="184" y="90" textAnchor="middle" fill="var(--svg-accent)"
        fontSize="4" fontFamily="Inter,system-ui,sans-serif" fontWeight="500"
        opacity="0.3" letterSpacing="1.5">
        WORKFLOW ORCHESTRATION
      </text>
    </svg>
  );
}

/* ── Hero section ── */
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

export default function Hero() {
  const reducedMotion = useReducedMotion() ?? false;

  return (
    <section className="relative overflow-hidden py-20 sm:py-28 lg:py-36">
      <div className="mx-auto flex max-w-6xl flex-col-reverse items-center gap-12 px-4 sm:px-6 md:flex-row lg:px-8">
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

        <motion.div
          className="flex-shrink-0"
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          transition={{ duration: reducedMotion ? 0 : 0.6, delay: 0.2 }}
        >
          <PipelineSVG reducedMotion={reducedMotion} />
        </motion.div>
      </div>
    </section>
  );
}
