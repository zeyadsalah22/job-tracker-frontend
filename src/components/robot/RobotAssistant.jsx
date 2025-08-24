import React, { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { useLocation } from 'react-router-dom';

export default function RobotAssistant() {
  const location = useLocation();
  const [introMessage, setIntroMessage] = useState(null);
  const [landingMessage, setLandingMessage] = useState(null);
  const hideTimerRef = useRef(null);

  // Landing page scroll messages
  const landingMessages = useMemo(
    () => [
      'Welcome! Let me show you around! 🚀',        // Hero (index 0)
      'Check out our amazing features! ✨',         // Features (index 1)  
      'Choose the perfect plan! 💼',               // Pricing (index 2)
      'See what others are saying! 💬',            // Testimonials (index 3)
      "Got questions? I'm here to help! ❓",       // FAQ (index 4)
    ],
    []
  );

  const updateLandingMessage = useCallback(() => {
    const scrollY = window.scrollY + window.innerHeight / 2; // Check middle of viewport
    
    // Get actual section positions
    const featuresEl = document.getElementById('features');
    const pricingEl = document.getElementById('pricing');
    const testimonialsEl = document.getElementById('testimonials');
    const faqEl = document.getElementById('faq');
    
    let sectionIndex = 0; // Default to hero message
    
    if (faqEl && scrollY >= faqEl.offsetTop) {
      sectionIndex = 4; // FAQ section
    } else if (testimonialsEl && scrollY >= testimonialsEl.offsetTop) {
      sectionIndex = 3; // Testimonials section
    } else if (pricingEl && scrollY >= pricingEl.offsetTop) {
      sectionIndex = 2; // Pricing section
    } else if (featuresEl && scrollY >= featuresEl.offsetTop) {
      sectionIndex = 1; // Features section
    }
    setLandingMessage(landingMessages[sectionIndex]);
  }, [landingMessages]);

  const pageIntro = useMemo(() => ({
    '/': '', // special case handled by landing scroll robot
    '/home': '', // special case handled by landing scroll robot
    '/landing': '', // special case handled by landing scroll robot
    '/dashboard': 'Welcome to your dashboard! Here is a quick overview of your activity.',
    '/applications': 'Track and manage your job applications here.',
    '/companies': 'Explore companies you are interested in.',
    '/user-companies': 'Manage your own companies here.',
    '/employees': 'View and manage employees.',
    '/questions': 'Browse and practice interview questions.',
    '/resume-matching': 'Optimize your resume for better matches.',
    '/interviews': 'Prepare for your interviews here.',
    '/profile': 'Update your profile and preferences.'
  }), []);

  useEffect(() => {
    const path = location.pathname;
    
    if (path === '/' || path === '/landing' || path === '/home') {
      setIntroMessage(null);
      // Set initial message and then update on scroll
      setLandingMessage(landingMessages[0]); // Show welcome message initially
      
      // Add a small delay to ensure DOM is ready, then update based on scroll
      const timer = setTimeout(() => {
        updateLandingMessage();
      }, 100);
      
      window.addEventListener('scroll', updateLandingMessage, { passive: true });
      
      return () => {
        clearTimeout(timer);
        window.removeEventListener('scroll', updateLandingMessage);
      };
    } else {
      setLandingMessage(null);
      const msg = pageIntro[path] || 'Welcome!';
      setIntroMessage(msg);
      if (hideTimerRef.current) window.clearTimeout(hideTimerRef.current);
      hideTimerRef.current = window.setTimeout(() => setIntroMessage(null), 4000);
      return () => {
        if (hideTimerRef.current) window.clearTimeout(hideTimerRef.current);
      };
    }
  }, [location.pathname, pageIntro, updateLandingMessage, landingMessages]);

  const handleOpenChat = () => {
    // In the future, this could open a chat modal
    console.log('Chat functionality coming soon!');
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2 select-none group">
      {(introMessage || landingMessage) && (
        <div className="mb-1 bg-white border border-primary/20 shadow-lg rounded-xl px-3 py-2 text-sm max-w-xs">
          <span className="text-gray-700">{introMessage ?? landingMessage}</span>
        </div>
      )}

      <div className="flex items-center gap-2">
        <div className="relative" onClick={handleOpenChat}>
          <div className="w-40 h-40 cursor-pointer hover:scale-105 transition-transform duration-300">
            <DotLottieReact
              src="https://lottie.host/c6f9b304-f3b8-4dea-b810-ac2d3e958d83/Xy3NrWVSF2.lottie"
              loop
              autoplay
              className="w-full h-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
