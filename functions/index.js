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
      locations: {
        [locationKey]: FieldValue.increment(1), // objeto anidado, no string con punto
      },
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



// Agregar estos imports arriba, junto a los que ya tenés
const { onCall, HttpsError } = require("firebase-functions/v2/https");
const { getAuth } = require("firebase-admin/auth");

const FUNCTIONS_REGION = "southamerica-east1"; // misma región que ya usás

const requireOwner = async (request) => {
  if (!request.auth) {
    throw new HttpsError("unauthenticated", "Debés iniciar sesión.");
  }
  const callerDoc = await db.doc(`users/${request.auth.uid}`).get();
  if (!callerDoc.exists || callerDoc.data().role !== "owner") {
    throw new HttpsError("permission-denied", "Solo el propietario puede administrar personal.");
  }
};

exports.createStaffUser = onCall({ region: FUNCTIONS_REGION }, async (request) => {
  await requireOwner(request);
  const { name, email, password } = request.data;

  if (!name || !email || !password) {
    throw new HttpsError("invalid-argument", "Faltan datos obligatorios.");
  }

  let userRecord;
  try {
    userRecord = await getAuth().createUser({ email, password, displayName: name });
  } catch (err) {
    if (err.code === "auth/email-already-exists") {
      throw new HttpsError("already-exists", "Ya existe una cuenta con este email.");
    }
    throw new HttpsError("internal", "No se pudo crear la cuenta.");
  }

  await db.doc(`users/${userRecord.uid}`).set({
    name,
    email,
    role: "staff",
    status: "active",
    createdAt: FieldValue.serverTimestamp(),
  });

  return { uid: userRecord.uid };
});

exports.updateStaffUser = onCall({ region: FUNCTIONS_REGION }, async (request) => {
  try {
    await requireOwner(request);
    const { uid, name, email, password } = request.data;

    if (!uid) {
      throw new HttpsError("invalid-argument", "Falta el ID de usuario.");
    }

    const isSelfEdit = uid === request.auth.uid;

    const targetDoc = await db.doc(`users/${uid}`).get();
    if (!targetDoc.exists) {
      throw new HttpsError("failed-precondition", "La cuenta no existe.");
    }
    if (!isSelfEdit && targetDoc.data().role !== "staff") {
      throw new HttpsError("failed-precondition", "Solo se pueden editar cuentas de personal.");
    }

    const authUpdate = {};
    if (name) authUpdate.displayName = name;
    if (email) authUpdate.email = email;
    if (password) authUpdate.password = password;

    if (Object.keys(authUpdate).length) {
      try {
        await getAuth().updateUser(uid, authUpdate);
      } catch (err) {
        logger.error("Error actualizando usuario en Auth:", err);
        if (err.code === "auth/email-already-exists") {
          throw new HttpsError("already-exists", "Ya existe una cuenta con este email.");
        }
        if (err.code === "auth/invalid-password") {
          throw new HttpsError("invalid-argument", "La contraseña debe tener al menos 6 caracteres.");
        }
        throw new HttpsError("internal", "No se pudo actualizar la cuenta.");
      }
    }

    const firestoreUpdate = {};
    if (name) firestoreUpdate.name = name;
    if (email) firestoreUpdate.email = email;
    if (Object.keys(firestoreUpdate).length) {
      await db.doc(`users/${uid}`).set(firestoreUpdate, { merge: true });
    }

    return { success: true };
  } catch (err) {
    logger.error("updateStaffUser falló:", err);
    throw err;
  }
});

exports.deleteStaffUser = onCall({ region: FUNCTIONS_REGION }, async (request) => {
  await requireOwner(request);
  const { uid } = request.data;

  if (!uid) {
    throw new HttpsError("invalid-argument", "Falta el ID de usuario.");
  }

  const targetDoc = await db.doc(`users/${uid}`).get();
  if (!targetDoc.exists || targetDoc.data().role !== "staff") {
    throw new HttpsError("failed-precondition", "Solo se pueden eliminar cuentas de personal.");
  }

  await getAuth().deleteUser(uid);
  await db.doc(`users/${uid}`).delete();

  return { success: true };
});

exports.toggleStaffStatus = onCall({ region: FUNCTIONS_REGION }, async (request) => {
  await requireOwner(request);
  const { uid, status } = request.data;

  if (!uid || !["active", "inactive"].includes(status)) {
    throw new HttpsError("invalid-argument", "Datos inválidos.");
  }

  const targetDoc = await db.doc(`users/${uid}`).get();
  if (!targetDoc.exists || targetDoc.data().role !== "staff") {
    throw new HttpsError("failed-precondition", "Solo se puede cambiar el estado de personal.");
  }

  await getAuth().updateUser(uid, { disabled: status === "inactive" });
  await db.doc(`users/${uid}`).set({ status }, { merge: true });

  return { success: true };
});