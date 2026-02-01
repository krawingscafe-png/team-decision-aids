import { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Printer, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/Spinner';
import { useAuth } from '@/contexts/AuthContext';
import { InteractiveFlowChart } from '@/components/charts/InteractiveFlowChart';
import { TorbayChart, ChartData as TorbayChartData, Treatment } from '@/components/charts/TorbayChart';
import { HIP_KNEE_CHART_DATA, KNEE_ARTHRITIS_CHART_DATA, HIP_ARTHRITIS_CHART_DATA } from '@/data/hipKneeChartData';

const API_BASE = import.meta.env.VITE_API_BASE || 'https://api.torbaycharts.com';
const MOCK_MODE = true;

// Map slugs to Torbay chart data
const TORBAY_CHART_MAP: Record<string, TorbayChartData> = {
  'hip-knee-arthritis': HIP_KNEE_CHART_DATA,
  'knee-arthritis': KNEE_ARTHRITIS_CHART_DATA,
  'hip-arthritis': HIP_ARTHRITIS_CHART_DATA,
};

interface FlowChartNode {
  id: string;
  type?: string;
  data: { label: string };
  position: { x: number; y: number };
}

interface FlowChartEdge {
  id: string;
  source: string;
  target: string;
  label?: string;
}

interface FlowChartData {
  slug: string;
  title: string;
  description: string;
  nodes: FlowChartNode[];
  edges: FlowChartEdge[];
}

const MOCK_FLOWCHART_DATA: Record<string, FlowChartData> = {
  'anticoagulation-af': {
    slug: 'anticoagulation-af',
    title: 'Anticoagulation in Atrial Fibrillation',
    description: 'Decision aid for choosing anticoagulation therapy in patients with AF.',
    nodes: [
      { id: '1', type: 'input', data: { label: 'Patient with AF' }, position: { x: 250, y: 0 } },
      { id: '2', data: { label: 'Calculate CHA₂DS₂-VASc Score' }, position: { x: 250, y: 100 } },
      { id: '3', data: { label: 'Score ≥ 2?' }, position: { x: 250, y: 200 } },
      { id: '4', type: 'output', data: { label: 'Consider anticoagulation' }, position: { x: 100, y: 320 } },
      { id: '5', data: { label: 'Assess bleeding risk (HAS-BLED)' }, position: { x: 400, y: 320 } },
      { id: '6', type: 'output', data: { label: 'Reassess annually' }, position: { x: 400, y: 440 } },
    ],
    edges: [
      { id: 'e1-2', source: '1', target: '2' },
      { id: 'e2-3', source: '2', target: '3' },
      { id: 'e3-4', source: '3', target: '4', label: 'Yes' },
      { id: 'e3-5', source: '3', target: '5', label: 'No' },
      { id: 'e5-6', source: '5', target: '6' },
    ],
  },
  'chest-pain-assessment': {
    slug: 'chest-pain-assessment',
    title: 'Chest Pain Assessment',
    description: 'Flowchart for evaluating and triaging patients presenting with chest pain.',
    nodes: [
      { id: '1', type: 'input', data: { label: 'Patient with Chest Pain' }, position: { x: 250, y: 0 } },
      { id: '2', data: { label: 'STEMI on ECG?' }, position: { x: 250, y: 100 } },
      { id: '3', type: 'output', data: { label: 'Activate Cath Lab' }, position: { x: 80, y: 220 } },
      { id: '4', data: { label: 'Troponin Testing' }, position: { x: 420, y: 220 } },
      { id: '5', data: { label: 'Elevated?' }, position: { x: 420, y: 340 } },
      { id: '6', type: 'output', data: { label: 'NSTEMI Protocol' }, position: { x: 280, y: 460 } },
      { id: '7', type: 'output', data: { label: 'Consider other causes' }, position: { x: 560, y: 460 } },
    ],
    edges: [
      { id: 'e1-2', source: '1', target: '2' },
      { id: 'e2-3', source: '2', target: '3', label: 'Yes' },
      { id: 'e2-4', source: '2', target: '4', label: 'No' },
      { id: 'e4-5', source: '4', target: '5' },
      { id: 'e5-6', source: '5', target: '6', label: 'Yes' },
      { id: 'e5-7', source: '5', target: '7', label: 'No' },
    ],
  },
};

function generateGenericFlowChart(slug: string): FlowChartData {
  return {
    slug,
    title: slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
    description: 'Decision support flowchart for clinical decision-making.',
    nodes: [
      { id: '1', type: 'input', data: { label: 'Start Assessment' }, position: { x: 250, y: 0 } },
      { id: '2', data: { label: 'Gather Patient History' }, position: { x: 250, y: 100 } },
      { id: '3', data: { label: 'Clinical Examination' }, position: { x: 250, y: 200 } },
      { id: '4', data: { label: 'Key Findings?' }, position: { x: 250, y: 300 } },
      { id: '5', type: 'output', data: { label: 'Proceed with Treatment' }, position: { x: 100, y: 420 } },
      { id: '6', type: 'output', data: { label: 'Further Investigation' }, position: { x: 400, y: 420 } },
    ],
    edges: [
      { id: 'e1-2', source: '1', target: '2' },
      { id: 'e2-3', source: '2', target: '3' },
      { id: 'e3-4', source: '3', target: '4' },
      { id: 'e4-5', source: '4', target: '5', label: 'Yes' },
      { id: 'e4-6', source: '4', target: '6', label: 'No' },
    ],
  };
}

export default function ChartDetail() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [flowChart, setFlowChart] = useState<FlowChartData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPrinting, setIsPrinting] = useState(false);
  const { token } = useAuth();

  // Check if this is a Torbay-style chart
  const torbayChartData = slug ? TORBAY_CHART_MAP[slug] : null;
  const isTorbayChart = !!torbayChartData;

  useEffect(() => {
    async function fetchChart() {
      if (!slug) return;

      // If it's a Torbay chart, we already have the data
      if (TORBAY_CHART_MAP[slug]) {
        setIsLoading(false);
        return;
      }

      try {
        if (MOCK_MODE) {
          await new Promise(resolve => setTimeout(resolve, 300));
          const mockChart = MOCK_FLOWCHART_DATA[slug];
          if (mockChart) {
            setFlowChart(mockChart);
          } else {
            setFlowChart(generateGenericFlowChart(slug));
          }
          setIsLoading(false);
          return;
        }

        const response = await fetch(`${API_BASE}/charts/${slug}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          if (response.status === 402) {
            throw new Error('Subscription required');
          }
          if (response.status === 404) {
            throw new Error('Chart not found');
          }
          throw new Error('Failed to load chart');
        }

        const data = await response.json();
        setFlowChart(data);

        // Track analytics
        fetch(`${API_BASE}/analytics/event`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            type: 'chart_view',
            chartSlug: slug,
          }),
        }).catch(console.error);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    }

    fetchChart();
  }, [slug, token]);

  const handlePrint = useCallback(async () => {
    setIsPrinting(true);
    window.print();
    setIsPrinting(false);
  }, []);

  const handleDownload = useCallback(async () => {
    setIsPrinting(true);
    try {
      const response = await fetch(`${API_BASE}/charts/${slug}/print`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to generate download');
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${slug}-decision-aid.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Download error:', err);
    } finally {
      setIsPrinting(false);
    }
  }, [slug, token]);

  const handleNodeClick = useCallback((nodeId: string) => {
    console.log('Node clicked:', nodeId);
  }, []);

  const handleTreatmentClick = useCallback((treatment: Treatment) => {
    navigate(`/charts/${slug}/treatment/${treatment.slug}`);
  }, [slug, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <p className="text-destructive mb-4">{error}</p>
            <Link to="/charts" className="text-primary hover:underline">
              ← Back to charts
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Render Torbay-style chart for hip/knee/arthritis
  if (isTorbayChart && torbayChartData) {
    return (
      <div className="py-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <TorbayChart 
            data={torbayChartData} 
            onTreatmentClick={handleTreatmentClick}
          />
        </div>
      </div>
    );
  }

  // Render flowchart for other chart types
  if (!flowChart) {
    return null;
  }

  return (
    <div className="py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <Link
              to="/charts"
              className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary mb-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to charts
            </Link>
            <h1 className="text-3xl font-bold text-foreground">{flowChart.title}</h1>
            <p className="mt-2 text-muted-foreground">{flowChart.description}</p>
          </div>
          
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrint}
              disabled={isPrinting}
              className="gap-2"
            >
              <Printer className="h-4 w-4" />
              Print
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownload}
              disabled={isPrinting}
              className="gap-2"
            >
              <Download className="h-4 w-4" />
              Download
            </Button>
          </div>
        </div>

        {/* Interactive Flow Chart */}
        <InteractiveFlowChart 
          nodes={flowChart.nodes}
          edges={flowChart.edges}
          onNodeClick={handleNodeClick}
        />
      </div>
    </div>
  );
}
