# Del Giorgio Maquinarias - Web

Sitio web oficial de **Del Giorgio Maquinarias**, orientado a presentar el negocio, publicar el catálogo de maquinaria agrícola nueva y usada y facilitar el contacto con clientes mediante WhatsApp, teléfono y los demás canales comerciales de la empresa.

El proyecto incluye una web pública y un panel administrativo protegido. Desde este panel, las personas autorizadas podrán mantener el catálogo actualizado desde cualquier ciudad y dispositivo con acceso a Internet.

## Objetivos

- Contar con una presencia web profesional bajo el dominio de la empresa.
- Centralizar el catálogo de maquinarias, la información comercial, la ubicación y los medios de contacto.
- Facilitar consultas mediante WhatsApp desde cada publicación.
- Permitir la administración remota del catálogo desde computadoras, tablets y celulares.
- Preparar la infraestructura para utilizar correo electrónico corporativo con el dominio del negocio.
- Mantener una arquitectura clara que permita incorporar mejoras sin rehacer el proyecto.

## Alcance funcional

### Sitio público

Los visitantes no necesitan registrarse ni iniciar sesión. Pueden:

- conocer la empresa y sus servicios;
- consultar maquinaria nueva y usada;
- filtrar publicaciones por marca, categoría y condición;
- acceder a fichas individuales con descripción, características e imágenes;
- visualizar el estado de cada maquinaria: disponible, reservada o vendida;
- consultar las marcas con las que trabaja la empresa;
- acceder a información sobre repuestos y servicio postventa;
- consultar la ubicación y los datos de contacto;
- comunicarse por WhatsApp desde cada publicación;
- acceder a las redes sociales de la empresa.

El proyecto no contempla cuentas de clientes, carrito de compras, pagos online, comentarios ni mensajería interna.

### Panel administrativo

El panel administrativo estará protegido mediante autenticación y será accesible por Internet desde distintos dispositivos.

Permitirá:

- crear, editar y eliminar publicaciones de maquinaria;
- marcar una maquinaria como disponible, reservada o vendida;
- indicar si una maquinaria es nueva o usada;
- destacar publicaciones;
- administrar descripciones y características técnicas;
- seleccionar marcas y categorías;
- cargar, ordenar y eliminar imágenes;
- mantener el mismo catálogo centralizado para todos los administradores.

La arquitectura permitirá utilizar varias cuentas administrativas, aunque inicialmente se comience con una sola. No se necesitan roles complejos: todos los administradores tendrán los mismos permisos.

## Tecnologías

### Frontend

- **React**
- **Vite**
- Interfaz responsive para escritorio, tablet y celular

### Backend

- **Node.js**
- **Express**
- API REST

### Base de datos

- **MongoDB**
- Servicio administrado accesible desde el backend

### Imágenes

Las fotografías se almacenarán en un servicio externo especializado. MongoDB guardará únicamente sus URLs y metadatos.

El proveedor todavía debe definirse. **Cloudinary** es una de las alternativas a evaluar, pero no se considera una decisión confirmada.

## Arquitectura general

```text
Visitantes                         Administradores
    |                                     |
    |                                     |
    +------------ React + Vite -----------+
                          |
                          | API REST / HTTPS
                          v
                   Node.js + Express
                          |
              +-----------+-----------+
              |                       |
              v                       v
           MongoDB          Servicio de imágenes
                                      externo
```

El frontend nunca se conecta directamente a MongoDB. La autenticación, la autorización y todas las operaciones de escritura se validan en el backend.

## Administración remota

El panel administrativo no estará asociado a una computadora ni a una red local. Los datos se almacenarán de forma centralizada, por lo que una modificación realizada desde un dispositivo estará disponible para los demás administradores al volver a consultar el catálogo.

```text
Administrador desde notebook
             |
             v
      Actualiza maquinaria
             |
             v
        API + MongoDB
             |
             v
Administrador desde celular
      consulta el mismo cambio
```

Si dos personas editan una misma publicación simultáneamente, el sistema deberá detectar o administrar el conflicto para evitar sobrescrituras silenciosas.

## Estructura del repositorio

```text
del-giorgio-maquinarias/
|-- docs/          # Arquitectura, requisitos y decisiones del proyecto
|-- frontend/      # Sitio público y panel administrativo en React + Vite
|-- backend/       # API, autenticación y lógica de negocio en Node.js + Express
|-- .gitignore
`-- README.md
```

Cada aplicación tiene su propia documentación:

- `frontend/README.md`: estructura, rutas, integración con la API y convenciones del frontend.
- `backend/README.md`: arquitectura, endpoints, modelos, seguridad y despliegue del backend.
- `docs/Documentacion_Tecnica_Del_Giorgio_Maquinarias.pdf`: alcance, tecnologías y arquitectura general.

## Flujo principal

### Consulta pública

```text
Visitante
   |
   v
Consulta el catálogo
   |
   v
Abre la ficha de una maquinaria
   |
   v
Selecciona "Consultar por WhatsApp"
```

### Administración del catálogo

```text
Administrador
   |
   v
Inicia sesión en /admin
   |
   v
Crea o modifica una maquinaria
   |
   +--> MongoDB guarda la información
   |
   `--> El servicio externo guarda las imágenes
```

## Seguridad

- El repositorio no debe contener credenciales ni secretos.
- Los archivos `.env`, las claves de API, las contraseñas y las credenciales de base de datos deben permanecer fuera del control de versiones.
- Las contraseñas administrativas deben almacenarse mediante hashes seguros.
- Las rutas administrativas deben validar autenticación y autorización en Express.
- La aplicación debe utilizar HTTPS en producción.
- El acceso a MongoDB y al servicio de imágenes debe realizarse con credenciales de privilegios limitados.
- No deben almacenarse fotografías de producción en el disco local del backend.

## Estado del proyecto

El alcance y la arquitectura principal se encuentran definidos. El proyecto está preparado para iniciar o continuar la implementación de:

1. estructura base del frontend y del backend;
2. modelos y API del catálogo;
3. sitio público;
4. autenticación administrativa;
5. gestión remota de maquinarias;
6. integración con el proveedor de imágenes;
7. pruebas, seguridad y despliegue.

## Decisiones pendientes

- proveedor externo de almacenamiento de imágenes;
- mecanismo definitivo de sesión administrativa;
- proveedores de hosting para frontend y backend;
- política de visibilidad de publicaciones vendidas;
- borrado definitivo o archivado de publicaciones;
- alcance final de la gestión de marcas y categorías.

## Documentación

La documentación técnica y funcional se encuentra en la carpeta `docs/`.

## Autoría

Proyecto desarrollado para **Del Giorgio Maquinarias**.
