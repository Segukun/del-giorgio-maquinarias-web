import { FaWhatsapp } from "react-icons/fa";
import { whatsappUrl } from "../config/contact.js";
import "../styles/whatsappbutton.css";

const WhatsAppButton = () => {
  const href = whatsappUrl();

  return (
    
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="dg-whatsapp-fab"
      aria-label="Escribinos por WhatsApp"
    >
      <FaWhatsapp size={28} />
    </a>
  );
}

export default WhatsAppButton;
