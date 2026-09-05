import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

function AttendanceTrend({ students = [], averageAttendance = 0 }) {
  const records = students
    .filter((student) => student?.name)
    .slice(0, 8)
    .map((student) => ({
      label:
        student.name.length > 10
          ? `${student.name.slice(0, 10)}…`
          : student.name,
      attendance: Number(student.attendance_percentage ?? 0),
    }));

  const data =
    records.length > 0
      ? records
      : [
          {
            label: "Current",
            attendance: Number(averageAttendance ?? 0),
          },
        ];

  return (
    <div className="dashboard-card attendance-trend-card">
      <div className="dashboard-card-header">
        <div>
          <h3>Attendance Overview</h3>
          <p>Attendance across current student records.</p>
        </div>
      </div>

      <div className="attendance-trend-value">
        <strong>{Number(averageAttendance ?? 0).toFixed(1)}%</strong>
        <span>overall attendance</span>
      </div>

      <div className="attendance-trend-chart">
        <ResponsiveContainer width="100%" height={190}>
          <LineChart
            data={data}
            margin={{ top: 10, right: 8, left: -24, bottom: 0 }}
          >
            <XAxis
              dataKey="label"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fill: "#8a8fa3" }}
            />

            <YAxis
              domain={[0, 100]}
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fill: "#8a8fa3" }}
            />

            <Tooltip
              contentStyle={{
                border: "1px solid #e8eaf2",
                borderRadius: "10px",
                boxShadow: "0 8px 24px rgba(30, 35, 60, 0.10)",
              }}
              formatter={(value) => [`${value}%`, "Attendance"]}
            />

            <Line
              type="monotone"
              dataKey="attendance"
              stroke="#5b4ce2"
              strokeWidth={2.5}
              dot={{
                r: 3.5,
                strokeWidth: 2,
                fill: "#ffffff",
                stroke: "#5b4ce2",
              }}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default AttendanceTrend;
