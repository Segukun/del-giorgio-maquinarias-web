import { useEffect, useState } from "react";
import "../../styles/layout/header.css";

const NAV_LINKS = [
  { label: "Inicio", href: "/" },
  { label: "Nuevos", href: "/nuevos" },
  { label: "Usados", href: "/usados" },
  { label: "Marcas", href: "/marcas" },
  { label: "Nosotros", href: "/nosotros" },
  { label: "Contacto", href: "/contacto" },
];

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [compact, setCompact] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;
      setCompact(y > 60);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    // Integrar con la lógica de búsqueda / routing real
    console.log("Buscar:", query);
  };

  return (
    <header className={`dg-header ${compact ? "is-compact" : ""}`}>
      <div className="dg-header__inner">
        <a href="/" className="dg-header__logo" aria-label="Del Giorgio Maquinarias">
          <img src="/brand/dg-logo.png" alt="Del Giorgio Maquinarias" />
        </a>

        <form className="dg-header__search" onSubmit={handleSearch}>
          <input
            type="text"
            aria-label="Buscar maquinaria, marca o modelo"
            placeholder="Buscar maquinaria, marca o modelo..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button type="submit" aria-label="Buscar">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="7" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </button>
        </form>

        <nav id="public-navigation" aria-label="Navegación principal" className={`dg-header__nav ${menuOpen ? "is-open" : ""}`}>
          {NAV_LINKS.map((link) => (
            <a key={link.href} href={link.href} className="dg-header__link">
              {link.label}
            </a>
          ))}
        </nav>

        <button
          className={`dg-header__burger ${menuOpen ? "is-open" : ""}`}
          onClick={() => setMenuOpen((v) => !v)}
          type="button"
          aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={menuOpen}
          aria-controls="public-navigation"
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      {menuOpen && (
        <div className="dg-header__mobile-search">
          <form onSubmit={handleSearch}>
            <input
              type="text"
              aria-label="Buscar maquinaria"
              placeholder="Buscar maquinaria..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </form>
        </div>
      )}
    </header>
  );
}

export default Header;
