import SEOGuidePage from "@/components/SEOGuidePage";
import { getSeoPageByPath } from "@/data/seo";
import { createSeoPageMetadata } from "@/lib/seo";

const page = getSeoPageByPath("/karakoram-highway-travel")!;

export const metadata = createSeoPageMetadata(page);

export default function KarakoramHighwayTravelPage() {
  return <SEOGuidePage page={page} />;
}
