"use client";

/**
 * Design System Integration
 *
 * This module provides React wrappers for the Clio Design System web components.
 * The design-system package (@clio/design-system-web-components) uses Lit-based
 * web components. We use @lit/react to create React-compatible wrappers.
 *
 * Components are loaded dynamically on the client side only (no SSR) since
 * Lit web components require a browser DOM.
 *
 * Usage:
 *   import { ClioButton, ClioBadge } from '@/lib/design-system';
 *
 * If the design-system build artifacts aren't available yet, these wrappers
 * will gracefully fall back. The team building the design-system can run
 * `npm run build` in the design-system package to generate the dist/ folder.
 */

import dynamic from "next/dynamic";
import React from "react";

// Placeholder component for when design-system components aren't available yet
function DesignSystemPlaceholder({ componentName }: { componentName: string }) {
  return (
    <div
      className="inline-flex items-center rounded border border-dashed border-muted-foreground/30 px-2 py-1 text-xs text-muted-foreground"
      title={`Clio Design System: ${componentName}`}
    >
      [{componentName}]
    </div>
  );
}

/**
 * Creates a lazy-loaded wrapper for a Clio Design System web component.
 * Falls back to a placeholder if the component can't be loaded.
 */
function createDesignSystemComponent(componentName: string) {
  return dynamic(
    () =>
      import("@clio/design-system-web-components")
        .then((mod) => {
          const Component = (mod as unknown as Record<string, React.ComponentType>)[componentName];
          if (!Component) {
            const Fallback = () => <DesignSystemPlaceholder componentName={componentName} />;
            Fallback.displayName = `${componentName}Fallback`;
            return Fallback;
          }
          return Component;
        })
        .catch(() => {
          const Fallback = () => <DesignSystemPlaceholder componentName={componentName} />;
          Fallback.displayName = `${componentName}Fallback`;
          return Fallback;
        }),
    {
      ssr: false,
      loading: function DSLoading() { return <DesignSystemPlaceholder componentName={componentName} />; },
    }
  );
}

// Export wrapped design-system components
export const DSBadge = createDesignSystemComponent("ClioBadge");
export const DSBanner = createDesignSystemComponent("ClioBanner");
export const DSButton = createDesignSystemComponent("ClioButton");
export const DSCard = createDesignSystemComponent("ClioCard");
export const DSIcon = createDesignSystemComponent("ClioIcon");
export const DSLink = createDesignSystemComponent("ClioLink");
export const DSLogo = createDesignSystemComponent("ClioLogo");
export const DSNotification = createDesignSystemComponent("ClioNotification");
export const DSPill = createDesignSystemComponent("ClioPill");
export const DSLoadingIndicator = createDesignSystemComponent("ClioLoadingIndicator");
