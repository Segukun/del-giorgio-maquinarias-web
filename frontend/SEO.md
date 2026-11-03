# SEO técnico de Del Giorgio Maquinarias

Revisión local: 2 de noviembre de 2026. Dominio canónico: **https://www.delgiorgiomaquinarias.com.ar**. Esta implementación no fue desplegada ni modifica DNS, dominios personalizados o servicios remotos.

El dominio con `www` coincide con el dominio conectado en Firebase Hosting según la configuración confirmada por el propietario. La redirección existente del dominio sin `www` al dominio con `www` permanece intacta. El SEO usa siempre el destino final, incluso cuando la visita se origina en otro host.

## Archivos creados y modificados

Rutas relativas a la raíz del repositorio. No se modificaron dependencias ni archivos lock.

| Archivos creados | Función |
| --- | --- |
| `frontend/src/seo/metadata.js` | Dominio único, metadata de rutas, maquinaria y datos estructurados. |
| `frontend/src/seo/head.js` | Generación y actualización segura de etiquetas HTML. |
| `frontend/src/components/SEO.jsx` | Aplicación de metadata durante la navegación React. |
| `frontend/src/components/RouteSEO.jsx` | Selección de metadata según la ruta actual. |
| `frontend/src/pages/NotFound.jsx` | Estado para rutas inexistentes, con metadata noindex. |
| `frontend/build/seoPlugin.js` | Encabezados por ruta en desarrollo y en el build de Vite. |
| `frontend/public/robots.txt` | Directivas de rastreo y referencia al sitemap. |
| `frontend/public/sitemap.xml` | Ocho URLs públicas canónicas verificadas. |
| `frontend/tests/seo.test.js` | Pruebas de rutas, metadata, productos y escape de contenido. |
| `frontend/scripts/verify-seo.mjs` | Inspección automática de los artefactos de producción. |
| `frontend/SEO.md` | Este informe y los pasos posteriores a la publicación. |

| Archivos modificados | Cambio |
| --- | --- |
| `frontend/index.html` | Fallback público correcto, bloque SEO administrado y referencia al favicon existente. |
| `frontend/vite.config.js` | Registro del plugin SEO local. |
| `frontend/package.json` | Comandos `check:seo` y `check:bootstrap`, ejecutados por `check`, sin nuevas dependencias. |
| `frontend/src/App.jsx` | Integración de RouteSEO y estado para rutas desconocidas. |
| `frontend/src/pages/ProductDetail.jsx` | Metadata de la ficha con los datos de la consulta existente. |
| `frontend/src/pages/Contact.jsx` | Eliminación del efecto de título que competía con el sistema central. |
| `frontend/src/components/layout/InformationPage.jsx` | Eliminación del efecto de título duplicado. |
| `frontend/src/config/contact.js` | Dirección estructurada reutilizable y lectura compatible con el build; mismos datos públicos. |
| `firebase.json` | HTML por ruta, URLs limpias y cabeceras SEO; se conserva el fallback SPA. |
| `README.md` | Arquitectura y rutas reales actualizadas, enlace a este informe. |
| `frontend/README.md` | Funcionamiento del SEO, catálogo y comandos de validación. |

## Sistema implementado

`src/seo/metadata.js` concentra el dominio, los metadatos estáticos, las reglas de canonical, los datos del negocio y la metadata de maquinaria. `src/seo/head.js` genera etiquetas tanto para HTML como para el navegador, escapando atributos y JSON-LD. `SEO.jsx` reemplaza solo las etiquetas marcadas `data-dg-seo`; su limpieza no restaura títulos de rutas anteriores. `RouteSEO.jsx`, dentro de React Router, cubre las páginas estáticas, todo `/admin` y rutas desconocidas. `ProductDetail` administra su SEO con la respuesta de su consulta existente.

Se eliminaron los efectos de título independientes de Contacto e InformationPage para evitar duplicaciones. No se agregó una librería ni se cambiaron versiones de dependencias.

