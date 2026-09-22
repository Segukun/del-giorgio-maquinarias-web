import { useEffect } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase/config";

const SESSION_KEY = "dg_session_id";
const SESSION_DATA_KEY = "dg_session_created";

const detectDevice = () => {
  const ua = navigator.userAgent;
  if (/tablet|ipad/i.test(ua)) return "tablet";
  if (/mobile|android|iphone/i.test(ua)) return "mobile";
  return "desktop";
};

const detectSource = () => {
  const params = new URLSearchParams(window.location.search);
  const utmSource = params.get("utm_source");
  if (utmSource) return utmSource.toLowerCase();

  const ref = document.referrer;
  if (!ref) return "direct";
  if (ref.includes("instagram")) return "instagram";
  if (ref.includes("facebook") || ref.includes("fb.")) return "facebook";
  if (ref.includes("google")) return "google";
  return "other";
};

const getLocation = async () => {
  try {
    const response = await fetch("https://ipapi.co/json/");
    if (!response.ok) return { city: null, province: null };
    const data = await response.json();
    return {
      city: data.city ?? null,
      province: data.region ?? null,
    };
  } catch {
    return { city: null, province: null };
  }
};

export const getOrCreateSessionId = () => {
  let sessionId = sessionStorage.getItem(SESSION_KEY);
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    sessionStorage.setItem(SESSION_KEY, sessionId);
  }
  return sessionId;
};

export const useVisitorTracking = () => {
  useEffect(() => {
    // No trackeamos navegación dentro del panel de administración
    if (window.location.pathname.startsWith("/admin")) return;

    const alreadyTracked = sessionStorage.getItem(SESSION_DATA_KEY);
    if (alreadyTracked) return;

    const trackSession = async () => {
      const sessionId = getOrCreateSessionId();
      const device = detectDevice();
      const referrerSource = detectSource();
      const { city, province } = await getLocation();

      await addDoc(collection(db, "sessions"), {
        sessionId,
        createdAt: serverTimestamp(),
        device,
        referrerSource,
        city,
        province,
        hadInteraction: false,
      });

      sessionStorage.setItem(SESSION_DATA_KEY, "true");
    };

    trackSession();
  }, []);
};