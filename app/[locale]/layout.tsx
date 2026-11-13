import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import SiteDocument from "@/components/SiteDocument";
import { isLocale } from "@/lib/i18n/config";
import { siteMetadata } from "@/lib/site-metadata";

export const metadata = siteMetadata;

export default async function LocalizedLayout({ children, params }: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale) || locale === "en") notFound();
  return <SiteDocument locale={locale}>{children}</SiteDocument>;
}