`build/seoPlugin.js` genera durante `npm run build` un documento HTML por ruta estática y administrativa, usando los mismos JS/CSS de la SPA. Cada uno contiene sus metadatos antes de ejecutar JavaScript. **Esto genera encabezados HTML, no prerenderiza el contenido ni agrega SSR.** En desarrollo, el plugin adapta el encabezado al URL solicitado.

## Rutas, títulos y descripciones

Todas las rutas de la tabla se incluyen en `public/sitemap.xml`. Su canonical es el dominio oficial más la ruta exacta, sin parámetros, fragmentos ni barra final, excepto la raíz `/`.

| Ruta | Title | Description |
| --- | --- | --- |
| `/` | Del Giorgio Maquinarias \| Maquinaria agrícola nueva y usada | Venta de maquinaria agrícola nueva y usada, repuestos y servicio postventa en Benito Juárez, Buenos Aires. Conocé nuestro catálogo y consultanos. |
| `/catalogo` | Catálogo de maquinaria agrícola nueva y usada \| Del Giorgio Maquinarias | Explorá nuestro catálogo de maquinaria agrícola nueva y usada. Filtrá por marca, categoría y condición, y consultá disponibilidad por WhatsApp. |
| `/marcas` | Marcas de maquinaria agrícola \| Del Giorgio Maquinarias | Conocé las marcas del catálogo de Del Giorgio Maquinarias. Consultanos por equipos y repuestos en Benito Juárez, Buenos Aires. |
| `/nosotros` | Nosotros \| Del Giorgio Maquinarias en Benito Juárez | Conocé Del Giorgio Maquinarias en Benito Juárez: venta de maquinaria agrícola nueva y usada, repuestos y acompañamiento postventa. |
| `/contacto` | Contacto y ubicación \| Del Giorgio Maquinarias | Contactá a Del Giorgio Maquinarias por WhatsApp o visitanos en Constitución 345, Benito Juárez. Consultas por maquinaria, repuestos y servicio postventa. |
| `/preguntas-frecuentes` | Preguntas frecuentes \| Del Giorgio Maquinarias | Respuestas sobre maquinaria nueva y usada, disponibilidad, repuestos, postventa y ubicación. Conocé cómo consultar a Del Giorgio Maquinarias. |
| `/privacidad` | Política de privacidad \| Del Giorgio Maquinarias | Conocé cómo Del Giorgio Maquinarias utiliza los datos de navegación, las métricas del sitio y los servicios externos, y cómo realizar consultas de privacidad. |
| `/terminos` | Términos de uso \| Del Giorgio Maquinarias | Información sobre el uso del catálogo de Del Giorgio Maquinarias, las publicaciones de equipos y las condiciones que se confirman al consultar a la empresa. |

Nuevos y Usados son `/catalogo?condicion=nuevo` y `/catalogo?condicion=usado`. No existen rutas independientes `/nuevos` ni `/usados`. Los filtros `q`, `marca`, `categoria`, `condicion`, `horas`, `extra` y `label` no generan URLs en el sitemap: todos canonicalizan a `/catalogo` y conservan la metadata del catálogo. Los parámetros de campañas tampoco afectan canonical. `/faq` conserva su redirección de React a `/preguntas-frecuentes`; su HTML usa el canonical de destino y no aparece en el sitemap.

La ruta `/maquinaria/:id` sí existe y utiliza el ID real del documento Firestore. No se inventaron slugs ni productos.

## Sitemap y robots

El sitemap contiene exactamente estas ocho URLs, sin `lastmod` ficticios:

```text
https://www.delgiorgiomaquinarias.com.ar/
https://www.delgiorgiomaquinarias.com.ar/catalogo
https://www.delgiorgiomaquinarias.com.ar/marcas
https://www.delgiorgiomaquinarias.com.ar/nosotros
https://www.delgiorgiomaquinarias.com.ar/contacto
https://www.delgiorgiomaquinarias.com.ar/preguntas-frecuentes
https://www.delgiorgiomaquinarias.com.ar/privacidad
https://www.delgiorgiomaquinarias.com.ar/terminos
```

