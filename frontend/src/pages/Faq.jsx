import InformationPage from "../components/layout/InformationPage.jsx";
import ContactLinks from "../components/ContactLinks.jsx";
import { CONTACT_ADDRESS, MAPS_PROFILE_URL, whatsappUrl } from "../config/contact.js";

const questions = [
  {
    question: "¿Venden maquinaria nueva y usada?",
    answer: <p>Sí. Del Giorgio Maquinarias comercializa maquinaria agrícola nueva y usada. Podés consultar la disponibilidad en nuestras publicaciones o directamente por <a href={whatsappUrl()} target="_blank" rel="noopener noreferrer">WhatsApp</a>.</p>,
  },
  {
    question: "¿Cómo puedo consultar por una máquina?",
    answer: <p>Desde las publicaciones de maquinaria podés acceder al botón de WhatsApp y comunicarte directamente con nosotros.</p>,
  },
  {
    question: "¿Los equipos publicados están siempre disponibles?",
    answer: <p>La disponibilidad puede cambiar. Recomendamos confirmar cada equipo directamente con la empresa antes de realizar cualquier operación.</p>,
  },
  {
    question: "¿Dónde están ubicados?",
    answer: <><p>Estamos en {CONTACT_ADDRESS}, Argentina.</p><p><a href={MAPS_PROFILE_URL} target="_blank" rel="noopener noreferrer">Ver ubicación y reseñas en Google Maps</a></p></>,
  },
  {
    question: "¿Ofrecen servicio postventa?",
    answer: <p>Sí. Del Giorgio Maquinarias brinda servicio postventa para acompañar a sus clientes después de la compra.</p>,
  },
  {
    question: "¿Venden repuestos?",
    answer: <p>Sí. Comercializamos repuestos. La disponibilidad puede consultarse directamente con nosotros.</p>,
  },
  {
    question: "¿Qué marcas trabajan?",
    answer: <p>Podés conocer las marcas de nuestro catálogo en la <a href="/marcas">página de marcas</a>. Consultanos por el equipo o repuesto que necesitás.</p>,
  },
  {
    question: "¿Cómo puedo contactarme?",
    answer: <><p>Estos son nuestros canales de contacto:</p><ContactLinks /></>,
  },
];

export default function Faq() {
  return (
    <InformationPage title="Preguntas frecuentes" introduction="Respuestas a las consultas más habituales sobre nuestra maquinaria, servicios y atención.">
      <div className="dg-faq">
        {questions.map(({ question, answer }) => (
          <details className="dg-faq__item" key={question}>
            <summary>{question}</summary>
            <div className="dg-faq__answer">{answer}</div>
          </details>
        ))}
      </div>
      <aside className="dg-information__callout">
        <h2>¿Tenés otra consulta?</h2>
        <p><a href="/contacto">Comunicate con nosotros</a> y conversemos sobre lo que necesitás.</p>
      </aside>
    </InformationPage>
  );
}
