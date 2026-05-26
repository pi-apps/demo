import React, { Suspense } from "react";
import { Route } from "react-router-dom";

import { PAGE_REGISTRY } from "./pageRegistry";

export function generateRoutes(): React.ReactNode[] {
  return Object.values(PAGE_REGISTRY).map((page) => {
    const Component = page.component;

    return (
      <Route
        key={page.key}
        path={page.path}
        element={
          <Suspense fallback={<div>Loading...</div>}>
            <Component />
          </Suspense>
        }
      />
    );
  });
}