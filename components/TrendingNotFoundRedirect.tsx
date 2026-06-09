"use client";

import { useEffect } from "react";

export default function TrendingNotFoundRedirect() {
  useEffect(() => {
    const match = window.location.pathname.match(/^\/trending\/([^/?#]+)\/?$/);

    if (!match) return;

    const slug = safeDecodeURIComponent(match[1]);
    window.location.replace(`/trending/?article=${encodeURIComponent(slug)}`);
  }, []);

  return null;
}

function safeDecodeURIComponent(value: string) {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}
