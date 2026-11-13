import { notFound } from "next/navigation";
import ModernLanding from "@/components/ModernLanding";
import { isLocale, locales } from "@/lib/i18n/config";
import { localizedHomepageMetadata, localizedHomepageSchema } from "@/lib/homepage-seo";
import { jsonLdScript } from "@/lib/seo";

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.filter(({ code }) => code !== "en").map(({ code }) => ({ locale: code }));
}

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale) || locale === "en") notFound();
  return localizedHomepageMetadata(locale);
}

export default async function LocalizedHomepage({ params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale) || locale === "en") notFound();
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScript(localizedHomepageSchema(locale))} />
      <ModernLanding locale={locale} />
    </>
  );
}
