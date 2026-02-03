import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, BarChart3, Table2, Pill, Printer, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { HIP_KNEE_CHART_DATA, KNEE_ARTHRITIS_CHART_DATA, HIP_ARTHRITIS_CHART_DATA } from '@/data/hipKneeChartData';
import { Treatment, ChartData } from '@/components/charts/TorbayChart';
import '@/styles/chart.css';

const STAGE_COLORS = [
  '#73C3B4', '#84B162', '#F6A92D', '#EC822A', '#D34232', '#713954',
];

const STAGE_NAMES = ['Normal', 'Start of Disease', 'Early Stage', 'Mid Stage', 'Late Stage', 'Very Late'];

// Map chart slugs to data
const CHART_DATA_MAP: Record<string, ChartData> = {
  'hip-knee-arthritis': HIP_KNEE_CHART_DATA,
  'knee-arthritis': KNEE_ARTHRITIS_CHART_DATA,
  'hip-arthritis': HIP_ARTHRITIS_CHART_DATA,
};

export default function ChartTableView() {
  const { chartSlug } = useParams<{ chartSlug: string }>();
  
  // Auto-scroll to top
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);
  
  const chartData = chartSlug ? CHART_DATA_MAP[chartSlug] : null;
  
  if (!chartData) {
    return (
      <div className="py-12 text-center">
        <p className="text-destructive mb-4">Chart not found</p>
        <Link to="/charts" className="text-primary hover:underline">← Back to charts</Link>
      </div>
    );
  }

  // Get all treatments from all categories
  const allTreatments: { treatment: Treatment; category: string }[] = [
    ...chartData.categories.diagnosisAndStaging.flatMap(c => 
      c.treatments.map(t => ({ treatment: t, category: 'Diagnosis & Staging' }))
    ),
    ...chartData.categories.selfHelp.flatMap(c => 
      c.treatments.map(t => ({ treatment: t, category: 'Self Help' }))
    ),
    ...chartData.categories.mainlineTreatment.flatMap(c => 
      c.treatments.map(t => ({ treatment: t, category: 'Mainline Treatment' }))
    ),
    ...chartData.categories.alternative.flatMap(c => 
      c.treatments.map(t => ({ treatment: t, category: 'Alternative' }))
    ),
    ...chartData.categories.observationNoTreatment.flatMap(c => 
      c.treatments.map(t => ({ treatment: t, category: 'Observation' }))
    ),
  ];

  const StageButtons = ({ from, to }: { from: number; to: number }) => (
    <div className="flex gap-0.5 flex-wrap">
      {[1, 2, 3, 4, 5, 6].map((stage) => {
        const isActive = stage >= from && stage <= to;
        return (
          <div 
            key={stage}
            className="w-5 h-5 rounded flex items-center justify-center text-xs font-bold"
            style={{ 
              backgroundColor: isActive ? STAGE_COLORS[stage - 1] : 'transparent',
              border: isActive ? 'none' : '1px solid #ccc',
              color: isActive ? 'white' : '#999',
            }}
          >
            {stage}
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="py-6">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="chart-breadcrumb mb-4">
          <Link to="/" className="hover:underline">Home</Link>
          <span className="mx-2">›</span>
          <Link to="/charts" className="hover:underline">Conditions</Link>
          <span className="mx-2">›</span>
          <Link to={`/charts/${chartSlug}`} className="hover:underline">{chartData.name}</Link>
          <span className="mx-2">›</span>
          <span className="text-muted-foreground">Table View</span>
        </nav>

        {/* Header with view toggle */}
        <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
          <div className="flex gap-2">
            <Button variant="secondary" size="sm" asChild>
              <Link to={`/charts/${chartSlug}`}>
                <BarChart3 className="h-4 w-4 mr-1" />
                Chart
              </Link>
            </Button>
            <Button variant="default" size="sm" asChild>
              <Link to={`/charts/${chartSlug}/table`}>
                <Table2 className="h-4 w-4 mr-1" />
                Table
              </Link>
            </Button>
            <Button variant="secondary" size="sm" asChild>
              <Link to={`/charts/${chartSlug}/treatments`}>
                <Pill className="h-4 w-4 mr-1" />
                All Treatments
              </Link>
            </Button>
          </div>
          
          <h1 className="text-xl font-bold text-primary text-center flex-1">{chartData.name} - Table View</h1>
          
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => window.print()}>
              <Printer className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Stage Headers */}
        <div className="mb-4 flex gap-2 justify-center flex-wrap">
          {STAGE_NAMES.map((name, i) => (
            <div 
              key={name}
              className="px-3 py-1.5 rounded-full text-xs font-bold text-white"
              style={{ backgroundColor: STAGE_COLORS[i] }}
            >
              {i + 1}: {name}
            </div>
          ))}
        </div>

        {/* Table View */}
        <div className="overflow-x-auto">
          <table className="comparison-table w-full">
            <thead>
              <tr>
                <th className="sticky-col">Treatment</th>
                <th>Category</th>
                <th>Stages</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {allTreatments.map(({ treatment, category }) => (
                <tr key={treatment.id}>
                  <td className="sticky-col font-semibold">{treatment.name}</td>
                  <td>{category}</td>
                  <td>
                    <StageButtons from={treatment.fromStage} to={treatment.toStage} />
                  </td>
                  <td>
                    <Button variant="outline" size="sm" asChild>
                      <Link to={`/charts/${chartSlug}/treatment/${treatment.slug}`}>
                        View Details
                      </Link>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Back button */}
        <div className="mt-8 text-center">
          <Button variant="outline" asChild>
            <Link to={`/charts/${chartSlug}`}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Chart View
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
