const SESSION_KEY = "dg_session_id";

export function getOrCreateSessionId(browser = globalThis) {
  try {
    const storage = browser.sessionStorage;
    if (!storage) return null;
    const existing = storage.getItem(SESSION_KEY);
    if (existing) return existing;
    if (typeof browser.crypto?.randomUUID !== "function") return null;
    const sessionId = browser.crypto.randomUUID();
    storage.setItem(SESSION_KEY, sessionId);
    return sessionId;
  } catch {
    // Restricted storage disables metrics; it must not prevent rendering/navigation.
    return null;
  }
}
