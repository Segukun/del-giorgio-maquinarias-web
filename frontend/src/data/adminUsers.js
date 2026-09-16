// Cambiá únicamente este ID para probar la interfaz con otro rol:
// - "owner-1" representa al propietario.
// - "staff-1" representa una cuenta de personal.
export const MOCK_CURRENT_USER_ID = "owner-1";

// Las contraseñas nunca forman parte de estos datos mock.
// Firebase Auth reemplazará la identidad y Firestore podrá aportar el perfil público.
export const MOCK_ADMIN_USERS = [
  {
    id: "owner-1",
    name: "Segundo Del Giorgio",
    email: "segundo@delgiorgio.com.ar",
    role: "owner",
    status: "active",
  },
  {
    id: "staff-1",
    name: "Juan Pérez",
    email: "juan@delgiorgio.com.ar",
    role: "staff",
    status: "active",
  },
  {
    id: "staff-2",
    name: "María González",
    email: "maria@delgiorgio.com.ar",
    role: "staff",
    status: "active",
  },
  {
    id: "staff-3",
    name: "Luciano Fernández",
    email: "luciano@delgiorgio.com.ar",
    role: "staff",
    status: "active",
  },
  {
    id: "staff-4",
    name: "Camila Rossi",
    email: "camila@delgiorgio.com.ar",
    role: "staff",
    status: "inactive",
  },
];
