# Arranque público e incidente de Search Console

Revisión: 3 de noviembre de 2026. Cambios locales, sin deploy, commit ni push.

## Evidencia y causa confirmada

Search Console obtuvo `/catalogo` con HTTP satisfactorio y metadata indexable, pero su consola registró:

```text
No se pudo iniciar la aplicación: TypeError:
Failed to fetch dynamically imported module:
https://www.delgiorgiomaquinarias.com.ar/assets/AdminSessionProvider-CAB5L2jJ.js
```

El flujo anterior era `index.html → main.jsx → Promise.all(import App, import providers/AdminSessionProvider) → root.render`. El rechazo de **cualquiera** de esas importaciones entraba en el `catch` y renderizaba exactamente la pantalla informada, antes de montar las páginas públicas. También podía llegar a ese catch una excepción durante la evaluación de un módulo importado o una excepción síncrona al invocar `root.render`; los errores posteriores de React no eran atrapados por ese try/catch.

El archivo señalado corresponde a `src/providers/AdminSessionProvider.jsx`, un proveedor antiguo con usuarios simulados. Se cargaba obligatoriamente desde `main.jsx`, aunque `App.jsx` lo reemplazaba con el proveedor real de `src/context/AdminSessionProvider.jsx`. El módulo antiguo ya no se importa ni aparece en el build. Su archivo fuente se conserva fuera del flujo activo.

Se verificó durante la investigación que ese módulo y `App-BvdODD5I.js` respondían HTTP 200 con MIME JavaScript. Por eso **no está confirmado el motivo de transporte** por el que WRS no pudo descargarlo en aquel LIVE TEST (por ejemplo, no hay evidencia para afirmar un 404 o un bloqueo de Cloudflare). Sí están confirmados el módulo que falló y el acoplamiento que convirtió ese fallo innecesario en una caída pública. No se cambiaron Hosting, cachés remotas, DNS ni Cloudflare.

Las seis variables públicas `VITE_FIREBASE_API_KEY`, `AUTH_DOMAIN`, `PROJECT_ID`, `STORAGE_BUCKET`, `MESSAGING_SENDER_ID` y `APP_ID` estaban presentes tanto en el entorno de build como en el JavaScript desplegado inspeccionado. Solo se imprimieron indicadores de presencia; no sus valores. La validación anterior de variables faltantes mostraba otro título, «Falta configurar Firebase», y no explica el error proporcionado.

## Separación implementada

| Parte | Comportamiento |
| --- | --- |
| `main.jsx`, `runtime/bootstrap.js` | Importan la aplicación pública y la renderizan; no esperan un proveedor administrativo ni Firebase. Los errores críticos conservan un fallback real y un diagnóstico por etapa. |
| `App.jsx`, `components/admin/AdminArea.jsx` | Las rutas administrativas, su proveedor y su guard se cargan con `React.lazy` y `Suspense` únicamente cuando se visita una ruta administrativa. Un error de carga/render administrativo queda en su boundary. |
| `firebase/app.js` | Conserva los mismos seis valores de configuración pública. Se evalúa cuando un servicio necesita Firebase; cada SDK valida los requisitos de su servicio. |
| `firebase/publicDb.js`, `publicCatalog.js` | Lecturas públicas diferidas de Firestore, sin importar los servicios administrativos. Inicio, Marcas, Catálogo y fichas usan esta interfaz. |
| `firebase/config.js` | Conserva Auth, Storage y Functions para los consumidores administrativos, compartiendo la misma app y base Firestore. No se cambian persistencia, endpoints, región, roles ni permisos. |
| `runtime/session.js`, `visitorTracking.js`, `firebase/tracking.js`, `metricsWriter.js` | Métricas opcionales después del render. El SDK de escritura se importa cuando hace falta y sus fallos quedan contenidos. |
| `pages/catalog.jsx` | Mantiene encabezado y navegación durante la carga. Un rechazo de Firestore o espera superior a 12 segundos termina en un error local con botón Reintentar y enlace de contacto. |
| `RuntimeErrorBoundary.jsx`, `runtime/errors.js` | Diagnósticos de errores de render y servicios; no muestran mensajes técnicos ni credenciales al visitante. |

No hay Firebase Analytics/Google Analytics ni Performance Monitoring inicializados en este proyecto. `firebase/analytics.js` consulta las métricas propias de Firestore para el Dashboard. No se agregó otro SDK, `getAnalytics()` ni un `isSupported()` para un servicio inexistente. Las métricas propias siguen funcionando cuando el navegador y los servicios están disponibles.

## APIs restringidas y seguridad

