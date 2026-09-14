const DEVICE_LABELS = {
  deviceMobile: "Móvil",
  deviceDesktop: "PC",
  deviceTablet: "Tablet",
};

const AudienceCard = ({ stats }) => {
  const locationEntries = Object.entries(stats.locations ?? {}).sort((a, b) => b[1] - a[1]);
  const locationTotal = locationEntries.reduce((sum, [, count]) => sum + count, 0);

  const deviceTotal = Object.keys(DEVICE_LABELS).reduce((sum, key) => sum + (stats[key] ?? 0), 0);
  const deviceEntries = Object.entries(DEVICE_LABELS).sort(
    ([keyA], [keyB]) => (stats[keyB] ?? 0) - (stats[keyA] ?? 0),
  );

  return (
    <>
      <div className="dg-dashboard-card">
        <div className="dg-dashboard-card__heading">
          <span>Ubicación</span>
        </div>
        {locationEntries.length ? (
          <ul className="dg-source-list">
            {locationEntries.map(([location, count]) => (
              <li key={location}>
                <span>{location}</span>
                <div className="dg-source-list__bar">
                  <div
                    className="dg-source-list__fill"
                    style={{ width: `${locationTotal ? (count / locationTotal) * 100 : 0}%` }}
                  />
                </div>
                <span>{locationTotal ? Math.round((count / locationTotal) * 100) : 0}%</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="dg-dashboard-card__empty">
            Todavía no hay datos de ubicación suficientes para mostrar.
          </p>
        )}
      </div>

      <div className="dg-dashboard-card">
        <div className="dg-dashboard-card__heading">
          <span>Dispositivo</span>
        </div>
        {deviceTotal ? (
          <ul className="dg-source-list">
            {deviceEntries.map(([key, label]) => (
              <li key={key}>
                <span>{label}</span>
                <div className="dg-source-list__bar">
                  <div
                    className="dg-source-list__fill"
                    style={{ width: `${deviceTotal ? ((stats[key] ?? 0) / deviceTotal) * 100 : 0}%` }}
                  />
                </div>
                <span>{deviceTotal ? Math.round(((stats[key] ?? 0) / deviceTotal) * 100) : 0}%</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="dg-dashboard-card__empty">Todavía no hay datos de dispositivo.</p>
        )}
      </div>
    </>
  );
};

export default AudienceCard;