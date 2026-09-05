import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

const RISK_COLORS = {
  High: "#ef4444",
  Medium: "#f59e0b",
  Low: "#10b981",
};

function RiskDistribution({ analytics }) {
  const data = [
    {
      name: "High Risk",
      value: analytics?.high_risk_students ?? 0,
      color: RISK_COLORS.High,
    },
    {
      name: "Medium Risk",
      value: analytics?.medium_risk_students ?? 0,
      color: RISK_COLORS.Medium,
    },
    {
      name: "Low Risk",
      value: analytics?.low_risk_students ?? 0,
      color: RISK_COLORS.Low,
    },
  ];

  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="dashboard-card risk-distribution-card">
      <div className="dashboard-card-header">
        <div>
          <h3>Risk Distribution</h3>
          <p>Current academic risk across students</p>
        </div>
      </div>

      {total === 0 ? (
        <div className="dashboard-empty">No risk data available</div>
      ) : (
        <div className="risk-distribution-content">
          <div className="risk-chart">
            <ResponsiveContainer width="100%" height={190}>
              <PieChart>
                <Pie
                  data={data}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={55}
                  outerRadius={82}
                  paddingAngle={3}
                  strokeWidth={0}
                >
                  {data.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>

                <Tooltip />
              </PieChart>
            </ResponsiveContainer>

            <div className="risk-chart-center">
              <strong>{total}</strong>
              <span>Students</span>
            </div>
          </div>

          <div className="risk-legend">
            {data.map((item) => {
              const percentage =
                total > 0 ? ((item.value / total) * 100).toFixed(1) : "0.0";

              return (
                <div className="risk-legend-item" key={item.name}>
                  <div className="risk-legend-label">
                    <span
                      className="risk-dot"
                      style={{
                        backgroundColor: item.color,
                      }}
                    />

                    <span>{item.name}</span>
                  </div>

                  <strong>
                    {item.value} ({percentage}%)
                  </strong>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default RiskDistribution;
