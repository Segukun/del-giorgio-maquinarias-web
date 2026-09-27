# Del Giorgio Maquinarias

Sitio público y panel administrativo para el catálogo de maquinaria agrícola nueva y usada de Del Giorgio Maquinarias, Benito Juárez. Estado documentado: septiembre de 2026.

## Arquitectura actual

- `frontend/`: React 19, Vite 8, React Router 7 y CSS. Incluye las páginas públicas y el panel administrativo.
- Firebase Authentication: acceso del personal al panel.
- Cloud Firestore: catálogo, perfiles administrativos, actividad y estadísticas.
- Firebase Storage: imágenes de maquinaria y marcas.
- `functions/`: Cloud Functions con Node.js 24 para gestión de personal y agregación de métricas.
- `firebase.json`: configuración del código de Functions. El repositorio no configura el hosting del frontend ni incluye reglas de Firestore/Storage.

El frontend utiliza el SDK de Firebase directamente y funciones callable para la gestión de personal. No hay una API Express ni una base MongoDB. Los roles administrativos existentes son `owner` y `staff`.

## Desarrollo local

Desde `frontend/`:

```powershell
npm install
Copy-Item .env.example .env # solo si todavía no existe .env
npm run dev -- --host 127.0.0.1
```

Completar la configuración pública de Firebase en `.env`. `VITE_CONTACT_EMAIL` contiene el correo público confirmado; si falta, Contacto y el footer indican un correo provisional, sin habilitar un enlace de envío. Las páginas informativas ofrecen los otros canales hasta que haya un correo configurado. Reiniciar Vite después de cambiar el entorno.

No guardar secretos en variables `VITE_*`: sus valores forman parte del frontend distribuido. La configuración de contacto y los enlaces oficiales están centralizados en `frontend/src/config/contact.js`.

## Rutas públicas

| Ruta | Contenido |
| --- | --- |
| `/` | Inicio, maquinaria destacada y marcas |
| `/maquinaria/:id` | Ficha individual y consulta por WhatsApp |
| `/contacto` | WhatsApp, email, dirección y mapa |
| `/nosotros` | Presentación institucional, repuestos y postventa |
| `/marcas` | Marcas activas del catálogo de Firestore |
| `/preguntas-frecuentes` | Ocho preguntas desplegables |
| `/privacidad` | Tratamiento real de datos y proveedores |
| `/terminos` | Términos de uso del catálogo |
| `/faq` | Redirección al enlace canónico de preguntas frecuentes |

Las páginas públicas comparten `PublicLayout`, Header, Footer y botón flotante de WhatsApp. Las nuevas páginas informativas comparten `InformationPage` y sus estilos. El sitio no realiza ventas ni pagos online y los visitantes no crean cuentas.

El panel tiene login y recuperación de acceso, y rutas bajo `/admin/panel/` para inicio, productos, personal, categorías, marcas y cuenta. Su comportamiento no se modificó en esta actualización pública.

## Estadísticas implementadas

Las métricas son propias, guardadas en Firestore. No se integra el SDK de Firebase Analytics / Google Analytics.

- `sessions`: `sessionId`, fecha, tipo de dispositivo, origen del tráfico, ciudad y provincia aproximadas, e indicador `hadInteraction`.
- `events`: `product_view` (ID y nombre de maquinaria) y `whatsapp_click` (sin producto asociado), con sesión y fecha.
- `dailyStats`: totales diarios, dispositivos, procedencias y ubicaciones, calculados mediante Functions.
- `productStats`: cantidad de visualizaciones y última vista por maquinaria.
- El panel muestra comparaciones por período, maquinaria más vista y visualizaciones recientes.

El navegador guarda `dg_session_id` y `dg_session_created` en `sessionStorage`. La consulta a `https://ipapi.co/json/` estima ciudad y provincia a partir de la conexión; estos son los únicos campos de esa respuesta conservados por el registro de sesión. La dirección IP llega al proveedor, pero no se guarda como campo en `sessions`.

Las vistas se registran desde `ProductDetail`; los clics a WhatsApp desde `featuredproducts` y `ProductDetail`. Los demás enlaces a WhatsApp no registran ese evento. No se miden todas las páginas, tiempo de permanencia, contenido de mensajes ni ventas. Un identificador de sesión no equivale a una persona única. No hay una tarea de borrado automático de estos registros en el código del repositorio.

## Verificación

Desde `frontend/`:

```powershell
npm run lint
npm test
npm run build
```

La salida de producción se genera en `frontend/dist/`. El servidor que aloje la SPA debe resolver las rutas públicas a `index.html` para permitir accesos directos.

## Pendientes existentes

- Confirmar el correo público definitivo mediante `VITE_CONTACT_EMAIL`.
- Completar la historia y las fotografías reales del negocio cuando se proporcionen.
- El buscador del header todavía no ejecuta búsquedas; `/nuevos` y `/usados` figuran en la navegación original pero no tienen rutas implementadas.
- El lint global detecta un error previo en `src/hooks/useAdminSession.js` (`react-hooks/set-state-in-effect`); no se cambió Admin en esta tarea.
- El build advierte sobre el tamaño del paquete principal; queda pendiente separar más código por ruta.

Ver [documentación del frontend](frontend/README.md) y [configuración de Contacto](frontend/CONTACTO.md).
