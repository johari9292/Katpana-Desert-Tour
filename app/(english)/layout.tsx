import type { ReactNode } from "react";
import SiteDocument from "@/components/SiteDocument";
import { siteMetadata } from "@/lib/site-metadata";

export const metadata = siteMetadata;

export default function EnglishLayout({ children }: { children: ReactNode }) {
  return <SiteDocument locale="en">{children}</SiteDocument>;
}
