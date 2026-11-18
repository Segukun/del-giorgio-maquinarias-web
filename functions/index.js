
/* =========================================================
   IMPORTACIONES
========================================================= */

const { initializeApp } = require("firebase-admin/app");

const {
  getFirestore,
  FieldValue,
  Timestamp,
} = require("firebase-admin/firestore");

const { getAuth } = require("firebase-admin/auth");

const {
  onDocumentCreated,
} = require("firebase-functions/v2/firestore");

const {
  onCall,
  HttpsError,
} = require("firebase-functions/v2/https");

const { defineSecret } = require("firebase-functions/params");
const { logger } = require("firebase-functions");

const { createHash } = require("node:crypto");

/* =========================================================
   INICIALIZACIÓN
========================================================= */

initializeApp();

const db = getFirestore();

const FUNCTIONS_REGION = "southamerica-east1";

/* =========================================================
   UTILIDADES
========================================================= */

const todayKey = (date = new Date()) => {
  return date.toISOString().slice(0, 10);
};

const capitalize = (value) => {
  const normalized = String(value || "other");

  return normalized.charAt(0).toUpperCase() +
    normalized.slice(1);
};

/* =========================================================
   TRIGGER: NUEVA SESIÓN
========================================================= */

exports.onSessionCreated = onDocumentCreated(
  "sessions/{sessionId}",
  async (event) => {
    const session = event.data.data();

    const dateKey = todayKey(
      session.createdAt?.toDate?.() ?? new Date(),
    );

    const statsRef = db.doc(`dailyStats/${dateKey}`);

    const sourceField =
      `source${capitalize(session.referrerSource ?? "other")}`;

    const deviceField =
      `device${capitalize(session.device ?? "desktop")}`;

    const locationKey =
      session.city && session.province
        ? `${session.province}-${session.city}`
        : "Desconocida";

    await statsRef.set(
      {
        sessionsTotal: FieldValue.increment(1),
        newSessionsTotal: FieldValue.increment(1),

        [sourceField]: FieldValue.increment(1),
        [deviceField]: FieldValue.increment(1),

        locations: {
          [locationKey]: FieldValue.increment(1),
        },
      },
      { merge: true },
    );
  },
);

/* =========================================================
   TRIGGER: NUEVO EVENTO
========================================================= */

exports.onEventCreated = onDocumentCreated(
  "events/{eventId}",
  async (event) => {
    const data = event.data.data();

    const dateKey = todayKey(
      data.createdAt?.toDate?.() ?? new Date(),
    );

    const statsRef = db.doc(`dailyStats/${dateKey}`);

    if (data.type === "product_view") {
      await statsRef.set(
        {
          productViewsTotal: FieldValue.increment(1),
        },
        { merge: true },
      );

      if (data.productId) {
        const productStatsRef =
          db.doc(`productStats/${data.productId}`);

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
        {
          whatsappClicksTotal: FieldValue.increment(1),
        },
        { merge: true },
      );

      if (data.sessionId) {
        await db
          .doc(`sessions/${data.sessionId}`)
          .set(
            { hadInteraction: true },
            { merge: true },
          );
      }
    }
  },
);

/* =========================================================
   ADMINISTRACIÓN DE PERSONAL
========================================================= */

const KNOWN_ROLES = ["owner", "admin", "staff"];

// Roles que cada rol puede editar, eliminar y activar/desactivar.
// Nadie administra a un owner ni a alguien de su mismo nivel.
const MANAGEABLE_ROLES = {
  owner: ["admin", "staff"],
  admin: ["staff"],
  staff: [],
};

// Roles con los que cada rol puede crear una cuenta nueva.
const CREATABLE_ROLES = {
  owner: ["admin", "staff"],
  admin: ["staff"],
  staff: [],
};

// Cambio de rol sobre una cuenta ajena:
// - owner: puede dejar a admins y staff como admin o staff.
// - admin: solo puede promover un staff a admin.
const canSetRole = (actorRole, targetRole, newRole) => {
  if (!MANAGEABLE_ROLES[actorRole]?.includes(targetRole)) return false;
  if (actorRole === "owner") return ["admin", "staff"].includes(newRole);
  if (actorRole === "admin") return targetRole === "staff" && newRole === "admin";
  return false;
};

