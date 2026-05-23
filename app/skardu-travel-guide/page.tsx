import SEOGuidePage from "@/components/SEOGuidePage";
import { getSeoPageByPath } from "@/data/seo";
import { createSeoPageMetadata } from "@/lib/seo";

const page = getSeoPageByPath("/skardu-travel-guide")!;

export const metadata = createSeoPageMetadata(page);

export default function SkarduTravelGuidePage() {
  return <SEOGuidePage page={page} />;
}
