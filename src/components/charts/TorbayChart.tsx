import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Printer, Download, Info, ChevronLeft, ChevronRight, Plus, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import '@/styles/chart.css';

// Stage colors for gradient backgrounds
const STAGE_COLORS = [
  '#73C3B4', // Stage 1 - Normal
  '#84B162', // Stage 2 - Start of Disease
  '#F6A92D', // Stage 3 - Early Stage
  '#EC822A', // Stage 4 - Mid Stage
  '#D34232', // Stage 5 - Late Stage
  '#713954', // Stage 6 - Very Late
];

const STAGE_NAMES = [
  'Normal',
  'Start of Disease',
  'Early Stage',
  'Mid Stage',
  'Late Stage',
  'Very Late',
];

export interface Treatment {
  id: string;
  name: string;
  slug: string;
  fromStage: number; // 1-6
  toStage: number;   // 1-6
}

export interface TreatmentCategory {
  name: string;
  icon?: string;
  treatments: Treatment[];
}

export interface ChartData {
  slug: string;
  name: string;
  description?: string;
  stages: string[];
  categories: {
    diagnosisAndStaging: TreatmentCategory[];
    selfHelp: TreatmentCategory[];
    mainlineTreatment: TreatmentCategory[];
    alternative: TreatmentCategory[];
    observationNoTreatment: TreatmentCategory[];
  };
}

interface TorbayChartProps {
  data: ChartData;
  onTreatmentClick?: (treatment: Treatment) => void;
}

