# Frontend de Del Giorgio Maquinarias

Aplicación React + Vite. Las rutas públicas y administrativas se declaran en `src/App.jsx`. `src/main.jsx` valida las variables públicas de Firebase antes de montar la aplicación.

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
src/styles/                Estilos globales, públicos y administrativos
tests/                     Pruebas existentes de validación del catálogo
```

## Páginas informativas

`Privacy`, `Terms`, `Faq`, `About` y `Brands` usan `InformationPage`, dentro del `PublicLayout` existente. Comparten colores, tipografía, ancho de lectura y adaptación móvil en `styles/pages/information.css`. Cada página actualiza el título del documento.

- `/privacidad`: política basada en `useVisitorTracking.js`, `firebase/tracking.js`, `firebase/analytics.js` y `../functions/index.js`. Incluye Firestore, Storage, Authentication, Functions, ipapi, Maps y enlaces externos. Fecha de revisión: septiembre de 2026.
- `/terminos`: ocho secciones para un catálogo con consultas directas, sin checkout.
- `/preguntas-frecuentes`: ocho elementos nativos `details` / `summary`, utilizables con teclado. `/faq` redirige a esta ruta.
- `/nosotros`: solo información confirmada sobre maquinaria, repuestos, postventa y ubicación; no se agregó una historia ni fotografías ficticias.
- `/marcas`: reutiliza `fetchBrands()`, filtra por `isActive` y muestra imágenes existentes. Incluye estados de carga, error y catálogo vacío.

`ContactLinks` utiliza la misma configuración que Contacto y el botón flotante. No expone el correo provisional como un canal real. No hay backend de recepción de consultas desde la web.

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
npm run preview
```

## Comprobaciones manuales

1. Abrir desde el footer Privacidad, Términos, FAQ, Nosotros y Contacto; abrir Marcas desde el header o FAQ.
2. Desplegar las ocho preguntas con mouse y teclado.
3. Comprobar que Instagram, Facebook y Maps tienen los destinos de la configuración y abren en otra pestaña.
4. Revisar header, menú, logo, footer y páginas en 320, 390, 768 y 1440 px; comprobar el cambio de navegación cerca de 1100 px.
5. Revisar consola y estados de carga de Marcas. Las peticiones al Firebase configurado y a ipapi requieren conexión; la navegación local usa los servicios configurados en `.env`.

El buscador y los enlaces originales `/nuevos` y `/usados` siguen pendientes de implementación. El error de lint previo en `useAdminSession.js` y el aviso de tamaño de bundle se documentan en el [README principal](../README.md).
