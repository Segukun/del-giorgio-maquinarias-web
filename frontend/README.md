# Frontend - Del Giorgio Maquinarias

Esta carpeta contiene la interfaz web pública de Del Giorgio Maquinarias.

## Responsabilidad

El frontend será responsable de presentar la información comercial de forma clara, rápida y responsive, priorizando la consulta directa por WhatsApp o teléfono.

## Principios generales

- Diseño simple, profesional y orientado al sector agropecuario.
- Navegación clara y con pocos niveles.
- Mobile-first / responsive.
- Reutilización de componentes.
- Evitar lógica de negocio compleja dentro de componentes visuales.
- Mantener estilos, componentes y datos claramente separados.
- Nombres de archivos y variables consistentes.
- No incluir secretos ni credenciales en el código cliente.

## Secciones previstas

- Inicio
- Nuevos
- Usados
- Marcas
- Repuestos y Servicio
- Nosotros
- Contacto

## Componentes principales previstos

- `Navbar`
- `Hero`
- `MachineCard`
- `FeaturedMachines`
- `BrandGrid`
- `CategoryGrid`
- `WhatsAppButton`
- `ContactSection`
- `MapSection`
- `Footer`

## Estructura sugerida

La estructura definitiva dependerá del framework elegido, pero se propone mantener una organización similar a esta:

```text
frontend/
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   ├── pages/
│   ├── services/
│   ├── styles/
│   ├── utils/
│   └── app/
├── README.md
└── .env.example
```

## Convenciones de código

### Componentes

- Componentes reutilizables en `components/`.
- Páginas completas en `pages/`.
- Un componente debe tener una responsabilidad principal.
- Evitar duplicar markup o lógica que pueda abstraerse.

### Nombres

Ejemplo sugerido:

```text
MachineCard.jsx
FeaturedMachines.jsx
WhatsAppButton.jsx
ContactPage.jsx
```

Funciones y variables:

```js
const machineList = [];
const handleWhatsAppClick = () => {};
```

### Estilos

- Utilizar una paleta consistente con la identidad de Del Giorgio Maquinarias.
- Rojo oscuro como color institucional/acento.
- Azul derivado del logo como color secundario.
- Fondos neutros para evitar saturación visual.
- Mantener buen contraste y legibilidad.

## Responsive

Como mínimo se deberán probar:

- Mobile.
- Tablet.
- Desktop.

No debe existir scroll horizontal accidental y los botones de contacto deben ser cómodos de utilizar desde dispositivos móviles.

## Integración con backend

Cuando exista una API, las solicitudes deberán centralizarse en `services/` y no distribuirse directamente por todos los componentes.

Ejemplo:

```text
services/
└── machinesService.js
```

## Variables de entorno

Las URLs o configuraciones dependientes del entorno deben utilizar variables de entorno. Nunca subir archivos `.env` con datos reales al repositorio.

## Prioridad de la V1

Para la primera versión se priorizará una web institucional funcional. No es obligatorio implementar desde el inicio un catálogo dinámico ni un panel administrativo.
