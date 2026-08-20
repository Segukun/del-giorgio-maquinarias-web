# Del Giorgio Maquinarias - Frontend

Frontend de la web publica y del panel administrativo de Del Giorgio Maquinarias. La aplicacion se construira con React y Vite, consumira una API REST propia y sera responsive para funcionar en computadoras, tablets y telefonos.

## Estado y decisiones del proyecto

| Tema | Decision |
| --- | --- |
| Framework | React |
| Herramienta de desarrollo y build | Vite |
| Backend | API REST en Node.js + Express |
| Datos | MongoDB, accedido unicamente por el backend |
| Visitantes | No crean cuentas ni inician sesion |
| Administracion | Panel protegido y disponible por Internet |
| Contacto comercial | Enlace directo a WhatsApp desde cada maquinaria |
| Imagenes | Servicio externo a definir; el frontend trabaja con URLs |

El proveedor de imagenes no esta elegido. Cloudinary es una alternativa posible, pero no debe acoplarse la interfaz a un proveedor concreto hasta tomar esa decision.

## Objetivo

La aplicacion tiene dos areas dentro del mismo frontend:

1. **Sitio publico:** presenta la empresa y permite consultar el catalogo de maquinarias nuevas y usadas.
2. **Panel administrativo:** permite que personas autorizadas administren el catalogo desde cualquier ciudad y dispositivo.

La accion comercial principal es **Consultar por WhatsApp**. El sitio no contempla registro de clientes, carrito, pagos, comentarios ni mensajeria interna.

## Alcance funcional

### Sitio publico

- inicio institucional con hero, destacados y marcas;
- catalogo de maquinarias nuevas y usadas;
- filtros por condicion, marca y categoria;
- ficha individual con galeria, descripcion y especificaciones;
- estados visible de cada maquinaria: disponible, reservada o vendida;
- secciones Marcas, Nosotros y Contacto;
- boton flotante de WhatsApp y consulta contextual desde cada ficha;
- diseno responsive y accesible.

### Panel administrativo

- inicio de sesion de administradores;
- listado, busqueda y filtrado de maquinarias;
- alta, edicion y eliminacion de publicaciones;
- gestion de estado, condicion y destacados;
- carga, orden y eliminacion de imagenes;
- seleccion de marca y categoria;
- gestion basica de marcas y categorias, si finalmente se habilita en el alcance;
- cierre de sesion y manejo claro de sesiones vencidas.

El panel debe poder utilizarse en simultaneo desde varios dispositivos. La autorizacion real de las operaciones se valida siempre en el backend; ocultar una pantalla en React no constituye una medida de seguridad.

## Rutas previstas

### Publicas

| Ruta | Proposito |
| --- | --- |
| `/` | Inicio |
| `/nuevos` | Catalogo filtrado por maquinaria nueva |
| `/usados` | Catalogo filtrado por maquinaria usada |
| `/maquinas/:slug` | Ficha de una maquinaria |
| `/marcas` | Marcas que trabaja la empresa |
| `/nosotros` | Informacion institucional |
| `/contacto` | Datos de contacto, ubicacion y WhatsApp |

### Administrativas

| Ruta | Proposito |
| --- | --- |
| `/admin/login` | Inicio de sesion |
| `/admin` | Resumen del catalogo |
| `/admin/maquinas` | Gestion de maquinarias |
| `/admin/maquinas/nueva` | Alta de maquinaria |
| `/admin/maquinas/:id/editar` | Edicion de maquinaria |
| `/admin/marcas` | Gestion de marcas, si se incluye |
| `/admin/categorias` | Gestion de categorias, si se incluye |

## Estructura propuesta

```text
frontend/
|-- public/
|   |-- icons/
|   |-- images/
|   `-- logos/
|-- src/
|   |-- api/              # Cliente HTTP y modulos por recurso
|   |-- app/              # Router, providers y configuracion global
|   |-- components/       # Componentes reutilizables
|   |   |-- common/
|   |   |-- layout/
|   |   |-- machines/
|   |   `-- admin/
|   |-- features/         # Logica agrupada por funcionalidad
|   |   |-- auth/
|   |   |-- machines/
|   |   |-- brands/
|   |   `-- categories/
|   |-- hooks/            # Hooks reutilizables
|   |-- pages/            # Pantallas asociadas a rutas
|   |   |-- public/
|   |   `-- admin/
|   |-- styles/           # Variables, reset y estilos globales
|   |-- utils/            # Funciones puras y helpers
|   |-- App.jsx
|   `-- main.jsx
|-- .env.example
|-- index.html
|-- package.json
|-- vite.config.js
`-- README.md
```

La estructura es una referencia. Solo deben crearse carpetas cuando exista codigo que las justifique.

## Flujo de datos

```text
Pantalla o formulario
        |
        v
Hook / modulo de feature
        |
        v
Cliente API
        |
        v
Node.js + Express
        |
        +--> MongoDB
        `--> Servicio externo de imagenes
