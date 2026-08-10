"use client";

import type { AnchorHTMLAttributes, ReactNode } from "react";
import { trackConversion, type ConversionEventName } from "@/lib/analytics";

type TrackedLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  children: ReactNode;
  eventName: ConversionEventName;
  eventData?: Record<string, string | number | boolean | undefined>;
};

export default function TrackedLink({
  children,
  eventName,
  eventData,
  onClick,
  ...props
}: TrackedLinkProps) {
  return (
    <a
      {...props}
      onClick={(event) => {
        trackConversion(eventName, eventData);
        onClick?.(event);
      }}
    >
      {children}
    </a>
  );
}
