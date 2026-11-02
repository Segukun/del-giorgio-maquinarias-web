import { useLocation } from "react-router-dom";
import SEO from "./SEO.jsx";
import { getPageMetadata, isProductPath } from "../seo/metadata.js";
import { CONTACT_EMAIL, CONTACT_EMAIL_IS_PLACEHOLDER } from "../config/contact.js";

export default function RouteSEO() {
  const { pathname } = useLocation();
  // ProductDetail owns its metadata after the existing Firestore request resolves.
  if (isProductPath(pathname)) return null;
  return <SEO metadata={getPageMetadata(pathname, { contactEmail: CONTACT_EMAIL_IS_PLACEHOLDER ? undefined : CONTACT_EMAIL })} />;
}
