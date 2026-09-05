import { ArrowRight } from "lucide-react";

function getRiskClass(level) {
  if (level === "High") return "risk-badge-high";
  if (level === "Medium") return "risk-badge-medium";
  return "risk-badge-low";
}

function AtRiskStudents({ students, onViewAll }) {
  const visibleStudents = students?.slice(0, 5) ?? [];

  return (
    <div className="dashboard-card at-risk-card">
      <div className="dashboard-card-header">
        <div>
          <h3>Top At-Risk Students</h3>
          <p>Students requiring academic attention</p>
        </div>

        {students?.length > 0 && (
          <button className="text-button" onClick={onViewAll}>
            View All
            <ArrowRight size={15} />
          </button>
        )}
      </div>

      {visibleStudents.length === 0 ? (
        <div className="dashboard-empty">
          No students currently require attention.
        </div>
      ) : (
        <div className="at-risk-list">
          {visibleStudents.map((student, index) => (
            <div className="at-risk-row" key={student.student_id}>
              <span className="student-rank">{index + 1}</span>

              <div className="student-avatar">
                {student.name?.charAt(0)?.toUpperCase() || "S"}
              </div>

              <div className="at-risk-student-info">
                <strong>{student.name}</strong>
                <span>{student.student_code}</span>
              </div>

              <span
                className={`risk-badge ${getRiskClass(student.risk_level)}`}
              >
                {student.risk_level} Risk
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AtRiskStudents;
