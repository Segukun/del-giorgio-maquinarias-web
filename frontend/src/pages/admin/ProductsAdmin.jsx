import { useMemo, useState } from "react";
import { FiCheckCircle, FiPackage, FiPlus, FiX } from "react-icons/fi";
import AdminLayout from "../../components/admin/AdminLayout.jsx";
import DeleteProductModal from "../../components/admin/DeleteProductModal.jsx";
import Pagination from "../../components/admin/Pagination.jsx";
import ProductDetailModal from "../../components/admin/ProductDetailModal.jsx";
import ProductFilters from "../../components/admin/ProductFilters.jsx";
import ProductFormModal from "../../components/admin/ProductFormModal.jsx";
import ProductTable from "../../components/admin/ProductTable.jsx";
import { ADMIN_PRODUCTS } from "../../data/adminProducts.js";
import "../../styles/admin/layout.css";
import "../../styles/admin/products.css";

const PAGE_SIZE = 10;
const EMPTY_FILTERS = { query: "", category: "", brand: "", status: "" };

const normalize = (value) =>
  value
    .toLocaleLowerCase("es")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

const ProductsAdmin = () => {
  const [products, setProducts] = useState(ADMIN_PRODUCTS);
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [currentPage, setCurrentPage] = useState(1);
  const [modal, setModal] = useState(null);
  const [notice, setNotice] = useState("");

  const options = useMemo(
    () => ({
      categories: [...new Set(products.map((product) => product.category))].sort(),
      brands: [...new Set(products.map((product) => product.brand))].sort(),
      statuses: ["Publicado", "Borrador", "Pendiente"],
    }),
    [products],
  );

  const filteredProducts = useMemo(() => {
    const query = normalize(filters.query.trim());

    return products.filter((product) => {
      const matchesQuery =
        !query ||
        normalize(`${product.name} ${product.brand} ${product.category}`).includes(query);
      const matchesCategory = !filters.category || product.category === filters.category;
      const matchesBrand = !filters.brand || product.brand === filters.brand;
      const matchesStatus = !filters.status || product.status === filters.status;

      return matchesQuery && matchesCategory && matchesBrand && matchesStatus;
    });
  }, [filters, products]);

  const pageCount = Math.max(1, Math.ceil(filteredProducts.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, pageCount);
  const pageStart = (safePage - 1) * PAGE_SIZE;
  const visibleProducts = filteredProducts.slice(pageStart, pageStart + PAGE_SIZE);

  const handleFilterChange = (field, value) => {
    setFilters((current) => ({ ...current, [field]: value }));
    setCurrentPage(1);
  };

  const showNotice = (message) => setNotice(message);

  const handleToggleFeatured = (id) => {
    setProducts((current) =>
      current.map((product) =>
        product.id === id ? { ...product, featured: !product.featured } : product,
      ),
    );
  };

  const handleDelete = (id) => {
    const product = products.find((item) => item.id === id);
    setProducts((current) => current.filter((item) => item.id !== id));
    setModal(null);
    showNotice(`${product?.name ?? "El producto"} se quitó temporalmente.`);
  };

  const handleFormSubmit = (form, isEditing) => {
    setModal(null);
    showNotice(
      isEditing
        ? `Vista de edición de ${form.name} completada. No se guardaron cambios permanentes.`
        : `Vista de alta de ${form.name} completada. El producto no se guardó de forma permanente.`,
    );
  };

  const openEdit = (product) => setModal({ type: "form", product });

  const resultEnd = Math.min(pageStart + PAGE_SIZE, filteredProducts.length);

  return (
    <AdminLayout
      onUnavailable={(section) => showNotice(`La sección ${section} queda preparada para una próxima etapa.`)}
    >
      <section className="dg-products-admin" aria-labelledby="products-admin-title">
        <div className="dg-products-admin__heading">
          <div className="dg-products-admin__title-group">
            <span className="dg-products-admin__title-icon" aria-hidden="true">
              <FiPackage />
            </span>
            <div>
              <h1 id="products-admin-title">Gestión de productos</h1>
              <p>{products.length} máquinas en total</p>
            </div>
          </div>

          <button
            className="dg-button dg-button--primary dg-products-admin__new"
            type="button"
            onClick={() => setModal({ type: "form", product: null })}
          >
            <FiPlus aria-hidden="true" />
            Nuevo producto
          </button>
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

        <div className="dg-products-admin__panel">
          <ProductFilters
            filters={filters}
            options={options}
            onChange={handleFilterChange}
            onClear={() => {
              setFilters(EMPTY_FILTERS);
              setCurrentPage(1);
            }}
          />

          <ProductTable
            products={visibleProducts}
            onToggleFeatured={handleToggleFeatured}
            onEdit={(product) => setModal({ type: "form", product })}
            onDelete={(product) => setModal({ type: "delete", product })}
            onView={(product) => setModal({ type: "detail", product })}
          />

          <div className="dg-products-admin__footer">
            <p aria-live="polite">
              {filteredProducts.length
                ? `Mostrando ${pageStart + 1} - ${resultEnd} de ${filteredProducts.length} equipos`
                : "0 equipos encontrados"}
            </p>
            <Pagination
              currentPage={safePage}
              pageCount={pageCount}
              onPageChange={setCurrentPage}
            />
          </div>
        </div>
      </section>

      {modal?.type === "form" ? (
        <ProductFormModal
          product={modal.product}
          options={options}
          onClose={() => setModal(null)}
          onSubmit={handleFormSubmit}
        />
      ) : null}

      {modal?.type === "detail" ? (
        <ProductDetailModal
          product={modal.product}
          onClose={() => setModal(null)}
          onEdit={openEdit}
        />
      ) : null}

      {modal?.type === "delete" ? (
        <DeleteProductModal
          product={modal.product}
          onClose={() => setModal(null)}
          onConfirm={handleDelete}
        />
      ) : null}
    </AdminLayout>
  );
};

export default ProductsAdmin;
