import type { StandCategory } from "@/data/exhibition-map/standData";

/**
 * Maps the API's categorySlug values to the old standData.ts StandCategory keys
 * so that SVG positions and StandShape rendering still work.
 */
export const apiSlugToCategory: Record<string, StandCategory> = {
  "goffs-complex-standard-size": "goff-standard",
  "goffs-complex-premium-6x2": "goff-premium-1",
  "goffs-complex-premium-4x2": "goff-premium-2",
  "goffs-complex-premium-4x3.5": "goff-premium-3",
  "goffs-complex-small-size": "goff-small",
  "marquee-standard-size": "marquee-standard",
  "marquee-premium-3x3": "marquee-premium-a",
  "marquee-premium-3x4": "marquee-premium-b",
  "marquee-premium-5x2": "marquee-premium-c",
  "marquee-premium-4x3": "marquee-premium-d",
  "outdoor-standard-size": "outdoor",
};