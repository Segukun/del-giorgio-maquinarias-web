# Del Giorgio Maquinarias - Backend

API de Del Giorgio Maquinarias. Centraliza el catalogo, la autenticacion administrativa, las reglas de negocio y la integracion con MongoDB y con el futuro servicio externo de imagenes.

## Estado y decisiones del proyecto

| Tema | Decision |
| --- | --- |
| Runtime | Node.js |
| Framework HTTP | Express |
| Base de datos | MongoDB |
| Protocolo | API REST sobre HTTPS en produccion |
| Acceso publico | Lectura del catalogo, marcas y categorias |
| Acceso privado | Administracion autenticada |
| Administracion remota | Disponible por Internet desde distintos dispositivos |
| Imagenes | Servicio externo a definir; MongoDB almacena URLs y metadatos |

El backend debe ser desplegable como un servicio sin estado local permanente. No se deben guardar las fotografias de produccion en una carpeta `uploads/` del servidor.

## Responsabilidades

- exponer datos publicos del catalogo;
- autenticar administradores y cerrar sesiones;
- autorizar cada operacion administrativa;
- validar y normalizar entradas;
- aplicar reglas de negocio;
- crear, editar, eliminar y cambiar el estado de maquinarias;
- gestionar marcas y categorias si se confirma ese alcance;
- coordinar la carga y eliminacion de imagenes con el proveedor elegido;
- almacenar datos y referencias de imagenes en MongoDB;
- registrar errores y eventos administrativos relevantes.

El backend no genera la interfaz ni administra cuentas de visitantes. Tampoco procesa compras, pagos, reservas automaticas ni conversaciones de WhatsApp.

## Arquitectura

```text
Solicitud HTTP
      |
      v
Route
      |
      v
Middleware - autenticacion, autorizacion, validacion
      |
      v
Controller - adapta HTTP
      |
      v
Service - reglas de negocio y casos de uso
      |
      +--> Repository / Model --> MongoDB
      `--> Image service ------> Proveedor externo
