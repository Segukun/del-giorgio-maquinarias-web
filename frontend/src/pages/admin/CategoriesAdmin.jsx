import { useEffect, useMemo, useState } from "react";
import { FiCheckCircle, FiPlus, FiTag, FiX } from "react-icons/fi";
import AdminLayout from "../../components/admin/AdminLayout.jsx";
import CategoriesTable from "../../components/admin/categories/CategoriesTable.jsx";
import CategoryFormModal from "../../components/admin/categories/CategoryFormModal.jsx";
import CatalogDeleteModal from "../../components/admin/catalog/CatalogDeleteModal.jsx";
import CatalogToolbar from "../../components/admin/catalog/CatalogToolbar.jsx";
import { createCategory, deleteCategory, fetchCategories, updateCategory } from "../../firebase/categories.js";
import normalizeSearch from "../../utils/normalizeSearch.js";
import "../../styles/admin/layout.css";
import "../../styles/admin/products.css";
import "../../styles/admin/taxonomy.css";

const CategoriesAdmin = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("");
  const [modal, setModal] = useState(null);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    let cancelled = false;
    fetchCategories()
      .then((data) => { if (!cancelled) setCategories(data); })
      .catch((loadError) => {
        console.error(loadError);
        if (!cancelled) setError("No se pudieron cargar las categorías. Recargá la página para intentar de nuevo.");
      })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  const filteredCategories = useMemo(() => {
    const normalizedQuery = normalizeSearch(query.trim());
    return categories.filter((category) => {
      const matchesQuery = !normalizedQuery || normalizeSearch(category.name).includes(normalizedQuery);
      const matchesStatus = !status || (status === "active" ? category.isActive : !category.isActive);
      return matchesQuery && matchesStatus;
    }).sort((a, b) => a.name.localeCompare(b.name, "es"));
  }, [categories, query, status]);

  const handleSave = async (values, isEditing) => {
    if (isEditing) {
      await updateCategory(modal.item.id, values);
      setCategories((current) => current.map((item) => item.id === modal.item.id ? { ...item, ...values } : item));
      setNotice(`${values.name} se actualizó correctamente.`);
    } else {
      const id = await createCategory(values);
      setCategories((current) => [...current, { id, ...values }]);
      setNotice(`${values.name} se agregó como categoría.`);
    }
    setModal(null);
  };

  const handleDelete = async (id) => {
    const category = categories.find((item) => item.id === id);
    await deleteCategory(id);
    setCategories((current) => current.filter((item) => item.id !== id));
    setModal(null);
    setNotice(`${category?.name ?? "La categoría"} se eliminó correctamente.`);
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
            <FiPlus aria-hidden="true" />Nueva categoría
          </button>
        </div>

        {notice ? (
          <div className="dg-admin-notice" role="status">
            <FiCheckCircle aria-hidden="true" /><span>{notice}</span>
            <button type="button" aria-label="Cerrar aviso" onClick={() => setNotice("")}><FiX aria-hidden="true" /></button>
          </div>
        ) : null}
        {error ? <div className="dg-admin-notice dg-admin-notice--error" role="alert">{error}</div> : null}

        <div className="dg-products-admin__panel">
          <CatalogToolbar query={query} status={status} searchPlaceholder="Buscar categoría..." onQueryChange={setQuery} onStatusChange={setStatus} />
          {loading ? <p className="dg-catalog-admin__loading" role="status">Cargando categorías...</p> : error ? null : (
            <CategoriesTable categories={filteredCategories} hasFilters={Boolean(query || status)} onEdit={(item) => setModal({ type: "form", item })} onDelete={(item) => setModal({ type: "delete", item })} />
          )}
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
