import { FaWhatsapp } from "react-icons/fa";
import "../styles/whatsappbutton.css";

const PHONE = "542281301249";
const DEFAULT_MESSAGE = "Hola, quisiera consultar su catalogo.";

const WhatsAppButton = () => {
  const href = `https://wa.me/${PHONE}?text=${encodeURIComponent(DEFAULT_MESSAGE)}`;

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