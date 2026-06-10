import SEOGuidePage from "@/components/SEOGuidePage";
import { getSeoPageByPath } from "@/data/seo";
import { createSeoPageMetadata } from "@/lib/seo";

const page = getSeoPageByPath("/international-pakistan-tours")!;

export const metadata = createSeoPageMetadata(page);

export default function InternationalPakistanToursPage() {
  return <SEOGuidePage page={page} />;
}
