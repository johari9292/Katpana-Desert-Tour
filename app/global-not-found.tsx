import type { Metadata } from "next";
import SiteDocument from "@/components/SiteDocument";
import NotFound from "./(english)/not-found";

export const metadata: Metadata = {
  title: "Page not found | Katpana Desert Tour",
  robots: { index: false, follow: true }
};

export default function GlobalNotFound() {
  return <SiteDocument locale="en"><NotFound /></SiteDocument>;
}
