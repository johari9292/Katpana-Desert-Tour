import ModernLanding from "@/components/ModernLanding";
import { localizedHomepageMetadata, localizedHomepageSchema } from "@/lib/homepage-seo";
import { jsonLdScript } from "@/lib/seo";

export const metadata = localizedHomepageMetadata("en");

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScript(localizedHomepageSchema("en"))} />
      <ModernLanding locale="en" />
    </>
  );
}
