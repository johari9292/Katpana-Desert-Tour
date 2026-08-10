export const WHATSAPP_MAIN = "+923430249240";
export const PHONE_SECONDARY = "+923438160801";
export const WHATSAPP_HOTEL = WHATSAPP_MAIN;
export const WHATSAPP_CAR = WHATSAPP_MAIN;

export const displayPhone = "0343 024 9240";
export const displayPhone2 = "0343 816 0801";
export const displayPhoneInternational = "+92 343 024 9240";
export const displayPhone2International = "+92 343 816 0801";

export function buildWhatsAppURL(phone: string, message: string) {
  return `https://wa.me/${phone.replace(/\D/g, "")}?text=${encodeURIComponent(message)}`;
}
