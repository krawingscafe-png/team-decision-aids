import { useState, useEffect } from 'react';

const ONBOARDING_KEY = 'torbay_onboarding_completed';

export function useOnboarding() {
  const [showTour, setShowTour] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user has completed onboarding
    const completed = localStorage.getItem(ONBOARDING_KEY);
    if (!completed) {
      setShowTour(true);
    }
    setIsLoading(false);
  }, []);

  const completeTour = () => {
    localStorage.setItem(ONBOARDING_KEY, 'true');
    setShowTour(false);
  };

  const skipTour = () => {
    localStorage.setItem(ONBOARDING_KEY, 'skipped');
    setShowTour(false);
  };

  const resetTour = () => {
    localStorage.removeItem(ONBOARDING_KEY);
    setShowTour(true);
  };

  return {
    showTour,
    isLoading,
    completeTour,
    skipTour,
    resetTour,
  };
}
