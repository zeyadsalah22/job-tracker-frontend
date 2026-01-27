import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import useOnboardingStore from '../store/onboarding.store';
import { tourSteps } from '../config/tourSteps';

/**
 * Custom hook to manage onboarding tour logic
 * @param {string} page - The current page identifier (e.g., 'dashboard', 'profile')
 * @returns {Object} Tour control methods and state
 */
export const useOnboarding = (page) => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const {
    shouldShowTour,
    markPageVisited,
    skipTour,
    getNextPageRoute,
    setCurrentPageIndex,
    completeOnboarding,
  } = useOnboardingStore();

  const [runTour, setRunTour] = useState(false);
  const [tourStepsForPage, setTourStepsForPage] = useState([]);

  useEffect(() => {
    if (page) {
      // Set the current page index
      setCurrentPageIndex(page);
      
      // Check if we should show the tour for this page
      const shouldShow = shouldShowTour(page);
      
      if (shouldShow && tourSteps[page]) {
        // Delay to ensure page is fully rendered and data is loaded
        const timer = setTimeout(() => {
          setTourStepsForPage(tourSteps[page]);
          setRunTour(true);
        }, 1000); // Increased from 500ms to 1000ms
        
        return () => clearTimeout(timer);
      }
    }
  }, [page, location.pathname, shouldShowTour, setCurrentPageIndex]);

  /**
   * Handle tour completion or skip
   */
  const handleTourCallback = (data) => {
    const { status, action, index, type } = data;

    // If tour is finished or skipped
    if (status === 'finished') {
      // Mark current page as visited
      markPageVisited(page);
      setRunTour(false);

      // Get next page route
      const nextRoute = getNextPageRoute();
      
      if (nextRoute) {
        // Navigate to next page in sequence after a short delay
        setTimeout(() => {
          navigate(nextRoute);
        }, 300);
      } else {
        // Tour is complete - all pages visited
        completeOnboarding();
      }
    } else if (status === 'skipped' || action === 'close') {
      // User skipped the tour
      skipTour();
      setRunTour(false);
    }
  };

  /**
   * Manually skip the tour
   */
  const handleSkipTour = () => {
    skipTour();
    setRunTour(false);
  };

  return {
    runTour,
    tourSteps: tourStepsForPage,
    handleTourCallback,
    handleSkipTour,
  };
};

export default useOnboarding;

