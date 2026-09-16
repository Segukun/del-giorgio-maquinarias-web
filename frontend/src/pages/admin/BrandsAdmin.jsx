import { useEffect, useMemo, useState } from "react";
import { FiCheckCircle, FiGrid, FiPlus, FiX } from "react-icons/fi";
import AdminLayout from "../../components/admin/AdminLayout.jsx";
import BrandFormModal from "../../components/admin/brands/BrandFormModal.jsx";
import BrandsTable from "../../components/admin/brands/BrandsTable.jsx";
import CatalogDeleteModal from "../../components/admin/catalog/CatalogDeleteModal.jsx";
import CatalogToolbar from "../../components/admin/catalog/CatalogToolbar.jsx";
import { createBrand, deleteBrand, fetchBrands, updateBrand } from "../../firebase/brands.js";
import normalizeSearch from "../../utils/normalizeSearch.js";
import "../../styles/admin/layout.css";
import "../../styles/admin/products.css";
import "../../styles/admin/taxonomy.css";

const BrandsAdmin = () => {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("");
  const [modal, setModal] = useState(null);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    let cancelled = false;
    fetchBrands()
      .then((data) => { if (!cancelled) setBrands(data); })
      .catch((loadError) => {
        console.error(loadError);
        if (!cancelled) setError("No se pudieron cargar las marcas. Recargá la página para intentar de nuevo.");
      })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  const filteredBrands = useMemo(() => {
    const normalizedQuery = normalizeSearch(query.trim());
    return brands.filter((brand) => {
      const matchesQuery = !normalizedQuery || normalizeSearch(brand.name).includes(normalizedQuery);
      const matchesStatus = !status || (status === "active" ? brand.isActive : !brand.isActive);
      return matchesQuery && matchesStatus;
    }).sort((a, b) => a.name.localeCompare(b.name, "es"));
  }, [brands, query, status]);

  const handleSave = async (values, file, isEditing) => {
    if (isEditing) {
      const updated = await updateBrand(modal.item.id, values, file);
      setBrands((current) => current.map((item) => item.id === updated.id ? updated : item));
      setNotice(`${values.name} se actualizó correctamente.`);
    } else {
      const created = await createBrand(values, file);
      setBrands((current) => [...current, created]);
      setNotice(`${values.name} se agregó como marca.`);
    }
    setModal(null);
  };

  const handleDelete = async (id) => {
    const brand = brands.find((item) => item.id === id);
    await deleteBrand(id);
    setBrands((current) => current.filter((item) => item.id !== id));
    setModal(null);
    setNotice(`${brand?.name ?? "La marca"} se eliminó correctamente.`);
  };

  return (
    <AdminLayout>
      <section className="dg-products-admin dg-catalog-admin" aria-labelledby="brands-admin-title">
        <div className="dg-products-admin__heading">
          <div className="dg-products-admin__title-group">
            <span className="dg-products-admin__title-icon" aria-hidden="true"><FiGrid /></span>
            <div>
              <h1 id="brands-admin-title">Gestión de marcas</h1>
              <p>{brands.length} marcas registradas</p>
            </div>
          </div>
          <button className="dg-button dg-button--primary dg-products-admin__new" type="button" onClick={() => setModal({ type: "form", item: null })}>
            <FiPlus aria-hidden="true" />Nueva marca
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
          <CatalogToolbar query={query} status={status} searchPlaceholder="Buscar marca..." onQueryChange={setQuery} onStatusChange={setStatus} />
          {loading ? <p className="dg-catalog-admin__loading" role="status">Cargando marcas...</p> : error ? null : (
            <BrandsTable brands={filteredBrands} hasFilters={Boolean(query || status)} onEdit={(item) => setModal({ type: "form", item })} onDelete={(item) => setModal({ type: "delete", item })} />
          )}
          <footer className="dg-catalog-admin__footer" aria-live="polite">
            {filteredBrands.length === brands.length
              ? `${brands.length} marcas registradas`
              : `${filteredBrands.length} de ${brands.length} marcas`}
          </footer>
        </div>
      </section>

      {modal?.type === "form" ? (
        <BrandFormModal brand={modal.item} brands={brands} onClose={() => setModal(null)} onSubmit={handleSave} />
      ) : null}
      {modal?.type === "delete" ? (
        <CatalogDeleteModal entityLabel="marca" item={modal.item} onClose={() => setModal(null)} onConfirm={handleDelete} />
      ) : null}
    </AdminLayout>
  );
};

export default BrandsAdmin;
