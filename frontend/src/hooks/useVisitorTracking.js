import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { trackVisit } from "../runtime/visitorTracking.js";

export const useVisitorTracking = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    void trackVisit();
  }, [pathname]);
};
