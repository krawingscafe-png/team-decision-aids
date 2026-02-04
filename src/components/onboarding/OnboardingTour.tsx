import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { X, ArrowRight, ArrowLeft, Check, BarChart3, Search, Star, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TourStep {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  target?: string;
}

const tourSteps: TourStep[] = [
  {
    id: 'welcome',
    title: 'Welcome to Torbay Charts!',
    description: 'Let\'s take a quick tour to help you get started with the platform. We\'ll show you the key features.',
    icon: BarChart3,
  },
  {
    id: 'charts',
    title: 'Browse Clinical Pathways',
    description: 'Access evidence-based treatment pathways for orthopaedic conditions. Each chart provides step-by-step guidance.',
    icon: BarChart3,
    target: '/charts',
  },
  {
    id: 'compare',
    title: 'Compare Treatments',
    description: 'Compare different treatment options side-by-side to make informed clinical decisions for your patients.',
    icon: Search,
  },
  {
    id: 'save',
    title: 'Save Your Favourites',
    description: 'Bookmark charts and treatments you frequently use for quick access from your dashboard.',
    icon: Star,
  },
  {
    id: 'settings',
    title: 'Customize Your Experience',
    description: 'Update your profile, manage billing, and adjust preferences in the settings area.',
    icon: Settings,
  },
];

interface OnboardingTourProps {
  onComplete: () => void;
  onSkip: () => void;
}

export function OnboardingTour({ onComplete, onSkip }: OnboardingTourProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  const progress = ((currentStep + 1) / tourSteps.length) * 100;
  const step = tourSteps[currentStep];
  const isLastStep = currentStep === tourSteps.length - 1;
  const isFirstStep = currentStep === 0;

  const handleNext = () => {
    if (isLastStep) {
      handleComplete();
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (!isFirstStep) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleComplete = () => {
    setIsVisible(false);
    setTimeout(onComplete, 300);
  };

  const handleSkip = () => {
    setIsVisible(false);
    setTimeout(onSkip, 300);
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className={cn(
          "fixed inset-0 z-50 bg-background/80 backdrop-blur-sm transition-opacity duration-300",
          isVisible ? "opacity-100" : "opacity-0"
        )}
      />

      {/* Tour Card */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <Card 
          className={cn(
            "w-full max-w-md shadow-2xl transition-all duration-300",
            isVisible ? "scale-100 opacity-100" : "scale-95 opacity-0"
          )}
        >
          <CardHeader className="relative pb-2">
            <Button 
              variant="ghost" 
              size="icon" 
              className="absolute right-2 top-2"
              onClick={handleSkip}
            >
              <X className="h-4 w-4" />
            </Button>
            <div className="flex items-center gap-3 pr-8">
              <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <step.icon className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">
                  Step {currentStep + 1} of {tourSteps.length}
                </p>
                <CardTitle className="text-lg">{step.title}</CardTitle>
              </div>
            </div>
          </CardHeader>

          <CardContent className="pt-4">
            <p className="text-muted-foreground">{step.description}</p>
            
            {/* Step indicators */}
            <div className="flex justify-center gap-2 mt-6">
              {tourSteps.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentStep(index)}
                  className={cn(
                    "h-2 rounded-full transition-all duration-300",
                    index === currentStep 
                      ? "w-6 bg-primary" 
                      : index < currentStep 
                        ? "w-2 bg-primary/50" 
                        : "w-2 bg-muted"
                  )}
                />
              ))}
            </div>
          </CardContent>

          <CardFooter className="flex flex-col gap-3">
            <Progress value={progress} className="h-1" />
            <div className="flex w-full gap-2">
              <Button 
                variant="outline" 
                onClick={handlePrev}
                disabled={isFirstStep}
                className="flex-1"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <Button 
                onClick={handleNext}
                className="flex-1"
              >
                {isLastStep ? (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    Get Started
                  </>
                ) : (
                  <>
                    Next
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </>
                )}
              </Button>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleSkip}
              className="text-muted-foreground"
            >
              Skip tour
            </Button>
          </CardFooter>
        </Card>
      </div>
    </>
  );
}
