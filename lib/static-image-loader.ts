interface StaticImageLoaderProps {
  src: string;
  width: number;
  quality?: number;
}

const GENERATED_WIDTHS = [320, 480, 768, 1280, 1536] as const;

function closestGeneratedWidth(requestedWidth: number) {
  return (
    GENERATED_WIDTHS.find((width) => width >= requestedWidth) ??
    GENERATED_WIDTHS[GENERATED_WIDTHS.length - 1]
  );
}

/**
 * Static exports have no image optimization server. Local JPEGs therefore map
 * to committed, pre-sized files while remote/non-JPEG images retain their URL.
 */
export default function staticImageLoader({ src, width }: StaticImageLoaderProps) {
  const localJpeg = src.match(/^\/images\/(.+)\.jpe?g$/i);

  if (!localJpeg) {
    return src;
  }

  return `/images/responsive/${localJpeg[1]}-${closestGeneratedWidth(width)}.jpg`;
}
