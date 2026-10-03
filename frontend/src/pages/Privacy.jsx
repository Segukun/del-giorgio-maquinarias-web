import InformationPage from "../components/layout/InformationPage.jsx";
import ContactLinks from "../components/ContactLinks.jsx";
import { CONTACT_ADDRESS } from "../config/contact.js";

export default function Privacy() {
  return (
    <InformationPage title="Política de privacidad" introduction="Cómo utilizamos la información relacionada con la navegación y las consultas a Del Giorgio Maquinarias." updated>
      <section>
        <h2>1. Quiénes somos</h2>
        <p>Del Giorgio Maquinarias, con ubicación en {CONTACT_ADDRESS}, Argentina, utiliza este sitio para presentar la empresa, su maquinaria y sus medios de contacto.</p>
      </section>
      <section>
        <h2>2. Información de navegación y métricas</h2>
        <p>Utilizamos Firebase y herramientas de análisis implementadas en el sitio para obtener métricas de uso. Al navegar por la web pública se genera un identificador de sesión y se registran:</p>
        <ul>
          <li>La fecha y hora de la sesión y el tipo de dispositivo: computadora, celular o tablet.</li>
          <li>El origen del tráfico, a partir del parámetro de campaña <code>utm_source</code> si está presente, o de una categoría del sitio de procedencia, como Google, Instagram, Facebook, acceso directo u otro.</li>
          <li>La ciudad y provincia aproximadas, cuando el servicio de localización puede obtenerlas.</li>
          <li>Las visualizaciones de fichas de maquinaria, con el identificador y nombre del equipo, la sesión y la fecha y hora.</li>
          <li>Los clics en los botones de WhatsApp de maquinaria destacada y de las fichas de producto, con la sesión y la fecha y hora. Esos eventos no guardan la máquina consultada ni el contenido de la conversación.</li>
        </ul>
        <p>Estas estadísticas no abarcan todos los botones de WhatsApp ni todas las páginas del sitio. No registramos una lista general de páginas visitadas, la duración de la navegación ni el texto de tus mensajes. El navegador se consulta para clasificar el dispositivo; no guardamos su identificación completa en estos registros.</p>
        <p>El identificador permite relacionar eventos de una sesión. Por eso, no describimos esta información como completamente anónima.</p>
      </section>
      <section>
        <h2>3. Para qué usamos esta información</h2>
        <p>Las estadísticas se consultan en nuestro panel administrativo para conocer el volumen de sesiones, las máquinas que generan interés y los clics registrados hacia WhatsApp. También permiten comparar períodos y conocer la distribución por dispositivo, procedencia y ubicación aproximada.</p>
        <p>Usamos esta información para orientar mejoras del contenido y la navegación. Un clic hacia WhatsApp no confirma que se haya enviado una consulta ni que se haya concretado una compra.</p>
      </section>
      <section>
        <h2>4. Almacenamiento en el navegador y conservación</h2>
        <p>Guardamos en el almacenamiento de sesión del navegador (<code>sessionStorage</code>) un identificador y una marca que permite evitar repetir el registro de la sesión. Este almacenamiento corresponde a la sesión de la pestaña y normalmente se elimina al cerrarla.</p>
        <p>Los registros enviados a Firebase y las estadísticas calculadas no se borran al cerrar la pestaña. Actualmente no hay un plazo automático de eliminación configurado para esos registros. Podés contactarnos para consultar sobre su conservación o solicitar su supresión cuando corresponda.</p>
        <p>Los servicios externos pueden utilizar sus propios mecanismos de almacenamiento o cookies, de acuerdo con sus políticas.</p>
      </section>
      <section>
        <h2>5. Proveedores y servicios externos</h2>
        <ul>
          <li><strong>Google / Firebase:</strong> Firestore almacena el catálogo, las sesiones, los eventos y las estadísticas; Cloud Functions procesa los eventos para calcular métricas; Storage aloja imágenes. Authentication se utiliza para el acceso del personal al panel administrativo. Las métricas del sitio son una implementación propia sobre Firestore; no utilizamos el SDK de Google Analytics para Firebase. Consultá la <a href="https://firebase.google.com/support/privacy" target="_blank" rel="noopener noreferrer">información de privacidad de Firebase</a>.</li>
          <li><strong>ipapi:</strong> el navegador consulta este proveedor, que recibe la dirección IP necesaria para estimar la ubicación. Nuestro registro de sesión conserva únicamente la ciudad y provincia devueltas, no la dirección IP ni coordenadas precisas. No solicitamos la ubicación GPS del dispositivo. Consultá la <a href="https://ipapi.co/privacy/" target="_blank" rel="noopener noreferrer">política de privacidad de ipapi</a>.</li>
          <li><strong>Google Maps:</strong> la página de Contacto incluye un mapa y el sitio ofrece enlaces a nuestra ubicación. Al cargar el mapa, Google puede recibir información técnica de la conexión. Consultá la <a href="https://policies.google.com/privacy?hl=es" target="_blank" rel="noopener noreferrer">política de privacidad de Google</a>.</li>
          <li><strong>WhatsApp, Instagram y Facebook:</strong> los enlaces abren estos servicios externos. La actividad que realices allí se rige también por sus propias políticas. Si nos escribís por WhatsApp o email, utilizamos la información que compartas para atender tu consulta.</li>
        </ul>
        <p>Del Giorgio Maquinarias no comercializa los datos de navegación recopilados mediante el sitio. Determinados proveedores tecnológicos pueden procesar información necesaria para prestar sus servicios, incluso fuera de Argentina, según sus condiciones y políticas.</p>
      </section>
      <section>
        <h2>6. Acceso administrativo</h2>
        <p>El acceso del personal al panel utiliza cuentas autenticadas. Se gestionan datos de perfil como nombre, email, rol y estado de la cuenta, y se registran acciones administrativas para mantener el catálogo. Esto es independiente de la navegación pública y no implica un registro de clientes.</p>
      </section>
      <section>
        <h2>7. Consultas y derechos</h2>
        <p>Podés comunicarte con nosotros para conocer cómo se trata tu información o solicitar acceso, rectificación, actualización o supresión, según corresponda. Para localizar un registro podemos necesitar información que nos permita identificarlo; no envíes contraseñas ni datos innecesarios.</p>
        <ContactLinks />
        <p>También podés consultar información sobre tus derechos ante la <a href="https://www.argentina.gob.ar/aaip/datospersonales/derechos" target="_blank" rel="noopener noreferrer">Agencia de Acceso a la Información Pública</a>.</p>
      </section>
      <section>
        <h2>8. Actualizaciones</h2>
        <p>Actualizaremos esta política si cambian los servicios o el tratamiento de información del sitio, indicando la fecha de la revisión.</p>
      </section>
    </InformationPage>
  );
}
