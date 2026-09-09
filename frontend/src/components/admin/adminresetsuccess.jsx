const AdminResetSuccess = ({ onLogin }) => {
  return (
    <div className="admin-card admin-card-success">
      <div className="admin-card-logo">
        <img src="/brand/dg-logo.png" alt="Logo" />
      </div>

      <div className="admin-success-icon">✓</div>

      <div className="admin-card-header">
        <h1>Restablecido con éxito</h1>
        <p>Tu contraseña fue actualizada correctamente.</p>
      </div>

      <button type="button" className="admin-primary-button" onClick={onLogin}>
        Volver a iniciar sesión
      </button>
    </div>
  );
};

export default AdminResetSuccess;