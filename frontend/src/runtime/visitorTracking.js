import { getOrCreateSessionId } from "./session.js";
import { runOptionalTask } from "./errors.js";
import { withTimeout } from "./timeout.js";

const SESSION_DATA_KEY = "dg_session_created";
let pendingSession;

function detectDevice(userAgent) {
  if (/tablet|ipad/i.test(userAgent)) return "tablet";
  if (/mobile|android|iphone/i.test(userAgent)) return "mobile";
  return "desktop";
}

function detectSource(browser) {
  const source = new URLSearchParams(browser.location.search).get("utm_source");
  if (source) return source.toLowerCase();
  const referrer = browser.document.referrer;
  if (!referrer) return "direct";
  if (referrer.includes("instagram")) return "instagram";
  if (referrer.includes("facebook") || referrer.includes("fb.")) return "facebook";
  if (referrer.includes("google")) return "google";
  return "other";
}

async function getLocation(browser) {
  let timer;
  try {
    const controller = new browser.AbortController();
    timer = setTimeout(() => controller.abort(), 2500);
    const response = await browser.fetch("https://ipapi.co/json/", { signal: controller.signal });
    if (!response.ok) return { city: null, province: null };
    const data = await response.json();
    return { city: data.city ?? null, province: data.region ?? null };
  } catch { return { city: null, province: null }; }
  finally { clearTimeout(timer); }
}

export function trackVisit(browser = globalThis, loadWriter = () => import("../firebase/metricsWriter.js")) {
  if (pendingSession) return pendingSession;
  pendingSession = runOptionalTask("tracking.session", async () => {
    if (/^\/admin(?:\/|$)/i.test(browser.location.pathname)) return;
    const sessionId = getOrCreateSessionId(browser);
    if (!sessionId || browser.sessionStorage.getItem(SESSION_DATA_KEY)) return;
    const device = detectDevice(browser.navigator?.userAgent || "");
    const referrerSource = detectSource(browser);
    const { city, province } = await getLocation(browser);
    await withTimeout(async () => {
      const { writeMetric } = await loadWriter();
      await writeMetric("sessions", { sessionId, device, referrerSource, city, province, hadInteraction: false });
    });
    browser.sessionStorage.setItem(SESSION_DATA_KEY, "true");
  }).finally(() => { pendingSession = null; });
  return pendingSession;
}
