import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Printer, Download, Home, Building2, Syringe, Bed } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
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

// Mock treatment details - in production, this would come from an API
const TREATMENT_DETAILS: Record<string, {
  whatIsIt: string;
  howAndWhere: { home: boolean; hospital: boolean; daycase: boolean; inpatient: boolean; localAnaesthetic: boolean; generalAnaesthetic: boolean };
  bestFromStage: number;
  bestToStage: number;
  applicableFromStage: number;
  applicableToStage: number;
  benefits: string[];
  risks: string[];
  effortBurden: string;
  sideEffects: string;
  chanceOfCure: string;
  noTreatmentConsequence: string;
  cost: string;
}> = {
  'paracetamol': {
    whatIsIt: 'Paracetamol is a common painkiller used to treat aches and pain. It can be used to reduce high temperature. It is available combined with other painkillers and anti-sickness medicines. It is also an ingredient in a wide range of cold and flu remedies.',
    howAndWhere: { home: true, hospital: false, daycase: false, inpatient: false, localAnaesthetic: false, generalAnaesthetic: false },
    bestFromStage: 2,
    bestToStage: 3,
    applicableFromStage: 2,
    applicableToStage: 4,
    benefits: ['Easy to take', 'Few side effects', 'Can be combined with other treatments', 'Available over the counter'],
    risks: ['Liver damage if overdosed', 'May not be effective for severe pain'],
    effortBurden: 'Very low - take tablets as needed',
    sideEffects: 'Rare when used correctly. Can cause liver damage if taken in excess.',
    chanceOfCure: 'Manages symptoms only, does not cure the underlying condition',
    noTreatmentConsequence: 'Pain may remain uncontrolled affecting quality of life',
    cost: '£2-5 per month',
  },
  'physiotherapy': {
    whatIsIt: 'Physiotherapy involves exercises and manual therapy to improve movement, reduce pain and restore function. A physiotherapist will assess your condition and develop a treatment plan.',
    howAndWhere: { home: true, hospital: true, daycase: false, inpatient: false, localAnaesthetic: false, generalAnaesthetic: false },
    bestFromStage: 2,
    bestToStage: 4,
    applicableFromStage: 2,
    applicableToStage: 5,
    benefits: ['Improves strength and flexibility', 'Reduces pain', 'Delays need for surgery', 'Teaches self-management skills'],
    risks: ['Temporary soreness after sessions', 'Requires commitment to exercise program'],
    effortBurden: 'Medium - requires regular exercise and attendance at sessions',
    sideEffects: 'Mild muscle soreness is common initially',
    chanceOfCure: 'Can significantly improve function and delay disease progression',
    noTreatmentConsequence: 'Muscles may weaken, joint stiffness may increase',
    cost: 'NHS: Free, Private: £40-80 per session',
  },
  'total-replacement': {
    whatIsIt: 'Total joint replacement involves removing the damaged joint surfaces and replacing them with artificial components made of metal and plastic.',
    howAndWhere: { home: false, hospital: true, daycase: false, inpatient: true, localAnaesthetic: false, generalAnaesthetic: true },
    bestFromStage: 5,
    bestToStage: 6,
    applicableFromStage: 5,
    applicableToStage: 6,
    benefits: ['Significant pain relief', 'Improved mobility', 'Better quality of life', 'Can last 15-25 years'],
    risks: ['Infection', 'Blood clots', 'Dislocation', 'Nerve damage', 'Need for revision surgery'],
    effortBurden: 'High - major surgery with 3-6 month recovery',
    sideEffects: 'Post-operative pain, swelling, limited mobility during recovery',
    chanceOfCure: 'Very effective for pain relief, 90%+ satisfaction rate',
    noTreatmentConsequence: 'Progressive deterioration, severe pain, loss of mobility',
    cost: 'NHS: Free, Private: £10,000-15,000',
  },
};

