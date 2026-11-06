import React from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { AnimatePresence } from "framer-motion";
import { StaticRouter } from "react-router-dom/server";
import { queryClientInstance } from "@/lib/query-client";
import { PublicApp } from "@/App.jsx";
import { Toaster } from "@/components/ui/toaster";

/**
 * Same tree as App, with a fixed URL so the build can render one route at a time.
 * initial={false} writes the settled motion styles into the static HTML.
 * The client bundle still runs the entrance animations after it boots.
 */
export function PrerenderApp({ location }) {
  return (
    <QueryClientProvider client={queryClientInstance}>
      <StaticRouter location={location}>
        <AnimatePresence initial={false}>
          <PublicApp />
        </AnimatePresence>
      </StaticRouter>
      <Toaster />
    </QueryClientProvider>
  );
}
