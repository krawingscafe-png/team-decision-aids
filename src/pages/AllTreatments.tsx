import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { HIP_KNEE_CHART_DATA, KNEE_ARTHRITIS_CHART_DATA, HIP_ARTHRITIS_CHART_DATA } from '@/data/hipKneeChartData';
import { Treatment, ChartData } from '@/components/charts/TorbayChart';
import '@/styles/chart.css';

const STAGE_COLORS = [
  '#73C3B4', '#84B162', '#F6A92D', '#EC822A', '#D34232', '#713954',
];

// Map chart slugs to data
const CHART_DATA_MAP: Record<string, ChartData> = {
  'hip-knee-arthritis': HIP_KNEE_CHART_DATA,
  'knee-arthritis': KNEE_ARTHRITIS_CHART_DATA,
  'hip-arthritis': HIP_ARTHRITIS_CHART_DATA,
};

// Mock treatment data for table view
const TREATMENT_TABLE_DATA: Record<string, {
  bestStages: string;
  applicableStages: string;
  involves: string;
  effort: string;
  sideEffects: string;
  benefits: string;
  chanceOfCure: string;
  risks: string;
  noTreatment: string;
  cost: string;
}> = {
  'paracetamol': {
    bestStages: '2-3',
    applicableStages: '2-4',
    involves: 'Take tablets as directed',
    effort: 'Very low',
    sideEffects: 'Rare when used correctly',
    benefits: 'Pain relief',
    chanceOfCure: 'Symptom management',
    risks: 'Liver damage if overdosed',
    noTreatment: 'Pain continues',
    cost: '£2-5/month',
  },
};

const getDefaultData = () => ({
  bestStages: 'Varies',
  applicableStages: 'Varies',
  involves: 'Consult healthcare provider',
  effort: 'Varies',
  sideEffects: 'Consult provider',
  benefits: 'May help symptoms',
  chanceOfCure: 'Varies',
  risks: 'Consult provider',
  noTreatment: 'May progress',
  cost: 'Varies',
});

export default function AllTreatments() {
  const { chartSlug } = useParams<{ chartSlug: string }>();
  
  const chartData = chartSlug ? CHART_DATA_MAP[chartSlug] : null;
  
  if (!chartData) {
    return (
      <div className="py-12 text-center">
        <p className="text-destructive mb-4">Chart not found</p>
        <Link to="/charts" className="text-primary hover:underline">← Back to charts</Link>
      </div>
    );
  }

  // Collect all treatments
  const allTreatments: Treatment[] = [
    ...chartData.categories.diagnosisAndStaging.flatMap(c => c.treatments),
    ...chartData.categories.selfHelp.flatMap(c => c.treatments),
    ...chartData.categories.mainlineTreatment.flatMap(c => c.treatments),
    ...chartData.categories.alternative.flatMap(c => c.treatments),
    ...chartData.categories.observationNoTreatment.flatMap(c => c.treatments),
  ];

  const StageButtons = ({ from, to }: { from: number; to: number }) => (
    <div className="flex gap-0.5">
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
              width: 20,
              height: 20,
              fontSize: 10,
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
          <span className="text-muted-foreground">All Treatments</span>
        </nav>

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button variant="outline" size="sm" asChild>
            <Link to={`/charts/${chartSlug}`}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Chart
            </Link>
          </Button>
          
          <h1 className="text-2xl font-bold text-primary">{chartData.name} - All Treatments</h1>
          
          <div className="w-32" />
        </div>

        {/* Treatments Table */}
        <div className="overflow-x-auto">
          <table className="comparison-table w-full text-sm">
            <thead>
              <tr>
                <th className="sticky-col"></th>
                {allTreatments.map(treatment => (
                  <th key={treatment.id} className="min-w-[120px] text-xs">
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
              <tr>
                <td className="sticky-col">Best Stages</td>
                {allTreatments.map(treatment => (
                  <td key={treatment.id}>
                    <StageButtons from={treatment.fromStage} to={treatment.toStage} />
                  </td>
                ))}
              </tr>
              <tr>
                <td className="sticky-col">Applicable Stages</td>
                {allTreatments.map(treatment => (
                  <td key={treatment.id}>
                    <StageButtons 
                      from={Math.max(1, treatment.fromStage - 1)} 
                      to={Math.min(6, treatment.toStage + 1)} 
                    />
                  </td>
                ))}
              </tr>
              {['involves', 'effort', 'sideEffects', 'benefits', 'chanceOfCure', 'risks', 'noTreatment', 'cost'].map(key => (
                <tr key={key}>
                  <td className="sticky-col">
                    {key === 'involves' && 'What stage?'}
                    {key === 'effort' && 'Effort/burden'}
                    {key === 'sideEffects' && 'Side effects'}
                    {key === 'benefits' && 'Benefits'}
                    {key === 'chanceOfCure' && 'Chances of cure'}
                    {key === 'risks' && 'Risks'}
                    {key === 'noTreatment' && 'No treatment?'}
                    {key === 'cost' && 'Cost'}
                  </td>
                  {allTreatments.map(treatment => {
                    const data = TREATMENT_TABLE_DATA[treatment.slug] || getDefaultData();
                    return (
                      <td key={treatment.id} className="text-xs">
                        {data[key as keyof typeof data]}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
