import { useEffect, useMemo, useState } from "react";
import Header from "../components/layout/header";
import Footer from "../components/layout/footer";
import WhatsAppButton from "../components/whatsappbutton";
import CatalogHeroBanner from "../components/catalog/catalogherobanner";
import FiltersSidebar from "../components/catalog/filterssidebar";
import FiltersModal from "../components/catalog/filtersmodal";
import ResultsToolbar from "../components/catalog/resultstoolbar";
import ProductGrid from "../components/catalog/productgrid";
import { DEFAULT_FILTERS, WORK_WIDTH_RANGE, HOURS_RANGE } from "../components/catalog/filtersdata";
import { getAllProducts } from "../firebase/productsService";
import "../styles/pages/catalog.css";

const PAGE_SIZE = 8;

// Rangos numéricos de potencia, en el mismo orden que POWER_OPTIONS
// en filtersdata.js. Si cambiás las etiquetas ahí, actualizá esto.
const POWER_RANGE_MAP = {
  "Hasta 100 HP": [0, 100],
  "100 a 150 HP": [100, 150],
  "150 a 200 HP": [150, 200],
  "200 a 300 HP": [200, 300],
  "Más de 300 HP": [300, Infinity],
};

const isRangeNarrowed = (value, defaultRange) =>
  value[0] !== defaultRange.min || value[1] !== defaultRange.max;

export default function Catalog() {
  const [allProducts, setAllProducts] = useState([]);
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [appliedFilters, setAppliedFilters] = useState(DEFAULT_FILTERS);
  const [sort, setSort] = useState("recientes");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  useEffect(() => {
    getAllProducts().then(setAllProducts);
  }, []);

  const handleApply = () => {
    setAppliedFilters(filters);
    setVisibleCount(PAGE_SIZE);
  };

  const handleReset = () => {
    setFilters(DEFAULT_FILTERS);
    setAppliedFilters(DEFAULT_FILTERS);
    setVisibleCount(PAGE_SIZE);
  };

  const filteredProducts = useMemo(() => {
    const hoursNarrowed = isRangeNarrowed(appliedFilters.hours, HOURS_RANGE);
    const widthNarrowed = isRangeNarrowed(appliedFilters.workWidth, WORK_WIDTH_RANGE);

    return allProducts.filter((p) => {
      if (!appliedFilters.conditions.nuevo && p.condition === "nuevo") return false;
      if (!appliedFilters.conditions.usado && p.condition === "usado") return false;

      if (appliedFilters.categories.length && !appliedFilters.categories.includes(p.category)) {
        return false;
      }

      if (appliedFilters.brands.length && !appliedFilters.brands.includes(p.brand)) {
        return false;
      }

      if (appliedFilters.traction.length && !appliedFilters.traction.includes(p.traction)) {
        return false;
      }

      if (appliedFilters.power.length) {
        const matchesAnyPowerRange = appliedFilters.power.some((label) => {
          const [min, max] = POWER_RANGE_MAP[label] ?? [0, Infinity];
          return p.power != null && p.power >= min && p.power < max;
        });
        if (!matchesAnyPowerRange) return false;
      }

      if (hoursNarrowed) {
        const [min, max] = appliedFilters.hours;
        if (p.hoursValue == null || p.hoursValue < min || p.hoursValue > max) return false;
      }

      if (widthNarrowed) {
        const [min, max] = appliedFilters.workWidth;
        if (p.workWidth == null || p.workWidth < min || p.workWidth > max) return false;
      }

      return true;
    });
  }, [allProducts, appliedFilters]);

  const activeFilterCount =
    appliedFilters.categories.length +
    appliedFilters.brands.length +
    appliedFilters.power.length +
    appliedFilters.traction.length;

  return (
    <div className="dg-page">
      <Header />

      <main>
        <CatalogHeroBanner
          title="Catálogo de maquinaria"
          subtitle="Encontrá la maquinaria ideal para tu campo."
        />

        <div className="dg-catalog-layout">
          <FiltersSidebar
            filters={filters}
            onChange={setFilters}
            onApply={handleApply}
            onReset={handleReset}
          />

          <section className="dg-catalog-results">
            <ResultsToolbar
              query="maquinaria"
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

      <Footer />
      <WhatsAppButton />

      <FiltersModal
        open={mobileFiltersOpen}
        filters={filters}
        onChange={setFilters}
        onApply={handleApply}
        onReset={handleReset}
        onClose={() => setMobileFiltersOpen(false)}
      />
    </div>
  );
}