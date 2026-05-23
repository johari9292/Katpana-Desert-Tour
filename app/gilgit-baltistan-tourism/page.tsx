import SEOGuidePage from "@/components/SEOGuidePage";
import { getSeoPageByPath } from "@/data/seo";
import { createSeoPageMetadata } from "@/lib/seo";

const page = getSeoPageByPath("/gilgit-baltistan-tourism")!;

export const metadata = createSeoPageMetadata(page);

export default function GilgitBaltistanTourismPage() {
  return <SEOGuidePage page={page} />;
}
