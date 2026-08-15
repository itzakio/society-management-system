/**
 * Custom image loader for Next.js Image component
 * Bypasses domain restrictions by returning the original image URL
 */

export const customImageLoader = ({ src }: { src: string }) => {
  return src;
};

export default customImageLoader;