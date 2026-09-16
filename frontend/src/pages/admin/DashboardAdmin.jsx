import { useEffect, useState } from "react";
import {
  FiActivity,
  FiEye,
  FiMessageCircle,
  FiPlus,
  FiTag,
  FiTrendingUp,
  FiUsers,
  FiExternalLink,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../../components/admin/AdminLayout.jsx";
import AdminModal from "../../components/admin/AdminModal.jsx";
import StatCard from "../../components/admin/dashboard/StatCard.jsx";
import TopMachinesCard from "../../components/admin/dashboard/TopMachinesCard.jsx";
import RecentActivityCard from "../../components/admin/dashboard/RecentActivityCard.jsx";
import TrafficSourcesCard from "../../components/admin/dashboard/TrafficSourcesCard.jsx";
import AudienceCard from "../../components/admin/dashboard/AudienceCard.jsx";
import RecentEventsCard from "../../components/admin/dashboard/RecentEventsCard.jsx";
import {
  fetchDashboardStats,
  fetchTopProducts,
  fetchRecentProductViews,
} from "../../firebase/analytics.js";
import { fetchRecentActivity } from "../../firebase/adminActivity.js";
import "../../styles/admin/layout.css";
import "../../styles/admin/dashboard.css";

const TABS = ["Vista General", "Alcance", "Interactividad", "Audiencia"];
const PUBLIC_SITE_URL = "https://delgiorgiomaquinarias.com"; // ajustar a tu dominio real

const DashboardAdmin = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("Vista General");
  const [period] = useState("month"); // dejamos fijo "Este mes" por ahora
  const [stats, setStats] = useState(null);
  const [topProducts, setTopProducts] = useState([]);
  const [activity, setActivity] = useState([]);
  const [recentViews, setRecentViews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null); // "topMachines" | "activity" | null

  useEffect(() => {
    let cancelled = false;

    Promise.all([
        fetchDashboardStats(period),
        fetchTopProducts(5),
        fetchRecentActivity(5),
        fetchRecentProductViews(5),
      ])
      .then(([statsData, topProductsData, activityData, recentViewsData]) => {
        if (cancelled) return;

      setStats(statsData);
      setTopProducts(topProductsData);
      setActivity(activityData);
      setRecentViews(recentViewsData);
      })
      .catch((error) => console.error(error))
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [period]);

  const interactivityRate = stats?.current?.sessionsTotal
    ? Math.round((stats.current.whatsappClicksTotal / stats.current.sessionsTotal) * 100)
    : 0;

  if (loading || !stats) {
    return (
      <AdminLayout onUnavailable={() => {}}>
        <section className="dg-dashboard">
          <p>Cargando panel...</p>
        </section>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout onUnavailable={(section) => alert(`La sección ${section} está en desarrollo.`)}>
      <section className="dg-dashboard" aria-labelledby="dashboard-title">
        <div className="dg-dashboard__heading">
          <div className="dg-dashboard__title-group">
            <span className="dg-dashboard__title-icon" aria-hidden="true">
              <FiTrendingUp />
            </span>
            <div>
              <h1 id="dashboard-title">Rendimientos y Analíticas</h1>
              <p>Acá podés ver el rendimiento de tu sitio web y el comportamiento de tus clientes.</p>
            </div>
          </div>
        </div>

        <div className="dg-dashboard__tabs" role="tablist">
          {TABS.map((tab) => (
            <button
              key={tab}
              type="button"
              role="tab"
              aria-selected={activeTab === tab}
              className={activeTab === tab ? "is-active" : ""}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        {activeTab === "Vista General" ? (
          <>
            <div className="dg-dashboard__stats-grid">
              <StatCard
                icon={FiUsers}
                label="Sesiones en total"
                value={stats.current.sessionsTotal.toLocaleString("es-AR")}
                changePct={stats.changes.sessionsTotal}
              />
              <StatCard
                icon={FiUsers}
                label="Sesiones nuevas totales"
                value={stats.current.newSessionsTotal.toLocaleString("es-AR")}
                changePct={stats.changes.newSessionsTotal}
              />
              <StatCard
                icon={FiEye}
                label="Máquinas vistas totales"
                value={stats.current.productViewsTotal.toLocaleString("es-AR")}
                changePct={stats.changes.productViewsTotal}
              />
              <StatCard
                icon={FiMessageCircle}
                label="Clicks en WhatsApp totales"
                value={stats.current.whatsappClicksTotal.toLocaleString("es-AR")}
                changePct={stats.changes.whatsappClicksTotal}
              />
            </div>

            <div className="dg-dashboard__two-col">
              <TopMachinesCard products={topProducts} onViewMore={() => setModal("topMachines")} />
              <RecentActivityCard activity={activity} onViewMore={() => setModal("activity")} />
            </div>
          </>
        ) : null}

        {activeTab === "Alcance" ? (
          <>
            <div className="dg-dashboard__stats-grid dg-dashboard__stats-grid--3">
              <StatCard
                icon={FiUsers}
                label="Sesiones"
                value={stats.current.sessionsTotal}
                changePct={stats.changes.sessionsTotal}
              />
              <StatCard
                icon={FiUsers}
                label="Sesiones nuevas"
                value={stats.current.newSessionsTotal}
                changePct={stats.changes.newSessionsTotal}
              />
              <StatCard
                icon={FiEye}
                label="Máquinas visitadas"
                value={stats.current.productViewsTotal}
                changePct={stats.changes.productViewsTotal}
              />
            </div>
            <TrafficSourcesCard stats={stats.current} />
          </>
        ) : null}

        {activeTab === "Interactividad" ? (
          <>
            <div className="dg-dashboard__stats-grid dg-dashboard__stats-grid--2">
              <StatCard
                icon={FiMessageCircle}
                label="Clicks en WhatsApp"
                value={stats.current.whatsappClicksTotal}
                changePct={stats.changes.whatsappClicksTotal}
              />
              <StatCard icon={FiActivity} label="Tasa de interactividad" value={`${interactivityRate}%`} />
            </div>
            <RecentEventsCard events={recentViews} />
          </>
        ) : null}

        {activeTab === "Audiencia" ? <AudienceCard stats={stats.current} /> : null}

        <div className="dg-dashboard__quick-actions">
          <button
            className="dg-button dg-button--primary"
            type="button"
            onClick={() => navigate("/admin/panel/productos?nuevo=1")}
          >
            Agregar producto
          </button>
          <button
            className="dg-button dg-button--secondary"
            type="button"
            onClick={() => navigate("/admin/panel/categorias")}
          >
            <FiTag aria-hidden="true" /> Agregar categoría
          </button>
          <button
            className="dg-button dg-button--secondary"
            type="button"
            onClick={() => navigate("/admin/panel/marcas")}
          >
            <FiPlus aria-hidden="true" /> Agregar marca
          </button>
          
          <a
            className="dg-button dg-button--secondary"
            href={PUBLIC_SITE_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            <FiExternalLink aria-hidden="true" /> Ver sitio web
          </a>
        </div>
      </section>

      {modal === "topMachines" ? (
        <AdminModal title="Top máquinas" onClose={() => setModal(null)} size="large">
          <TopMachinesCard products={topProducts} />
        </AdminModal>
      ) : null}

      {modal === "activity" ? (
        <AdminModal title="Actividad completa" onClose={() => setModal(null)} size="large">
          <RecentActivityCard activity={activity} />
        </AdminModal>
      ) : null}
    </AdminLayout>
  );
};

export default DashboardAdmin;
