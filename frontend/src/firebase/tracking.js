import { getOrCreateSessionId } from "../runtime/session.js";
import { runOptionalTask } from "../runtime/errors.js";
import { withTimeout } from "../runtime/timeout.js";

async function writeMetric(name, data) {
  const writer = await import("./metricsWriter.js");
  return writer.writeMetric(name, data);
}

export const trackProductView = (productId, productName) => runOptionalTask("tracking.product-view", async () => {
  const sessionId = getOrCreateSessionId();
  if (!sessionId) return;
  await withTimeout(() => writeMetric("events", {
    sessionId,
    type: "product_view",
    productId,
    productName,
  }));
});

export const trackWhatsappClick = () => runOptionalTask("tracking.whatsapp", async () => {
  const sessionId = getOrCreateSessionId();
  if (!sessionId) return;
  await withTimeout(() => writeMetric("events", {
    sessionId,
    type: "whatsapp_click",
    productId: null,
    productName: null,
  }));
});
