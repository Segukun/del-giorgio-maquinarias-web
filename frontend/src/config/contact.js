// Source: the original floating WhatsApp button. Keep every public CTA in sync.
export const WHATSAPP_NUMBER = "542281301249";
export const CONTACT_PHONE = `+${WHATSAPP_NUMBER.slice(0, 2)} ${WHATSAPP_NUMBER.slice(2, 6)} ${WHATSAPP_NUMBER.slice(6)}`;
// Confirmed company email; an environment override remains available for future changes.
export const CONTACT_EMAIL = import.meta.env?.VITE_CONTACT_EMAIL?.trim() || "delgiorgiomaquinarias@yahoo.com.ar";
export const CONTACT_EMAIL_IS_PLACEHOLDER = /@example\.com$/i.test(CONTACT_EMAIL);
export const CONTACT_LOCATION = {
  streetAddress: "Constitución 345",
  addressLocality: "Benito Juárez",
  addressRegion: "Buenos Aires",
  postalCode: "7020",
  addressCountry: "AR",
};
export const CONTACT_ADDRESS = `${CONTACT_LOCATION.streetAddress}, ${CONTACT_LOCATION.addressLocality}, ${CONTACT_LOCATION.addressRegion} ${CONTACT_LOCATION.postalCode}`;

export const whatsappUrl = (message = "Hola, quisiera consultar su catalogo.") =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

// Exact business pin from MAPS_PROFILE_URL; avoid ambiguous address geocoding in Buenos Aires city.
const MAPS_DESTINATION = "-37.6756492,-59.817902";
export const MAPS_URL = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(MAPS_DESTINATION)}`;
export const MAP_EMBED_URL = `https://www.google.com/maps?q=${encodeURIComponent(MAPS_DESTINATION)}&z=17&hl=es&output=embed`;

export const MAPS_PROFILE_URL = "https://maps.app.goo.gl/NpyX7QCTfPEJuLAK7";
export const INSTAGRAM_URL = "https://www.instagram.com/delgiorgiomaquinarias?utm_source=ig_web_button_share_sheet&stkn=ZDNlZDc0MzIxNw==";
export const FACEBOOK_URL = "https://www.facebook.com/p/Del-Giorgio-Maquinarias-61561764549250/";
