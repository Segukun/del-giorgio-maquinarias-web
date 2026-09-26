import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import WhatsAppButton from "../components/whatsappbutton";
import CatalogHeroBanner from "../components/catalog/catalogherobanner";
import FiltersSidebar from "../components/catalog/filterssidebar";
import FiltersModal from "../components/catalog/filtersmodal";
import ResultsToolbar from "../components/catalog/resultstoolbar";
import ProductGrid from "../components/catalog/productgrid";
import {
  EMPTY_FILTERS,
  parseFiltersFromParams,
  filtersToSearchParams,
  matchSearchToEntities,
  applyFilters,
  computeExtraFieldOptions,
  computeAvailableHourPresets,
} from "../utils/catalogFilters.js";
import { fetchProducts, fetchActiveBrands, fetchActiveCategories } from "../firebase/products.js";
import "../styles/pages/catalog.css";

const PAGE_SIZE = 8;

const Catalog = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [allProducts, setAllProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);

  const [sort, setSort] = useState("recientes");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const [productsData, categoriesData, brandsData] = await Promise.all([
        fetchProducts(),
        fetchActiveCategories(),
        fetchActiveBrands(),
      ]);
      setAllProducts(productsData.filter((p) => p.status === "Publicado"));
      setCategories(categoriesData);
      setBrands(brandsData);
      setLoading(false);
    };
    load();
  }, []);

  // La URL es la única fuente de verdad: los filtros se recalculan en cada
  // render a partir de searchParams, así que nunca quedan desincronizados
  // sin importar cómo cambie la URL (tipeando, un chip, un link directo).
  const filters = useMemo(() => {
    const parsed = parseFiltersFromParams(searchParams);

    if (parsed.q && !parsed.category && !parsed.brands.length && (categories.length || brands.length)) {
      const { category, brand } = matchSearchToEntities(parsed.q, categories, brands);
      if (category) parsed.category = category;
      if (brand) parsed.brands = [brand];
    }

    return parsed;
  }, [searchParams, categories, brands]);

  // Cuando cambia cualquier filtro dentro del catálogo, solo actualizamos la URL.
  // El estado `filters` de arriba se recalcula solo, como consecuencia.
  const updateFilters = (nextFilters) => {
    setSearchParams(filtersToSearchParams(nextFilters));
    setVisibleCount(PAGE_SIZE);
  };

  const handleReset = () => {
    setSearchParams(new URLSearchParams());
    setVisibleCount(PAGE_SIZE);
  };

  const productsInCategory = useMemo(() => {
    if (!filters.category) return [];
    return allProducts.filter((p) => p.category === filters.category);
  }, [allProducts, filters.category]);

  const extraFieldOptions = useMemo(
    () => computeExtraFieldOptions(productsInCategory),
    [productsInCategory],
  );

  const usedProductsInScope = useMemo(
    () => (filters.category ? productsInCategory : allProducts).filter((p) => p.condition === "Usado"),
    [allProducts, productsInCategory, filters.category],
  );

  const availableHourPresets = useMemo(
    () => computeAvailableHourPresets(usedProductsInScope),
    [usedProductsInScope],
  );

  const filteredProducts = useMemo(() => {
    const result = applyFilters(allProducts, filters);
    const sorted = [...result];
    if (sort === "recientes") sorted.sort((a, b) => (b.year ?? 0) - (a.year ?? 0));
    if (sort === "antiguos") sorted.sort((a, b) => (a.year ?? 0) - (b.year ?? 0));
    if (sort === "recomendados") sorted.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    return sorted;
  }, [allProducts, filters, sort]);

  const activeFilterCount =
    (filters.category ? 1 : 0) +
    filters.brands.length +
    filters.hours.length +
    Object.values(filters.extra).reduce((sum, values) => sum + values.length, 0);

  if (loading) {
    return (
      <div className="dg-page">
        <main>
          <p style={{ padding: "3rem", textAlign: "center" }}>Cargando catálogo...</p>
        </main>
      </div>
    );
  }

  return (
    <div className="dg-page">
      <main>
        <CatalogHeroBanner
          title="Catálogo de maquinaria"
          subtitle="Encontrá la maquinaria ideal para tu campo."
        />

        <div className="dg-catalog-layout">
          <FiltersSidebar
            filters={filters}
            onChange={updateFilters}
            onReset={handleReset}
            categories={categories}
            brands={brands}
            extraFieldOptions={extraFieldOptions}
            availableHourPresets={availableHourPresets}
          />

          <section className="dg-catalog-results">
            <ResultsToolbar
              searchQuery={filters.q}
              resultCount={filteredProducts.length}
              sort={sort}
              onSortChange={setSort}
              activeFilterCount={activeFilterCount}
              onOpenMobileFilters={() => setMobileFiltersOpen(true)}
            />

            <ProductGrid
              products={filteredProducts}
              visibleCount={visibleCount}
              onLoadMore={() => setVisibleCount((v) => v + PAGE_SIZE)}
            />
          </section>
        </div>
      </main>

      <WhatsAppButton />

      <FiltersModal
        open={mobileFiltersOpen}
        filters={filters}
        onChange={updateFilters}
        onReset={handleReset}
        onClose={() => setMobileFiltersOpen(false)}
        categories={categories}
        brands={brands}
        extraFieldOptions={extraFieldOptions}
        availableHourPresets={availableHourPresets}
        resultCount={filteredProducts.length}
      />
    </div>
  );
};

export default Catalog;