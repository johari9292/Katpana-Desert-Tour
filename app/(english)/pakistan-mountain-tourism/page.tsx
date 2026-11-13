import SEOGuidePage from "@/components/SEOGuidePage";
import { getSeoPageByPath } from "@/data/seo";
import { createSeoPageMetadata } from "@/lib/seo";

const page = getSeoPageByPath("/pakistan-mountain-tourism")!;

export const metadata = createSeoPageMetadata(page);

export default function PakistanMountainTourismPage() {
  return <SEOGuidePage page={page} />;
}
