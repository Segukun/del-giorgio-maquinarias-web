import { collection, doc, getDoc, getDocs, query, orderBy, limit } from "firebase/firestore";
import { db } from "./config";

const toDateKey = (date) => date.toISOString().slice(0, 10);

const getDateRange = (period) => {
  const end = new Date();
  const start = new Date();
  if (period === "month") start.setDate(1);
  if (period === "week") start.setDate(end.getDate() - 7);
  if (period === "today") start.setHours(0, 0, 0, 0);
  return { start, end };
};

const getPreviousDateRange = (period) => {
  const { start } = getDateRange(period);
  const prevEnd = new Date(start);
  prevEnd.setDate(prevEnd.getDate() - 1);
  const prevStart = new Date(prevEnd);

  if (period === "month") prevStart.setDate(1);
  if (period === "week") prevStart.setDate(prevEnd.getDate() - 7);
  if (period === "today") prevStart.setHours(0, 0, 0, 0);

  return { start: prevStart, end: prevEnd };
};

const sumStatsForRange = async (start, end) => {
  const days = [];
  const cursor = new Date(start);
  while (cursor <= end) {
    days.push(toDateKey(cursor));
    cursor.setDate(cursor.getDate() + 1);
  }

  const docs = await Promise.all(days.map((dateKey) => getDoc(doc(db, "dailyStats", dateKey))));

  const totals = {
    sessionsTotal: 0,
    newSessionsTotal: 0,
    productViewsTotal: 0,
    whatsappClicksTotal: 0,
    sourceInstagram: 0,
    sourceFacebook: 0,
    sourceDirect: 0,
    sourceGoogle: 0,
    sourceOther: 0,
    deviceMobile: 0,
    deviceDesktop: 0,
    deviceTablet: 0,
    locations: {},
  };

  docs.forEach((docSnap) => {
    if (!docSnap.exists()) return;
    const data = docSnap.data();
    Object.keys(totals).forEach((key) => {
      if (key === "locations") return;
      totals[key] += data[key] ?? 0;
    });
    Object.entries(data.locations ?? {}).forEach(([key, count]) => {
      totals.locations[key] = (totals.locations[key] ?? 0) + count;
    });
  });

  return totals;
};

const pctChange = (current, previous) => {
  if (previous === 0) return current > 0 ? 100 : 0;
  return Math.round(((current - previous) / previous) * 100);
};

export const fetchDashboardStats = async (period = "month") => {
  const current = getDateRange(period);
  const previous = getPreviousDateRange(period);

  const [currentTotals, previousTotals] = await Promise.all([
    sumStatsForRange(current.start, current.end),
    sumStatsForRange(previous.start, previous.end),
  ]);

  return {
    current: currentTotals,
    changes: {
      sessionsTotal: pctChange(currentTotals.sessionsTotal, previousTotals.sessionsTotal),
      newSessionsTotal: pctChange(currentTotals.newSessionsTotal, previousTotals.newSessionsTotal),
      productViewsTotal: pctChange(currentTotals.productViewsTotal, previousTotals.productViewsTotal),
      whatsappClicksTotal: pctChange(currentTotals.whatsappClicksTotal, previousTotals.whatsappClicksTotal),
    },
  };
};

export const fetchTopProducts = async (topN = 5) => {
  const q = query(collection(db, "productStats"), orderBy("viewCount", "desc"), limit(topN));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() }));
};

export const fetchRecentProductViews = async (topN = 5) => {
  const q = query(
    collection(db, "events"),
    orderBy("createdAt", "desc"),
    limit(topN * 3), // traemos de más porque vamos a filtrar solo product_view
  );
  const snapshot = await getDocs(q);
  return snapshot.docs
    .map((docSnap) => ({ id: docSnap.id, ...docSnap.data() }))
    .filter((event) => event.type === "product_view")
    .slice(0, topN);
};