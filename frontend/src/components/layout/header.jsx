import { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../../styles/layout/header.css";

const NAV_LINKS = [
  { label: "Inicio", href: "/" },
  { label: "Nuevos", href: "/catalogo?condicion=nuevo" },
  { label: "Usados", href: "/catalogo?condicion=usado" },
  { label: "Marcas", href: "/marcas" },
  { label: "Nosotros", href: "/nosotros" },
  { label: "Contacto", href: "/contacto" },
];

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [compact, setCompact] = useState(false);
  const lastScrollY = useRef(0);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;
      setCompact(y > 60);
      lastScrollY.current = y;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Mantiene el buscador sincronizado con la URL real, sin importar
  // cómo se llegó a ella (tipeando, un chip de categoría, un link directo).
  useEffect(() => {
    if (location.pathname !== "/catalogo") {
      setQuery("");
      return;
    }
    const params = new URLSearchParams(location.search);
    setQuery(params.get("q") ?? "");
  }, [location]);

  const handleSearch = (e) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;
    setMenuOpen(false);
    navigate(`/catalogo?q=${encodeURIComponent(trimmed)}`);
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

        <nav className={`dg-header__nav ${menuOpen ? "is-open" : ""}`}>
          {NAV_LINKS.map((link) => (
            <a key={link.href} href={link.href} className="dg-header__link">
              {link.label}
            </a>
          ))}
        </nav>

        <button
          className={`dg-header__burger ${menuOpen ? "is-open" : ""}`}
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Abrir menú"
          aria-expanded={menuOpen}
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
              placeholder="Buscar maquinaria..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </form>
        </div>
      )}
    </header>
  );
};

export default Header;