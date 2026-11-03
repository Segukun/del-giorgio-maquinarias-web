# Contacto

La ruta pública `/contacto` usa el `PublicLayout`, header, footer y botón flotante existentes.

La página incluye únicamente contacto directo y ubicación: WhatsApp, email y Google Maps con botón Cómo llegar. Conserva el hero y adapta las tarjetas y el mapa a pantallas pequeñas.

## Datos compartidos

- WhatsApp: **542281301249**, tomado del botón flotante original. Home, destacados, detalle, Contacto y footer usan `whatsappUrl` de `src/config/contact.js`.
- Dirección: **Constitución 345, Benito Juárez, Buenos Aires 7020**. El mapa y las indicaciones apuntan a las coordenadas **-37.6756492, -59.817902**, verificadas en el [perfil del negocio en Google Maps](https://maps.app.goo.gl/NpyX7QCTfPEJuLAK7). Esto evita que la búsqueda textual seleccione una dirección en la ciudad de Buenos Aires.
- Email confirmado: **delgiorgiomaquinarias@yahoo.com.ar**. Contacto y el footer lo muestran con enlace `mailto:`, sin aviso de correo provisional. Puede reemplazarse mediante `VITE_CONTACT_EMAIL` en `frontend/.env`; reiniciar Vite o recompilar después de cambiarlo.

Se retiraron el formulario, sus validaciones, el captcha, el envío de correo y la función de consultas del backend, junto con sus pruebas y configuración local. No hay requisitos de Resend ni Turnstile para usar esta página. No se desplegó la función de consultas ni se modificaron las funciones existentes de administración y estadísticas.

El secreto creado previamente en Firebase queda sin uso; no se eliminaron recursos remotos.
