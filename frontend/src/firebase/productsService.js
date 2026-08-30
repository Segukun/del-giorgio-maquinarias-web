// Capa de acceso a datos de productos.
//
// HOY: lee de mockProducts.js (array en memoria).
// MAÑANA: cuando se instale Firebase, el contenido de estas funciones
// se reemplaza por llamadas reales a Firestore, pero la firma (qué
// recibe y qué devuelve cada función) se mantiene igual — así ningún
// componente que ya las esté usando necesita cambiar.
//
// Pasos para migrar más adelante:
// 1. npm install firebase
// 2. Crear src/firebase/config.js con la inicialización del proyecto
// 3. Reemplazar el cuerpo de cada función acá abajo por getDocs/getDoc
// 4. Borrar mockProducts.js

import { MOCK_PRODUCTS } from "./mockProducts";

// Simula la latencia de red de una consulta real, para que el resto
// de la app ya esté preparada para trabajar de forma asíncrona
// (loading states, etc.) desde ahora.
const simulateDelay = (ms = 200) => new Promise((resolve) => setTimeout(resolve, ms));

export async function getAllProducts() {
  await simulateDelay();
  return MOCK_PRODUCTS;
}

export async function getFeaturedProducts() {
  await simulateDelay();
  return MOCK_PRODUCTS.filter((p) => p.featured);
}

export async function getProductById(id) {
  await simulateDelay();
  return MOCK_PRODUCTS.find((p) => String(p.id) === String(id)) ?? null;
}