// El rol siempre se lee de Firestore, nunca del request.
const getCaller = async (request) => {
  if (!request.auth) {
    throw new HttpsError("unauthenticated", "Debés iniciar sesión.");
  }

  const snap = await db.doc(`users/${request.auth.uid}`).get();
  const data = snap.exists ? snap.data() : null;

  if (!data || !KNOWN_ROLES.includes(data.role) || data.status === "inactive") {
    throw new HttpsError(
      "permission-denied",
      "Tu cuenta no tiene permisos para realizar esta acción.",
    );
  }

  return { uid: request.auth.uid, role: data.role };
};

const getTarget = async (uid) => {
  const snap = await db.doc(`users/${uid}`).get();

  if (!snap.exists) {
    throw new HttpsError("not-found", "La cuenta no existe.");
  }

  return { uid, ...snap.data() };
};

const assertCanManage = (caller, target, message) => {
  const allowed =
    target.uid !== caller.uid &&
    MANAGEABLE_ROLES[caller.role].includes(target.role);

  if (!allowed) {
    throw new HttpsError("permission-denied", message);
  }
};

/* =========================================================
   CREAR USUARIO DE PERSONAL
========================================================= */

exports.createStaffUser = onCall(
  { region: FUNCTIONS_REGION },
  async (request) => {
    const caller = await getCaller(request);

    const { name, email, password } = request.data || {};
    const role = request.data?.role ?? "staff";

    if (!name || !email || !password) {
      throw new HttpsError(
        "invalid-argument",
        "Faltan datos obligatorios.",
      );
    }

    if (!CREATABLE_ROLES[caller.role].includes(role)) {
      throw new HttpsError(
        "permission-denied",
        "No tenés permiso para crear una cuenta con este rol.",
      );
    }

    let userRecord;

    try {
      userRecord = await getAuth().createUser({
        email,
        password,
        displayName: name,
      });
    } catch (err) {
      if (err.code === "auth/email-already-exists") {
        throw new HttpsError(
          "already-exists",
          "Ya existe una cuenta con este email.",
        );
      }

      if (err.code === "auth/invalid-password") {
        throw new HttpsError(
          "invalid-argument",
          "La contraseña debe tener al menos 6 caracteres.",
        );
      }

      logger.error("No se pudo crear el usuario:", {
        code: err.code,
      });

      throw new HttpsError(
        "internal",
        "No se pudo crear la cuenta.",
      );
    }

    await db.doc(`users/${userRecord.uid}`).set({
      name,
      email,
      role,
      status: "active",
      createdAt: FieldValue.serverTimestamp(),
    });

    return { uid: userRecord.uid };
  },
);

/* =========================================================
   ACTUALIZAR USUARIO DE PERSONAL
========================================================= */

exports.updateStaffUser = onCall(
  { region: FUNCTIONS_REGION },
  async (request) => {
    try {
      const caller = await getCaller(request);

      const { uid, name, email, password, role } = request.data || {};

      if (!uid) {
        throw new HttpsError(
          "invalid-argument",
          "Falta el ID de usuario.",
        );
      }

      const isSelfEdit = uid === caller.uid;
      const target = await getTarget(uid);

      // Cualquier rol puede editar su propia cuenta.
      // Para cuentas ajenas se aplica la jerarquía.
      if (!isSelfEdit) {
        assertCanManage(
          caller,
          target,
          "No tenés permiso para editar esta cuenta.",
        );
      }

      // El rol solo cambia sobre cuentas ajenas y según la jerarquía.
      let newRole;

      if (role !== undefined && role !== target.role) {
        if (isSelfEdit || !canSetRole(caller.role, target.role, role)) {
          throw new HttpsError(
            "permission-denied",
            "No tenés permiso para cambiar el rol de esta cuenta.",
          );
        }

        newRole = role;
      }

      const authUpdate = {};

      if (name) authUpdate.displayName = name;
      if (email) authUpdate.email = email;
      if (password) authUpdate.password = password;

      if (Object.keys(authUpdate).length) {
        try {
          await getAuth().updateUser(uid, authUpdate);
        } catch (err) {
          logger.error("Error actualizando Auth:", {
            code: err.code,
          });

          if (err.code === "auth/email-already-exists") {
            throw new HttpsError(
              "already-exists",
              "Ya existe una cuenta con este email.",
            );
          }

          if (err.code === "auth/invalid-password") {
            throw new HttpsError(
              "invalid-argument",
              "La contraseña debe tener al menos 6 caracteres.",
            );
          }

          throw new HttpsError(
            "internal",
            "No se pudo actualizar la cuenta.",
          );
        }
      }

      const firestoreUpdate = {};

      if (name) firestoreUpdate.name = name;
      if (email) firestoreUpdate.email = email;
      if (newRole) firestoreUpdate.role = newRole;

      if (Object.keys(firestoreUpdate).length) {
        await db
          .doc(`users/${uid}`)
          .set(firestoreUpdate, { merge: true });
      }

      return { success: true };
    } catch (err) {
      logger.error("updateStaffUser falló:", {
        code: err.code,
        message: err.message,
      });

      throw err;
    }
  },
);

