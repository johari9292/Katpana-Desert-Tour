import SEOGuidePage from "@/components/SEOGuidePage";
import { getSeoPageByPath } from "@/data/seo";
import { createSeoPageMetadata } from "@/lib/seo";

const page = getSeoPageByPath("/pakistan-trekking-guide")!;

export const metadata = createSeoPageMetadata(page);

export default function PakistanTrekkingGuidePage() {
  return <SEOGuidePage page={page} />;
}
