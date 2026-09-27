import InformationPage from "../components/layout/InformationPage.jsx";
import ContactLinks from "../components/ContactLinks.jsx";

export default function Terms() {
  return (
    <InformationPage title="Términos de uso" introduction="Información sobre el uso del sitio y las consultas por maquinaria y servicios." updated>
      <section>
        <h2>1. Uso del sitio</h2>
        <p>El sitio de Del Giorgio Maquinarias tiene fines informativos y comerciales: presenta la empresa, su catálogo y los canales de contacto. Podés navegar sin crear una cuenta de cliente. No se realizan pagos online, compras directas ni contratos automáticos a través del sitio.</p>
      </section>
      <section>
        <h2>2. Información sobre maquinaria</h2>
        <p>La disponibilidad de los equipos puede cambiar y sus características pueden actualizarse. Las fotografías muestran o representan la maquinaria publicada; consultanos para confirmar los detalles y las imágenes de la unidad de tu interés. Una publicación no garantiza disponibilidad permanente.</p>
      </section>
      <section>
        <h2>3. Consultas y operaciones</h2>
        <p>Visualizar una publicación, abrir WhatsApp o comunicarse con la empresa no constituye automáticamente una compraventa ni una reserva. Cualquier operación y sus condiciones deben confirmarse directamente con Del Giorgio Maquinarias.</p>
      </section>
      <section>
        <h2>4. Maquinaria nueva y usada</h2>
        <p>El precio, estado, disponibilidad, características y condiciones de entrega de cada equipo se confirman con la empresa antes de acordar una operación. Las condiciones pueden variar según la unidad; la información general del catálogo no reemplaza esa confirmación.</p>
      </section>
      <section>
        <h2>5. Contenido del sitio</h2>
        <p>Las fotografías, marcas, logos, textos y elementos de identidad visual pertenecen a sus respectivos titulares. Su publicación no otorga derechos sobre ellos. Para usos que requieran autorización, contactá al titular correspondiente.</p>
      </section>
      <section>
        <h2>6. Servicios externos</h2>
        <p>El sitio incluye enlaces a WhatsApp, Google Maps, Instagram y Facebook. Al acceder a esos servicios, también resultan aplicables sus propias condiciones y políticas. El tratamiento de información relacionado con nuestra web se explica en la <a href="/privacidad">Política de privacidad</a>.</p>
      </section>
      <section>
        <h2>7. Modificaciones</h2>
        <p>Podemos actualizar el contenido del sitio y estos términos para reflejar cambios en la información o el funcionamiento de la web. La fecha de revisión figura al inicio. Las actualizaciones no alteran por sí mismas las condiciones de operaciones ya acordadas ni los derechos que correspondan conforme a la normativa aplicable.</p>
      </section>
      <section>
        <h2>8. Contacto</h2>
        <p>Si tenés dudas sobre una publicación, una operación o el uso del sitio, comunicate con nosotros.</p>
        <ContactLinks />
      </section>
    </InformationPage>
  );
}