/* =========================================================
   ELIMINAR USUARIO DE PERSONAL
========================================================= */

exports.deleteStaffUser = onCall(
  { region: FUNCTIONS_REGION },
  async (request) => {
    const caller = await getCaller(request);

    const { uid } = request.data || {};

    if (!uid) {
      throw new HttpsError(
        "invalid-argument",
        "Falta el ID de usuario.",
      );
    }

    const target = await getTarget(uid);

    assertCanManage(
      caller,
      target,
      "No tenés permiso para eliminar esta cuenta.",
    );

    await getAuth().deleteUser(uid);
    await db.doc(`users/${uid}`).delete();

    return { success: true };
  },
);

/* =========================================================
   CAMBIAR ESTADO DE USUARIO DE PERSONAL
========================================================= */

exports.toggleStaffStatus = onCall(
  { region: FUNCTIONS_REGION },
  async (request) => {
    const caller = await getCaller(request);

    const { uid, status } = request.data || {};

    if (!uid || !["active", "inactive"].includes(status)) {
      throw new HttpsError(
        "invalid-argument",
        "Datos inválidos.",
      );
    }

    const target = await getTarget(uid);

    assertCanManage(
      caller,
      target,
      "No tenés permiso para cambiar el estado de esta cuenta.",
    );

    await getAuth().updateUser(uid, {
      disabled: status === "inactive",
    });

    await db.doc(`users/${uid}`).set(
      { status },
      { merge: true },
    );

    return { success: true };
  },
);

/* =========================================================
   RESEND: CONFIGURACIÓN
========================================================= */

const resendApiKey = defineSecret("RESEND_API_KEY");

const RESET_EMAIL_FROM =
  "Del Giorgio Maquinarias <no-reply@dgm.delgiorgiomaquinarias.com.ar>";

const RESET_PASSWORD_PAGE =
  "https://www.delgiorgiomaquinarias.com.ar/admin/reset-password";

const passwordResetEmail =
  require("./emails/passwordResetEmail.js");

/* =========================================================
   LÍMITES DE SOLICITUDES
========================================================= */

const PASSWORD_RESET_WINDOW_MS = 60 * 60 * 1000;

const PASSWORD_RESET_LIMITS = {
  email: 3,
  ip: 12,
};

const hashRateLimitKey = (scope, value) => {
  return createHash("sha256")
    .update(`${scope}:${value}`)
    .digest("hex");
};

const consumePasswordResetRateLimit = async (
  email,
  ip,
) => {
  const checks = [
    {
      scope: "email",
      value: email,
      limit: PASSWORD_RESET_LIMITS.email,
    },
  ];

  if (ip && ip !== "unknown") {
    checks.push({
      scope: "ip",
      value: ip,
      limit: PASSWORD_RESET_LIMITS.ip,
    });
  }

  const refs = checks.map((item) => {
    const id = hashRateLimitKey(
      item.scope,
      item.value,
    );

    return db
      .collection("passwordResetRateLimits")
      .doc(id);
  });

  const now = Date.now();

  await db.runTransaction(async (transaction) => {
    const snapshots = await Promise.all(
      refs.map((ref) => transaction.get(ref)),
    );

    const updates = snapshots.map((snapshot, index) => {
      const previous = snapshot.exists
        ? snapshot.data()
        : {};

      const previousStart =
        previous.windowStartedAt?.toMillis?.() ?? 0;

      const expired =
        !previousStart ||
        now - previousStart >= PASSWORD_RESET_WINDOW_MS;

      const currentCount = expired
        ? 0
        : Number(previous.count ?? 0);

      const startedAt = expired
        ? now
        : previousStart;

      if (currentCount >= checks[index].limit) {
        throw new HttpsError(
          "resource-exhausted",
          "Se alcanzó el límite de solicitudes. Intentá nuevamente más tarde.",
        );
      }

      return {
        count: currentCount + 1,

        windowStartedAt:
          Timestamp.fromMillis(startedAt),

        expiresAt: Timestamp.fromMillis(
          startedAt + PASSWORD_RESET_WINDOW_MS * 2,
        ),

        updatedAt: FieldValue.serverTimestamp(),
      };
    });

    updates.forEach((data, index) => {
      transaction.set(refs[index], data);
    });
  });
};

