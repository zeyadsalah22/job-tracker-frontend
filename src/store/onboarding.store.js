import { create } from "zustand";
import { persist } from "zustand/middleware";

// Define the sequential page order for the guided tour
const PAGE_SEQUENCE = [
  'dashboard',
  'profile',
  'companies',
  'user-companies',
  'employees',
  'applications',
  'questions',
  'interviews',
  'community',
  'resume-matching'
];

// Map page names to their routes
export const PAGE_ROUTES = {
  'dashboard': '/dashboard',
  'profile': '/profile',
  'companies': '/companies',
  'user-companies': '/user-companies',
  'employees': '/employees',
  'applications': '/applications',
  'questions': '/questions',
  'interviews': '/interviews',
  'community': '/community',
  'resume-matching': '/resume-matching'
};

const useOnboardingStore = create(
  persist(
    (set, get) => ({
      // State
      hasCompletedTour: false,
      tourSkipped: false,
      visitedPages: [],
      currentPageIndex: 0,
      
      // Mark a page as visited
      markPageVisited: (page) => {
        set((state) => ({
          visitedPages: [...new Set([...state.visitedPages, page])]
        }));
      },
      
      // Get the next page in the sequence
      getNextPage: () => {
        const state = get();
        const nextIndex = state.currentPageIndex + 1;
        if (nextIndex < PAGE_SEQUENCE.length) {
          return PAGE_SEQUENCE[nextIndex];
        }
        return null; // Tour complete
      },
      
      // Get the route for the next page
      getNextPageRoute: () => {
        const nextPage = get().getNextPage();
        return nextPage ? PAGE_ROUTES[nextPage] : null;
      },
      
      // Set current page index based on page name
      setCurrentPageIndex: (page) => {
        const index = PAGE_SEQUENCE.indexOf(page);
        if (index !== -1) {
          set({ currentPageIndex: index });
        }
      },
      
      // Check if a page should show the tour
      shouldShowTour: (page) => {
        const state = get();
        // Don't show if tour was skipped or already completed
        if (state.tourSkipped || state.hasCompletedTour) {
          return false;
        }
        // Show if page hasn't been visited
        return !state.visitedPages.includes(page);
      },
      
      // Skip the entire tour
      skipTour: () => {
        set({ tourSkipped: true });
      },
      
      // Restart the tour from the beginning
      restartTour: () => {
        set({
          hasCompletedTour: false,
          tourSkipped: false,
          visitedPages: [],
          currentPageIndex: 0
        });
      },
      
      // Mark the tour as completed
      completeOnboarding: () => {
        set({ hasCompletedTour: true });
      },
      
      // Get tour progress percentage
      getTourProgress: () => {
        const state = get();
        const progress = (state.visitedPages.length / PAGE_SEQUENCE.length) * 100;
        return Math.round(progress);
      },
    }),
    {
      name: 'onboarding-storage', // localStorage key
    }
  )
);

export default useOnboardingStore;

