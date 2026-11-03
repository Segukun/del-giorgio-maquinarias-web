// Log only diagnostic fields, never Firebase users, request bodies or customData.
export function redactDiagnostic(value) {
  return String(value ?? "")
    .replace(/https?:\/\/[^\s<>"']+/g, (value) => {
      try {
        const url = new URL(value);
        url.username = "";
        url.password = "";
        url.search = "";
        url.hash = "";
        return url.href;
      } catch { return "[url]"; }
    })
    .replace(/\bBearer\s+\S+/gi, "Bearer [redacted]")
    .replace(/\beyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\b/g, "[redacted]")
    .replace(/\bAIza[A-Za-z0-9_-]+/g, "[redacted]")
    .replace(/((?:password|secret|api[_-]?key|access[_-]?token|id[_-]?token|refresh[_-]?token|token)["']?\s*[:=]\s*)(?:"[^"]*"|'[^']*'|[^\s,}]+)/gi, "$1[redacted]")
    .replace(/[\w.+-]+@[\w.-]+\.[A-Za-z]{2,}/g, "[email]")
    .slice(0, 6000);
}

export function reportRuntimeError(stage, error) {
  console.error("[DGM]", {
    stage,
    name: redactDiagnostic(error?.name || "Error"),
    code: redactDiagnostic(error?.code),
    message: redactDiagnostic(error?.message || error),
    stack: redactDiagnostic(error?.stack),
  });
}

export async function runOptionalTask(stage, task) {
  try { return await task(); }
  catch (error) {
    reportRuntimeError(stage, error);
    return null;
  }
}
