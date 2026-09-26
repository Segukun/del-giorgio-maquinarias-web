import { useEffect } from "react";
import { FaWhatsapp, FaEnvelope, FaMapMarkerAlt, FaArrowRight, FaDirections } from "react-icons/fa";
import { CONTACT_ADDRESS, CONTACT_EMAIL, CONTACT_EMAIL_IS_PLACEHOLDER, CONTACT_PHONE, MAP_EMBED_URL, MAPS_URL, whatsappUrl } from "../config/contact.js";
import "../styles/hero.css";
import "../styles/pages/contact.css";

export default function Contact() {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = "Contacto | Del Giorgio Maquinarias";
    return () => { document.title = previousTitle; };
  }, []);

  return (
    <div className="dg-contact">
      <section className="dg-contact__hero" aria-labelledby="contact-title">
        <div className="dg-contact__container">
          <span className="dg-contact__eyebrow">CONTACTO</span>
          <h1 id="contact-title">Estamos para ayudarte</h1>
          <p>El próximo paso para tu campo empieza con una charla.<br />Consultanos por maquinaria nueva o usada, repuestos y servicio técnico.</p>
        </div>
      </section>
      <div className="dg-contact__container dg-contact__content">
        <section className="dg-contact__channels" aria-label="Canales de contacto">
          <a className="dg-contact__card dg-contact__card--whatsapp" href={whatsappUrl()} target="_blank" rel="noopener noreferrer">
            <span className="dg-contact__icon"><FaWhatsapp aria-hidden="true" /></span>
            <span><span className="dg-contact__card-label">Hablemos por WhatsApp</span><strong>{CONTACT_PHONE}</strong><span className="dg-contact__card-note">Escribinos y te asesoramos</span></span>
            <FaArrowRight aria-hidden="true" className="dg-contact__arrow" />
          </a>
          {!CONTACT_EMAIL_IS_PLACEHOLDER ? <a className="dg-contact__card" href={`mailto:${CONTACT_EMAIL}`}>
            <span className="dg-contact__icon"><FaEnvelope aria-hidden="true" /></span>
            <span><span className="dg-contact__card-label">Email</span><strong>{CONTACT_EMAIL}</strong><span className="dg-contact__card-note">Envianos tu consulta por correo</span></span>
            <FaArrowRight aria-hidden="true" className="dg-contact__arrow" />
          </a> : <div className="dg-contact__card">
            <span className="dg-contact__icon"><FaEnvelope aria-hidden="true" /></span>
            <span><span className="dg-contact__card-label">Email</span><strong>{CONTACT_EMAIL}</strong><span className="dg-contact__card-note">Email provisional · pendiente de confirmar</span></span>
          </div>}
          <a className="dg-contact__card" href={MAPS_URL} target="_blank" rel="noopener noreferrer">
            <span className="dg-contact__icon"><FaMapMarkerAlt aria-hidden="true" /></span>
            <span><span className="dg-contact__card-label">Visitanos</span><strong>{CONTACT_ADDRESS}</strong><span className="dg-contact__card-note">Encontrá cómo llegar</span></span>
            <FaArrowRight aria-hidden="true" className="dg-contact__arrow" />
          </a>
        </section>
          <section className="dg-contact__location" aria-labelledby="contact-location-title">
            <div className="dg-contact__location-heading">
              <span className="dg-contact__eyebrow">CERCA TUYO</span>
              <h2 id="contact-location-title">Encontranos en Benito Juárez</h2>
              <p>Acercate y conversemos sobre lo que necesitás para tu trabajo.</p>
            </div>
            <iframe className="dg-contact__map" src={MAP_EMBED_URL} title={`Ubicación de Del Giorgio Maquinarias: ${CONTACT_ADDRESS}`} loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen />
            <div className="dg-contact__address">
              <FaMapMarkerAlt aria-hidden="true" />
              <div><strong>Del Giorgio Maquinarias</strong><address>{CONTACT_ADDRESS}</address></div>
            </div>
            <a className="dg-btn dg-contact__directions" href={MAPS_URL} target="_blank" rel="noopener noreferrer"><FaDirections aria-hidden="true" />Cómo llegar</a>
          </section>
      </div>
    </div>
  );
}
