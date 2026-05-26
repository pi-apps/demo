// src/core/router/navigationService.ts

import { NavigateFunction } from 'react-router-dom';

let navigator: NavigateFunction | null = null;

/**
 * React Router navigator setter
 */
export const setNavigator = (navigateFn: NavigateFunction) => {
  navigator = navigateFn;
};

/**
 * SPA navigation using React Router
 */
export const routerNavigate = (path: string) => {
  if (!navigator) {
    console.error('Navigator not initialized');
    return;
  }

  navigator(path);
};

/**
 * Hard navigation (full page reload)
 * Useful for:
 * - Pi Browser deep links
 * - external redirects
 * - auth reset
 * - emergency fallback
 */
export const navigate = (path: string) => {
  window.location.href = path;
};

/**
 * Main navigation service
 */
export const navigationService = {
  setNavigator,
  navigate: routerNavigate,
  hardNavigate: navigate,
};