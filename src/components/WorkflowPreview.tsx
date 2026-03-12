import { useState } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  Handle,
  Position,
  type Node,
  type Edge,
  type NodeProps,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

/* Simplified BaseNode matching the Continuum workbench look */
function BaseNode({ data }: NodeProps) {
  const nodeData = data as { title: string; subTitle: string; inputs: Record<string, unknown> | null; outputs: Record<string, unknown> | null };
  return (
    <div className="min-w-[180px] rounded-[10px] border-2 border-accent/50 bg-card px-4 py-3 shadow-lg">
      {/* Input handles */}
      {nodeData.inputs &&
        Object.keys(nodeData.inputs).map((portId, i, arr) => (
          <Handle
            key={portId}
            id={portId}
            type="target"
            position={Position.Left}
            className="!h-2.5 !w-2.5 !border-2 !border-accent !bg-base"
            style={{ top: `${((i + 1) / (arr.length + 1)) * 100}%` }}
          />
        ))}

      <div className="text-xs font-semibold text-fg">{nodeData.title}</div>
      <div className="mt-0.5 text-[10px] text-fg-muted">{nodeData.subTitle}</div>

      {/* Output handles */}
      {nodeData.outputs &&
        Object.keys(nodeData.outputs).map((portId, i, arr) => (
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

/* ── Example workflow data extracted from .cwf files ── */

interface WorkflowExample {
  name: string;
  description: string;
  nodes: Node[];
  edges: Edge[];
}

const SENSOR_PIPELINE: WorkflowExample = {
  name: 'Sensor Anomaly Pipeline',
  description: '7-node IoT pipeline: generate data → detect anomalies → branch by severity → alert or archive',
  nodes: [
    { id: '1', type: 'BaseNode', position: { x: 0, y: 200 }, data: { title: 'Create Table', subTitle: 'IoT Sensor Readings', inputs: null, outputs: { data: {} } } },
    { id: '2', type: 'BaseNode', position: { x: 260, y: 200 }, data: { title: 'Anomaly Detector', subTitle: 'Z-Score Analysis', inputs: { data: {} }, outputs: { data: {} } } },
    { id: '3', type: 'BaseNode', position: { x: 520, y: 200 }, data: { title: 'Conditional Splitter', subTitle: 'Route by severity', inputs: { data: {} }, outputs: { high: {}, low: {} } } },
    { id: '4', type: 'BaseNode', position: { x: 800, y: 80 }, data: { title: 'Batch Accumulator', subTitle: 'Group alerts', inputs: { data: {} }, outputs: { data: {} } } },
    { id: '5', type: 'BaseNode', position: { x: 1060, y: 80 }, data: { title: 'REST Client', subTitle: 'Send Alerts', inputs: { data: {} }, outputs: { data: {} } } },
    { id: '6', type: 'BaseNode', position: { x: 800, y: 320 }, data: { title: 'Dynamic Row Filter', subTitle: 'Keep anomalies', inputs: { data: {} }, outputs: { data: {} } } },
    { id: '7', type: 'BaseNode', position: { x: 1060, y: 320 }, data: { title: 'REST Client', subTitle: 'Archive to Lake', inputs: { data: {} }, outputs: { data: {} } } },
  ],
  edges: [
    { id: 'e1-2', source: '1', sourceHandle: 'data', target: '2', targetHandle: 'data', type: 'default' },
    { id: 'e2-3', source: '2', sourceHandle: 'data', target: '3', targetHandle: 'data', type: 'default' },
    { id: 'e3-4', source: '3', sourceHandle: 'high', target: '4', targetHandle: 'data', type: 'default' },
    { id: 'e4-5', source: '4', sourceHandle: 'data', target: '5', targetHandle: 'data', type: 'default' },
    { id: 'e3-6', source: '3', sourceHandle: 'low', target: '6', targetHandle: 'data', type: 'default' },
    { id: 'e6-7', source: '6', sourceHandle: 'data', target: '7', targetHandle: 'data', type: 'default' },
  ],
};

const ANOMALY_DETECTOR: WorkflowExample = {
  name: 'Anomaly Detector',
  description: '3-node flow: generate 1000 sensor readings → Z-score outlier detection → split by threshold',
  nodes: [
    { id: '2', type: 'BaseNode', position: { x: 0, y: 200 }, data: { title: 'Create Table', subTitle: '1000 sensor readings', inputs: null, outputs: { data: {} } } },
    { id: '3', type: 'BaseNode', position: { x: 300, y: 200 }, data: { title: 'Anomaly Detector', subTitle: 'Z-Score outlier detection', inputs: { data: {} }, outputs: { data: {} } } },
    { id: '6', type: 'BaseNode', position: { x: 600, y: 200 }, data: { title: 'Conditional Splitter', subTitle: 'Split by threshold', inputs: { data: {} }, outputs: { high: {}, low: {} } } },
  ],
  edges: [
    { id: 'e2-3', source: '2', sourceHandle: 'data', target: '3', targetHandle: 'data', type: 'default' },
    { id: 'e3-6', source: '3', sourceHandle: 'data', target: '6', targetHandle: 'data', type: 'default' },
  ],
};

const WORKFLOWS = [SENSOR_PIPELINE, ANOMALY_DETECTOR];

export default function WorkflowPreview() {
  const [active, setActive] = useState(0);
  const wf = WORKFLOWS[active];

  return (
    <section id="see-it" aria-labelledby="see-it-heading" className="py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <h2 id="see-it-heading" className="text-3xl font-bold sm:text-4xl">
            See it in <span className="text-gradient">action</span>
          </h2>
          <p className="mt-4 text-fg-muted">
            Real workflows from the example-workflows repo, rendered with React Flow — the same
            engine that powers the Continuum workbench.
          </p>
        </div>

        {/* Workflow selector tabs */}
        <div className="mb-4 flex justify-center gap-3">
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
        </div>

        <p className="mb-4 text-center text-sm text-fg-muted">{wf.description}</p>

        {/* React Flow canvas */}
        <div className="overflow-hidden rounded-2xl border border-divider" style={{ height: 460 }}>
          <ReactFlow
            key={wf.name}
            nodes={wf.nodes}
            edges={wf.edges}
            nodeTypes={nodeTypes}
            fitView
            fitViewOptions={{ padding: 0.3 }}
            nodesDraggable={false}
            nodesConnectable={false}
            elementsSelectable={false}
            panOnDrag
            zoomOnScroll={false}
            proOptions={{ hideAttribution: true }}
            defaultEdgeOptions={{
              style: { stroke: 'var(--svg-accent)', strokeWidth: 2, opacity: 0.6 },
              animated: true,
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
    </section>
  );
}
