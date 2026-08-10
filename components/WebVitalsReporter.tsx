"use client";

import { useReportWebVitals } from "next/web-vitals";
import { trackConversion } from "@/lib/analytics";

export default function WebVitalsReporter() {
  useReportWebVitals((metric) => {
    trackConversion("web_vital", {
      metric_id: metric.id,
      metric_name: metric.name,
      value: metric.value,
      delta: metric.delta,
      rating: metric.rating,
      navigation_type: metric.navigationType
    });
  });

  return null;
}
