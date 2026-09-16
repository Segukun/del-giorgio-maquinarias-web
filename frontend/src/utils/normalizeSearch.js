const normalizeSearch = (value = "") =>
  value
    .toLocaleLowerCase("es")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

export default normalizeSearch;
