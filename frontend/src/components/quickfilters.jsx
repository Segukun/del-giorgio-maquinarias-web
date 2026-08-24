import "../styles/quickfilters.css";

const CONDITION_FILTERS = [
  {
    key: "nuevos",
    title: "NUEVOS",
    subtitle: "Maquinaria 0 km con garantía oficial",
    image: "/tractor-red.png",
    href: "/nuevos",
    variant: "blue",
  },
  {
    key: "usados",
    title: "USADOS",
    subtitle: "Equipos revisados y listos para trabajar",
    image: "/rastra-red.png",
    href: "/usados",
    variant: "red",
  },
];

const CATEGORY_FILTERS = [
  {
    key: "tractores",
    title: "Tractores",
    image: "/category-tractores.jpg",
    icon: "/icon-tractor.svg",
    subfilters: ["Cosechadoras", "Pulverización", "Mixers"],
  },
  {
    key: "sembradoras",
    title: "Sembradoras",
    image: "/category-sembradoras.jpg",
    icon: "/icon-seeder.svg",
    subfilters: ["Sembradoras", "Fertilizadoras", "Plantadoras"],
  },
  {
    key: "rastrillos",
    title: "Rastrillos",
    image: "/category-rastrillos.jpg",
    icon: "/icon-rake.svg",
    subfilters: ["Rastras", "Hileradores", "Otros"],
  },
];

const QuickFilters = () => {
  return (
    <section className="dg-quickfilters">
      <div className="dg-quickfilters__conditions">
        {CONDITION_FILTERS.map((item) => (
          <a
            key={item.key}
            href={item.href}
            className={`dg-condition-card dg-condition-card--${item.variant}`}
            style={{ backgroundImage: `url(${item.image})` }}
          >
            <div className="dg-condition-card__overlay" />
            <div className="dg-condition-card__text">
              <h3>{item.title}</h3>
              <p>{item.subtitle}</p>
            </div>
            <span className="dg-condition-card__arrow" aria-hidden>
              &#8250;
            </span>
          </a>
        ))}
      </div>

      <div className="dg-quickfilters__categories">
        {CATEGORY_FILTERS.map((cat) => (
          <div
            key={cat.key}
            className="dg-category-card"
            style={{ backgroundImage: `url(${cat.image})` }}
          >
            <div className="dg-category-card__overlay" />

            <a href={`/categoria/${cat.key}`} className="dg-category-card__main">
              <img className="dg-category-card__icon" src={cat.icon} alt="" aria-hidden />
              <h4>{cat.title}</h4>
            </a>

            <div className="dg-category-card__subfilters">
              {cat.subfilters.map((sub) => (
                <button key={sub} type="button" className="dg-chip">
                  {sub}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default QuickFilters;
