import { useState } from "react";
import { FiCheckCircle, FiUser, FiX } from "react-icons/fi";
import AdminLayout from "../../components/admin/AdminLayout.jsx";
import AccountForm from "../../components/admin/profile/AccountForm.jsx";
import useAdminSession from "../../hooks/useAdminSession.js";
import "../../styles/admin/layout.css";
import "../../styles/admin/products.css";
import "../../styles/admin/staff.css";

const AccountAdmin = () => {
  const { currentUser, users, updateCurrentUser } = useAdminSession();
  const [notice, setNotice] = useState("");

  if (!currentUser) return null;

  const handleSave = async (form) => {
    const succeeded = await updateCurrentUser(form);
    if (!succeeded) return;
    setNotice("Tu cuenta se actualizó correctamente.");
  };

  return (
    <AdminLayout
      onUnavailable={(section) =>
        setNotice(`La sección ${section} queda preparada para una próxima etapa.`)
      }
    >
      <section className="dg-products-admin dg-account-admin" aria-labelledby="account-admin-title">
        <div className="dg-products-admin__heading">
          <div className="dg-products-admin__title-group">
            <span className="dg-products-admin__title-icon" aria-hidden="true">
              <FiUser />
            </span>
            <div>
              <h1 id="account-admin-title">Mi cuenta</h1>
              <p>Actualizá tus datos de acceso</p>
            </div>
          </div>
        </div>

        {notice ? (
          <div className="dg-admin-notice" role="status">
            <FiCheckCircle aria-hidden="true" />
            <span>{notice}</span>
            <button type="button" aria-label="Cerrar aviso" onClick={() => setNotice("")}>
              <FiX aria-hidden="true" />
            </button>
          </div>
        ) : null}

        <div className="dg-account-admin__panel">
          <AccountForm user={currentUser} users={users} onSubmit={handleSave} />
        </div>
      </section>
    </AdminLayout>
  );
};

export default AccountAdmin;