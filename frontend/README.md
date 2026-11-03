# Frontend de Del Giorgio Maquinarias

Aplicación React + Vite. Las rutas públicas y administrativas se declaran en `src/App.jsx`. `src/main.jsx` monta React sin esperar Auth ni métricas; la administración y los servicios de Firebase se cargan cuando se necesitan. Ver [BOOTSTRAP.md](BOOTSTRAP.md) para el diagnóstico de Search Console, el aislamiento de servicios y sus verificaciones.

## Estructura

```text
public/brand/               PNG transparente real del logo
src/components/layout/     Header, Footer, PublicLayout e InformationPage
src/components/            Componentes de Inicio, WhatsApp y ContactLinks
src/components/admin/      Componentes del panel administrativo
src/pages/                 Inicio, Contacto, detalle y páginas informativas
src/pages/admin/           Pantallas administrativas
src/config/contact.js      WhatsApp, email, dirección, Maps y redes oficiales
src/firebase/              SDK, servicios de catálogo, eventos y estadísticas
src/hooks/                 Sesión administrativa y tracking de visitantes
src/runtime/               Bootstrap, diagnóstico, sesión y métricas opcionales
src/styles/                Estilos globales, públicos y administrativos
tests/                     Validación de catálogo, SEO, bootstrap y render de componentes
```

## Páginas informativas

`Privacy`, `Terms`, `Faq`, `About` y `Brands` usan `InformationPage`, dentro del `PublicLayout` existente. Comparten colores, tipografía, ancho de lectura y adaptación móvil en `styles/pages/information.css`. Los títulos y demás metadatos se gestionan mediante `RouteSEO` y la configuración central `src/seo/metadata.js`.

- `/privacidad`: política basada en `useVisitorTracking.js`, `firebase/tracking.js`, `firebase/analytics.js` y `../functions/index.js`. Incluye Firestore, Storage, Authentication, Functions, ipapi, Maps y enlaces externos. Fecha de revisión: septiembre de 2026.
- `/terminos`: ocho secciones para un catálogo con consultas directas, sin checkout.
- `/preguntas-frecuentes`: ocho elementos nativos `details` / `summary`, utilizables con teclado. `/faq` redirige a esta ruta.
- `/nosotros`: solo información confirmada sobre maquinaria, repuestos, postventa y ubicación; no se agregó una historia ni fotografías ficticias.
- `/marcas`: reutiliza `fetchBrands()`, filtra por `isActive` y muestra imágenes existentes. Incluye estados de carga, error y catálogo vacío.

`ContactLinks` utiliza la misma configuración que Contacto y el footer: el correo confirmado es `delgiorgiomaquinarias@yahoo.com.ar`, con enlace `mailto:`. No hay backend de recepción de consultas desde la web.

## Header y footer

El header utiliza `/brand/dg-logo.png`, conservando sus proporciones. El contenedor encuadra mediante CSS los márgenes transparentes del PNG original, sin editar el asset ni usar el favicon. En escritorio, el logo precede al buscador y a la navegación; hasta 1100 px se usa el menú móvil con buscador. El menú cerrado se oculta también de la navegación por teclado.

El footer conserva sus columnas y colores. Solo muestra Instagram y Facebook. Ubicación y Tienda física llevan al perfil de Maps provisto por la empresa; Contacto conserva sus enlaces de indicaciones y mapa embebido. Las URL oficiales se definen una sola vez en `config/contact.js`; los enlaces externos abren una pestaña nueva con `noopener noreferrer`.

## Entorno y comandos

Usar `.env.example` como referencia, sin sobrescribir un `.env` existente. El correo público se configura con `VITE_CONTACT_EMAIL`. Todas las variables `VITE_*` son públicas al compilar; no incluir credenciales privadas.

```powershell
npm install
npm run dev -- --host 127.0.0.1
npm run lint
npm test
npm run build
npm run check
npm run preview
```

## Comprobaciones manuales

1. Abrir desde el footer Privacidad, Términos, FAQ, Nosotros y Contacto; abrir Marcas desde el header o FAQ.
2. Desplegar las ocho preguntas con mouse y teclado.
3. Comprobar que Instagram, Facebook y Maps tienen los destinos de la configuración y abren en otra pestaña.
4. Revisar header, menú, logo, footer y páginas en 320, 390, 768 y 1440 px; comprobar el cambio de navegación cerca de 1100 px.
5. Revisar consola y estados de carga de Marcas. Las peticiones al Firebase configurado y a ipapi requieren conexión; la navegación local usa los servicios configurados en `.env`.

El buscador y los enlaces Nuevos/Usados utilizan `/catalogo` con filtros en la query string. Todas esas variantes comparten el canonical de `/catalogo`.

## SEO

Ver [SEO.md](SEO.md) para el inventario de rutas, metadatos, canonicals, JSON-LD, configuración de Hosting, límites de la SPA y pasos posteriores en Search Console. Los archivos `public/robots.txt` y `public/sitemap.xml` se copian a la raíz de `dist`; el plugin `build/seoPlugin.js` genera los encabezados HTML por ruta.

Después de `npm run build`, ejecutar `npm run check`: verifica SEO y dependencias del bootstrap. `npm test` incluye coherencia de rutas, metadata, fichas, escape seguro, restricciones de almacenamiento y render de las páginas públicas. Ver [BOOTSTRAP.md](BOOTSTRAP.md) para el alcance y los límites de estas pruebas.
