
import { useEffect, useMemo, useState } from "react";

import {
  FiAlertCircle,
  FiCheckCircle,
  FiPackage,
  FiPlus,
  FiX,
} from "react-icons/fi";

import AdminLayout from "../../components/admin/AdminLayout.jsx";
import DeleteProductModal from "../../components/admin/DeleteProductModal.jsx";
import Pagination from "../../components/admin/Pagination.jsx";
import ProductDetailModal from "../../components/admin/ProductDetailModal.jsx";
import ProductFilters from "../../components/admin/ProductFilters.jsx";
import ProductFormModal from "../../components/admin/ProductFormModal.jsx";
import ProductTable from "../../components/admin/ProductTable.jsx";

import {
  subscribeProducts,
  subscribeActiveBrands,
  subscribeActiveCategories,
  createProduct,
  updateProduct,
  deleteProduct,
  toggleProductFeatured,
} from "../../firebase/products.js";

import "../../styles/admin/layout.css";
import "../../styles/admin/products.css";

const PAGE_SIZE = 10;

const EMPTY_FILTERS = {
  query: "",
  category: "",
  brand: "",
  status: "",
};

const normalize = (value) =>
  String(value ?? "")
    .toLocaleLowerCase("es")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

/* =========================================================
   SKELETON DE CARGA
========================================================= */

const ProductTableSkeleton = () => (
  <div
    className="dg-products-skeleton"
    role="status"
    aria-label="Cargando productos"
  >
    <div className="dg-products-skeleton__filters">
      <span />
      <span />
      <span />
      <span />
    </div>

    <div className="dg-products-skeleton__table">
      <div className="dg-products-skeleton__header">
        {Array.from({ length: 6 }).map((_, index) => (
          <span key={index} />
        ))}
      </div>

      {Array.from({ length: 6 }).map((_, index) => (
        <div
          className="dg-products-skeleton__row"
          key={index}
        >
          <span className="is-image" />
          <span className="is-model" />
          <span />
          <span />
          <span />
          <span className="is-actions" />
        </div>
      ))}
    </div>

    <span className="dg-visually-hidden">
      Sincronizando productos con Firestore...
    </span>
  </div>
);

/* =========================================================
   COMPONENTE
========================================================= */