```

Los controladores deben ser delgados. Las reglas reutilizables viven en servicios y el acceso a infraestructura se mantiene aislado para poder cambiar el proveedor de imagenes sin reescribir las rutas.

## Estructura propuesta

```text
backend/
|-- src/
|   |-- config/           # Entorno, base de datos y configuracion
|   |-- controllers/      # Adaptadores HTTP
|   |-- middlewares/      # Auth, validacion y errores
|   |-- models/           # Esquemas y modelos de MongoDB
|   |-- repositories/     # Acceso a datos, si aporta claridad
|   |-- routes/           # Definicion de endpoints
|   |-- services/         # Casos de uso e integraciones
|   |   `-- images/       # Interfaz independiente del proveedor
|   |-- utils/            # Utilidades sin estado
|   |-- validators/       # Esquemas de entrada
|   |-- app.js            # Configura Express
|   `-- server.js         # Inicia servidor y conexiones
|-- tests/
|   |-- integration/
|   `-- unit/
|-- .env.example
|-- package.json
`-- README.md
```

`app.js` no debe abrir puertos. Esa separacion permite probar la aplicacion sin iniciar un servidor real.

## Colecciones iniciales

### `machines`

```js
{
  name: String,
  slug: String,
  condition: "new" | "used",
  brandId: ObjectId,
  categoryId: ObjectId,
  model: String,
  year: Number | null,
  description: String,
  specifications: [
    { label: String, value: String }
  ],
  images: [
    {
      url: String,
      providerId: String,
      alt: String,
      order: Number,
      isCover: Boolean
    }
  ],
  status: "available" | "reserved" | "sold",
  featured: Boolean,
  createdBy: ObjectId,
  updatedBy: ObjectId,
  createdAt: Date,
  updatedAt: Date
}
```

`specifications` es una lista flexible porque un tractor, una sembradora y un implemento no comparten necesariamente los mismos atributos.

### `brands`

```js
{
  name: String,
  slug: String,
  logoUrl: String | null,
  active: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### `categories`

```js
{
  name: String,
  slug: String,
  active: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### `admins`

```js
{
  name: String,
  email: String,
  passwordHash: String,
  role: "admin",
  active: Boolean,
  lastLoginAt: Date | null,
  createdAt: Date,
  updatedAt: Date
}
```

Aunque se comience con una sola cuenta, el modelo admite varias cuentas administrativas. Es preferible asignar una cuenta por persona en lugar de compartir una contraseña: permite revocar accesos y atribuir cambios sin modificar la arquitectura.

## API prevista

El prefijo recomendado es `/api`. Si se versiona externamente, puede evolucionar a `/api/v1` antes de publicar consumidores estables.

### Estado del servicio

| Metodo | Ruta | Acceso | Descripcion |
| --- | --- | --- | --- |
| GET | `/health` | Publico | Comprueba que la API responde |

### Autenticacion

| Metodo | Ruta | Acceso | Descripcion |
| --- | --- | --- | --- |
| POST | `/auth/login` | Publico | Inicia sesion administrativa |
| POST | `/auth/logout` | Admin | Cierra la sesion actual |
| GET | `/auth/me` | Admin | Devuelve el administrador autenticado |

### Catalogo publico

| Metodo | Ruta | Acceso | Descripcion |
| --- | --- | --- | --- |
| GET | `/machines` | Publico | Lista y filtra maquinarias |
| GET | `/machines/:slug` | Publico | Obtiene una ficha por slug |
| GET | `/brands` | Publico | Lista marcas activas |
| GET | `/categories` | Publico | Lista categorias activas |

Filtros iniciales:

```text
GET /api/machines?condition=used
GET /api/machines?brand=mainero
GET /api/machines?category=rastrillos
GET /api/machines?status=available
GET /api/machines?featured=true
GET /api/machines?page=1&limit=20
```

La lista publica no debe ocultar por accidente el estado vendida si el diseño necesita conservar fichas historicas. La politica de visibilidad se define explicitamente en el servicio.

### Administracion

| Metodo | Ruta | Acceso | Descripcion |
| --- | --- | --- | --- |
| GET | `/admin/machines` | Admin | Lista completa para gestion |
| POST | `/admin/machines` | Admin | Crea una maquinaria |
| GET | `/admin/machines/:id` | Admin | Obtiene datos editables |
| PUT | `/admin/machines/:id` | Admin | Reemplaza datos editables |
| PATCH | `/admin/machines/:id/status` | Admin | Cambia disponible, reservada o vendida |
| DELETE | `/admin/machines/:id` | Admin | Elimina una maquinaria |
| POST | `/admin/images` | Admin | Inicia o procesa una carga autorizada |
| DELETE | `/admin/images/:id` | Admin | Elimina una imagen vinculada |

Las rutas de marcas y categorias se agregan con el mismo criterio si se confirma su gestion desde el panel.

## Contrato de respuesta

Formato de exito recomendado:

```json
{
  "data": {},
  "meta": {}
}
```

Formato de error recomendado:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Hay datos que deben corregirse.",
    "details": [
      { "field": "name", "message": "El nombre es obligatorio." }
    ]
  }
}
```

No se deben devolver trazas, consultas, tokens ni detalles internos en produccion.

## Autenticacion y administracion remota

La aplicacion y la base de datos se alojan en Internet. Un administrador puede iniciar sesion desde distintas ciudades y dispositivos, y todos operan sobre el mismo catalogo central.

Recomendacion inicial:

- contraseñas con hash robusto y sal unica;
- sesiones o JWT de corta duracion en cookie `HttpOnly`, `Secure` y con politica `SameSite` adecuada;
- renovacion controlada de sesion si se implementa;
- cierre de sesion que invalide o expire la credencial correspondiente;
- rate limiting en login;
- respuestas genericas ante credenciales invalidas;
- cuentas desactivables;
- registro de `createdBy`, `updatedBy` y fechas.

La estrategia exacta de sesion debe definirse antes de implementar el login. No se debe compartir un secreto JWT con el frontend.

## Concurrencia entre dispositivos

Dos administradores pueden editar el catalogo al mismo tiempo. Para la primera implementacion:

- cada documento conserva `updatedAt`;
- el cliente envia la version o fecha que comenzo a editar;
- el backend puede rechazar una escritura obsoleta con `409 Conflict`;
- operaciones compuestas de datos e imagenes deben evitar registros parciales;
- la interfaz recarga el dato y permite decidir como continuar.

Si se adopta temporalmente la regla "ultima escritura gana", debe quedar documentada y reemplazarse si aparecen conflictos reales de operacion.

## Integracion de imagenes

El proveedor se mantiene detras de una interfaz interna:

```js
imageService.upload(file, options)
imageService.delete(providerId)
```

El servicio elegido debe resolver, como minimo:

- almacenamiento persistente;
- entrega publica por HTTPS;
- optimizacion o variantes de tamaño;
- limites adecuados de peso y cantidad;
- eliminacion mediante identificador estable;
- costos y cuotas compatibles con el catalogo;
- respaldo o estrategia de migracion.

MongoDB almacena la URL y el identificador del proveedor, no el binario de la fotografia. Las credenciales viven solo en el backend. Cloudinary puede evaluarse, pero no se considera confirmado.

## Variables de entorno

Ejemplo orientativo:

```env
NODE_ENV=development
PORT=3000
MONGODB_URI=mongodb://127.0.0.1:27017/dgm
FRONTEND_ORIGIN=http://localhost:5173
SESSION_SECRET=reemplazar
IMAGE_PROVIDER=por_definir
IMAGE_PROVIDER_KEY=
IMAGE_PROVIDER_SECRET=
```

Reglas:

- mantener `.env` fuera de Git;
- versionar un `.env.example` sin valores reales;
- validar variables obligatorias al iniciar;
- usar credenciales distintas por ambiente;
- rotar cualquier secreto expuesto accidentalmente.

## Ejecucion local

Cuando la aplicacion Node haya sido inicializada:

```bash
npm install
npm run dev
```

Comandos esperados:

```bash
npm run dev       # servidor con recarga en desarrollo
npm start         # ejecucion de produccion
npm run lint      # analisis estatico
npm run test      # pruebas
```

Las versiones y los scripts reales son los definidos en `package.json`.

## Seguridad minima

- HTTPS obligatorio en produccion;
- CORS limitado al frontend autorizado;
- limites de tamaño y tipo para JSON y archivos;
- validacion de todos los datos de entrada;
- sanitizacion y proteccion contra operadores no permitidos en consultas;
- cabeceras de seguridad;
- rate limiting en autenticacion y operaciones sensibles;
- logs sin contraseñas, cookies, tokens ni secretos;
- principio de menor privilegio para MongoDB y el proveedor de imagenes;
- copias de seguridad y restauracion probada;
- dependencias revisadas y actualizadas de forma controlada.

## Errores y observabilidad

El middleware global de errores debe:

- traducir errores conocidos a codigos HTTP consistentes;
- asignar un identificador a cada solicitud;
- registrar contexto tecnico sin exponerlo al cliente;
- responder `404` para recursos inexistentes;
- finalizar de forma controlada ante fallos de dependencias.

Como minimo se deben monitorear disponibilidad, errores `5xx`, latencia y fallos de login. El historial detallado de auditoria puede incorporarse despues, pero `createdBy` y `updatedBy` deben quedar previstos desde el modelo inicial.

## Pruebas prioritarias

- login correcto, incorrecto, cuenta inactiva y limite de intentos;
- rechazo de rutas administrativas sin sesion;
- alta y edicion con datos validos e invalidos;
- filtros y paginacion del catalogo;
- transiciones de estado;
- slugs unicos;
- carga y eliminacion de imagenes con proveedor simulado;
- conflicto de actualizacion concurrente;
- eliminacion sin dejar imagenes huerfanas;
- manejo de MongoDB o proveedor de imagenes no disponible.

## Despliegue

El servicio productivo debe:

- ejecutarse en un host accesible por HTTPS;
- conectarse a MongoDB administrado o a una instancia protegida;
- no depender del disco local para persistencia;
- tener variables de entorno configuradas fuera del codigo;
- permitir despliegues repetibles;
- exponer un endpoint de salud;
- separar ambientes de desarrollo y produccion;
- contar con backup y procedimiento de recuperacion.

## Criterios de finalizacion

Una funcionalidad del backend se considera terminada cuando:

- valida autenticacion y autorizacion donde corresponde;
- valida entradas y devuelve errores consistentes;
- tiene pruebas de caso feliz y errores relevantes;
- no expone secretos ni datos internos;
- registra las operaciones necesarias;
- documenta cualquier cambio de contrato;
- funciona sin almacenamiento local persistente;
- supera lint y pruebas automatizadas.

## Pendientes de decision

- libreria o estrategia de acceso a MongoDB;
- proveedor externo de imagenes;
- estrategia final de sesion y renovacion;
- politica de visibilidad de publicaciones vendidas;
- borrado fisico o archivado de maquinarias;
- gestion de marcas y categorias desde el panel;
- proveedor de hosting, monitoreo y backups.

