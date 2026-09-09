import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { verifyPasswordResetCode, confirmPasswordReset } from "firebase/auth";
import { auth } from "../firebase/config";

import AdminResetSuccess from "../components/admin/adminresetsuccess";
import "../styles/pages/adminlogin.css";

const AdminResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const oobCode = searchParams.get("oobCode");

  const [newPassword, setNewPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [validCode, setValidCode] = useState(null); // null = verificando
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!oobCode) {
      setValidCode(false);
      return;
    }
    verifyPasswordResetCode(auth, oobCode)
      .then(() => setValidCode(true))
      .catch(() => setValidCode(false));
  }, [oobCode]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (newPassword.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }
    if (newPassword !== repeatPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    setLoading(true);
    try {
      await confirmPasswordReset(auth, oobCode, newPassword);
      setSuccess(true);
    } catch (err) {
      setError("El enlace expiró o ya fue usado. Solicitá uno nuevo.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <main className="admin-login-page">
        <div className="admin-login-overlay"></div>
        <div className="admin-login-content">
          <AdminResetSuccess onLogin={() => navigate("/admin/login")} />
        </div>
      </main>
    );
  }

  if (validCode === null) {
    return (
      <main className="admin-login-page">
        <div className="admin-login-overlay"></div>
        <div className="admin-login-content">
          <div className="admin-card">
            <p>Verificando enlace...</p>
          </div>
        </div>
      </main>
    );
  }

  if (validCode === false) {
    return (
      <main className="admin-login-page">
        <div className="admin-login-overlay"></div>
        <div className="admin-login-content">
          <div className="admin-card">
            <div className="admin-card-header">
              <h1>Enlace inválido</h1>
              <p>Este enlace expiró o ya fue utilizado. Solicitá uno nuevo desde "Recuperar cuenta".</p>
            </div>
            <button
              type="button"
              className="admin-link-button"
              onClick={() => navigate("/admin/login")}
            >
              Volver al inicio de sesión
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="admin-login-page">
      <div className="admin-login-overlay"></div>
      <div className="admin-login-content">
        <div className="admin-card">
          <div className="admin-card-logo">
            <img src="/brand/dg-logo.png" alt="Logo" />
          </div>

          <div className="admin-card-header">
            <h1>Cambiar contraseña</h1>
            <p>Establecé una nueva contraseña para tu cuenta.</p>
          </div>

          <form className="admin-form" onSubmit={handleSubmit}>
            <div className="admin-field">
              <label htmlFor="new-password">Nueva contraseña</label>
              <input
                id="new-password"
                type="password"
                placeholder="••••••••"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>

            <div className="admin-field">
              <label htmlFor="repeat-password">Repetir contraseña</label>
              <input
                id="repeat-password"
                type="password"
                placeholder="••••••••"
                value={repeatPassword}
                onChange={(e) => setRepeatPassword(e.target.value)}
                required
              />
            </div>

            {error && (
              <p style={{ color: "#8d1717", fontSize: "13px", margin: 0 }}>
                {error}
              </p>
            )}

            <button type="submit" className="admin-primary-button" disabled={loading}>
              {loading ? "Cambiando..." : "Cambiar contraseña"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
};

export default AdminResetPasswordPage;