Contenido completo de `public/robots.txt`:

```text
User-agent: *
Allow: /

Sitemap: https://www.delgiorgiomaquinarias.com.ar/sitemap.xml
```

Vite copia ambos archivos a `dist/robots.txt` y `dist/sitemap.xml`. No se bloquean JS, CSS, imágenes ni recursos de Firebase. Las pruebas comparan el sitemap y la configuración SEO con las rutas reales de `App.jsx` para detectar olvidos al agregar páginas.

No se incluyeron productos dinámicos en el sitemap: el catálogo cambia desde Admin sin requerir un nuevo build. Un listado estático quedaría desactualizado y agregar lecturas remotas al build introduciría dependencia de red/permisos y no resolvería esa sincronización. Tampoco se añadieron funciones backend. Como evolución separada, se puede implementar un sitemap actualizado con productos `Publicado` y fechas `updatedAt` reales. Mientras tanto, se descubren mediante los enlaces públicos del catálogo; el botón “Cargar más resultados” limita los enlaces que aparecen inicialmente y conviene revisar su rastreo en Search Console.

## Administración

Rutas detectadas, todas excluidas del sitemap:

```text
/admin
/admin/login
/admin/reset-password
/admin/panel
/admin/panel/inicio
/admin/panel/productos
/admin/panel/personal
/admin/panel/categorias
/admin/panel/marcas
/admin/panel/cuenta
/admin/personal
/admin/categorias
/admin/marcas
```

Tienen `robots=noindex, nofollow` en el HTML generado, en React y mediante `X-Robots-Tag` de Firebase Hosting. No llevan canonical público ni JSON-LD. La regla de cabecera cubre también futuras subrutas administrativas. Se conservan Firebase Auth, los componentes de protección, roles y permisos.

`robots.txt` permite el rastreo también de las rutas administrativas para que Google pueda detectar su `noindex`; no se utiliza como mecanismo de seguridad. El panel sigue protegido mediante Firebase Auth, los componentes de protección y sus permisos existentes. Si hay URLs administrativas previamente indexadas, revisar su eliminación en Search Console; `noindex` no implica una retirada inmediata.

## Open Graph, Twitter e iconos

Se generan `og:title`, `og:description`, `og:url` (cuando hay canonical), `og:type=website`, `og:site_name`, `og:locale=es_AR`, `og:image` y texto alternativo. Twitter utiliza `card`, `title`, `description`, `image` y `image:alt`. No se agregó una cuenta de X ni enlaces sociales nuevos.

La imagen institucional es el PNG real `/brand/dg-logo.png`, de 1254 × 1254 px. Se utiliza `twitter:card=summary`, adecuado al logo cuadrado; no se afirma tener una imagen panorámica. Las fichas usan su primera imagen HTTPS válida disponible y omiten dimensiones que no estén verificadas. Si falta una imagen válida, reutilizan el logo. Se descartan URLs locales, esquemas inseguros y el dominio alternativo de Hosting indicado en el pedido.

Las imágenes del dominio propio se publican en la metadata con `www`, conservando ruta y parámetros. Las URLs externas de Firebase Storage se mantienen intactas, incluidos sus tokens. No se modifican documentos ni imágenes almacenadas.

El favicon original `frontend/dmg-logo.ico` se conserva. Vite lo publica con hash bajo `/assets/` y transforma su referencia en todos los HTML generados. No se usa el SVG de Vite como favicon ni se inventan iconos Apple/PWA inexistentes. Se verificó la existencia en `dist` del favicon y del PNG institucional.

## JSON-LD