```

- React nunca se conecta directamente a MongoDB.
- Las credenciales del proveedor de imagenes no se exponen en variables `VITE_*`.
- El backend devuelve URLs y metadatos de las imagenes ya almacenadas.
- Las respuestas de la API se transforman en el modulo de acceso a datos, no dentro de componentes visuales.

## Integracion con la API

Se recomienda centralizar las llamadas y utilizar una URL base configurable:

```env
VITE_API_URL=http://localhost:3000/api
VITE_WHATSAPP_NUMBER=5490000000000
```

Variables que comienzan con `VITE_` quedan disponibles en el navegador. No deben contener secretos, tokens privados ni credenciales.

Recursos previstos:

```text
GET    /machines
GET    /machines/:slug
GET    /brands
GET    /categories
POST   /auth/login
POST   /auth/logout
GET    /auth/me
POST   /admin/machines
PUT    /admin/machines/:id
PATCH  /admin/machines/:id/status
DELETE /admin/machines/:id
```

El contrato definitivo, los codigos de respuesta y la estrategia de sesion deben mantenerse sincronizados con `backend/README.md`.

## Formularios administrativos

Los formularios deben:

- mostrar validaciones junto al campo correspondiente;
- impedir envios duplicados mientras una operacion esta en curso;
- conservar los datos ingresados ante errores recuperables;
- pedir confirmacion antes de eliminar una publicacion;
- informar exito o error con mensajes claros;
- permitir reordenar imagenes y elegir una portada;
- funcionar con controles tactiles, no solo con mouse;
- advertir si una edicion intenta guardar sobre datos que cambiaron en otro dispositivo, cuando el backend implemente control de concurrencia.

## Imagenes

El frontend debe tratar la subida mediante una abstraccion independiente del proveedor. El flujo esperado es:

```text
Administrador selecciona fotos
             |
             v
Validacion de tipo, cantidad y peso
             |
             v
Backend / mecanismo de carga autorizado
             |
             v
Servicio externo de imagenes
             |
             v
URL y identificador guardados por el backend
```

Requisitos minimos de interfaz:

- vista previa antes de publicar;
- progreso y estado de cada archivo;
- mensaje util cuando una carga falla;
- texto alternativo para la imagen principal;
- carga diferida en el catalogo;
- dimensiones reservadas para evitar saltos de contenido.

## WhatsApp

Cada ficha debe construir un mensaje contextual y codificado para URL, por ejemplo:

```text
Hola, quiero consultar por la maquinaria Mainero 5937 publicada en su sitio.
```

El numero se configura por ambiente. No se necesita integrar la API empresarial de WhatsApp para el alcance actual.

## Ejecucion local

Cuando el proyecto React haya sido inicializado:

```bash
npm install
npm run dev
```

Comandos esperados:

```bash
npm run dev       # servidor local de Vite
npm run build     # build de produccion
npm run preview   # revision local del build
npm run lint      # analisis estatico
npm run test      # pruebas, cuando se configure el runner
```

No se fijan versiones en este documento. Las versiones reales y los scripts validos son los declarados en `package.json`.

## Convenciones

- componentes en `PascalCase`;
- hooks con prefijo `use`;
- funciones y variables en `camelCase`;
- una responsabilidad principal por componente;
- componentes visuales sin llamadas HTTP directas;
- estados de carga, vacio y error en cada pantalla de datos;
- estilos y textos reutilizables centralizados;
- nombres tecnicos en ingles y textos visibles en espanol;
- imports consistentes y sin dependencias circulares;
- ningun secreto dentro del repositorio.

## Accesibilidad y experiencia

- navegacion completa con teclado;
- foco visible;
- contraste legible;
- etiquetas en todos los campos;
- iconos acompañados por texto o nombre accesible;
- mensajes de error que indiquen como resolver el problema;
- soporte desde 320 px de ancho;
- objetivos tactiles de tamaño suficiente en el panel movil.

## Seguridad desde el frontend

El frontend puede mejorar la experiencia, pero no reemplaza la seguridad del servidor:

- no guardar contraseñas;
- evitar tokens persistentes en `localStorage` si se utilizan cookies seguras;
- no confiar en roles o permisos enviados por el navegador;
- no renderizar HTML sin sanitizacion;
- cerrar la sesion visual ante una respuesta `401`;
- proteger las rutas administrativas como experiencia de navegacion y validar cada accion nuevamente en la API.

## Criterios de finalizacion

Una funcionalidad del frontend se considera terminada cuando:

- funciona en escritorio y movil;
- contempla carga, error, vacio y exito;
- tiene validacion de entradas;
- no expone datos sensibles;
- respeta el contrato de la API;
- supera lint, build y pruebas relacionadas;
- tiene textos y acciones comprensibles para usuarios no tecnicos.

## Pendientes de decision

- proveedor externo de imagenes;
- mecanismo final de sesion definido junto con el backend;
- biblioteca de routing y de obtencion de datos;
- alcance exacto de la administracion de marcas y categorias;
- sistema de estilos definitivo;
- herramienta de pruebas y monitoreo.

