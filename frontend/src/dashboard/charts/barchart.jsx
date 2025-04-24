// import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const requestTrends = [
  { month: "Jan", Maintenance: 12, Lost: 3 },
  { month: "Feb", Maintenance: 18, Lost: 4 },
  { month: "Mar", Maintenance: 10, Lost: 5 },
  { month: "Apr", Maintenance: 15, Lost: 2 },
  { month: "May", Maintenance: 9, Lost: 6 },
];

const RequestBarChart = () => {
  return (
    <div style={{ width: "100%", height: 300 }}>
      <ResponsiveContainer>
        <BarChart
          data={requestTrends}
          margin={{ top: 20, right: 10, left: 0, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Legend />
          <Bar dataKey="Maintenance" fill="#4c53d7" radius={[4, 4, 0, 0]} />
          <Bar dataKey="Lost" fill="#f38181" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RequestBarChart;