- `LocalBusiness` en Inicio y Contacto: nombre, dominio, logo, imagen, teléfono público confirmado `+5492281556067`, dirección centralizada, código postal, país, enlace de Maps y `sameAs` para Instagram/Facebook. Instagram se normaliza sin parámetros de campaña. El email reutiliza el correo confirmado `delgiorgiomaquinarias@yahoo.com.ar` o el reemplazo configurado en `VITE_CONTACT_EMAIL`; se excluyen direcciones de ejemplo.
- `WebSite` en Inicio, con nombre, URL, idioma y referencia al negocio.
- `BreadcrumbList` en páginas secundarias y fichas publicadas, con URLs canónicas.

No se agregaron horarios, coordenadas, CUIT, ratings, reseñas, precios, financiación ni medios de pago. El JSON-LD es JSON válido y escapa caracteres que podrían cerrar el elemento `script` si un texto de Firestore incluyera HTML.

## SEO de maquinaria

La consulta existente a `products/{id}` permanece intacta. Para documentos `Publicado` con nombre, la metadata utiliza nombre, marca (sin duplicarla si ya aparece en el nombre), descripción visible, condición y año disponibles; el canonical es `/maquinaria/{id}` y la imagen procede de `images`. No se crean precios ni disponibilidades a partir de supuestos.

Durante la carga se usa un encabezado genérico indexable sin canonical de Home. Esto permite que el rastreador ejecute React y espere los datos. Al cambiar de ID no se reutiliza la metadata de otra máquina. Las fichas ausentes, fallidas, sin nombre o no publicadas reciben `noindex, nofollow` y se elimina su canonical. Esto no modifica qué documentos puede leer Firestore ni el comportamiento visual previo de la ficha.

Los estados actuales del formulario son `Publicado` y `Pendiente`; no hay un estado de venta implementado. No se eliminaron ni redirigieron equipos. Se añadió BreadcrumbList pero no un marcado Product para resultados enriquecidos: faltan ofertas/precios o reseñas verificables, y no se fabricaron para satisfacer requisitos de Google.

## Firebase Hosting y SPA

Se conserva `public: frontend/dist` y la regla final `** → /index.html`. `cleanUrls: true` permite servir los HTML generados mediante las rutas existentes sin `.html`; `trailingSlash: false` alinea las variantes con canonical. Los documentos privados y públicos utilizan los mismos archivos JS/CSS compilados.

Antes de la regla general se resuelven `/maquinaria/**` hacia `__seo/product.html` y las rutas administrativas no cubiertas por un archivo hacia `__seo/admin.html`. Son archivos de soporte de la SPA, no páginas del catálogo ni entradas del sitemap. El acceso directo a `/__seo/**` recibe `X-Robots-Tag: noindex, nofollow`, sin aplicar esa cabecera a las fichas públicas reescritas.

Las cabeceras usan expresiones regulares compatibles con Firebase y con los separadores de Windows. Se verificó un problema del emulador local con glob patterns de cabeceras y se usaron patrones que funcionan tanto en el emulador como con rutas `/` de Hosting. No se cambiaron dominios personalizados, redirecciones entre dominios, DNS ni servicios remotos.

Limitaciones restantes:

- El contenido visible aún necesita JavaScript; generar encabezados no elimina esta dependencia.
- Los bots sociales que no ejecutan JavaScript verán metadata específica en páginas estáticas, pero una vista genérica en maquinaria dinámica. Las fichas específicas se actualizan cuando React obtiene Firestore.
- Las rutas inexistentes y fichas borradas pueden responder HTTP 200 por el fallback SPA. React muestra el estado de error y aplica `noindex`; no se implementó un servidor que devuelva 404 dinámicos.
- Canonical es una señal y no configura redirecciones. El SEO coincide con el destino `www` de la redirección existente, confirmada por el propietario; Google decide la URL seleccionada. No se modificó DNS ni Hosting custom domains.
- Las imágenes, Firestore y recursos públicos deben seguir accesibles sin autenticación para que el render del catálogo pueda completarse.
- No hay garantía automática de indexación ni resultados enriquecidos por agregar etiquetas.

## Validaciones y pasos manuales

Desde `frontend/`:

