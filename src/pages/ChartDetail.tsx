import { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Printer, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/Spinner';
import { useAuth } from '@/contexts/AuthContext';

const API_BASE = import.meta.env.VITE_API_BASE || 'https://api.torbaycharts.com';

interface ChartData {
  slug: string;
  title: string;
  description: string;
  flowData?: any; // React Flow data structure
}

export default function ChartDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [chart, setChart] = useState<ChartData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPrinting, setIsPrinting] = useState(false);
  const { token } = useAuth();

  useEffect(() => {
    async function fetchChart() {
      try {
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

    if (slug) {
      fetchChart();
    }
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