/* =========================================================
   RECUPERAR CONTRASEÑA
========================================================= */

exports.requestAdminPasswordReset = onCall(
  {
    region: FUNCTIONS_REGION,

    // Exige un token válido de Firebase App Check.
    enforceAppCheck: true,

    // Resend solo está disponible en esta función.
    secrets: [resendApiKey],

    cors: [
      "https://www.delgiorgiomaquinarias.com.ar",
      "https://delgiorgiomaquinarias.com.ar",
      "http://localhost:5173",
    ],
  },

  async (request) => {
    const email =
      typeof request.data?.email === "string"
        ? request.data.email.trim().toLowerCase()
        : "";

    const validEmail =
      email.length <= 254 &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    if (!validEmail) {
      throw new HttpsError(
        "invalid-argument",
        "Ingresá una dirección de correo válida.",
      );
    }

    /* =====================================================
       CONTROL DE SOLICITUDES
    ===================================================== */

    const ip =
      request.rawRequest?.ip ||
      request.rawRequest?.socket?.remoteAddress ||
      "unknown";

    try {
      await consumePasswordResetRateLimit(email, ip);
    } catch (err) {
      if (err instanceof HttpsError) {
        throw err;
      }

      logger.error(
        "Error aplicando el límite de solicitudes:",
        { message: err.message },
      );

      throw new HttpsError(
        "internal",
        "No se pudo procesar la solicitud.",
      );
    }

    /* =====================================================
       GENERAR LINK CON FIREBASE ADMIN
    ===================================================== */

    let actionLink;

    try {
      actionLink =
        await getAuth().generatePasswordResetLink(email);
    } catch (err) {
      // No revelamos si el usuario existe.
      if (
        err.code === "auth/user-not-found" ||
        err.code === "auth/user-disabled"
      ) {
        return { success: true };
      }

      logger.error(
        "Error generando el enlace de recuperación:",
        { code: err.code },
      );

      throw new HttpsError(
        "internal",
        "No se pudo procesar la solicitud.",
      );
    }

    /* =====================================================
       EXTRAER CÓDIGO
    ===================================================== */

    let oobCode;

    try {
      const generatedUrl = new URL(actionLink);

      oobCode =
        generatedUrl.searchParams.get("oobCode");
    } catch (err) {
      logger.error(
        "No se pudo interpretar el enlace generado por Firebase.",
      );

      throw new HttpsError(
        "internal",
        "No se pudo procesar la solicitud.",
      );
    }

    if (!oobCode) {
      logger.error(
        "El enlace generado no contiene oobCode.",
      );

      throw new HttpsError(
        "internal",
        "No se pudo procesar la solicitud.",
      );
    }

    /* =====================================================
       CONSTRUIR LINK PROPIO
    ===================================================== */

    const resetUrl = new URL(RESET_PASSWORD_PAGE);

    resetUrl.searchParams.set("mode", "resetPassword");
    resetUrl.searchParams.set("oobCode", oobCode);

    /* =====================================================
       ENVIAR CORREO CON RESEND
    ===================================================== */

    try {
      const { Resend } = await import("resend");

      const resend = new Resend(resendApiKey.value());

      const { data, error } = await resend.emails.send({
        from: RESET_EMAIL_FROM,

        to: [email],

        subject: "Restablecé tu contraseña",

        html: passwordResetEmail(resetUrl.toString()),

        text:
          "Recibimos una solicitud para restablecer tu contraseña.\n\n" +
          "Ingresá en este enlace para establecer una nueva contraseña:\n\n" +
          resetUrl.toString() +
          "\n\nSi no solicitaste este cambio, podés ignorar este mensaje.",
      });

      if (error) {
        logger.error(
          "Resend rechazó el correo:",
          {
            message: error.message,
            statusCode: error.statusCode,
          },
        );

        return { success: true };
      }

      logger.info(
        "Correo de recuperación enviado.",
        { emailId: data?.id },
      );

      return { success: true };
    } catch (err) {
      logger.error(
        "Error enviando correo con Resend:",
        { message: err.message },
      );

      return { success: true };
    }
  },
);
