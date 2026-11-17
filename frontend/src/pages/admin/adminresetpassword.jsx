
import { useEffect, useState } from "react";

import {
  useSearchParams,
  useNavigate,
} from "react-router-dom";

import {
  verifyPasswordResetCode,
  confirmPasswordReset,
} from "firebase/auth";

import { auth } from "../../firebase/config";

import AdminResetSuccess from "../../components/admin/adminresetsuccess";

import "../../styles/admin/adminlogin.css";

const AdminResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const mode = searchParams.get("mode");
  const oobCode = searchParams.get("oobCode");

  const [newPassword, setNewPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [validCode, setValidCode] = useState(
    () =>
      oobCode && mode === "resetPassword"
        ? null
        : false,
  );

  const [success, setSuccess] = useState(false);

  /* =========================================================
     VALIDAR ENLACE
  ========================================================= */

  useEffect(() => {
    let active = true;

    if (!oobCode || mode !== "resetPassword") {
      setValidCode(false);

      return () => {
        active = false;
      };
    }

    setValidCode(null);
    setError("");

    verifyPasswordResetCode(auth, oobCode)
      .then(() => {
        if (active) {
          setValidCode(true);
        }
      })
      .catch((err) => {
        console.error(
          "Error validando enlace:",
          err.code,
        );

        if (active) {
          setValidCode(false);
        }
      });

    return () => {
      active = false;
    };
  }, [oobCode, mode]);

  /* =========================================================
     CAMBIAR CONTRASEÑA
  ========================================================= */

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (!oobCode || validCode !== true) {
      setError(
        "El enlace de recuperación no es válido.",
      );

      return;
    }

    if (newPassword.length < 6) {
      setError(
        "La contraseña debe tener al menos 6 caracteres.",
      );

      return;
    }

    if (newPassword !== repeatPassword) {
      setError(
        "Las contraseñas no coinciden.",
      );

      return;
    }

    setLoading(true);

    try {
      await confirmPasswordReset(
        auth,
        oobCode,
        newPassword,
      );

      setSuccess(true);

      setNewPassword("");
      setRepeatPassword("");
    } catch (err) {
      console.error(
        "Error cambiando contraseña:",
        err,
      );

      if (
        err.code === "auth/expired-action-code" ||
        err.code === "auth/invalid-action-code"
      ) {
        setValidCode(false);

        setError(
          "El enlace expiró o ya fue utilizado. Solicitá uno nuevo.",
        );
      } else if (
        err.code === "auth/weak-password"
      ) {
        setError(
          "La contraseña no cumple con los requisitos de seguridad.",
        );
      } else {
        setError(
          "No pudimos cambiar la contraseña. Intentá nuevamente.",
        );
      }
    } finally {
      setLoading(false);
    }
  };

  /* =========================================================
     ÉXITO
  ========================================================= */

  if (success) {
    return (
      <main className="admin-login-page">
        <div className="admin-login-overlay" />

        <div className="admin-login-content">
          <AdminResetSuccess
            onLogin={() => navigate("/admin/login")}
          />
        </div>
      </main>
    );
  }

  /* =========================================================
     VERIFICANDO
  ========================================================= */

  if (validCode === null) {
    return (
      <main className="admin-login-page">
        <div className="admin-login-overlay" />

        <div className="admin-login-content">
          <div className="admin-card">
            <div className="admin-card-logo">
              <img src="/brand/dg-logo.png" alt="Logo" />
            </div>

            <div className="admin-card-header">
              <h1>Verificando enlace</h1>

              <p>
                Estamos comprobando la validez del enlace
                de recuperación.
              </p>
            </div>
          </div>
        </div>
      </main>
    );
  }

  /* =========================================================
     ENLACE INVÁLIDO
  ========================================================= */

  if (validCode === false) {
    return (
      <main className="admin-login-page">
        <div className="admin-login-overlay" />

        <div className="admin-login-content">
          <div className="admin-card">
            <div className="admin-card-logo">
              <img src="/brand/dg-logo.png" alt="Logo" />
            </div>

            <div className="admin-card-header">
              <h1>Enlace inválido</h1>

              <p>
                Este enlace expiró, ya fue utilizado o
                no es válido. Solicitá uno nuevo desde
                Recuperar cuenta.
              </p>
            </div>

            <button
              type="button"
              className="admin-primary-button"
              onClick={() => navigate("/admin/login")}
            >
              Volver al inicio de sesión
            </button>
          </div>
        </div>
      </main>
    );
  }

  /* =========================================================
     FORMULARIO
  ========================================================= */

  return (
    <main className="admin-login-page">
      <div className="admin-login-overlay" />

      <div className="admin-login-content">
        <div className="admin-card">
          <div className="admin-card-logo">
            <img src="/brand/dg-logo.png" alt="Logo" />
          </div>

          <div className="admin-card-header">
            <h1>Cambiar contraseña</h1>

            <p>
              Establecé una nueva contraseña para tu cuenta.
            </p>
          </div>

          <form
            className="admin-form"
            onSubmit={handleSubmit}
          >
            <div className="admin-field">
              <label htmlFor="new-password">
                Nueva contraseña
              </label>

              <input
                id="new-password"
                type="password"
                placeholder="••••••••"
                value={newPassword}
                onChange={(e) =>
                  setNewPassword(e.target.value)
                }
                autoComplete="new-password"
                minLength={6}
                required
              />
            </div>

            <div className="admin-field">
              <label htmlFor="repeat-password">
                Repetir contraseña
              </label>

              <input
                id="repeat-password"
                type="password"
                placeholder="••••••••"
                value={repeatPassword}
                onChange={(e) =>
                  setRepeatPassword(e.target.value)
                }
                autoComplete="new-password"
                minLength={6}
                required
              />
            </div>

            {error && (
              <p
                role="alert"
                style={{
                  color: "#8d1717",
                  fontSize: "13px",
                  margin: 0,
                }}
              >
                {error}
              </p>
            )}

            <button
              type="submit"
              className="admin-primary-button"
              disabled={loading}
            >
              {loading
                ? "Cambiando..."
                : "Cambiar contraseña"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
};

export default AdminResetPasswordPage;
