const { onDocumentCreated } = require("firebase-functions/v2/firestore");
const { initializeApp } = require("firebase-admin/app");
const { getFirestore, FieldValue } = require("firebase-admin/firestore");

initializeApp();
const db = getFirestore();

const todayKey = (date = new Date()) => {
  // Usamos fecha en UTC para simplicidad; si necesitás timezone AR exacta, se puede ajustar
  return date.toISOString().slice(0, 10); // "YYYY-MM-DD"
};

/* =========================================================
   TRIGGER: nueva sesión creada
========================================================= */
exports.onSessionCreated = onDocumentCreated("sessions/{sessionId}", async (event) => {
  const session = event.data.data();
  const dateKey = todayKey(session.createdAt?.toDate?.() ?? new Date());
  const statsRef = db.doc(`dailyStats/${dateKey}`);

  const sourceField = `source${capitalize(session.referrerSource ?? "other")}`;
  const deviceField = `device${capitalize(session.device ?? "desktop")}`;
  const locationKey = session.city && session.province
    ? `${session.province}-${session.city}`
    : "Desconocida";

  await statsRef.set(
    {
      sessionsTotal: FieldValue.increment(1),
      newSessionsTotal: FieldValue.increment(1),
      [sourceField]: FieldValue.increment(1),
      [deviceField]: FieldValue.increment(1),
      [`locations.${locationKey}`]: FieldValue.increment(1),
    },
    { merge: true },
  );
});

/* =========================================================
   TRIGGER: nuevo evento (vista de producto o click WhatsApp)
========================================================= */
exports.onEventCreated = onDocumentCreated("events/{eventId}", async (event) => {
  const data = event.data.data();
  const dateKey = todayKey(data.createdAt?.toDate?.() ?? new Date());
  const statsRef = db.doc(`dailyStats/${dateKey}`);

  if (data.type === "product_view") {
    await statsRef.set(
      { productViewsTotal: FieldValue.increment(1) },
      { merge: true },
    );

    if (data.productId) {
      const productStatsRef = db.doc(`productStats/${data.productId}`);
      await productStatsRef.set(
        {
          name: data.productName ?? "",
          viewCount: FieldValue.increment(1),
          lastViewedAt: data.createdAt,
        },
        { merge: true },
      );
    }
  }

  if (data.type === "whatsapp_click") {
    await statsRef.set(
      { whatsappClicksTotal: FieldValue.increment(1) },
      { merge: true },
    );

    // Marcamos la sesión como interactiva, para calcular tasa de interactividad
    if (data.sessionId) {
      await db.doc(`sessions/${data.sessionId}`).set(
        { hadInteraction: true },
        { merge: true },
      );
    }
  }
});

const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);