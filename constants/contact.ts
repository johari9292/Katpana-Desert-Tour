export const WHATSAPP_HOTEL = "+923438160801";
export const WHATSAPP_CAR = "+923438160801";

export const displayPhone = "+92 343 816 0801";

export function buildWhatsAppURL(phone: string, message: string) {
  return `https://wa.me/${phone.replace(/\D/g, "")}?text=${encodeURIComponent(message)}`;
}
