# Backend - Del Giorgio Maquinarias

Esta carpeta estará destinada a la API, persistencia y lógica de negocio cuando el proyecto avance hacia una versión dinámica.

La V1 puede no requerir un backend completo si el contenido inicial es mayormente institucional y estático. La carpeta se mantiene desde el comienzo para separar responsabilidades y permitir una evolución ordenada.

## Responsabilidades futuras

- Gestión de maquinaria.
- Gestión de marcas.
- Gestión de categorías.
- Estados de publicación: disponible, reservado y vendido.
- Maquinaria destacada.
- Administración de imágenes o referencias a imágenes.
- Autenticación del panel administrativo.
- Validaciones.
- Persistencia en base de datos.

## Principios generales

- Separar rutas, controladores, servicios y acceso a datos.
- Validar toda entrada recibida desde el cliente.
- No exponer datos internos innecesarios.
- Utilizar variables de entorno para configuración y secretos.
- Mantener respuestas HTTP consistentes.
- Centralizar el manejo de errores.
- Evitar lógica SQL o de persistencia directamente dentro de las rutas.

## Estructura sugerida

La estructura final dependerá del stack, pero se propone:

```text
backend/
├── src/
│   ├── config/
│   ├── controllers/
│   ├── routes/
│   ├── services/
│   ├── models/
│   ├── middlewares/
│   ├── validators/
│   └── app.js
├── README.md
└── .env.example
```

## Convenciones de nombres

Ejemplo:

```text
machinesRoutes.js
machinesController.js
machinesService.js
machinesModel.js
brandsRoutes.js
brandsController.js
```

Funciones y variables deben expresar claramente su propósito:

```js
getMachines()
getMachineById(id)
createMachine(data)
updateMachine(id, data)
```

## API prevista

Una futura API podría organizarse bajo un prefijo versionado:

```text
/api/v1
```

Ejemplo conceptual:

```text
GET    /api/v1/machines
GET    /api/v1/machines/:id
POST   /api/v1/machines
PUT    /api/v1/machines/:id
DELETE /api/v1/machines/:id

GET    /api/v1/brands
GET    /api/v1/categories
```

Estos endpoints son una referencia inicial y podrán modificarse según los requisitos definitivos.

## Respuestas HTTP

Mantener criterios consistentes:

- `200` para operaciones exitosas.
- `201` para recursos creados.
- `400` para solicitudes inválidas.
- `401` para falta de autenticación.
- `403` para operaciones no autorizadas.
- `404` cuando el recurso no existe.
- `500` para errores internos no controlados.

## Variables de entorno

Nunca subir credenciales reales al repositorio.

Ejemplo de `.env.example` futuro:

```env
PORT=
DATABASE_HOST=
DATABASE_NAME=
DATABASE_USER=
DATABASE_PASSWORD=
```

## Seguridad

- Validar y sanitizar entradas.
- Proteger endpoints administrativos.
- No almacenar contraseñas en texto plano.
- Mantener secretos únicamente en variables de entorno.
- Revisar permisos antes de implementar operaciones administrativas.

## Prioridad de la V1

No se debe agregar complejidad de backend si la primera versión puede cumplir su objetivo comercial con contenido estático. El backend se incorporará cuando exista una necesidad concreta de administrar publicaciones desde la propia web.
