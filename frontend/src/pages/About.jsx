import InformationPage from "../components/layout/InformationPage.jsx";
import ContactLinks from "../components/ContactLinks.jsx";
import { CONTACT_ADDRESS, MAPS_PROFILE_URL } from "../config/contact.js";

export default function About() {
  return (
    <InformationPage title="Sobre nosotros" introduction="Del Giorgio Maquinarias. Maquinaria agrícola nueva y usada en Benito Juárez.">
      <section>
        <h2>Maquinaria y atención para tu trabajo</h2>
        <p>Comercializamos maquinaria agrícola nueva y usada. Te acompañamos en la consulta por los equipos de nuestro catálogo para que puedas conocer su disponibilidad y características.</p>
        <p>Conocé <a href="/marcas">las marcas con las que trabajamos</a> o contactanos para conversar sobre la maquinaria que necesitás.</p>
      </section>
      <section>
        <h2>Repuestos y servicio postventa</h2>
        <p>También comercializamos repuestos y brindamos servicio postventa para acompañar a nuestros clientes después de la compra. Consultanos por la disponibilidad de repuestos y la atención para tu equipo.</p>
      </section>
      <section>
        <h2>Encontranos en Benito Juárez</h2>
        <p>{CONTACT_ADDRESS}, Argentina.</p>
        <p><a href={MAPS_PROFILE_URL} target="_blank" rel="noopener noreferrer">Ver nuestro negocio y sus reseñas en Google Maps</a>.</p>
        <ContactLinks />
      </section>
    </InformationPage>
  );
}