export function TorbayChart({ data, onTreatmentClick }: TorbayChartProps) {
  const [selectedTreatments, setSelectedTreatments] = useState<string[]>([]);
  const [mobileNavIndex, setMobileNavIndex] = useState(0);
  
  // Refs for scroll navigation
  const diagnosisStagingRef = useRef<HTMLDivElement>(null);
  const selfHelpRef = useRef<HTMLDivElement>(null);
  const mainlineTreatmentRef = useRef<HTMLDivElement>(null);
  const alternativeRef = useRef<HTMLDivElement>(null);
  const observationRef = useRef<HTMLDivElement>(null);

  const handleToggleTreatment = (treatmentId: string, checked: boolean) => {
    if (checked && selectedTreatments.length >= 3) {
      toast({
        title: "Maximum reached",
        description: "A maximum of 3 treatments may be compared.",
        variant: "destructive",
      });
      return;
    }
    
    setSelectedTreatments(prev => 
      checked 
        ? [...prev, treatmentId]
        : prev.filter(id => id !== treatmentId)
    );
  };

  const clearSelection = () => {
    setSelectedTreatments([]);
  };

  const scrollToSection = (ref: React.RefObject<HTMLDivElement>) => {
    ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    toast({
      title: "Downloading PDF",
      description: "Your infographic is being prepared for download.",
    });
  };

  // Get gradient colors for a treatment bar
  const getTreatmentGradient = (fromStage: number, toStage: number) => {
    const colors = STAGE_COLORS.slice(fromStage - 1, toStage);
    if (colors.length === 1) {
      colors.push(colors[0]);
    }
    return `linear-gradient(to right, ${colors.join(', ')})`;
  };

  // Calculate column span based on stages
  const getColumnSpan = (fromStage: number, toStage: number) => {
    return toStage - fromStage + 1;
  };

  // Render a treatment bar
  const renderTreatmentBar = (treatment: Treatment) => {
    const colSpan = getColumnSpan(treatment.fromStage, treatment.toStage);
    const colStart = treatment.fromStage;
    const isSelected = selectedTreatments.includes(treatment.id);

    return (
      <div 
        key={treatment.id}
        className="w-full py-1 px-2"
        style={{ 
          display: 'flex',
          marginLeft: `${(colStart - 1) * 16.666}%`,
          width: `${colSpan * 16.666}%`,
        }}
      >
        <div 
          className="treatment-bar w-full"
          style={{ backgroundImage: getTreatmentGradient(treatment.fromStage, treatment.toStage) }}
        >
          <div className="treatment-label">
            <Switch
              checked={isSelected}
              onCheckedChange={(checked) => handleToggleTreatment(treatment.id, checked)}
              className="scale-75"
            />
            <span 
              className="cursor-pointer hover:text-primary"
              onClick={() => onTreatmentClick?.(treatment)}
            >
              {treatment.name}
            </span>
            <Info className="h-3 w-3 text-[#0D61B6]" />
          </div>
        </div>
      </div>
    );
  };

  // Render a category section
  const renderCategorySection = (category: TreatmentCategory, showLegend = true) => (
    <div className="study-row" key={category.name}>
      {showLegend && (
        <div className="col-legend flex items-center justify-center">
          <div className="legend-icon">
            {category.icon ? (
              <img src={category.icon} alt={category.name} className="w-6 h-6" />
            ) : (
              <div className="w-6 h-6 rounded bg-white/20" />
            )}
          </div>
        </div>
      )}
      <div className={cn("col-chart py-2", !showLegend && "w-full pl-4")}>
        {category.treatments.map(treatment => renderTreatmentBar(treatment))}
      </div>
    </div>
  );

  // Render stage headers
  const renderStageHeaders = () => (
    <div className="flex">
      <div className="col-legend" />
      <div className="col-chart flex">
        {(data.stages || STAGE_NAMES).map((stage, index) => (
          <div 
            key={stage}
            className={`stage-column stage-column-${index + 1} flex-1`}
          >
            {stage}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="chart-container">
      {/* Chart Header */}
      <div className="chart-header-bar rounded-t-lg">
        {/* Breadcrumb */}
        <nav className="chart-breadcrumb mb-2">
          <Link to="/" className="hover:underline">Home</Link>
          <span className="mx-2">›</span>
          <Link to="/charts" className="hover:underline">Conditions</Link>
          <span className="mx-2">›</span>
          <span className="text-muted-foreground">{data.name}</span>
        </nav>

        {/* Title and Actions */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link to={`/charts/${data.slug}`}>
                <span className="sr-only">Chart view</span>
                📊
              </Link>
            </Button>
            <Button variant="secondary" size="sm">
              📝
            </Button>
            <Button variant="secondary" size="sm">
              💊
            </Button>
          </div>
          
          <h1 className="chart-title flex-1 text-center">{data.name}</h1>
          
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handlePrint}>
              <Printer className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={handleDownload}>
              <Download className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm">
              <Info className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Legend Navigation */}
        <div className="legend-nav-buttons mt-4">
          <button className="legend-nav-btn" onClick={() => scrollToSection(diagnosisStagingRef)}>
            <Badge variant="outline" className="px-3 py-1">🔬 Diagnosis & Staging</Badge>
          </button>
          <button className="legend-nav-btn" onClick={() => scrollToSection(selfHelpRef)}>
            <Badge variant="outline" className="px-3 py-1">🏠 Self Help</Badge>
          </button>
          <button className="legend-nav-btn" onClick={() => scrollToSection(mainlineTreatmentRef)}>
            <Badge variant="outline" className="px-3 py-1">💊 Mainline Treatment</Badge>
          </button>
          <button className="legend-nav-btn" onClick={() => scrollToSection(alternativeRef)}>
            <Badge variant="outline" className="px-3 py-1">🌿 Alternative</Badge>
          </button>
          <button className="legend-nav-btn" onClick={() => scrollToSection(observationRef)}>
            <Badge variant="outline" className="px-3 py-1">👁️ Observation</Badge>
          </button>
        </div>
      </div>

      {/* Comparison Panel */}
      {selectedTreatments.length >= 2 && (
        <div className="fixed bottom-4 right-4 z-50 bg-card border rounded-lg shadow-lg p-4">
          <h4 className="font-semibold mb-2">{selectedTreatments.length} selected</h4>
          <div className="flex gap-2">
            <Button size="sm" variant="default">Compare</Button>
            <Button size="sm" variant="secondary" onClick={clearSelection}>Clear</Button>
          </div>
        </div>
      )}

      {/* Diagnosis and Staging Section */}
      <div ref={diagnosisStagingRef} className="mt-6">
        <h4 className="chart-section-header">Diagnosis And Staging</h4>
        <div className="chartarea">
          {renderStageHeaders()}
          
          {/* Pain Graph */}
          <div className="study-row">
            <div className="col-legend flex items-center justify-center">
              <span className="text-xs font-medium">Pain</span>
            </div>
            <div className="col-chart p-2">
              <div className="pain-graph" />
            </div>
          </div>

          {/* Mobility */}
          <div className="study-row">
            <div className="col-legend flex items-center justify-center">
              <span className="text-xs font-medium">Mobility</span>
            </div>
            <div className="col-chart">
              <div className="mobility-icons-row">
                {[1, 2, 3, 4, 5, 6].map((stage) => (
                  <div key={stage} className="mobility-icon">
                    <div 
                      className="w-16 h-16 rounded-full flex items-center justify-center text-2xl"
                      style={{ backgroundColor: STAGE_COLORS[stage - 1], color: 'white' }}
                    >
                      🚶
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Daily Activities */}
          <div className="study-row">
            <div className="col-legend flex items-center justify-center">
              <span className="text-xs font-medium">Daily Activities</span>
            </div>
            <div className="col-chart">
              <div className="mobility-icons-row">
                {[1, 2, 3, 4, 5, 6].map((stage) => (
                  <div key={stage} className="mobility-icon">
                    <div 
                      className="w-16 h-16 rounded-full flex items-center justify-center text-2xl"
                      style={{ backgroundColor: STAGE_COLORS[stage - 1], color: 'white' }}
                    >
                      🏃
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Exam Criteria */}
          <div className="study-row">
            <div className="col-legend flex items-center justify-center">
              <span className="text-xs font-medium">Exam</span>
            </div>
            <div className="col-chart">
              <div className="exam-criteria">
                {[1, 2, 3, 4, 5, 6].map((stage) => (
                  <div 
                    key={stage} 
                    className="exam-criteria-cell"
                    style={{ color: STAGE_COLORS[stage - 1] }}
                  >
                    {stage === 1 && (
                      <div>
                        <p>Leg Shortening →</p>
                        <p>Stiffness</p>
                        <p>X-Ray</p>
                      </div>
                    )}
                    {stage === 2 && <div><p>-</p><p>-</p><p>Normal</p></div>}
                    {stage === 3 && <div><p>+</p><p>+</p><p>Mild OA</p></div>}
                    {stage === 4 && <div><p>+</p><p>++</p><p>Mod OA</p></div>}
                    {stage === 5 && <div><p>++</p><p>++</p><p>Severe OA</p></div>}
                    {stage === 6 && <div><p>+++</p><p>+++</p><p>End Stage</p></div>}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Diagnosis Categories */}
          {data.categories.diagnosisAndStaging.map(category => 
            renderCategorySection(category)
          )}
        </div>
      </div>

      {/* Self Help Section */}
      <div ref={selfHelpRef}>
        <h4 className="chart-section-header">Self Help</h4>
        <div className="chartarea">
          {renderStageHeaders()}
          {data.categories.selfHelp.map(category => 
            renderCategorySection(category)
          )}
        </div>
      </div>

      {/* Mainline Treatment Section */}
      <div ref={mainlineTreatmentRef}>
        <h4 className="chart-section-header">Mainline Treatment Options</h4>
        <div className="chartarea">
          {renderStageHeaders()}
          {data.categories.mainlineTreatment.map(category => 
            renderCategorySection(category)
          )}
        </div>
      </div>

      {/* Alternative Section */}
      <div ref={alternativeRef}>
        <h4 className="chart-section-header">Alternative</h4>
        <div className="chartarea">
          {renderStageHeaders()}
          {data.categories.alternative.map(category => 
            renderCategorySection(category)
          )}
        </div>
      </div>

      {/* Observation / No Treatment Section */}
      <div ref={observationRef}>
        <h4 className="chart-section-header">Observation / No Treatment</h4>
        <div className="chartarea">
          {renderStageHeaders()}
          {data.categories.observationNoTreatment.map(category => 
            renderCategorySection(category)
          )}
        </div>
      </div>

      {/* Disclaimer */}
      <div className="torbay-alert mt-6">
        <p>
          No treatment is guaranteed to work, sometimes diseases will still continue to deteriorate. 
          Alternative treatment options may not be available in all NHS hospitals.
        </p>
      </div>
    </div>
  );
}