```powershell
npm run build
npm test
npm run check
npm run lint
```

`check` ejecuta `check:seo`, que inspecciona el build real: ocho HTML públicos, trece administrativos, canonicals, ausencia de noindex público, imagen, favicon, JSON-LD, archivos estáticos y configuración de Hosting. También ejecuta `check:bootstrap`, que verifica el aislamiento de la administración y la existencia de los módulos finales. Las once pruebas originales de catálogo/SEO se conservan; se agregaron nueve de bootstrap y render. Ver [BOOTSTRAP.md](BOOTSTRAP.md) para el diagnóstico del Soft 404 reportado por Search Console y los límites de la validación local.

Las verificaciones exigen el dominio `www` en el sitemap, robots, canonical, Open Graph, Twitter y URLs internas del JSON-LD. Las referencias al host sin `www`, localhost y el host alternativo de Firebase solo permanecen como entradas de pruebas o patrones de rechazo; nunca se emiten como URLs SEO. También se comprueba que las imágenes de Storage no cambien y que las imágenes propias se normalicen al dominio final.

Se probaron respuestas HTTP mediante Firebase Hosting Emulator con un proyecto demo, sin desplegar: treinta rutas y variantes, más el HTML compartido de maquinaria y el favicon. Incluyen las ocho páginas públicas, las trece rutas administrativas y una subruta administrativa futura, filtros del catálogo, redirecciones de `.html` y barra final, logo, robots y sitemap. Se confirmaron canonicals, MIME types y `X-Robots-Tag`, sin consultar Firestore. El navegador automatizado no estuvo disponible, por lo que queda pendiente la comprobación visual del DOM tras navegación SPA y de una ficha real en Search Console.

La revisión SEO inicial completó build, once pruebas y check SEO. Tras la corrección de bootstrap se ejecutan **20 pruebas** y ambos checks, además de ESLint de los archivos modificados. Los errores globales previos en `ProductFormModal.jsx`, `header.jsx` y `useAdminSession.js` quedan fuera del alcance; el import sin uso de Catálogo se eliminó al revisar su carga. El aviso de tamaño corresponde ahora al SDK compartido de Firebase, cargado cuando se necesitan los datos. Los resultados y limitaciones del diagnóstico actual se documentan en [BOOTSTRAP.md](BOOTSTRAP.md).

Después de revisar y publicar manualmente:

1. Comprobar `/robots.txt`, `/sitemap.xml`, Home, Contacto, Catálogo, una ficha publicada y `/admin/login` en el dominio oficial. Inspeccionar HTML inicial y DOM renderizado. Confirmar canonical y las cabeceras administrativas.
2. Verificar o usar la propiedad del dominio en Google Search Console. Enviar `https://www.delgiorgiomaquinarias.com.ar/sitemap.xml` e inspeccionar URLs representativas. Si la propiedad no está verificada, completar personalmente el método de verificación correspondiente.
3. Probar Home/Contacto en Rich Results Test y el JSON-LD en Schema Markup Validator. Revisar la URL canónica seleccionada por Google y solicitar indexación donde corresponda.
4. Comprobar las vistas previas sociales y renovar sus cachés después de publicar. Las fichas dinámicas siguen teniendo la limitación explicada arriba.
5. Si cambia el correo, configurar `VITE_CONTACT_EMAIL` antes del build; si está vacío, se utiliza el correo oficial confirmado. No hay necesidad de agregar una variable de dominio: el dominio canónico es explícito y único.
6. Revisar en Search Console si hay rutas administrativas ya indexadas y seguir el procedimiento de retirada si es necesario. No modificar Auth ni permisos para facilitar la indexación.

Referencias oficiales: [SEO de JavaScript](https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics), [configuración de Hosting](https://firebase.google.com/docs/hosting/full-config), [LocalBusiness](https://developers.google.com/search/docs/appearance/structured-data/local-business), [robots.txt](https://developers.google.com/search/docs/crawling-indexing/robots/intro).
