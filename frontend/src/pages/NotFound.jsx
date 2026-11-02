import InformationPage from "../components/layout/InformationPage.jsx";

export default function NotFound() {
  return <InformationPage title="Página no encontrada" introduction="La dirección que abriste no corresponde a una página disponible.">
    <p>Podés <a href="/catalogo">ver el catálogo</a> o <a href="/contacto">comunicarte con nosotros</a>.</p>
  </InformationPage>;
}