const ProductsAdmin = () => {
  const [products, setProducts] = useState([]);
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);

  const [loading, setLoading] = useState(true);
  const [syncStatus, setSyncStatus] = useState("connecting");
  const [error, setError] = useState("");

  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [currentPage, setCurrentPage] = useState(1);

  const [modal, setModal] = useState(null);
  const [notice, setNotice] = useState(null);

  const [featuredLoadingIds, setFeaturedLoadingIds] = useState(
    () => new Set(),
  );

  const [deletingProductId, setDeletingProductId] = useState(null);

  /* =======================================================
     SUSCRIPCIONES EN TIEMPO REAL
  ======================================================= */

  useEffect(() => {
    let cancelled = false;

    const initializedListeners = new Set();
    let hasSubscriptionError = false;

    const markInitialized = (listenerName) => {
      if (cancelled) return;

      initializedListeners.add(listenerName);

      if (initializedListeners.size === 3) {
        setLoading(false);

        if (!hasSubscriptionError) {
          setSyncStatus("connected");
        }
      }
    };

    const handleSubscriptionError = (
      listenerName,
      description,
      listenerError,
    ) => {
      if (cancelled) return;

      console.error(
        `Error en la suscripción de ${listenerName}:`,
        listenerError,
      );

      hasSubscriptionError = true;

      setSyncStatus("error");
      setError(
        `No pudimos sincronizar ${description}. Algunas actualizaciones podrían no reflejarse.`,
      );

      markInitialized(listenerName);
    };

    const unsubscribeProducts = subscribeProducts(
      (data) => {
        if (cancelled) return;

        setProducts(data);
        markInitialized("products");
      },
      (listenerError) =>
        handleSubscriptionError(
          "products",
          "los productos",
          listenerError,
        ),
    );

    const unsubscribeBrands = subscribeActiveBrands(
      (data) => {
        if (cancelled) return;

        setBrands(data);
        markInitialized("brands");
      },
      (listenerError) =>
        handleSubscriptionError(
          "brands",
          "las marcas",
          listenerError,
        ),
    );

    const unsubscribeCategories = subscribeActiveCategories(
      (data) => {
        if (cancelled) return;

        setCategories(data);
        markInitialized("categories");
      },
      (listenerError) =>
        handleSubscriptionError(
          "categories",
          "las categorías",
          listenerError,
        ),
    );

    return () => {
      cancelled = true;

      unsubscribeProducts();
      unsubscribeBrands();
      unsubscribeCategories();
    };
  }, []);

  /* =======================================================
     OPCIONES DE FILTROS
  ======================================================= */

  const options = useMemo(
    () => ({
      categories: categories.map((category) => category.name),
      brands: brands.map((brand) => brand.name),
      statuses: ["Publicado", "Pendiente"],
    }),
    [categories, brands],
  );

  /* =======================================================
     FILTRADO
  ======================================================= */

  const filteredProducts = useMemo(() => {
    const query = normalize(filters.query.trim());

    return products.filter((product) => {
      const matchesQuery =
        !query ||
        normalize(
          `${product.name ?? ""} ${product.brand ?? ""} ${product.category ?? ""}`,
        ).includes(query);

      const matchesCategory =
        !filters.category ||
        product.category === filters.category;

      const matchesBrand =
        !filters.brand ||
        product.brand === filters.brand;

      const matchesStatus =
        !filters.status ||
        product.status === filters.status;

      return (
        matchesQuery &&
        matchesCategory &&
        matchesBrand &&
        matchesStatus
      );
    });
  }, [filters, products]);

  /* =======================================================
     PAGINACIÓN
  ======================================================= */

  const pageCount = Math.max(
    1,
    Math.ceil(filteredProducts.length / PAGE_SIZE),
  );

  const safePage = Math.min(currentPage, pageCount);
  const pageStart = (safePage - 1) * PAGE_SIZE;

  const visibleProducts = filteredProducts.slice(
    pageStart,
    pageStart + PAGE_SIZE,
  );

  const visibleProductsWithBrandImages = visibleProducts.map(
    (product) => {
      const brand = brands.find(
        (item) =>
          normalize(item.name) ===
          normalize(product.brand ?? ""),
      );

      const brandLogo =
        typeof brand?.image === "string"
          ? brand.image
          : brand?.image?.url;

      return {
        ...product,
        brandLogo: brandLogo ?? product.brandLogo,
      };
    },
  );

  const resultEnd = Math.min(
    pageStart + PAGE_SIZE,
    filteredProducts.length,
  );

  /* =======================================================
     FILTROS
  ======================================================= */

  const handleFilterChange = (field, value) => {
    setFilters((current) => ({
      ...current,
      [field]: value,
    }));

    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setFilters(EMPTY_FILTERS);
    setCurrentPage(1);
  };

  /* =======================================================
     AVISOS
  ======================================================= */

  const showNotice = (message, type = "success") => {
    setNotice({ message, type });
  };

  /* =======================================================
     DESTACADOS
  ======================================================= */

  const handleToggleFeatured = async (id) => {
    const product = products.find(
      (item) => item.id === id,
    );

    if (!product || featuredLoadingIds.has(id)) return;

    const previousFeatured = Boolean(product.featured);
    const nextFeatured = !previousFeatured;

    setFeaturedLoadingIds((current) => {
      const next = new Set(current);
      next.add(id);
      return next;
    });

    // Actualización optimista para una respuesta visual inmediata.
    setProducts((current) =>
      current.map((item) =>
        item.id === id
          ? { ...item, featured: nextFeatured }
          : item,
      ),
    );

    try {
      await toggleProductFeatured(id, nextFeatured);
    } catch (operationError) {
      console.error(operationError);

      // Si falla Firestore, restauramos el valor anterior.
      setProducts((current) =>
        current.map((item) =>
          item.id === id
            ? { ...item, featured: previousFeatured }
            : item,
        ),
      );

      showNotice(
        "No se pudo actualizar el destacado. Intentá de nuevo.",
        "error",
      );
    } finally {
      setFeaturedLoadingIds((current) => {
        const next = new Set(current);
        next.delete(id);
        return next;
      });
    }
  };

  /* =======================================================
     ELIMINACIÓN
  ======================================================= */

  const handleDelete = async (id) => {
    if (deletingProductId) return;

    const product = products.find(
      (item) => item.id === id,
    );

    setDeletingProductId(id);

    try {
      await deleteProduct(id, product?.name);

      // No eliminamos manualmente el producto del estado.
      // La suscripción de Firestore lo quitará automáticamente.

      setModal(null);

      showNotice(
        `${product?.name ?? "El producto"} se eliminó correctamente.`,
        "success",
      );
    } catch (operationError) {
      console.error(operationError);

      setModal(null);

      showNotice(
        "No se pudo eliminar el producto. Intentá de nuevo.",
        "error",
      );
    } finally {
      setDeletingProductId(null);
    }
  };

  /* =======================================================
     CREACIÓN Y EDICIÓN
  ======================================================= */

  const handleFormSubmit = async (
    formData,
    imageItems,
    isEditing,
    onUploadProgress,
  ) => {
    try {
      if (isEditing && modal?.product?.id) {
        await updateProduct(
          modal.product.id,
          formData,
          imageItems,
          onUploadProgress,
        );

        showNotice(
          `${formData.name} se actualizó correctamente.`,
        );
      } else {
        await createProduct(
          formData,
          imageItems,
          onUploadProgress,
        );

        showNotice(
          `${formData.name} se creó correctamente.`,
        );
      }

      // La suscripción actualizará la tabla automáticamente.
      // No hace falta volver a consultar toda la información.
      setModal(null);
    } catch (operationError) {
      console.error(operationError);

      showNotice(
        "No se pudo guardar el producto. Revisá la conexión e intentá nuevamente.",
        "error",
      );
    }
  };

  /* =======================================================
     MODALES
  ======================================================= */

  const openEdit = (product) => {
    setModal({ type: "form", product });
  };

  const openCreate = () => {
    setModal({ type: "form", product: null });
  };

  const openDelete = (product) => {
    setModal({ type: "delete", product });
  };

  const openDetail = (product) => {
    setModal({ type: "detail", product });
  };

  /* =======================================================
     ESTADO DE SINCRONIZACIÓN
  ======================================================= */

  return (
    <AdminLayout
      onUnavailable={(section) =>
        showNotice(
          `La sección ${section} queda preparada para una próxima etapa.`,
        )
      }
    >
      <section
        className="dg-products-admin"
        aria-labelledby="products-admin-title"
      >
        <div className="dg-products-admin__heading">
          <div className="dg-products-admin__title-group">
            <span
              className="dg-products-admin__title-icon"
              aria-hidden="true"
            >
              <FiPackage />
            </span>

            <div>
              <h1 id="products-admin-title">
                Gestión de productos
              </h1>

              <p>
                {loading
                  ? "Sincronizando inventario..."
                  : `${products.length} máquinas en total`}
              </p>
            </div>
          </div>

          <div className="dg-products-admin__heading-actions">

            <button
              className="dg-button dg-button--primary dg-products-admin__new"
              type="button"
              onClick={openCreate}
            >
              <FiPlus aria-hidden="true" />
              Nuevo producto
            </button>
          </div>
        </div>

        {error ? (
          <div
            className="dg-admin-notice dg-admin-notice--error"
            role="alert"
          >
            <FiAlertCircle aria-hidden="true" />
            <span>{error}</span>
          </div>
        ) : null}

        {notice ? (
          <div
            className={`dg-admin-notice ${
              notice.type === "error"
                ? "dg-admin-notice--error"
                : ""
            }`}
            role={notice.type === "error" ? "alert" : "status"}
          >
            {notice.type === "error" ? (
              <FiAlertCircle aria-hidden="true" />
            ) : (
              <FiCheckCircle aria-hidden="true" />
            )}

            <span>{notice.message}</span>

            <button
              type="button"
              aria-label="Cerrar aviso"
              onClick={() => setNotice(null)}
            >
              <FiX aria-hidden="true" />
            </button>
          </div>
        ) : null}

        <div
          className="dg-products-admin__panel"
          aria-busy={loading}
        >
          {loading ? (
            <ProductTableSkeleton />
          ) : (
            <>
              <ProductFilters
                filters={filters}
                options={options}
                onChange={handleFilterChange}
                onClear={handleClearFilters}
              />

              <ProductTable
                products={visibleProductsWithBrandImages}
                onToggleFeatured={handleToggleFeatured}
                onEdit={openEdit}
                onDelete={openDelete}
                onView={openDetail}
                featuredLoadingIds={featuredLoadingIds}
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
            </>
          )}
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
          isDeleting={deletingProductId === modal.product.id}
        />
      ) : null}
    </AdminLayout>
  );
};

export default ProductsAdmin;
