import { useLayoutEffect, useRef } from "react";
import { useLocation, useNavigationType } from "react-router-dom";
import { shouldScrollToTop } from "../utils/publicNavigation.js";

// Keep native history restoration and in-page filter/anchor navigation intact.
export default function ScrollToTop() {
  const location = useLocation();
  const navigationType = useNavigationType();
  const previousPath = useRef(location.pathname);

  useLayoutEffect(() => {
    if (shouldScrollToTop(previousPath.current, location, navigationType)) {
      // Before paint, so the previous page's position is never shown on arrival.
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    }
    previousPath.current = location.pathname;
  }, [location, navigationType]);

  return null;
}
