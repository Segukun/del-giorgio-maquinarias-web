import { useEffect, useState } from "react";
import InformationPage from "../components/layout/InformationPage.jsx";
import { fetchBrands } from "../firebase/brands.js";

export default function Brands() {
  const [brands, setBrands] = useState([]);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    let active = true;
    fetchBrands().then((data) => {
      if (!active) return;
      setBrands(data.filter((brand) => brand.isActive));
      setStatus("ready");
    }).catch(() => {
      if (active) setStatus("error");
    });
    return () => { active = false; };
  }, []);

  return (
    <InformationPage title="Nuestras marcas" introduction="Conocé las marcas con las que trabajamos y consultanos por maquinaria y repuestos.">
      {status === "loading" && <p role="status">Cargando marcas…</p>}
      {status === "error" && <p role="alert">No pudimos cargar las marcas. <a href="/marcas">Intentá nuevamente</a> o <a href="/contacto">comunicate con nosotros</a>.</p>}
      {status === "ready" && (brands.length ? (
        <ul className="dg-brand-grid" aria-label="Marcas del catálogo">
          {brands.map((brand) => {
            const image = brand.image?.url ?? brand.image;
            return <li key={brand.id}>
              {image && <img src={image} alt="" loading="lazy" width="180" height="100" />}
              <h2>{brand.name}</h2>
            </li>;
          })}
        </ul>
      ) : <p>Consultanos para conocer las marcas y equipos disponibles.</p>)}
      <aside className="dg-information__callout">
        <h2>Consultá por el equipo que necesitás</h2>
        <p>La disponibilidad se confirma directamente con nosotros. <a href="/contacto">Ver medios de contacto</a>.</p>
      </aside>
    </InformationPage>
  );
}
