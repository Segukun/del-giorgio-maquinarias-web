import { CONTACT_EMAIL, CONTACT_EMAIL_IS_PLACEHOLDER, CONTACT_PHONE, whatsappUrl } from "../config/contact.js";

export default function ContactLinks() {
  return (
    <ul className="dg-information__contact">
      <li>WhatsApp: <a href={whatsappUrl()} target="_blank" rel="noopener noreferrer">{CONTACT_PHONE}</a></li>
      {!CONTACT_EMAIL_IS_PLACEHOLDER && <li>Email: <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a></li>}
      <li><a href="/contacto">Ver todos los medios de contacto y la ubicación</a></li>
    </ul>
  );
}
