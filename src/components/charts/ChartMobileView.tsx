import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Printer, Download, Info, BarChart3, Table2, Pill } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { toast } from '@/hooks/use-toast';
import { ChartData, Treatment } from './TorbayChart';
import '@/styles/chart.css';

const STAGE_COLORS = [
  '#73C3B4', '#84B162', '#F6A92D', '#EC822A', '#D34232', '#713954',
];

const STAGE_NAMES = [
  'Normal', 'Start of Disease', 'Early Stage', 'Mid Stage', 'Late Stage', 'Very Late',
];

interface ChartMobileViewProps {
  data: ChartData;
  onTreatmentClick?: (treatment: Treatment) => void;
}

export function ChartMobileView({ data, onTreatmentClick }: ChartMobileViewProps) {
  const navigate = useNavigate();
  const [navIndex, setNavIndex] = useState(0);
  const [selectedTreatments, setSelectedTreatments] = useState<string[]>([]);

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
      checked ? [...prev, treatmentId] : prev.filter(id => id !== treatmentId)
    );
  };

  const clearSelection = () => setSelectedTreatments([]);

  const handleCompare = () => {
    localStorage.setItem('selectedCharts', selectedTreatments.join(','));
    navigate(`/charts/${data.slug}/compare`);
  };

  const handleTreatmentClick = (treatment: Treatment) => {
    navigate(`/charts/${data.slug}/treatment/${treatment.slug}`);
  };

  // Get treatments that include the current stage
  const getTreatmentsForStage = (treatments: Treatment[]) => {
    return treatments.filter(t => navIndex + 1 >= t.fromStage && navIndex + 1 <= t.toStage);
  };

  // Render mobile treatment bar
  const renderMobileTreatmentBar = (treatment: Treatment) => {
    const isSelected = selectedTreatments.includes(treatment.id);
    
    // Get gradient colors for the stage range
    const colors = STAGE_COLORS.slice(treatment.fromStage - 1, treatment.toStage);
    if (colors.length === 1) colors.push(colors[0]);
    const gradient = `linear-gradient(to right, ${colors.join(', ')})`;

    return (
      <div 
        key={treatment.id}
        className="mobile-treatment-item mb-2 rounded-lg overflow-hidden"
        style={{ backgroundImage: gradient }}
      >
        <div className="mobile-treatment-content bg-card/95 m-[2px] rounded-lg p-3">
          <div className="treatment-name-mobile text-sm font-semibold mb-2 truncate">
            {treatment.name}
          </div>
          <div 
            className="treatment-mini-bar h-1 rounded-full mb-2"
            style={{ backgroundImage: gradient }}
          />
          <div className="flex items-center justify-between">
            <Switch
              checked={isSelected}
              onCheckedChange={(checked) => handleToggleTreatment(treatment.id, checked)}
              className="scale-75"
            />
            <button
              onClick={() => handleTreatmentClick(treatment)}
              className="text-primary hover:text-primary/80"
              aria-label={`View ${treatment.name} details`}
            >
              <Info className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Render category section
  const renderMobileCategory = (title: string, categories: { name: string; treatments: Treatment[] }[]) => {
    const allTreatments = categories.flatMap(c => getTreatmentsForStage(c.treatments));
    if (allTreatments.length === 0) return null;

    return (
      <div className="mobile-category-section mb-4">
        <h4 className="text-sm font-bold text-primary mb-2 uppercase tracking-wide">{title}</h4>
        <div className="mobile-treatments-grid grid gap-2">
          {categories.map(category => 
            getTreatmentsForStage(category.treatments).map(treatment => 
              renderMobileTreatmentBar(treatment)
            )
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="chart-mobile-container">
      {/* Mobile Header */}
      <div className="chart-mobile-header bg-card border-b border-border">
        {/* Breadcrumb */}
        <nav className="chart-breadcrumb text-xs px-3 py-2">
          <Link to="/" className="hover:underline">Home</Link>
          <span className="mx-1">›</span>
          <Link to="/charts" className="hover:underline">Conditions</Link>
          <span className="mx-1">›</span>
          <span className="text-muted-foreground truncate">{data.name}</span>
        </nav>
        
        {/* View Toggle & Actions */}
        <div className="flex items-center justify-between px-3 py-2 border-t border-border">
          <div className="flex gap-1">
            <Button variant="default" size="sm" asChild>
              <Link to={`/charts/${data.slug}`}>
                <BarChart3 className="h-4 w-4" />
              </Link>
            </Button>
            <Button variant="secondary" size="sm" asChild>
              <Link to={`/charts/${data.slug}/table`}>
                <Table2 className="h-4 w-4" />
              </Link>
            </Button>
            <Button variant="secondary" size="sm" asChild>
              <Link to={`/charts/${data.slug}/treatments`}>
                <Pill className="h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="flex gap-1">
            <Button variant="outline" size="sm" onClick={() => window.print()}>
              <Printer className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Stage Navigation */}
        <div className="flex items-center justify-between px-3 py-3 bg-primary/5">
          <Button
            variant="outline"
            size="icon"
            disabled={navIndex === 0}
            onClick={() => setNavIndex(prev => Math.max(0, prev - 1))}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <div className="text-center flex-1">
            <h1 className="font-bold text-primary text-lg truncate px-2">{data.name}</h1>
          </div>
          
          <Button
            variant="outline"
            size="icon"
            disabled={navIndex === 5}
            onClick={() => setNavIndex(prev => Math.min(5, prev + 1))}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Current Stage Indicator */}
        <div 
          className="py-3 px-4 text-center font-bold text-white"
          style={{ backgroundColor: STAGE_COLORS[navIndex] }}
        >
          {STAGE_NAMES[navIndex]}
        </div>
      </div>

      {/* Mobile Chart Content */}
      <div className="chart-mobile-content p-3">
        {/* Visual Indicators */}
        <div className="mobile-visual-section bg-card rounded-lg border border-border mb-4 overflow-hidden">
          {/* Pain */}
          <div className="flex items-stretch border-b border-border">
            <div className="mobile-legend-col w-16 flex-shrink-0 bg-primary flex items-center justify-center p-2">
              <span className="mobile-legend-text text-white text-xs font-bold writing-vertical">Pain</span>
            </div>
            <div className="flex-1 p-3 flex items-center justify-center">
              <div 
                className="w-full h-24 rounded-lg"
                style={{ 
                  backgroundImage: `linear-gradient(to bottom, ${STAGE_COLORS[navIndex]}, transparent)`,
                  opacity: 0.3 + (navIndex * 0.14)
                }}
              />
            </div>
          </div>

          {/* Mobility */}
          <div className="flex items-stretch border-b border-border">
            <div className="mobile-legend-col w-16 flex-shrink-0 bg-primary flex items-center justify-center p-2">
              <span className="mobile-legend-text text-white text-xs font-bold writing-vertical">Mobility</span>
            </div>
            <div className="flex-1 p-4 flex items-center justify-center">
              <div 
                className="w-20 h-20 rounded-full flex items-center justify-center text-3xl"
                style={{ backgroundColor: STAGE_COLORS[navIndex], color: 'white' }}
              >
                🚶
              </div>
            </div>
          </div>

          {/* Daily Activities */}
          <div className="flex items-stretch border-b border-border">
            <div className="mobile-legend-col w-16 flex-shrink-0 bg-primary flex items-center justify-center p-2">
              <span className="mobile-legend-text text-white text-xs font-bold writing-vertical">Daily</span>
            </div>
            <div className="flex-1 p-4 flex items-center justify-center">
              <div 
                className="w-20 h-20 rounded-full flex items-center justify-center text-3xl"
                style={{ backgroundColor: STAGE_COLORS[navIndex], color: 'white' }}
              >
                🏃
              </div>
            </div>
          </div>

          {/* Exam */}
          <div className="flex items-stretch">
            <div className="mobile-legend-col w-16 flex-shrink-0 bg-primary flex items-center justify-center p-2">
              <span className="mobile-legend-text text-white text-xs font-bold writing-vertical">Exam</span>
            </div>
            <div className="flex-1 p-4 flex items-center justify-center text-center" style={{ color: STAGE_COLORS[navIndex] }}>
              {navIndex === 0 && <div><p className="font-bold">Leg →</p><p>Stiff</p><p>X-Ray</p></div>}
              {navIndex === 1 && <div><p>-</p><p>-</p><p className="font-bold">Normal</p></div>}
              {navIndex === 2 && <div><p>+</p><p>+</p><p className="font-bold">Mild</p></div>}
              {navIndex === 3 && <div><p>+</p><p>++</p><p className="font-bold">Moderate</p></div>}
              {navIndex === 4 && <div><p>++</p><p>++</p><p className="font-bold">Severe</p></div>}
              {navIndex === 5 && <div><p>+++</p><p>+++</p><p className="font-bold">End Stage</p></div>}
            </div>
          </div>
        </div>

        {/* Treatment Categories */}
        {renderMobileCategory('Diagnosis & Staging', data.categories.diagnosisAndStaging)}
        {renderMobileCategory('Self Help', data.categories.selfHelp)}
        {renderMobileCategory('Mainline Treatment', data.categories.mainlineTreatment)}
        {renderMobileCategory('Alternative', data.categories.alternative)}
        {renderMobileCategory('Observation', data.categories.observationNoTreatment)}
      </div>

      {/* Comparison Panel */}
      {selectedTreatments.length >= 2 && (
        <div className="fixed bottom-4 left-4 right-4 z-50 bg-card border rounded-lg shadow-lg p-4">
          <div className="flex items-center justify-between">
            <span className="font-semibold">{selectedTreatments.length} selected</span>
            <div className="flex gap-2">
              <Button size="sm" variant="default" onClick={handleCompare}>Compare</Button>
              <Button size="sm" variant="secondary" onClick={clearSelection}>Clear</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
