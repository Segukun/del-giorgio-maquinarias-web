// Source: the original floating WhatsApp button. Keep every public CTA in sync.
export const WHATSAPP_NUMBER = "542281301249";
export const CONTACT_PHONE = `+${WHATSAPP_NUMBER.slice(0, 2)} ${WHATSAPP_NUMBER.slice(2, 6)} ${WHATSAPP_NUMBER.slice(6)}`;
// Replace VITE_CONTACT_EMAIL with the company's real email when confirmed.
export const CONTACT_EMAIL_IS_PLACEHOLDER = !import.meta.env.VITE_CONTACT_EMAIL?.trim();
export const CONTACT_EMAIL = import.meta.env.VITE_CONTACT_EMAIL?.trim() || "contacto@example.com";
export const CONTACT_ADDRESS = "Constitución 345, Benito Juárez, Buenos Aires 7020";

export const whatsappUrl = (message = "Hola, quisiera consultar su catalogo.") =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

export const MAPS_URL = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(CONTACT_ADDRESS)}`;
export const MAP_EMBED_URL = `https://www.google.com/maps?q=${encodeURIComponent(CONTACT_ADDRESS)}&output=embed`;
