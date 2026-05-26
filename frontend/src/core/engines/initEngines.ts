import { TrackingEngine } from './TrackingEngine';
import { initRealtime } from '@/core/realtime/initRealtime';

let initialized = false;

export const initEngines = () => {
  if (initialized) {
    console.log('[Engine] already initialized');
    return;
  }

  initialized = true;

  console.log('🚀 Initializing GHN.PI engines...');

  /**
   * Core Engines
   */
  TrackingEngine.init();

  /**
   * Realtime Layer
   */
  initRealtime();

  console.log('🔥 GHN.PI PRO ENGINES READY');
};