// Get default treatment details
const getDefaultDetails = () => ({
  whatIsIt: 'This treatment option is used to manage symptoms and slow disease progression.',
  howAndWhere: { home: true, hospital: false, daycase: false, inpatient: false, localAnaesthetic: false, generalAnaesthetic: false },
  bestFromStage: 2,
  bestToStage: 4,
  applicableFromStage: 1,
  applicableToStage: 5,
  benefits: ['May help manage symptoms', 'Part of a comprehensive treatment plan'],
  risks: ['Individual results may vary', 'Consult your healthcare provider'],
  effortBurden: 'Varies depending on treatment',
  sideEffects: 'Consult your healthcare provider for specific information',
  chanceOfCure: 'Helps manage symptoms',
  noTreatmentConsequence: 'Symptoms may progress',
  cost: 'Varies',
});

export default function TreatmentDetail() {
  const { chartSlug, treatmentSlug } = useParams<{ chartSlug: string; treatmentSlug: string }>();
  const navigate = useNavigate();
  
  const chartData = chartSlug ? CHART_DATA_MAP[chartSlug] : null;
  
  if (!chartData || !treatmentSlug) {
    return (
      <div className="py-12 text-center">
        <p className="text-destructive mb-4">Treatment not found</p>
        <Link to="/charts" className="text-primary hover:underline">← Back to charts</Link>
      </div>
    );
  }

  // Find treatment in chart data
  const allTreatments: Treatment[] = [
    ...chartData.categories.diagnosisAndStaging.flatMap(c => c.treatments),
    ...chartData.categories.selfHelp.flatMap(c => c.treatments),
    ...chartData.categories.mainlineTreatment.flatMap(c => c.treatments),
    ...chartData.categories.alternative.flatMap(c => c.treatments),
    ...chartData.categories.observationNoTreatment.flatMap(c => c.treatments),
  ];

  const currentIndex = allTreatments.findIndex(t => t.slug === treatmentSlug);
  const treatment = allTreatments[currentIndex];
  const prevTreatment = currentIndex > 0 ? allTreatments[currentIndex - 1] : null;
  const nextTreatment = currentIndex < allTreatments.length - 1 ? allTreatments[currentIndex + 1] : null;

  if (!treatment) {
    return (
      <div className="py-12 text-center">
        <p className="text-destructive mb-4">Treatment not found</p>
        <Link to={`/charts/${chartSlug}`} className="text-primary hover:underline">← Back to chart</Link>
      </div>
    );
  }

  const details = TREATMENT_DETAILS[treatmentSlug] || getDefaultDetails();

  const StageIndicator = ({ from, to, type }: { from: number; to: number; type: 'best' | 'applicable' }) => (
    <div className="flex gap-1 flex-wrap">
      {[1, 2, 3, 4, 5, 6].map((stage) => {
        const isActive = stage >= from && stage <= to;
        return (
          <Tooltip key={stage}>
            <TooltipTrigger>
              <div 
                className="stage-indicator"
                style={{ 
                  backgroundColor: isActive ? STAGE_COLORS[stage - 1] : undefined,
                  opacity: isActive ? 1 : 0.3,
                }}
              >
                {stage}
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>{STAGE_NAMES[stage - 1]}</p>
              <p className="text-xs text-muted-foreground">
                {isActive ? `${type === 'best' ? 'Best' : 'Applicable'} at this stage` : 'Not recommended'}
              </p>
            </TooltipContent>
          </Tooltip>
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
          <span className="text-muted-foreground">Treatment Detail</span>
        </nav>

        {/* Header with navigation */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1">
            {prevTreatment && (
              <Button variant="outline" size="sm" asChild>
                <Link to={`/charts/${chartSlug}/treatment/${prevTreatment.slug}`}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  {prevTreatment.name}
                </Link>
              </Button>
            )}
          </div>
          
          <h1 className="text-2xl font-bold text-primary text-center flex-1">{treatment.name}</h1>
          
          <div className="flex-1 text-right">
            {nextTreatment && (
              <Button variant="outline" size="sm" asChild>
                <Link to={`/charts/${chartSlug}/treatment/${nextTreatment.slug}`}>
                  {nextTreatment.name}
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
            )}
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex justify-end gap-2 mb-6">
          <Button variant="outline" size="sm" onClick={() => window.print()}>
            <Printer className="h-4 w-4 mr-2" />
            Print
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
        </div>

        {/* Summary Section */}
        <div className="grid gap-4 md:grid-cols-3 mb-6">
          {/* What is it */}
          <Card className="treatment-detail-card card-what-is-it">
            <CardHeader>
              <CardTitle>What is it?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm">{details.whatIsIt}</p>
            </CardContent>
          </Card>

          {/* How and Where */}
          <Card className="treatment-detail-card card-how-where">
            <CardHeader>
              <CardTitle>How and Where?</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3">
                <Tooltip>
                  <TooltipTrigger>
                    <Home className={`h-6 w-6 ${details.howAndWhere.home ? 'text-primary' : 'text-muted-foreground/30'}`} />
                  </TooltipTrigger>
                  <TooltipContent>Home/Self-help</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger>
                    <Building2 className={`h-6 w-6 ${details.howAndWhere.hospital ? 'text-primary' : 'text-muted-foreground/30'}`} />
                  </TooltipTrigger>
                  <TooltipContent>Hospital</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger>
                    <Syringe className={`h-6 w-6 ${details.howAndWhere.daycase ? 'text-primary' : 'text-muted-foreground/30'}`} />
                  </TooltipTrigger>
                  <TooltipContent>Daycase</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger>
                    <Bed className={`h-6 w-6 ${details.howAndWhere.inpatient ? 'text-primary' : 'text-muted-foreground/30'}`} />
                  </TooltipTrigger>
                  <TooltipContent>Inpatient</TooltipContent>
                </Tooltip>
                <span className={`font-bold ${details.howAndWhere.localAnaesthetic ? 'text-primary' : 'text-muted-foreground/30'}`}>LA</span>
                <span className={`font-bold ${details.howAndWhere.generalAnaesthetic ? 'text-primary' : 'text-muted-foreground/30'}`}>GA</span>
              </div>
            </CardContent>
          </Card>

          {/* Stages */}
          <div className="space-y-4">
            <Card className="treatment-detail-card card-applicable-stage">
              <CardHeader className="py-3">
                <CardTitle className="text-sm">Applicable Stages</CardTitle>
              </CardHeader>
              <CardContent className="py-2">
                <StageIndicator from={details.applicableFromStage} to={details.applicableToStage} type="applicable" />
              </CardContent>
            </Card>
            <Card className="treatment-detail-card card-best-stage">
              <CardHeader className="py-3">
                <CardTitle className="text-sm">Best Stages</CardTitle>
              </CardHeader>
              <CardContent className="py-2">
                <StageIndicator from={details.bestFromStage} to={details.bestToStage} type="best" />
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card className="treatment-detail-card card-benefits">
            <CardHeader>
              <CardTitle>Benefits</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside space-y-1 text-sm">
                {details.benefits.map((benefit, i) => (
                  <li key={i}>{benefit}</li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="treatment-detail-card card-risks">
            <CardHeader>
              <CardTitle>Risks</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside space-y-1 text-sm">
                {details.risks.map((risk, i) => (
                  <li key={i}>{risk}</li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="treatment-detail-card card-effort">
            <CardHeader>
              <CardTitle>Effort/Burden</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm">{details.effortBurden}</p>
            </CardContent>
          </Card>

          <Card className="treatment-detail-card card-cost">
            <CardHeader>
              <CardTitle>Cost</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm">{details.cost}</p>
            </CardContent>
          </Card>
        </div>

        {/* Additional Info */}
        <div className="grid gap-4 md:grid-cols-2 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Side Effects</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm">{details.sideEffects}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Chance of Cure</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm">{details.chanceOfCure}</p>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-4">
          <CardHeader>
            <CardTitle>What if No Treatment?</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">{details.noTreatmentConsequence}</p>
          </CardContent>
        </Card>

        {/* Back to chart */}
        <div className="mt-8 text-center">
          <Button asChild>
            <Link to={`/charts/${chartSlug}`}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to {chartData.name} Chart
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
