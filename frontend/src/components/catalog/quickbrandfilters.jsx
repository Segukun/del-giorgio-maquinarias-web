import "../../styles/catalog/quickbrandfilters.css";

const BRANDS = [
  { key: "case-ih", name: "Case IH", logo: "/brands/case-ih.png" },
  { key: "new-holland", name: "New Holland", logo: "/brands/new-holland.png" },
  { key: "john-deere", name: "John Deere", logo: "/brands/john-deere.png" },
  { key: "agco", name: "AGCO", logo: "/brands/agco.png" },
  { key: "claas", name: "Claas", logo: "/brands/claas.png" },
  { key: "kuhn", name: "Kuhn", logo: "/brands/kuhn.png" },
  { key: "metalfor", name: "Metalfor", logo: "/brands/metalfor.png" },
  { key: "jacto", name: "Jacto", logo: "/brands/jacto.png" },
];

export default function QuickBrandFilters({ activeBrand, onSelectBrand }) {
  return (
    <div className="dg-quickbrands">
      <div className="dg-quickbrands__track">
        {BRANDS.map((brand) => {
          const isActive = activeBrand === brand.key;
          return (
            <button
              key={brand.key}
              type="button"
              className={`dg-quickbrands__item ${isActive ? "is-active" : ""}`}
              onClick={() => onSelectBrand(isActive ? null : brand.key)}
            >
              <span className="dg-quickbrands__avatar">
                <img src={brand.logo} alt="" aria-hidden />
              </span>
              <span className="dg-quickbrands__label">{brand.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
