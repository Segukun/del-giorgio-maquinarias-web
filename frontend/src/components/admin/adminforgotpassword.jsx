
import { useState } from "react";

import { httpsCallable } from "firebase/functions";
import { functions } from "../../firebase/config";

const requestPasswordReset = httpsCallable(
  functions,
  "requestAdminPasswordReset",
);

const AdminForgotPassword = ({ onBack }) => {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      await requestPasswordReset({
        email: email.trim().toLowerCase(),
      });

      setSent(true);
    } catch (err) {
      console.error(
        "Error solicitando recuperación:",
        err,
      );

      if (err.code === "functions/resource-exhausted") {
        setError(
          "Realizaste demasiadas solicitudes. Intentá nuevamente más tarde.",
        );
      } else if (err.code === "functions/invalid-argument") {
        setError(
          "Ingresá una dirección de correo válida.",
        );
      } else {
        setError(
          "No pudimos procesar la solicitud. Intentá nuevamente más tarde.",
        );
      }
    } finally {
      setLoading(false);
    }
  };

  /* =========================================================
     CONFIRMACIÓN DE SOLICITUD
  ========================================================= */

  if (sent) {
    return (
      <div className="admin-card">
        <div className="admin-card-logo">
          <img
            src="/brand/dg-logo.png"
            alt="Del Giorgio Maquinarias"
          />
        </div>

        <div className="admin-card-header">
          <h1>Revisá tu email</h1>

          <p>
            Si existe una cuenta asociada a{" "}
            <strong>{email.trim()}</strong>, recibirás
            instrucciones para restablecer tu contraseña.
          </p>
        </div>

        <button
          type="button"
          className="admin-link-button"
          onClick={onBack}
        >
          Volver al inicio de sesión
        </button>
      </div>
    );
  }

  /* =========================================================
     FORMULARIO
  ========================================================= */

  return (
    <div className="admin-card">
      <div className="admin-card-logo">
        <img
          src="/brand/dg-logo.png"
          alt="Del Giorgio Maquinarias"
        />
      </div>

      <div className="admin-card-header">
        <h1>Recuperar cuenta</h1>

        <p>
          Ingresá tu email y te enviaremos un enlace para
          recuperar tu contraseña.
        </p>
      </div>

      <form className="admin-form" onSubmit={handleSubmit}>
        <div className="admin-field">
          <label htmlFor="reset-email">
            Email
          </label>

          <input
            id="reset-email"
            type="email"
            placeholder="admin@empresa.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
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
          {loading ? "Enviando..." : "Recuperar"}
        </button>
      </form>

      <button
        type="button"
        className="admin-link-button"
        onClick={onBack}
      >
        Volver al inicio de sesión
      </button>
    </div>
  );
};

export default AdminForgotPassword;
