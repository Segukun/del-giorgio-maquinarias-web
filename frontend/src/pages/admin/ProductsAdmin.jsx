import { useEffect, useMemo, useState } from "react";
import { FiCheckCircle, FiPackage, FiPlus, FiX } from "react-icons/fi";
import AdminLayout from "../../components/admin/AdminLayout.jsx";
import DeleteProductModal from "../../components/admin/DeleteProductModal.jsx";
import Pagination from "../../components/admin/Pagination.jsx";
import ProductDetailModal from "../../components/admin/ProductDetailModal.jsx";
import ProductFilters from "../../components/admin/ProductFilters.jsx";
import ProductFormModal from "../../components/admin/ProductFormModal.jsx";
import ProductTable from "../../components/admin/ProductTable.jsx";
import {
  fetchProducts,
  fetchActiveBrands,
  fetchActiveCategories,
  createProduct,
  updateProduct,
  deleteProduct,
  toggleProductFeatured,
} from "../../firebase/products.js";
import "../../styles/admin/layout.css";
import "../../styles/admin/products.css";

const PAGE_SIZE = 10;
const EMPTY_FILTERS = { query: "", category: "", brand: "", status: "" };

const normalize = (value) =>
  value
    .toLocaleLowerCase("es")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

const requestProductData = () =>
  Promise.all([fetchProducts(), fetchActiveBrands(), fetchActiveCategories()]);

const ProductsAdmin = () => {
  const [products, setProducts] = useState([]);
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [currentPage, setCurrentPage] = useState(1);
  const [modal, setModal] = useState(null);
  const [notice, setNotice] = useState("");

  const loadData = async () => {
    setLoading(true);
    setError("");
    try {
      const [productsData, brandsData, categoriesData] = await requestProductData();
      setProducts(productsData);
      setBrands(brandsData);
      setCategories(categoriesData);
    } catch (err) {
      console.error(err);
      setError("No pudimos cargar los productos. Probá recargar la página.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let cancelled = false;

    requestProductData()
      .then(([productsData, brandsData, categoriesData]) => {
        if (cancelled) return;
        setProducts(productsData);
        setBrands(brandsData);
        setCategories(categoriesData);
      })
      .catch((loadError) => {
        console.error(loadError);
        if (!cancelled) setError("No pudimos cargar los productos. Probá recargar la página.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const options = useMemo(
    () => ({
      categories: categories.map((category) => category.name),
      brands: brands.map((brand) => brand.name),
      statuses: ["Publicado", "Pendiente"],
    }),
    [categories, brands],
  );

  const filteredProducts = useMemo(() => {
    const query = normalize(filters.query.trim());

    return products.filter((product) => {
      const matchesQuery =
        !query ||
        normalize(`${product.name ?? ""} ${product.brand ?? ""} ${product.category ?? ""}`).includes(query);
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
  const visibleProductsWithBrandImages = visibleProducts.map((product) => {
    const brand = brands.find((item) => normalize(item.name) === normalize(product.brand ?? ""));
    const brandLogo = typeof brand?.image === "string" ? brand.image : brand?.image?.url;
    return { ...product, brandLogo: brandLogo ?? product.brandLogo };
  });

  const handleFilterChange = (field, value) => {
    setFilters((current) => ({ ...current, [field]: value }));
    setCurrentPage(1);
  };

  const showNotice = (message) => setNotice(message);

  const handleToggleFeatured = async (id) => {
    const product = products.find((item) => item.id === id);
    if (!product) return;

    const nextFeatured = !product.featured;
    setProducts((current) =>
      current.map((item) => (item.id === id ? { ...item, featured: nextFeatured } : item)),
    );

    try {
      await toggleProductFeatured(id, nextFeatured);
    } catch (err) {
      console.error(err);
      // revertimos si falló en el servidor
      setProducts((current) =>
        current.map((item) => (item.id === id ? { ...item, featured: !nextFeatured } : item)),
      );
      showNotice("No se pudo actualizar el destacado. Intentá de nuevo.");
    }
  };

  const handleDelete = async (id) => {
    const product = products.find((item) => item.id === id);
    try {
      await deleteProduct(id);
      setProducts((current) => current.filter((item) => item.id !== id));
      setModal(null);
      showNotice(`${product?.name ?? "El producto"} se eliminó correctamente.`);
    } catch (err) {
      console.error(err);
      showNotice("No se pudo eliminar el producto. Intentá de nuevo.");
    }
  };

  const handleFormSubmit = async (formData, imageItems, isEditing) => {
    try {
      if (isEditing && modal?.product?.id) {
        await updateProduct(modal.product.id, formData, imageItems);
        showNotice(`${formData.name} se actualizó correctamente.`);
      } else {
        await createProduct(formData, imageItems);
        showNotice(`${formData.name} se creó correctamente.`);
      }
      setModal(null);
      await loadData();
    } catch (err) {
      console.error(err);
      showNotice("Ocurrió un error al guardar el producto. Intentá de nuevo.");
    }
  };

  const openEdit = (product) => setModal({ type: "form", product });

  const resultEnd = Math.min(pageStart + PAGE_SIZE, filteredProducts.length);

  if (loading) {
    return (
      <AdminLayout onUnavailable={(section) => showNotice(`La sección ${section} queda preparada para una próxima etapa.`)}>
        <section className="dg-products-admin">
          <p>Cargando productos...</p>
        </section>
      </AdminLayout>
    );
  }

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

        {error ? (
          <div className="dg-admin-notice dg-admin-notice--error" role="alert">
            <span>{error}</span>
          </div>
        ) : null}

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
            products={visibleProductsWithBrandImages}
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