- Si `sessionStorage` arroja `SecurityError`, no admite escrituras o no está disponible, se omite el tracking. Lo mismo sucede si falta `crypto.randomUUID()` y aún no hay identificador de sesión. No se inventa otro identificador ni se agrega un polyfill.
- Las lecturas opcionales de navegador y los rechazos de carga/escritura están contenidos. La geolocalización por IP conserva los campos existentes y tiene un límite de 2,5 segundos; si falla, usa ciudad y provincia nulas.
- Se evita registrar dos sesiones simultáneas durante el montaje de StrictMode. La marca de sesión enviada se escribe después de una escritura satisfactoria.
- El timeout limita la espera de la interfaz; no puede cancelar una petición Firestore ya enviada. No se promete que el SDK haya abortado una operación subyacente.
- Auth sigue siendo obligatorio en las seis pantallas protegidas. `RequireAdminAuth` continúa redirigiendo al login sin usuario y no muestra sus hijos mientras verifica la sesión. Un fallo de verificación se muestra como error, sin permitir acceso.
- El proveedor real contiene errores de perfil/sesión y descarta respuestas de perfiles correspondientes a una sesión anterior.
- No se cambia el contenido según Googlebot ni se agrega detección de bots. La clasificación de dispositivo para las métricas era preexistente y no modifica el render público.

## Diagnóstico

`console.error` registra `[DGM]` con `stage`, `name`, `code`, `message` y `stack` cuando existen. Etapas relevantes:

```text
bootstrap.import-app
bootstrap.render-react
react.public-render
admin.load-or-render
admin.session
admin.auth-guard
catalog.read
tracking.session
tracking.product-view
tracking.whatsapp
```

Se seleccionan esos campos en lugar de volcar el objeto completo del error. Se eliminan parámetros y fragmentos de URL, credenciales embebidas, emails y patrones de contraseñas/tokens/API keys. No se registran cuerpos de petición, objetos de usuario de Firebase ni `customData`.

## Verificaciones

Desde `frontend/`:

```powershell
npm run build
npm test
npm run check
```

`check` ejecuta la verificación SEO existente y `check:bootstrap`. La segunda inspecciona los **archivos finales** del build y sus dependencias: React público no importa estáticamente Firebase ni módulos administrativos; el proveedor simulado no se emite; Auth y las seis rutas protegidas siguen presentes. También comprueba que cada módulo y sus importaciones existan. La auditoría se guarda en `dist/.vite/bootstrap-audit.json`, excluida de Hosting por la regla existente `**/.*`.

Las 20 pruebas incluyen los 11 casos anteriores y 9 de bootstrap/render: módulos críticos fallidos, servicios opcionales rechazados, almacenamiento bloqueado, UUID ausente, escrituras fallidas, sesiones duplicadas, espera limitada, redacción de diagnósticos y render de las ocho páginas públicas con APIs restringidas. La prueba de render usa React DOM Server **solo como herramienta de test de componentes**; no implementa SSR en producción ni simula todos los efectos de un navegador.

Resultados finales: `npm run build` aprobado, **20/20 pruebas aprobadas**, `npm run check` aprobado y ESLint de los archivos modificados sin errores. El build real servido mediante Firebase Hosting Emulator respondió correctamente en las ocho rutas públicas, las trece administrativas y los **23 módulos JavaScript finales**; se comprobaron tipos MIME, HTML, sitemap, robots y cabeceras administrativas.

El control del navegador terminó porque la herramienta no pudo verificar la URL de la ventana con suficiente confianza. No había Playwright/Puppeteer instalado y no se agregaron dependencias de navegador. Por tanto, la navegación interactiva, la autenticación real y el render de WRS requieren una comprobación posterior; las pruebas de componentes/HTTP no se presentan como equivalentes a esas comprobaciones.

El build conserva un aviso de tamaño del SDK compartido de Firebase. La separación también expone un aviso por `/hero-combine.jpg` en el CSS de Contacto: esa referencia preexistente no corresponde a un fallo JavaScript del bootstrap y no se modificó el diseño en esta tarea.

## Comprobación posterior a una publicación autorizada

1. Abrir Inicio, Catálogo, Marcas, Nosotros, Contacto, FAQ, Privacidad y Términos en una sesión nueva; revisar el contenido y la consola.
2. Confirmar que una visita pública no solicita el proveedor antiguo ni servicios administrativos para renderizar.
3. Probar `/admin/panel/inicio` sin sesión: debe permanecer protegido y llevar al login. Iniciar sesión únicamente con una cuenta autorizada para comprobar el panel.
4. En herramientas de desarrollo, bloquear las peticiones de métricas/geolocalización y comprobar que la navegación sigue funcionando. Bloquear Firestore para comprobar el error local y el botón Reintentar del catálogo.
5. Repetir el LIVE TEST de `/catalogo` en Search Console y revisar HTML renderizado, captura, recursos y consola. Si falla otro módulo, conservar URL, etapa y error exactos para distinguir problemas de entrega de fallos de ejecución.

La indexación final y la desaparición del Soft 404 no se pueden confirmar sin publicar y repetir el LIVE TEST. No se realizó deploy.
