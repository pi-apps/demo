// src/hooks/useAppController.ts

import { useCallback } from "react";
import { appController } from "../core/app/appController";

export const useAppController = () => {
  const dispatch = useCallback(async (action: string, payload?: any) => {
    return appController.dispatch(action as any, payload);
  }, []);

  const navigate = useCallback((route: string) => {
    return appController.dispatch("NAVIGATE", route);
  }, []);

  const createOrder = useCallback((data: any) => {
    return appController.dispatch("CREATE_ORDER", data);
  }, []);

  const updateTracking = useCallback((data: any) => {
    return appController.dispatch("UPDATE_TRACKING", data);
  }, []);

  const assignDriver = useCallback((data: any) => {
    return appController.dispatch("ASSIGN_DRIVER", data);
  }, []);

  const syncAll = useCallback(() => {
    return appController.dispatch("SYNC_ALL");
  }, []);

  const initApp = useCallback(() => {
    return appController.dispatch("INIT_APP");
  }, []);

  return {
    dispatch,
    navigate,
    createOrder,
    updateTracking,
    assignDriver,
    syncAll,
    initApp,
  };
};