const SOURCE_LABELS = {
  sourceInstagram: "Instagram",
  sourceFacebook: "Facebook",
  sourceDirect: "Link directo",
  sourceGoogle: "Búsqueda Google",
  sourceOther: "Otro",
};

const TrafficSourcesCard = ({ stats }) => {
  const total = Object.keys(SOURCE_LABELS).reduce((sum, key) => sum + (stats[key] ?? 0), 0);

  const rows = Object.entries(SOURCE_LABELS)
    .map(([key, label]) => ({
      label,
      value: stats[key] ?? 0,
      pct: total ? Math.round(((stats[key] ?? 0) / total) * 100) : 0,
    }))
    .sort((a, b) => b.value - a.value);

  return (
    <div className="dg-dashboard-card">
      <div className="dg-dashboard-card__heading">
        <span>Fuentes de tráfico</span>
      </div>

      {total ? (
        <ul className="dg-source-list">
          {rows.map((row) => (
            <li key={row.label}>
              <span>{row.label}</span>
              <div className="dg-source-list__bar">
                <div className="dg-source-list__fill" style={{ width: `${row.pct}%` }} />
              </div>
              <span>{row.pct}%</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="dg-dashboard-card__empty">Todavía no hay datos de tráfico.</p>
      )}
    </div>
  );
};

export default TrafficSourcesCard;