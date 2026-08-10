export type ConversionEventName =
  | "whatsapp_click"
  | "inquiry_start"
  | "inquiry_submit"
  | "phone_click"
  | "customize_itinerary_click"
  | "web_vital";

type ConversionParameters = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
    gtag?: (command: "event", eventName: string, parameters?: ConversionParameters) => void;
  }
}

export function trackConversion(eventName: ConversionEventName, parameters: ConversionParameters = {}) {
  if (typeof window === "undefined") return;

  const payload = {
    event: eventName,
    ...parameters,
  };

  window.dataLayer?.push(payload);
  window.gtag?.("event", eventName, parameters);
  window.dispatchEvent(
    new CustomEvent("katpana:conversion", {
      detail: payload,
    }),
  );
}
