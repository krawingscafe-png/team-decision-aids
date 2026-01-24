import { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Printer, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/Spinner';
import { useAuth } from '@/contexts/AuthContext';

const API_BASE = import.meta.env.VITE_API_BASE || 'https://api.torbaycharts.com';
const MOCK_MODE = true; // Toggle for testing

interface ChartData {
  slug: string;
  title: string;
  description: string;
  nodes: Array<{ id: string; type?: string; data: { label: string }; position: { x: number; y: number } }>;
  edges: Array<{ id: string; source: string; target: string; label?: string }>;
}

const MOCK_CHART_DATA: Record<string, ChartData> = {
  'anticoagulation-af': {
    slug: 'anticoagulation-af',
    title: 'Anticoagulation in Atrial Fibrillation',
    description: 'Decision aid for choosing anticoagulation therapy in patients with AF.',
    nodes: [
      { id: '1', type: 'input', data: { label: 'Patient with AF' }, position: { x: 250, y: 0 } },
      { id: '2', data: { label: 'Calculate CHA₂DS₂-VASc Score' }, position: { x: 250, y: 100 } },
      { id: '3', data: { label: 'Score ≥ 2?' }, position: { x: 250, y: 200 } },
      { id: '4', data: { label: 'Consider anticoagulation' }, position: { x: 100, y: 300 } },
      { id: '5', data: { label: 'Assess bleeding risk (HAS-BLED)' }, position: { x: 400, y: 300 } },
    ],
    edges: [
      { id: 'e1-2', source: '1', target: '2' },
      { id: 'e2-3', source: '2', target: '3' },
      { id: 'e3-4', source: '3', target: '4', label: 'Yes' },
      { id: 'e3-5', source: '3', target: '5', label: 'No' },
    ],
  },
  'chest-pain-assessment': {
    slug: 'chest-pain-assessment',
    title: 'Chest Pain Assessment',
    description: 'Flowchart for evaluating and triaging patients presenting with chest pain.',
    nodes: [
      { id: '1', type: 'input', data: { label: 'Patient with Chest Pain' }, position: { x: 250, y: 0 } },
      { id: '2', data: { label: 'STEMI on ECG?' }, position: { x: 250, y: 100 } },
      { id: '3', data: { label: 'Activate Cath Lab' }, position: { x: 100, y: 200 } },
      { id: '4', data: { label: 'Troponin Testing' }, position: { x: 400, y: 200 } },
    ],
    edges: [
      { id: 'e1-2', source: '1', target: '2' },
      { id: 'e2-3', source: '2', target: '3', label: 'Yes' },
      { id: 'e2-4', source: '2', target: '4', label: 'No' },
    ],
  },
};

export default function ChartDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [chart, setChart] = useState<ChartData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPrinting, setIsPrinting] = useState(false);
  const { token } = useAuth();

  useEffect(() => {
    async function fetchChart() {
      if (!slug) return;

      try {
        if (MOCK_MODE) {
          await new Promise(resolve => setTimeout(resolve, 300));
          const mockChart = MOCK_CHART_DATA[slug];
          if (mockChart) {
            setChart(mockChart);
          } else {
            // Generic mock for charts not in our mock data
            setChart({
              slug,
              title: slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
              description: 'Decision support flowchart for clinical decision-making.',
              nodes: [
                { id: '1', type: 'input', data: { label: 'Start' }, position: { x: 250, y: 0 } },
                { id: '2', data: { label: 'Assess Patient' }, position: { x: 250, y: 100 } },
                { id: '3', data: { label: 'Make Decision' }, position: { x: 250, y: 200 } },
              ],
              edges: [
                { id: 'e1-2', source: '1', target: '2' },
                { id: 'e2-3', source: '2', target: '3' },
              ],
            });
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
        setChart(data);

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
    try {
      const response = await fetch(`${API_BASE}/charts/${slug}/print`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to generate print version');
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank');
    } catch (err) {
      console.error('Print error:', err);
    } finally {
      setIsPrinting(false);
    }
  }, [slug, token]);

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

  if (!chart) {
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
            <h1 className="text-3xl font-bold text-foreground">{chart.title}</h1>
            <p className="mt-2 text-muted-foreground">{chart.description}</p>
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

        {/* Chart Viewer Placeholder */}
        <div className="bg-card border rounded-lg p-8 min-h-[500px] flex items-center justify-center">
          <div className="text-center">
            <p className="text-muted-foreground mb-2">
              React Flow interactive chart will render here
            </p>
            <p className="text-sm text-muted-foreground">
              Chart slug: {slug}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
