import Link from "next/link";
import type { RelatedLink } from "@/data/seo";

export default function Breadcrumbs({ items }: { items: RelatedLink[] }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-6 flex flex-wrap items-center gap-2 text-xs font-black uppercase tracking-[0.16em] text-skardu-ash">
      {items.map((item, index) => (
        <span key={item.href} className="inline-flex items-center gap-2">
          {index > 0 ? <span aria-hidden="true" className="text-skardu-mist">/</span> : null}
          {index === items.length - 1 ? (
            <span className="text-skardu-gold">{item.label}</span>
          ) : (
            <Link href={item.href} className="hover:text-skardu-gold">
              {item.label}
            </Link>
          )}
        </span>
      ))}
    </nav>
  );
}
