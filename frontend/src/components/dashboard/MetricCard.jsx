import { ArrowUpRight } from "lucide-react";

function MetricCard({
  title,
  value,
  subtitle,
  icon: Icon,
  variant = "purple",
}) {
  return (
    <div className="metric-card">
      <div className={`metric-icon metric-icon-${variant}`}>
        <Icon size={20} strokeWidth={2} />
      </div>

      <div className="metric-content">
        <span className="metric-title">{title}</span>
        <strong className="metric-value">{value}</strong>

        {subtitle && (
          <span className="metric-subtitle">
            <ArrowUpRight size={13} />
            {subtitle}
          </span>
        )}
      </div>
    </div>
  );
}

export default MetricCard;
