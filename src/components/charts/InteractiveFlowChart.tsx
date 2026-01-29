import { useCallback, useMemo, useState } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  Node,
  MarkerType,
  Handle,
  Position,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface ChartNode {
  id: string;
  type?: string;
  data: { label: string };
  position: { x: number; y: number };
}

interface ChartEdge {
  id: string;
  source: string;
  target: string;
  label?: string;
}

interface InteractiveFlowChartProps {
  nodes: ChartNode[];
  edges: ChartEdge[];
  onNodeClick?: (nodeId: string) => void;
}

interface CustomNodeData {
  label: string;
  visited?: boolean;
}

// Custom Node Components
function DecisionNode({ data, selected }: { data: CustomNodeData; selected?: boolean }) {
  return (
    <div
      className={cn(
        "px-4 py-3 rounded-lg border-2 bg-card shadow-md min-w-[180px] text-center transition-all",
        selected ? "border-primary ring-2 ring-primary/20" : "border-border"
      )}
    >
      <Handle type="target" position={Position.Top} className="!bg-primary" />
      <p className="text-sm font-medium text-foreground">{data.label}</p>
      <Handle type="source" position={Position.Bottom} className="!bg-primary" />
    </div>
  );
}

function InputNode({ data, selected }: { data: CustomNodeData; selected?: boolean }) {
  return (
    <div
      className={cn(
        "px-4 py-3 rounded-full bg-primary text-primary-foreground shadow-md min-w-[180px] text-center transition-all",
        selected && "ring-2 ring-primary/40"
      )}
    >
      <p className="text-sm font-medium">{data.label}</p>
      <Handle type="source" position={Position.Bottom} className="!bg-primary-foreground" />
    </div>
  );
}

function OutputNode({ data, selected }: { data: CustomNodeData; selected?: boolean }) {
  return (
    <div
      className={cn(
        "px-4 py-3 rounded-lg border-2 border-accent bg-accent/10 shadow-md min-w-[180px] text-center transition-all",
        selected && "ring-2 ring-accent/40"
      )}
    >
      <Handle type="target" position={Position.Top} className="!bg-accent" />
      <p className="text-sm font-medium text-foreground">{data.label}</p>
    </div>
  );
}

const nodeTypes = {
  default: DecisionNode,
  input: InputNode,
  output: OutputNode,
};

export function InteractiveFlowChart({ 
  nodes: initialNodes, 
  edges: initialEdges,
  onNodeClick 
}: InteractiveFlowChartProps) {
  const [visitedNodes, setVisitedNodes] = useState<Set<string>>(new Set());

  // Transform nodes to React Flow format
  const flowNodes = useMemo(() => 
    initialNodes.map((node) => ({
      ...node,
      type: node.type || 'default',
      data: {
        ...node.data,
        visited: visitedNodes.has(node.id),
      },
    })),
    [initialNodes, visitedNodes]
  );

  // Transform edges to React Flow format with styling
  const flowEdges = useMemo(() =>
    initialEdges.map((edge) => ({
      ...edge,
      type: 'smoothstep',
      animated: true,
      style: { stroke: 'hsl(var(--primary))', strokeWidth: 2 },
      markerEnd: {
        type: MarkerType.ArrowClosed,
        color: 'hsl(var(--primary))',
      },
      labelStyle: { 
        fill: 'hsl(var(--foreground))', 
        fontWeight: 500,
        fontSize: 12,
      },
      labelBgStyle: { 
        fill: 'hsl(var(--card))',
        fillOpacity: 0.9,
      },
      labelBgPadding: [8, 4] as [number, number],
      labelBgBorderRadius: 4,
    })),
    [initialEdges]
  );

  const [nodes, setNodes, onNodesChange] = useNodesState(flowNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(flowEdges);

  const handleNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    setVisitedNodes(prev => new Set([...prev, node.id]));
    onNodeClick?.(node.id);
  }, [onNodeClick]);

  return (
    <Card className="w-full h-[500px] bg-card overflow-hidden">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={handleNodeClick}
        nodeTypes={nodeTypes as any}
        fitView
        attributionPosition="bottom-left"
        className="bg-muted/20"
      >
        <Controls className="!bg-card !border-border !shadow-md [&>button]:!bg-card [&>button]:!border-border [&>button]:!text-foreground [&>button:hover]:!bg-muted" />
        <MiniMap 
          className="!bg-card !border-border"
          nodeColor="hsl(var(--primary))"
          maskColor="hsl(var(--background) / 0.8)"
        />
        <Background color="hsl(var(--border))" gap={16} />
      </ReactFlow>
      
      {/* Legend */}
      <div className="absolute bottom-4 left-4 flex items-center gap-2">
        <Badge variant="outline" className="text-xs">
          Click nodes to navigate
        </Badge>
        <Badge variant="secondary" className="text-xs">
          {visitedNodes.size} / {nodes.length} visited
        </Badge>
      </div>
    </Card>
  );
}
