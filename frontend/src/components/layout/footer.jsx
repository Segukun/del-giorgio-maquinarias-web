import { FaFacebookF, FaInstagram, FaWhatsapp, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";
import "../../styles/layout/footer.css";
import { CONTACT_ADDRESS, CONTACT_EMAIL, CONTACT_EMAIL_IS_PLACEHOLDER, CONTACT_PHONE, MAPS_PROFILE_URL, FACEBOOK_URL, INSTAGRAM_URL, whatsappUrl } from "../../config/contact.js";

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="dg-footer">
      <div className="dg-footer__inner">
        <div className="dg-footer__col">
          <h4>Info útil</h4>
          <ul>
            <li><a href={MAPS_PROFILE_URL} target="_blank" rel="noopener noreferrer">Ubicación / Tienda física</a></li>
            <li><a href="/nosotros">Sobre nosotros</a></li>
            <li><a href="/preguntas-frecuentes">Preguntas frecuentes</a></li>
          </ul>
        </div>

        <div className="dg-footer__col">
          <h4>Contacto</h4>
          <ul className="dg-footer__contact">
            <li>
              <FaWhatsapp aria-hidden="true" />
              <a href={whatsappUrl()} target="_blank" rel="noopener noreferrer">{CONTACT_PHONE}</a>
            </li>
            <li>
              <FaEnvelope aria-hidden="true" />
              {!CONTACT_EMAIL_IS_PLACEHOLDER ? <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> : <span>{CONTACT_EMAIL} (provisional)</span>}
            </li>
            <li>
              <FaMapMarkerAlt aria-hidden="true" />
              <a href={MAPS_PROFILE_URL} target="_blank" rel="noopener noreferrer">{CONTACT_ADDRESS}</a>
            </li>
            <li><a href="/contacto">Ver página de contacto</a></li>
          </ul>
        </div>

        <div className="dg-footer__col">
          <h4>Legal</h4>
          <ul>
            <li><a href="/privacidad">Política de privacidad</a></li>
            <li><a href="/terminos">Términos de uso</a></li>
          </ul>
        </div>
      </div>

      <div className="dg-footer__social">
        <span>Seguinos</span>
        <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="dg-footer__social-link">
          <FaInstagram size={18} aria-hidden="true" />
        </a>
        <a href={FACEBOOK_URL} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="dg-footer__social-link">
          <FaFacebookF size={18} aria-hidden="true" />
        </a>
      </div>

      <div className="dg-footer__bottom">
        © {year} Del Giorgio Maquinarias. Todos los derechos reservados.
      </div>
    </footer>
  );
};

export default Footer;
