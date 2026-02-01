import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BarChart3 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { SkeletonCard } from '@/components/SkeletonCard';
import { useAuth } from '@/contexts/AuthContext';

const API_BASE = import.meta.env.VITE_API_BASE || 'https://api.torbaycharts.com';
const MOCK_MODE = true; // Toggle for testing

interface Chart {
  slug: string;
  title: string;
  description: string;
  image?: string;
  category?: string;
}

const MOCK_CHARTS: Chart[] = [
  {
    slug: 'hip-knee-arthritis',
    title: 'Hip and Knee Arthritis',
    description: 'Decision aid for managing hip and knee osteoarthritis from early stage to surgical intervention.',
    category: 'Orthopaedics',
  },
  {
    slug: 'knee-arthritis',
    title: 'Knee Arthritis',
    description: 'Decision aid for managing knee osteoarthritis including conservative and surgical options.',
    category: 'Orthopaedics',
  },
  {
    slug: 'hip-arthritis',
    title: 'Hip Arthritis',
    description: 'Decision aid for managing hip osteoarthritis from diagnosis to total hip replacement.',
    category: 'Orthopaedics',
  },
  {
    slug: 'anticoagulation-af',
    title: 'Anticoagulation in Atrial Fibrillation',
    description: 'Decision aid for choosing anticoagulation therapy in patients with AF.',
    category: 'Cardiology',
  },
  {
    slug: 'chest-pain-assessment',
    title: 'Chest Pain Assessment',
    description: 'Flowchart for evaluating and triaging patients presenting with chest pain.',
    category: 'Emergency',
  },
  {
    slug: 'diabetes-management',
    title: 'Type 2 Diabetes Management',
    description: 'Step-by-step decision support for glucose-lowering therapy selection.',
    category: 'Endocrinology',
  },
];

// Category colors
const CATEGORY_COLORS: Record<string, string> = {
  'Orthopaedics': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
  'Cardiology': 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
  'Emergency': 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300',
  'Endocrinology': 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
};

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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Decision Aids</h1>
          <p className="mt-2 text-muted-foreground">
            Interactive clinical decision support tools for shared decision making
          </p>
        </div>
        
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {charts.map((chart) => (
            <Link key={chart.slug} to={`/charts/${chart.slug}`}>
              <Card className="h-full transition-all hover:shadow-lg hover:border-primary/50 group">
                <CardHeader className="pb-2">
                  {chart.category && (
                    <Badge 
                      variant="secondary" 
                      className={`w-fit mb-2 ${CATEGORY_COLORS[chart.category] || ''}`}
                    >
                      {chart.category}
                    </Badge>
                  )}
                  <CardTitle className="text-lg group-hover:text-primary transition-colors">
                    {chart.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {chart.image ? (
                    <img
                      src={chart.image}
                      alt={chart.title}
                      className="w-full h-32 object-cover rounded-md mb-3"
                    />
                  ) : (
                    <div className="w-full h-32 bg-gradient-to-r from-[#73C3B4] via-[#F6A92D] to-[#D34232] rounded-md mb-3 flex items-center justify-center opacity-80">
                      <BarChart3 className="h-12 w-12 text-white drop-shadow-md" />
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
