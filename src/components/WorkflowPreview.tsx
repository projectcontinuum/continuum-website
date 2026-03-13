import { useState, useEffect, useCallback, useRef } from 'react';
import {
  ReactFlow,
  ReactFlowProvider,
  useReactFlow,
  Background,
  Controls,
  Handle,
  Position,
  type Node,
  type Edge,
  type NodeProps,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

/* ── Stage status enum matching continuum-platform-core's StageStatus ── */
type StageStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED';
type NodeStatus = 'IDLE' | 'BUSY' | 'SUCCESS';

interface StageInfo {
  name: string;
  status: StageStatus;
}

interface NodeData {
  title: string;
  subTitle: string;
  inputs: Record<string, unknown> | null;
  outputs: Record<string, unknown> | null;
  stages?: StageInfo[];
  status?: NodeStatus;
  progress?: number;
  duration?: string;
}

/* ── Stage status icons (inline SVG, matching workbench Stepper icons) ── */
function StageIcon({ status }: { status: StageStatus }) {
  const cls = 'h-3 w-3 flex-shrink-0';
  switch (status) {
    case 'COMPLETED':
      return (
        <svg className={`${cls} text-green-500`} viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
      );
    case 'IN_PROGRESS':
      return (
        <svg className={`${cls} animate-spin text-accent`} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="10" cy="10" r="7" strokeDasharray="30 14" />
        </svg>
      );
    case 'FAILED':
      return (
        <svg className={`${cls} text-red-500`} viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
        </svg>
      );
    default:
      return (
        <svg className={`${cls} text-fg-muted/40`} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="10" cy="10" r="7" />
        </svg>
      );
  }
}

/* ── BaseNode with stage progress stepper ── */
function BaseNode({ data }: NodeProps) {
  const d = data as unknown as NodeData;
  const borderColor =
    d.status === 'BUSY' ? 'border-accent' : d.status === 'SUCCESS' ? 'border-green-500' : 'border-accent/40';

  return (
    <div className={`min-w-[180px] rounded-[10px] border-2 ${borderColor} bg-card px-3 py-2.5 shadow-lg transition-colors`}>
      {/* Input handles */}
      {d.inputs &&
        Object.keys(d.inputs).map((portId, i, arr) => (
          <Handle
            key={portId}
            id={portId}
            type="target"
            position={Position.Left}
            className="!h-2.5 !w-2.5 !border-2 !border-accent !bg-base"
            style={{ top: `${((i + 1) / (arr.length + 1)) * 100}%` }}
          />
        ))}

      {/* Header row: title + status badge */}
      <div className="flex items-center justify-between gap-2">
        <div className="text-xs font-semibold text-fg">{d.title}</div>
        {d.status === 'SUCCESS' && (
          <svg className="h-3.5 w-3.5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        )}
        {d.status === 'BUSY' && d.progress != null && (
          <span className="text-[9px] font-mono tabular-nums text-accent">{d.progress}%</span>
        )}
      </div>
      <div className="text-[10px] text-fg-muted">{d.subTitle}</div>

      {/* Duration */}
      {d.duration && (
        <div className="mt-1 text-[9px] font-mono text-fg-muted/60">{d.duration}</div>
      )}

      {/* Stage stepper (only shown when stages exist) */}
      {d.stages && d.stages.length > 0 && (
        <div className="mt-2 space-y-1 border-t border-divider/50 pt-2">
          {d.stages.map((stage) => (
            <div key={stage.name} className="flex items-center gap-1.5">
              <StageIcon status={stage.status} />
              <span className={`text-[9px] leading-tight ${
                stage.status === 'IN_PROGRESS' ? 'text-accent font-medium' :
                stage.status === 'COMPLETED' ? 'text-green-500' : 'text-fg-muted/50'
              }`}>
                {stage.name}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Output handles */}
      {d.outputs &&
        Object.keys(d.outputs).map((portId, i, arr) => (
          <Handle
            key={portId}
            id={portId}
            type="source"
            position={Position.Right}
            className="!h-2.5 !w-2.5 !border-2 !border-purple !bg-base"
            style={{ top: `${((i + 1) / (arr.length + 1)) * 100}%` }}
          />
        ))}
    </div>
  );
}

const nodeTypes = { BaseNode };

/* ── Execution timeline: each step defines what changes per tick ── */
interface ExecStep {
  nodeId: string;
  status: NodeStatus;
  progress?: number;
  duration?: string;
  stages?: StageInfo[];
}

/* Stage helpers */
const s = (name: string, status: StageStatus): StageInfo => ({ name, status });

/* Anomaly Detector stages — mirrors the real 3-pass Kotlin implementation */
const AD_STAGES = ['Calculate Mean', 'Calculate Standard Deviation', 'Flag Outliers'] as const;

function adStages(pass: 0 | 1 | 2 | 3): StageInfo[] {
  return AD_STAGES.map((name, i) => s(name,
    i < pass ? 'COMPLETED' : i === pass ? 'IN_PROGRESS' : 'PENDING'));
}
function adDone(): StageInfo[] {
  return AD_STAGES.map((name) => s(name, 'COMPLETED'));
}

/* Unsloth LLM Trainer stages — mirrors the real train.py 7-stage pipeline */
const UNSLOTH_STAGES = [
  'Initialization', 'Loading Dataset', 'Downloading Model',
  'Loading Model', 'Configuring LoRA', 'Training', 'Saving Model',
] as const;

function ulStages(pass: number): StageInfo[] {
  return UNSLOTH_STAGES.map((name, i) => s(name,
    i < pass ? 'COMPLETED' : i === pass ? 'IN_PROGRESS' : 'PENDING'));
}
/* Download stage can be SKIPPED when model is cached */
function ulSkipDownload(pass: number): StageInfo[] {
  return UNSLOTH_STAGES.map((name, i) => {
    if (i === 2) return s(name, 'COMPLETED'); // Download → skipped/completed (cached)
    return s(name, i < pass ? 'COMPLETED' : i === pass ? 'IN_PROGRESS' : 'PENDING');
  });
}
function ulDone(): StageInfo[] {
  return UNSLOTH_STAGES.map((name, i) => s(name, i === 2 ? 'COMPLETED' : 'COMPLETED'));
}

/* Execution timeline for the Sensor Pipeline */
const SENSOR_TIMELINE: ExecStep[] = [
  /* Node 1: Create Table */
  { nodeId: '1', status: 'BUSY', progress: 0 },
  { nodeId: '1', status: 'BUSY', progress: 50 },
  { nodeId: '1', status: 'SUCCESS', duration: '120ms' },

  /* Node 2: Anomaly Detector — 3-pass Z-Score */
  { nodeId: '2', status: 'BUSY', progress: 0, stages: adStages(0) },
  { nodeId: '2', status: 'BUSY', progress: 16, stages: adStages(0) },
  { nodeId: '2', status: 'BUSY', progress: 33, stages: adStages(1) },
  { nodeId: '2', status: 'BUSY', progress: 50, stages: adStages(1) },
  { nodeId: '2', status: 'BUSY', progress: 66, stages: adStages(2) },
  { nodeId: '2', status: 'BUSY', progress: 85, stages: adStages(2) },
  { nodeId: '2', status: 'SUCCESS', duration: '1.8s', stages: adDone() },

  /* Node 3: Conditional Splitter */
  { nodeId: '3', status: 'BUSY', progress: 0 },
  { nodeId: '3', status: 'SUCCESS', duration: '45ms' },

  /* Fork: nodes 4+6 execute in parallel */
  { nodeId: '4', status: 'BUSY', progress: 0 },
  { nodeId: '6', status: 'BUSY', progress: 0 },
  { nodeId: '4', status: 'BUSY', progress: 60 },
  { nodeId: '6', status: 'SUCCESS', duration: '90ms' },
  { nodeId: '4', status: 'SUCCESS', duration: '200ms' },

  /* Fork: nodes 5+7 */
  { nodeId: '5', status: 'BUSY', progress: 0, stages: [s('POST /alerts', 'IN_PROGRESS')] },
  { nodeId: '7', status: 'BUSY', progress: 0, stages: [s('POST /archive', 'IN_PROGRESS')] },
  { nodeId: '5', status: 'BUSY', progress: 60, stages: [s('POST /alerts', 'IN_PROGRESS')] },
  { nodeId: '7', status: 'SUCCESS', duration: '310ms', stages: [s('POST /archive', 'COMPLETED')] },
  { nodeId: '5', status: 'SUCCESS', duration: '480ms', stages: [s('POST /alerts', 'COMPLETED')] },
];

/* Execution timeline for RDKit Drug Discovery — dual screening with fan-out/fan-in */
const CHEMINFORMATICS_TIMELINE: ExecStep[] = [
  /* Node 1: Create Table — compound library */
  { nodeId: '1', status: 'BUSY', progress: 0 },
  { nodeId: '1', status: 'BUSY', progress: 60 },
  { nodeId: '1', status: 'SUCCESS', duration: '340ms' },

  /* Node 2: RDKit Descriptors — molecular property computation */
  { nodeId: '2', status: 'BUSY', progress: 0, stages: [s('Parse SMILES', 'IN_PROGRESS'), s('Compute MW/LogP/TPSA', 'PENDING'), s('Compute HBD/HBA/RotBonds', 'PENDING')] },
  { nodeId: '2', status: 'BUSY', progress: 20, stages: [s('Parse SMILES', 'COMPLETED'), s('Compute MW/LogP/TPSA', 'IN_PROGRESS'), s('Compute HBD/HBA/RotBonds', 'PENDING')] },
  { nodeId: '2', status: 'BUSY', progress: 55, stages: [s('Parse SMILES', 'COMPLETED'), s('Compute MW/LogP/TPSA', 'COMPLETED'), s('Compute HBD/HBA/RotBonds', 'IN_PROGRESS')] },
  { nodeId: '2', status: 'SUCCESS', duration: '4.7s', stages: [s('Parse SMILES', 'COMPLETED'), s('Compute MW/LogP/TPSA', 'COMPLETED'), s('Compute HBD/HBA/RotBonds', 'COMPLETED')] },

  /* Node 3: Lipinski Filter — Rule of 5 gate */
  { nodeId: '3', status: 'BUSY', progress: 0 },
  { nodeId: '3', status: 'SUCCESS', duration: '180ms' },

  /* Fork: nodes 4+6 run in parallel (similarity screening + substructure search) */
  { nodeId: '4', status: 'BUSY', progress: 0, stages: [s('Generate ECFP4', 'IN_PROGRESS'), s('Encode Bit Vectors', 'PENDING')] },
  { nodeId: '6', status: 'BUSY', progress: 0, stages: [s('Parse SMARTS Pattern', 'IN_PROGRESS'), s('Substructure Match', 'PENDING')] },
  { nodeId: '4', status: 'BUSY', progress: 55, stages: [s('Generate ECFP4', 'COMPLETED'), s('Encode Bit Vectors', 'IN_PROGRESS')] },
  { nodeId: '6', status: 'BUSY', progress: 50, stages: [s('Parse SMARTS Pattern', 'COMPLETED'), s('Substructure Match', 'IN_PROGRESS')] },
  { nodeId: '6', status: 'SUCCESS', duration: '1.4s', stages: [s('Parse SMARTS Pattern', 'COMPLETED'), s('Substructure Match', 'COMPLETED')] },
  { nodeId: '4', status: 'SUCCESS', duration: '2.1s', stages: [s('Generate ECFP4', 'COMPLETED'), s('Encode Bit Vectors', 'COMPLETED')] },

  /* Node 5: Tanimoto Similarity — compare vs Imatinib reference */
  { nodeId: '5', status: 'BUSY', progress: 0, stages: [s('Load Reference (Imatinib)', 'IN_PROGRESS'), s('Pairwise Tanimoto', 'PENDING')] },
  { nodeId: '5', status: 'BUSY', progress: 25, stages: [s('Load Reference (Imatinib)', 'COMPLETED'), s('Pairwise Tanimoto', 'IN_PROGRESS')] },
  { nodeId: '5', status: 'BUSY', progress: 65, stages: [s('Load Reference (Imatinib)', 'COMPLETED'), s('Pairwise Tanimoto', 'IN_PROGRESS')] },
  { nodeId: '5', status: 'SUCCESS', duration: '3.8s', stages: [s('Load Reference (Imatinib)', 'COMPLETED'), s('Pairwise Tanimoto', 'COMPLETED')] },

  /* Node 7: Hit Ranker — merge and rank (waits for both branches) */
  { nodeId: '7', status: 'BUSY', progress: 0, stages: [s('Merge Scores', 'IN_PROGRESS'), s('Rank Candidates', 'PENDING'), s('Filter Top 50', 'PENDING')] },
  { nodeId: '7', status: 'BUSY', progress: 40, stages: [s('Merge Scores', 'COMPLETED'), s('Rank Candidates', 'IN_PROGRESS'), s('Filter Top 50', 'PENDING')] },
  { nodeId: '7', status: 'BUSY', progress: 80, stages: [s('Merge Scores', 'COMPLETED'), s('Rank Candidates', 'COMPLETED'), s('Filter Top 50', 'IN_PROGRESS')] },
  { nodeId: '7', status: 'SUCCESS', duration: '620ms', stages: [s('Merge Scores', 'COMPLETED'), s('Rank Candidates', 'COMPLETED'), s('Filter Top 50', 'COMPLETED')] },
];

/* Execution timeline for Unsloth LLM Training — full train → evaluate → deploy pipeline */
const UNSLOTH_TIMELINE: ExecStep[] = [
  /* Node 1: Create Table — 50k+ math Q&A training rows */
  { nodeId: '1', status: 'BUSY', progress: 0 },
  { nodeId: '1', status: 'BUSY', progress: 40 },
  { nodeId: '1', status: 'BUSY', progress: 80 },
  { nodeId: '1', status: 'SUCCESS', duration: '2.4s' },

  /* Node 2: LLM Trainer — 7-stage Unsloth pipeline */
  { nodeId: '2', status: 'BUSY', progress: 0, stages: ulStages(0) },
  { nodeId: '2', status: 'BUSY', progress: 5, stages: ulStages(1) },
  { nodeId: '2', status: 'BUSY', progress: 15, stages: ulStages(1) },
  { nodeId: '2', status: 'BUSY', progress: 20, stages: ulSkipDownload(3) },
  { nodeId: '2', status: 'BUSY', progress: 35, stages: ulSkipDownload(3) },
  { nodeId: '2', status: 'BUSY', progress: 40, stages: ulSkipDownload(4) },
  { nodeId: '2', status: 'BUSY', progress: 50, stages: ulSkipDownload(5) },
  { nodeId: '2', status: 'BUSY', progress: 60, stages: ulSkipDownload(5) },
  { nodeId: '2', status: 'BUSY', progress: 70, stages: ulSkipDownload(5) },
  { nodeId: '2', status: 'BUSY', progress: 85, stages: ulSkipDownload(6) },
  { nodeId: '2', status: 'BUSY', progress: 95, stages: ulSkipDownload(6) },
  { nodeId: '2', status: 'SUCCESS', duration: '14m 32s', stages: ulDone() },

  /* Node 3: Create Table — test prompts (can start once trainer is done) */
  { nodeId: '3', status: 'BUSY', progress: 0 },
  { nodeId: '3', status: 'SUCCESS', duration: '50ms' },

  /* Node 4: LLM Inference Score — run test prompts against trained model */
  { nodeId: '4', status: 'BUSY', progress: 0, stages: [s('Load Model', 'IN_PROGRESS'), s('Run Inference', 'PENDING'), s('Compute Score', 'PENDING')] },
  { nodeId: '4', status: 'BUSY', progress: 25, stages: [s('Load Model', 'COMPLETED'), s('Run Inference', 'IN_PROGRESS'), s('Compute Score', 'PENDING')] },
  { nodeId: '4', status: 'BUSY', progress: 55, stages: [s('Load Model', 'COMPLETED'), s('Run Inference', 'IN_PROGRESS'), s('Compute Score', 'PENDING')] },
  { nodeId: '4', status: 'BUSY', progress: 80, stages: [s('Load Model', 'COMPLETED'), s('Run Inference', 'COMPLETED'), s('Compute Score', 'IN_PROGRESS')] },
  { nodeId: '4', status: 'SUCCESS', duration: '8.3s', stages: [s('Load Model', 'COMPLETED'), s('Run Inference', 'COMPLETED'), s('Compute Score', 'COMPLETED')] },

  /* Node 5: Conditional Splitter — quality gate (score >= 0.85) */
  { nodeId: '5', status: 'BUSY', progress: 0 },
  { nodeId: '5', status: 'SUCCESS', duration: '12ms' },

  /* Node 6: Push to Ollama — model passed quality gate */
  { nodeId: '6', status: 'BUSY', progress: 0, stages: [s('Convert GGUF', 'IN_PROGRESS'), s('Push to Registry', 'PENDING')] },
  { nodeId: '6', status: 'BUSY', progress: 40, stages: [s('Convert GGUF', 'IN_PROGRESS'), s('Push to Registry', 'PENDING')] },
  { nodeId: '6', status: 'BUSY', progress: 75, stages: [s('Convert GGUF', 'COMPLETED'), s('Push to Registry', 'IN_PROGRESS')] },
  { nodeId: '6', status: 'SUCCESS', duration: '52s', stages: [s('Convert GGUF', 'COMPLETED'), s('Push to Registry', 'COMPLETED')] },
];

/* ── Workflow definitions ── */
interface WorkflowExample {
  name: string;
  description: string;
  nodes: Node[];
  edges: Edge[];
  timeline: ExecStep[];
}

function makeNodes(defs: { id: string; x: number; y: number; title: string; subTitle: string; inputs: Record<string, unknown> | null; outputs: Record<string, unknown> | null }[]): Node[] {
  return defs.map((d) => ({
    id: d.id,
    type: 'BaseNode',
    position: { x: d.x, y: d.y },
    data: { title: d.title, subTitle: d.subTitle, inputs: d.inputs, outputs: d.outputs },
  }));
}

const SENSOR_PIPELINE: WorkflowExample = {
  name: 'Sensor Anomaly Pipeline',
  description: '7-node IoT pipeline: generate data → detect anomalies → branch by severity → alert or archive',
  nodes: makeNodes([
    { id: '1', x: 0, y: 200, title: 'Create Table', subTitle: 'IoT Sensor Readings', inputs: null, outputs: { data: {} } },
    { id: '2', x: 260, y: 200, title: 'Anomaly Detector', subTitle: 'Z-Score Analysis', inputs: { data: {} }, outputs: { data: {} } },
    { id: '3', x: 540, y: 200, title: 'Conditional Splitter', subTitle: 'Route by severity', inputs: { data: {} }, outputs: { high: {}, low: {} } },
    { id: '4', x: 820, y: 80, title: 'Batch Accumulator', subTitle: 'Group alerts', inputs: { data: {} }, outputs: { data: {} } },
    { id: '5', x: 1100, y: 80, title: 'REST Client', subTitle: 'Send Alerts', inputs: { data: {} }, outputs: { data: {} } },
    { id: '6', x: 820, y: 340, title: 'Dynamic Row Filter', subTitle: 'Keep anomalies', inputs: { data: {} }, outputs: { data: {} } },
    { id: '7', x: 1100, y: 340, title: 'REST Client', subTitle: 'Archive to Lake', inputs: { data: {} }, outputs: { data: {} } },
  ]),
  edges: [
    { id: 'e1-2', source: '1', sourceHandle: 'data', target: '2', targetHandle: 'data', type: 'default' },
    { id: 'e2-3', source: '2', sourceHandle: 'data', target: '3', targetHandle: 'data', type: 'default' },
    { id: 'e3-4', source: '3', sourceHandle: 'high', target: '4', targetHandle: 'data', type: 'default' },
    { id: 'e4-5', source: '4', sourceHandle: 'data', target: '5', targetHandle: 'data', type: 'default' },
    { id: 'e3-6', source: '3', sourceHandle: 'low', target: '6', targetHandle: 'data', type: 'default' },
    { id: 'e6-7', source: '6', sourceHandle: 'data', target: '7', targetHandle: 'data', type: 'default' },
  ],
  timeline: SENSOR_TIMELINE,
};

const CHEMINFORMATICS: WorkflowExample = {
  name: 'Drug Screening (RDKit)',
  description: 'Dual screening: descriptors → Lipinski gate → parallel similarity + substructure search → merge & rank top 50 hits',
  nodes: makeNodes([
    { id: '1', x: 0, y: 240, title: 'Create Table', subTitle: '10k compound SMILES', inputs: null, outputs: { data: {} } },
    { id: '2', x: 260, y: 210, title: 'RDKit Descriptors', subTitle: 'MW, LogP, TPSA, HBD, HBA', inputs: { data: {} }, outputs: { data: {} } },
    { id: '3', x: 530, y: 240, title: 'Lipinski Filter', subTitle: 'Rule of 5', inputs: { data: {} }, outputs: { pass: {}, fail: {} } },
    { id: '4', x: 820, y: 100, title: 'Morgan Fingerprints', subTitle: 'ECFP4 r=2 1024-bit', inputs: { data: {} }, outputs: { data: {} } },
    { id: '5', x: 1100, y: 100, title: 'Tanimoto Similarity', subTitle: 'vs Imatinib reference', inputs: { data: {} }, outputs: { data: {} } },
    { id: '6', x: 820, y: 400, title: 'Substructure Search', subTitle: 'Benzimidazole scaffold', inputs: { data: {} }, outputs: { data: {} } },
    { id: '7', x: 1380, y: 240, title: 'Hit Ranker', subTitle: 'Merge & rank top 50', inputs: { similarity: {}, substructure: {} }, outputs: { data: {} } },
  ]),
  edges: [
    { id: 'e1-2', source: '1', sourceHandle: 'data', target: '2', targetHandle: 'data', type: 'default' },
    { id: 'e2-3', source: '2', sourceHandle: 'data', target: '3', targetHandle: 'data', type: 'default' },
    { id: 'e3-4', source: '3', sourceHandle: 'pass', target: '4', targetHandle: 'data', type: 'default' },
    { id: 'e3-6', source: '3', sourceHandle: 'pass', target: '6', targetHandle: 'data', type: 'default' },
    { id: 'e4-5', source: '4', sourceHandle: 'data', target: '5', targetHandle: 'data', type: 'default' },
    { id: 'e5-7', source: '5', sourceHandle: 'data', target: '7', targetHandle: 'similarity', type: 'default' },
    { id: 'e6-7', source: '6', sourceHandle: 'data', target: '7', targetHandle: 'substructure', type: 'default' },
  ],
  timeline: CHEMINFORMATICS_TIMELINE,
};

const UNSLOTH_TRAINING: WorkflowExample = {
  name: 'LLM Fine-Tuning',
  description: 'Train → evaluate → deploy: fine-tune Phi-2 with Unsloth, score with test prompts, push passing models to Ollama',
  nodes: makeNodes([
    { id: '1', x: 0, y: 100, title: 'Create Table', subTitle: '50k+ training pairs', inputs: null, outputs: { data: {} } },
    { id: '2', x: 300, y: 100, title: 'LLM Trainer (Unsloth)', subTitle: 'Phi-2 · LoRA r=16 · 4-bit', inputs: { training_data: {} }, outputs: { model_info: {} } },
    { id: '3', x: 0, y: 480, title: 'Create Table', subTitle: 'Test prompts', inputs: null, outputs: { data: {} } },
    { id: '4', x: 640, y: 260, title: 'LLM Inference Score', subTitle: 'Evaluate model accuracy', inputs: { model_info: {}, prompts: {} }, outputs: { scores: {} } },
    { id: '5', x: 940, y: 260, title: 'Conditional Splitter', subTitle: 'Score >= 0.85?', inputs: { data: {} }, outputs: { pass: {}, fail: {} } },
    { id: '6', x: 1220, y: 180, title: 'Push to Ollama', subTitle: 'GGUF + registry push', inputs: { data: {} }, outputs: { data: {} } },
  ]),
  edges: [
    { id: 'e1-2', source: '1', sourceHandle: 'data', target: '2', targetHandle: 'training_data', type: 'default' },
    { id: 'e2-4', source: '2', sourceHandle: 'model_info', target: '4', targetHandle: 'model_info', type: 'default' },
    { id: 'e3-4', source: '3', sourceHandle: 'data', target: '4', targetHandle: 'prompts', type: 'default' },
    { id: 'e4-5', source: '4', sourceHandle: 'scores', target: '5', targetHandle: 'data', type: 'default' },
    { id: 'e5-6', source: '5', sourceHandle: 'pass', target: '6', targetHandle: 'data', type: 'default' },
  ],
  timeline: UNSLOTH_TIMELINE,
};

const WORKFLOWS = [SENSOR_PIPELINE, UNSLOTH_TRAINING, CHEMINFORMATICS];

/* ── Hook: simulate execution by stepping through the timeline ── */
function useSimulatedExecution(wf: WorkflowExample) {
  const [nodes, setNodes] = useState<Node[]>(wf.nodes);
  const [tick, setTick] = useState(-1);
  const intervalRef = useRef<ReturnType<typeof setInterval>>();
  const isRunning = tick >= 0 && tick < wf.timeline.length;
  const isDone = tick >= wf.timeline.length;

  /* Reset when workflow changes */
  useEffect(() => {
    setTick(-1);
    setNodes(wf.nodes);
    return () => clearInterval(intervalRef.current);
  }, [wf]);

  /* Apply timeline steps */
  useEffect(() => {
    if (tick < 0) return;
    if (tick >= wf.timeline.length) {
      clearInterval(intervalRef.current);
      return;
    }
    const step = wf.timeline[tick];
    setNodes((prev) =>
      prev.map((n) =>
        n.id === step.nodeId
          ? { ...n, data: { ...n.data, status: step.status, progress: step.progress, stages: step.stages, duration: step.duration } }
          : n,
      ),
    );
  }, [tick, wf.timeline]);

  const run = useCallback(() => {
    /* Reset all nodes to idle */
    setNodes(wf.nodes);
    setTick(0);
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setTick((t) => t + 1);
    }, 400);
  }, [wf]);

  /* Derive edges: only animate edges feeding into a BUSY node (data flowing in) */
  const busyNodeIds = new Set(
    nodes.filter((n) => (n.data as unknown as NodeData).status === 'BUSY').map((n) => n.id),
  );
  const edges = wf.edges.map((e) => ({
    ...e,
    animated: busyNodeIds.has(e.target),
  }));

  return { nodes, edges, run, isRunning, isDone };
}

/* ── Inner component (needs ReactFlowProvider ancestor) ── */
function WorkflowCanvas({ wf, active, setActive }: { wf: WorkflowExample; active: number; setActive: (i: number) => void }) {
  const { nodes, edges, run, isRunning, isDone } = useSimulatedExecution(wf);
  const { fitView } = useReactFlow();
  const [fullscreen, setFullscreen] = useState(false);

  /* Re-fit when the active workflow changes or fullscreen toggles */
  useEffect(() => {
    const t = setTimeout(() => fitView({ padding: 0.25, duration: 300 }), 50);
    return () => clearTimeout(t);
  }, [active, fullscreen, fitView]);

  /* Close fullscreen on Escape */
  useEffect(() => {
    if (!fullscreen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setFullscreen(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [fullscreen]);

  return (
    <>
      {/* Title bar */}
      <div className="mx-auto max-w-6xl px-4 pt-20 pb-6 sm:px-6 sm:pt-28 lg:px-8">
        <div className="mb-8 text-center">
          <h2 id="see-it-heading" className="text-3xl font-bold sm:text-4xl">
            See it in <span className="text-gradient">action</span>
          </h2>
          <p className="mt-4 text-fg-muted">
            Real workflows rendered with React Flow. Hit play to watch the execution simulation.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3">
          {WORKFLOWS.map((w, i) => (
            <button
              key={w.name}
              type="button"
              onClick={() => setActive(i)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                i === active
                  ? 'bg-accent text-on-accent'
                  : 'bg-overlay/10 text-fg-muted hover:text-fg'
              }`}
            >
              {w.name}
            </button>
          ))}
          <button
            type="button"
            onClick={run}
            disabled={isRunning}
            className="flex items-center gap-2 rounded-full bg-green-600 px-4 py-1.5 text-sm font-semibold text-white transition-colors hover:bg-green-500 disabled:opacity-50"
          >
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M6.3 2.8A1.5 1.5 0 004 4.1v11.8a1.5 1.5 0 002.3 1.3l9-5.9a1.5 1.5 0 000-2.6l-9-5.9z" />
            </svg>
            {isDone ? 'Replay' : isRunning ? 'Running...' : 'Run Workflow'}
          </button>
        </div>

        <p className="mt-4 text-center text-sm text-fg-muted">{wf.description}</p>
      </div>

      {/* Canvas */}
      <div className="mx-auto max-w-6xl px-4 pb-20 sm:px-6 sm:pb-28 lg:px-8">
        <div className="relative overflow-hidden rounded-2xl border border-divider" style={{ height: fullscreen ? 0 : '40vh', minHeight: fullscreen ? 0 : 320 }}>
          {!fullscreen && (
            <>
              {/* Fullscreen toggle */}
              <button
                type="button"
                onClick={() => setFullscreen(true)}
                title="View fullscreen"
                className="absolute right-3 top-3 z-10 rounded-lg border border-divider bg-card p-1.5 text-fg-muted transition-colors hover:bg-overlay/10 hover:text-fg"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
                </svg>
              </button>
              <ReactFlow
                nodes={nodes}
                edges={edges}
                nodeTypes={nodeTypes}
                fitView
                fitViewOptions={{ padding: 0.25 }}
                nodesDraggable={false}
                nodesConnectable={false}
                elementsSelectable={false}
                panOnDrag
                zoomOnScroll={false}
                proOptions={{ hideAttribution: true }}
                defaultEdgeOptions={{
                  style: { stroke: 'var(--svg-accent)', strokeWidth: 2, opacity: 0.5 },
                }}
              >
                <Background gap={20} size={1} color="var(--svg-accent)" style={{ opacity: 0.08 }} />
                <Controls
                  showInteractive={false}
                  className="!rounded-lg !border-divider !bg-card !shadow-none [&>button]:!border-divider [&>button]:!bg-card [&>button]:!fill-fg-muted [&>button:hover]:!bg-overlay/10"
                />
              </ReactFlow>
            </>
          )}
        </div>
      </div>

      {/* Fullscreen overlay */}
      {fullscreen && (
        <div className="fixed inset-0 z-50 flex flex-col bg-base">
          {/* Fullscreen header */}
          <div className="flex items-center justify-between border-b border-divider px-4 py-3">
            <div className="flex items-center gap-3">
              {WORKFLOWS.map((w, i) => (
                <button
                  key={w.name}
                  type="button"
                  onClick={() => setActive(i)}
                  className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                    i === active
                      ? 'bg-accent text-on-accent'
                      : 'bg-overlay/10 text-fg-muted hover:text-fg'
                  }`}
                >
                  {w.name}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={run}
                disabled={isRunning}
                className="flex items-center gap-2 rounded-full bg-green-600 px-3 py-1 text-xs font-semibold text-white transition-colors hover:bg-green-500 disabled:opacity-50"
              >
                <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M6.3 2.8A1.5 1.5 0 004 4.1v11.8a1.5 1.5 0 002.3 1.3l9-5.9a1.5 1.5 0 000-2.6l-9-5.9z" />
                </svg>
                {isDone ? 'Replay' : isRunning ? 'Running...' : 'Run'}
              </button>
              <button
                type="button"
                onClick={() => setFullscreen(false)}
                title="Exit fullscreen (Esc)"
                className="rounded-lg border border-divider bg-card p-1.5 text-fg-muted transition-colors hover:bg-overlay/10 hover:text-fg"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
          {/* Fullscreen canvas */}
          <div className="flex-1">
            <ReactFlow
              nodes={nodes}
              edges={edges}
              nodeTypes={nodeTypes}
              fitView
              fitViewOptions={{ padding: 0.15 }}
              nodesDraggable={false}
              nodesConnectable={false}
              elementsSelectable={false}
              panOnDrag
              zoomOnScroll
              proOptions={{ hideAttribution: true }}
              defaultEdgeOptions={{
                style: { stroke: 'var(--svg-accent)', strokeWidth: 2, opacity: 0.5 },
              }}
            >
              <Background gap={20} size={1} color="var(--svg-accent)" style={{ opacity: 0.08 }} />
              <Controls
                showInteractive={false}
                className="!rounded-lg !border-divider !bg-card !shadow-none [&>button]:!border-divider [&>button]:!bg-card [&>button]:!fill-fg-muted [&>button:hover]:!bg-overlay/10"
              />
            </ReactFlow>
          </div>
        </div>
      )}
    </>
  );
}

/* ── Main component ── */
export default function WorkflowPreview() {
  const [active, setActive] = useState(0);
  const wf = WORKFLOWS[active];

  return (
    <section id="see-it" aria-labelledby="see-it-heading">
      <ReactFlowProvider>
        <WorkflowCanvas wf={wf} active={active} setActive={setActive} />
      </ReactFlowProvider>
    </section>
  );
}
