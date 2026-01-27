import React from 'react';
import Joyride, { ACTIONS, EVENTS, STATUS } from 'react-joyride';
import { useOnboarding } from '../../hooks/useOnboarding';

/**
 * OnboardingTour Component
 * Wraps react-joyride with custom styling and logic
 * 
 * @param {string} page - Page identifier (e.g., 'dashboard', 'profile')
 */
const OnboardingTour = ({ page }) => {
  const { runTour, tourSteps, handleTourCallback } = useOnboarding(page);

  // Custom styles matching the app theme
  const joyrideStyles = {
    options: {
      arrowColor: '#fff',
      backgroundColor: '#fff',
      overlayColor: 'rgba(0, 0, 0, 0.5)',
      primaryColor: '#7571F9',
      textColor: '#333',
      width: 380,
      zIndex: 10000,
    },
    beacon: {
      inner: '#7571F9',
      outer: '#7571F9',
    },
    beaconInner: {
      backgroundColor: '#7571F9',
    },
    beaconOuter: {
      backgroundColor: 'rgba(117, 113, 249, 0.2)',
      border: '2px solid #7571F9',
    },
    tooltip: {
      backgroundColor: '#fff',
      borderRadius: '12px',
      boxShadow: '0 10px 40px rgba(0, 0, 0, 0.15)',
      fontSize: '14px',
      padding: '20px',
    },
    tooltipContainer: {
      textAlign: 'left',
    },
    tooltipTitle: {
      fontSize: '18px',
      fontWeight: '600',
      marginBottom: '10px',
      color: '#333',
    },
    tooltipContent: {
      fontSize: '14px',
      lineHeight: '1.6',
      color: '#555',
      padding: '10px 0',
    },
    tooltipFooter: {
      marginTop: '15px',
    },
    buttonNext: {
      backgroundColor: '#7571F9',
      borderRadius: '8px',
      color: '#fff',
      fontSize: '14px',
      fontWeight: '500',
      padding: '10px 20px',
      border: 'none',
      cursor: 'pointer',
      transition: 'all 0.2s',
      outline: 'none',
    },
    buttonBack: {
      color: '#7571F9',
      fontSize: '14px',
      fontWeight: '500',
      marginRight: '10px',
      padding: '10px 15px',
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      transition: 'all 0.2s',
    },
    buttonSkip: {
      color: '#999',
      fontSize: '13px',
      padding: '8px 12px',
      background: 'none',
      border: 'none',
      cursor: 'pointer',
    },
    buttonClose: {
      color: '#999',
      fontSize: '20px',
      padding: '5px',
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      position: 'absolute',
      right: '10px',
      top: '10px',
    },
    spotlight: {
      borderRadius: '8px',
    },
  };

  // Locale customization
  const locale = {
    back: 'Back',
    close: 'Close',
    last: 'Finish',
    next: 'Next',
    open: 'Open',
    skip: 'Skip Tour',
  };

  if (!runTour || !tourSteps || tourSteps.length === 0) {
    return null;
  }

  return (
    <Joyride
      steps={tourSteps}
      run={runTour}
      continuous
      showProgress
      showSkipButton
      scrollToFirstStep
      scrollOffset={100}
      disableScrolling={false}
      disableOverlayClose
      hideCloseButton={false}
      spotlightClicks={false}
      spotlightPadding={10}
      disableScrollParentFix={false}
      styles={joyrideStyles}
      locale={locale}
      callback={(data) => {
        // Debug logging
        console.log('Joyride Callback:', {
          action: data.action,
          index: data.index,
          status: data.status,
          type: data.type,
          step: data.step,
          lifecycle: data.lifecycle,
        });
        
        // If a step is being skipped because target not found
        if (data.type === 'error:target_not_found') {
          console.error('Target not found for step:', data.step);
        }
        
        handleTourCallback(data);
      }}
      floaterProps={{
        disableAnimation: false,
      }}
      debug
    />
  );
};

export default OnboardingTour;

