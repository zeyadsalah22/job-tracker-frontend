/**
 * API Configuration
 * 
 * Centralized configuration for API base URL.
 * Uses environment variable VITE_API_URL with fallback to production URL.
 */
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://gp-backend-deployment.vercel.app';



