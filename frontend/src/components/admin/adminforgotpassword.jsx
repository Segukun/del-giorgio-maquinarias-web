import { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../firebase/config";

const actionCodeSettings = {
  url: `${window.location.origin}/admin/reset-password`,
  handleCodeInApp: true, //sino te lleva a una página de firebase, y no queremos eso
};

const AdminForgotPassword = ({ onBack }) => {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

     console.log("actionCodeSettings usado:", actionCodeSettings);

    try {
      await sendPasswordResetEmail(auth, email, actionCodeSettings);
      setSent(true);
    } catch (err) {
      // No revelamos si el email existe o no, por seguridad.
      // Si preferís ocultar completamente el error, cambiá esto por setSent(true).
      setError("No pudimos enviar el email. Verificá la dirección.");
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="admin-card">
        <div className="admin-card-logo">
          <img src="/brand/dg-logo.png" alt="Logo" />
        </div>
        <div className="admin-card-header">
          <h1>Revisá tu email</h1>
          <p>Te enviamos un enlace para recuperar tu contraseña a {email}.</p>
        </div>
        <button type="button" className="admin-link-button" onClick={onBack}>
          Volver al inicio de sesión
        </button>
      </div>
    );
  }

  return (
    <div className="admin-card">
      <div className="admin-card-logo">
        <img src="/brand/dg-logo.png" alt="Logo" />
      </div>

      <div className="admin-card-header">
        <h1>Recuperar cuenta</h1>
        <p>Ingresá tu email y te enviaremos un enlace para recuperar tu contraseña.</p>
      </div>

      <form className="admin-form" onSubmit={handleSubmit}>
        <div className="admin-field">
          <label htmlFor="reset-email">Email</label>
          <input
            id="reset-email"
            type="email"
            placeholder="admin@empresa.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        {error && (
          <p style={{ color: "#8d1717", fontSize: "13px", margin: 0 }}>
            {error}
          </p>
        )}

        <button type="submit" className="admin-primary-button" disabled={loading}>
          {loading ? "Enviando..." : "Recuperar"}
        </button>
      </form>

      <button type="button" className="admin-link-button" onClick={onBack}>
        Volver al inicio de sesión
      </button>
    </div>
  );
};

export default AdminForgotPassword;