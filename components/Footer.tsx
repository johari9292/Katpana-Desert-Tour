import Link from "next/link";
import { buildWhatsAppURL, WHATSAPP_MAIN, displayPhoneInternational } from "@/constants/contact";
import { getMessages, localePath, type Locale } from "@/lib/i18n";
import TrackedLink from "./TrackedLink";

const exploreLinks = ["/tours/", "/destinations/", "/travel-guides/", "/about/", "/contact/"];
const essentialLinks = ["/travel-safety/", "/responsible-travel/", "/booking-terms/", "/privacy/", "/image-credits/"];

export default function Footer({ locale = "en" }: { locale?: Locale }) {
  const t = getMessages(locale);
  return (
    <footer lang={locale} className="modern-footer">
      <div className="modern-container footer-grid">
        <div className="footer-intro"><Link className="footer-brand" href={localePath(locale)}>KATPANA<span>DESERT TOUR</span></Link><p>{t.footerText}</p><span className="footer-location">{t.footerLocation}</span></div>
        <div><h2>{t.footerExplore}</h2><ul>{exploreLinks.map((href, i) => <li key={href}><Link href={localePath(locale, href)}>{t.footerLinks[i]}</Link></li>)}</ul></div>
        <div><h2>{t.footerPlan}</h2><ul>{essentialLinks.map((href, i) => <li key={href}><Link href={localePath(locale, href)}>{t.footerLinks[i + 5]}</Link></li>)}</ul></div>
        <div className="footer-contact"><h2>{t.footerContact}</h2><TrackedLink href={`tel:${WHATSAPP_MAIN}`} dir="ltr" eventName="phone_click" eventData={{ placement: "footer", locale }}>{displayPhoneInternational}</TrackedLink><TrackedLink href={buildWhatsAppURL(WHATSAPP_MAIN, t.form.intro)} target="_blank" rel="noopener noreferrer" eventName="whatsapp_click" eventData={{ placement: "footer", locale }} className="footer-whatsapp">WhatsApp <span aria-hidden="true">↗</span></TrackedLink><Link href={`${localePath(locale)}#plan-trip`}>{t.nav[4]} <span aria-hidden="true">↗</span></Link></div>
      </div>
      <div className="modern-container footer-bottom"><p>© {new Date().getUTCFullYear()} {t.footerCopyright}</p><span>35.30° N &nbsp; 75.63° E</span></div>
    </footer>
  );
}
