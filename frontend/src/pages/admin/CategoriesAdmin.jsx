import { useMemo, useState } from "react";
import { FiCheckCircle, FiPlus, FiTag, FiX } from "react-icons/fi";
import AdminLayout from "../../components/admin/AdminLayout.jsx";
import CategoriesTable from "../../components/admin/categories/CategoriesTable.jsx";
import CategoryFormModal from "../../components/admin/categories/CategoryFormModal.jsx";
import CatalogDeleteModal from "../../components/admin/catalog/CatalogDeleteModal.jsx";
import CatalogToolbar from "../../components/admin/catalog/CatalogToolbar.jsx";
import { MOCK_CATEGORIES } from "../../data/adminCatalogMocks.js";
import normalizeSearch from "../../utils/normalizeSearch.js";
import "../../styles/admin/layout.css";
import "../../styles/admin/products.css";
import "../../styles/admin/taxonomy.css";

const CategoriesAdmin = () => {
  const [categories, setCategories] = useState(() => MOCK_CATEGORIES.map((item) => ({ ...item })));
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("");
  const [modal, setModal] = useState(null);
  const [notice, setNotice] = useState("");

  const filteredCategories = useMemo(() => {
    const normalizedQuery = normalizeSearch(query.trim());
    return categories.filter((category) => {
      const matchesQuery = !normalizedQuery || normalizeSearch(category.name).includes(normalizedQuery);
      const matchesStatus =
        !status || (status === "active" ? category.isActive : !category.isActive);
      return matchesQuery && matchesStatus;
    });
  }, [categories, query, status]);

  const handleSave = (values, isEditing) => {
    if (isEditing) {
      setCategories((current) =>
        current.map((item) => (item.id === modal.item.id ? { ...item, ...values } : item)),
      );
      setNotice(`${values.name} se actualizó temporalmente.`);
    } else {
      setCategories((current) => [
        ...current,
        { id: `category-${Date.now()}`, ...values },
      ]);
      setNotice(`${values.name} se agregó como categoría.`);
    }
    setModal(null);
  };

  const handleDelete = (id) => {
    const category = categories.find((item) => item.id === id);
    setCategories((current) => current.filter((item) => item.id !== id));
    setModal(null);
    setNotice(`${category?.name ?? "La categoría"} se eliminó temporalmente.`);
  };

  return (
    <AdminLayout>
      <section className="dg-products-admin dg-catalog-admin" aria-labelledby="categories-admin-title">
        <div className="dg-products-admin__heading">
          <div className="dg-products-admin__title-group">
            <span className="dg-products-admin__title-icon" aria-hidden="true"><FiTag /></span>
            <div>
              <h1 id="categories-admin-title">Gestión de categorías</h1>
              <p>{categories.length} categorías registradas</p>
            </div>
          </div>

          <button className="dg-button dg-button--primary dg-products-admin__new" type="button" onClick={() => setModal({ type: "form", item: null })}>
            <FiPlus aria-hidden="true" />
            Nueva categoría
          </button>
        </div>

        {notice ? (
          <div className="dg-admin-notice" role="status">
            <FiCheckCircle aria-hidden="true" />
            <span>{notice}</span>
            <button type="button" aria-label="Cerrar aviso" onClick={() => setNotice("")}><FiX aria-hidden="true" /></button>
          </div>
        ) : null}

        <div className="dg-products-admin__panel">
          <CatalogToolbar query={query} status={status} searchPlaceholder="Buscar categoría..." onQueryChange={setQuery} onStatusChange={setStatus} />
          <CategoriesTable categories={filteredCategories} onEdit={(item) => setModal({ type: "form", item })} onDelete={(item) => setModal({ type: "delete", item })} />
          <footer className="dg-catalog-admin__footer" aria-live="polite">
            {filteredCategories.length === categories.length
              ? `${categories.length} categorías registradas`
              : `${filteredCategories.length} de ${categories.length} categorías`}
          </footer>
        </div>
      </section>

      {modal?.type === "form" ? (
        <CategoryFormModal category={modal.item} categories={categories} onClose={() => setModal(null)} onSubmit={handleSave} />
      ) : null}
      {modal?.type === "delete" ? (
        <CatalogDeleteModal entityLabel="categoría" item={modal.item} onClose={() => setModal(null)} onConfirm={handleDelete} />
      ) : null}
    </AdminLayout>
  );
};

export default CategoriesAdmin;
