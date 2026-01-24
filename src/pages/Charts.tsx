import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BarChart3 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SkeletonCard } from '@/components/SkeletonCard';
import { useAuth } from '@/contexts/AuthContext';

const API_BASE = import.meta.env.VITE_API_BASE || 'https://api.torbaycharts.com';
const MOCK_MODE = true; // Toggle for testing

const MOCK_CHARTS: Chart[] = [
  {
    slug: 'anticoagulation-af',
    title: 'Anticoagulation in Atrial Fibrillation',
    description: 'Decision aid for choosing anticoagulation therapy in patients with AF.',
    image: undefined,
  },
  {
    slug: 'chest-pain-assessment',
    title: 'Chest Pain Assessment',
    description: 'Flowchart for evaluating and triaging patients presenting with chest pain.',
    image: undefined,
  },
  {
    slug: 'diabetes-management',
    title: 'Type 2 Diabetes Management',
    description: 'Step-by-step decision support for glucose-lowering therapy selection.',
    image: undefined,
  },
  {
    slug: 'copd-exacerbation',
    title: 'COPD Exacerbation Management',
    description: 'Treatment pathway for acute exacerbations of chronic obstructive pulmonary disease.',
    image: undefined,
  },
];

interface Chart {
  slug: string;
  title: string;
  description: string;
  image?: string;
}

export default function Charts() {
  const [charts, setCharts] = useState<Chart[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { token } = useAuth();

  useEffect(() => {
    async function fetchCharts() {
      try {
        if (MOCK_MODE) {
          // Simulate API delay
          await new Promise(resolve => setTimeout(resolve, 500));
          setCharts(MOCK_CHARTS);
          return;
        }

        const response = await fetch(`${API_BASE}/charts`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          if (response.status === 402) {
            throw new Error('Subscription required to access charts.');
          }
          throw new Error('Failed to load charts');
        }

        const data = await response.json();
        setCharts(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    }

    fetchCharts();
  }, [token]);
  if (isLoading) {
    return (
      <div className="py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-foreground mb-8">Decision Aids</h1>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <p className="text-destructive mb-4">{error}</p>
            {error.includes('Subscription') && (
              <Link to="/pricing" className="text-primary hover:underline">
                View pricing plans →
              </Link>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (charts.length === 0) {
    return (
      <div className="py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-foreground mb-8">Decision Aids</h1>
          <div className="text-center py-12 bg-muted/30 rounded-lg">
            <BarChart3 className="mx-auto h-12 w-12 text-muted-foreground/50" />
            <p className="mt-4 text-muted-foreground">No decision aids available yet.</p>
            <p className="text-sm text-muted-foreground">Check back soon for new content.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-foreground mb-8">Decision Aids</h1>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {charts.map((chart) => (
            <Link key={chart.slug} to={`/charts/${chart.slug}`}>
              <Card className="h-full transition-all hover:shadow-lg hover:border-primary/50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{chart.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  {chart.image ? (
                    <img
                      src={chart.image}
                      alt={chart.title}
                      className="w-full h-32 object-cover rounded-md mb-3"
                    />
                  ) : (
                    <div className="w-full h-32 bg-muted rounded-md mb-3 flex items-center justify-center">
                      <BarChart3 className="h-8 w-8 text-muted-foreground/30" />
                    </div>
                  )}
                  <CardDescription>{chart.description}</CardDescription>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
