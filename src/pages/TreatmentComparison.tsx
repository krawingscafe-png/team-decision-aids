import { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Printer, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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

// Mock treatment comparison data
const COMPARISON_DATA: Record<string, {
  stages: string;
  involves: string;
  effortBurden: string;
  sideEffects: string;
  benefits: string;
  chanceOfCure: string;
  risks: string;
  noTreatment: string;
  cost: string;
}> = {
  'paracetamol': {
    stages: 'Stages 2-4',
    involves: 'Take tablets as directed',
    effortBurden: 'Very low',
    sideEffects: 'Rare when used correctly',
    benefits: 'Pain relief, easy to use',
    chanceOfCure: 'Symptom management only',
    risks: 'Liver damage if overdosed',
    noTreatment: 'Pain continues',
    cost: '£2-5/month',
  },
  'physiotherapy': {
    stages: 'Stages 2-5',
    involves: 'Regular sessions with exercises',
    effortBurden: 'Medium - commitment required',
    sideEffects: 'Mild muscle soreness',
    benefits: 'Improved strength and mobility',
    chanceOfCure: 'Can delay progression',
    risks: 'Temporary soreness',
    noTreatment: 'Muscles weaken',
    cost: 'NHS: Free',
  },
  'total-replacement': {
    stages: 'Stages 5-6',
    involves: 'Major surgery, general anaesthetic',
    effortBurden: 'High - 3-6 month recovery',
    sideEffects: 'Post-op pain, swelling',
    benefits: 'Significant pain relief',
    chanceOfCure: '90%+ satisfaction',
    risks: 'Infection, blood clots',
    noTreatment: 'Severe deterioration',
    cost: 'NHS: Free, Private: £10-15k',
  },
};

const getDefaultComparisonData = (treatment: Treatment) => ({
  stages: `Stages ${treatment.fromStage}-${treatment.toStage}`,
  involves: 'Consult healthcare provider',
  effortBurden: 'Varies',
  sideEffects: 'Consult healthcare provider',
  benefits: 'May help manage symptoms',
  chanceOfCure: 'Varies',
  risks: 'Consult healthcare provider',
  noTreatment: 'Symptoms may progress',
  cost: 'Varies',
});

export default function TreatmentComparison() {
  const { chartSlug } = useParams<{ chartSlug: string }>();
  const navigate = useNavigate();
  
  // Auto-scroll to top when component mounts
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);
  
  const chartData = chartSlug ? CHART_DATA_MAP[chartSlug] : null;
  
  // Get selected treatments from localStorage
  const selectedIds = (localStorage.getItem('selectedCharts') || '').split(',').filter(Boolean);
  
  if (!chartData) {
    return (
      <div className="py-12 text-center">
        <p className="text-destructive mb-4">Chart not found</p>
        <Link to="/charts" className="text-primary hover:underline">← Back to charts</Link>
      </div>
    );
  }

  // Find all treatments in chart data
  const allTreatments: Treatment[] = [
    ...chartData.categories.diagnosisAndStaging.flatMap(c => c.treatments),
    ...chartData.categories.selfHelp.flatMap(c => c.treatments),
    ...chartData.categories.mainlineTreatment.flatMap(c => c.treatments),
    ...chartData.categories.alternative.flatMap(c => c.treatments),
    ...chartData.categories.observationNoTreatment.flatMap(c => c.treatments),
  ];

  // Get selected treatments
  const selectedTreatments = allTreatments.filter(t => selectedIds.includes(t.id));

  if (selectedTreatments.length === 0) {
    return (
      <div className="py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-2xl font-bold mb-4">No Treatments Selected</h1>
          <p className="text-muted-foreground mb-6">
            Please go back to the chart and select at least 2 treatments to compare.
          </p>
          <Button asChild>
            <Link to={`/charts/${chartSlug}`}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Chart
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  const StageButtons = ({ from, to }: { from: number; to: number }) => (
    <div className="flex gap-1 flex-wrap">
      {[1, 2, 3, 4, 5, 6].map((stage) => {
        const isActive = stage >= from && stage <= to;
        return (
          <div 
            key={stage}
            className="stage-indicator"
            style={{ 
              backgroundColor: isActive ? STAGE_COLORS[stage - 1] : 'transparent',
              border: isActive ? 'none' : '1px solid #ccc',
              color: isActive ? 'white' : '#999',
              width: 24,
              height: 24,
              fontSize: 11,
            }}
          >
            {stage}
          </div>
        );
      })}
    </div>
  );

  const comparisonRows = [
    { label: 'Best Stages', key: 'bestStages' },
    { label: 'Applicable Stages', key: 'applicableStages' },
    { label: 'What does it involve?', key: 'involves' },
    { label: 'Effort/Burden', key: 'effortBurden' },
    { label: 'Limitations & Side Effects', key: 'sideEffects' },
    { label: 'Benefits', key: 'benefits' },
    { label: 'Chance of Cure', key: 'chanceOfCure' },
    { label: 'Risks', key: 'risks' },
    { label: 'What if No Treatment?', key: 'noTreatment' },
    { label: 'Cost', key: 'cost' },
  ];

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
          <span className="text-muted-foreground">Comparison</span>
        </nav>

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button variant="outline" size="sm" asChild>
            <Link to={`/charts/${chartSlug}`}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Chart
            </Link>
          </Button>
          
          <h1 className="text-2xl font-bold text-primary">Treatment Comparison</h1>
          
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => window.print()}>
              <Printer className="h-4 w-4 mr-2" />
              Print
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
          </div>
        </div>

        {/* Comparison Table */}
        <div className="overflow-x-auto">
          <table className="comparison-table w-full">
            <thead>
              <tr>
                <th className="sticky-col"></th>
                {selectedTreatments.map(treatment => (
                  <th key={treatment.id} className="min-w-[200px]">
                    <Link 
                      to={`/charts/${chartSlug}/treatment/${treatment.slug}`}
                      className="hover:underline"
                    >
                      {treatment.name}
                    </Link>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {/* Best Stages */}
              <tr>
                <td className="sticky-col">Best Stages</td>
                {selectedTreatments.map(treatment => (
                  <td key={treatment.id}>
                    <StageButtons from={treatment.fromStage} to={treatment.toStage} />
                  </td>
                ))}
              </tr>

              {/* Applicable Stages */}
              <tr>
                <td className="sticky-col">Applicable Stages</td>
                {selectedTreatments.map(treatment => (
                  <td key={treatment.id}>
                    <StageButtons 
                      from={Math.max(1, treatment.fromStage - 1)} 
                      to={Math.min(6, treatment.toStage + 1)} 
                    />
                  </td>
                ))}
              </tr>

              {/* Other rows */}
              {['involves', 'effortBurden', 'sideEffects', 'benefits', 'chanceOfCure', 'risks', 'noTreatment', 'cost'].map(key => (
                <tr key={key}>
                  <td className="sticky-col">
                    {key === 'involves' && 'What does it involve?'}
                    {key === 'effortBurden' && 'Effort/Burden'}
                    {key === 'sideEffects' && 'Limitations & Side Effects'}
                    {key === 'benefits' && 'Benefits'}
                    {key === 'chanceOfCure' && 'Chance of Cure'}
                    {key === 'risks' && 'Risks'}
                    {key === 'noTreatment' && 'What if No Treatment?'}
                    {key === 'cost' && 'Cost'}
                  </td>
                  {selectedTreatments.map(treatment => {
                    const data = COMPARISON_DATA[treatment.slug] || getDefaultComparisonData(treatment);
                    return (
                      <td key={treatment.id}>
                        {data[key as keyof typeof data]}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Actions */}
        <div className="mt-8 flex justify-center gap-4">
          <Button variant="outline" onClick={() => {
            localStorage.removeItem('selectedCharts');
            navigate(`/charts/${chartSlug}`);
          }}>
            Clear Selection
          </Button>
          <Button asChild>
            <Link to={`/charts/${chartSlug}`}>
              Back to Chart
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
