import { FiArrowDown, FiArrowUp } from "react-icons/fi";

const StatCard = ({ icon: Icon, label, value, changePct, tone = "default" }) => {
  const isPositive = changePct >= 0;

  return (
    <div className={`dg-stat-card dg-stat-card--${tone}`}>
      <span className="dg-stat-card__icon" aria-hidden="true">
        <Icon />
      </span>
      <div className="dg-stat-card__body">
        <span className="dg-stat-card__label">{label}</span>
        <strong className="dg-stat-card__value">{value}</strong>
        {typeof changePct === "number" ? (
          <span className={`dg-stat-card__change ${isPositive ? "is-positive" : "is-negative"}`}>
            {isPositive ? <FiArrowUp aria-hidden="true" /> : <FiArrowDown aria-hidden="true" />}
            {Math.abs(changePct)}% vs período anterior
          </span>
        ) : null}
      </div>
    </div>
  );
};

export default StatCard;