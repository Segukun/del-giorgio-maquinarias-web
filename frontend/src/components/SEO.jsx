import { useEffect } from "react";
import { applyHead } from "../seo/head.js";

export default function SEO({ metadata }) {
  const serialized = JSON.stringify(metadata);
  useEffect(() => applyHead(document, JSON.parse(serialized)), [serialized]);
  return null;
}
