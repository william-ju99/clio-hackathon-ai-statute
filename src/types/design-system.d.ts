/**
 * Type stub for @clio/design-system-web-components.
 *
 * This will be replaced with real types once the design-system package
 * is linked via `npm install` with the ARTIFACTORY_NPM_TOKEN set.
 */
declare module "@clio/design-system-web-components" {
  import type { ComponentType } from "react";

  export const ClioBadge: ComponentType<Record<string, unknown>>;
  export const ClioBanner: ComponentType<Record<string, unknown>>;
  export const ClioButton: ComponentType<Record<string, unknown>>;
  export const ClioButtonGroup: ComponentType<Record<string, unknown>>;
  export const ClioCard: ComponentType<Record<string, unknown>>;
  export const ClioDot: ComponentType<Record<string, unknown>>;
  export const ClioGreeting: ComponentType<Record<string, unknown>>;
  export const ClioIcon: ComponentType<Record<string, unknown>>;
  export const ClioIconButton: ComponentType<Record<string, unknown>>;
  export const ClioLink: ComponentType<Record<string, unknown>>;
  export const ClioLoadingIndicator: ComponentType<Record<string, unknown>>;
  export const ClioLogo: ComponentType<Record<string, unknown>>;
  export const ClioNotification: ComponentType<Record<string, unknown>>;
  export const ClioPill: ComponentType<Record<string, unknown>>;
  export const ClioSwitch: ComponentType<Record<string, unknown>>;

  export function setLocale(locale: string): void;
  export function getLocale(): string;
}
