import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";


const requestData = [
  { month: "Jan", Laptops: 20, Monitors: 10, Phones: 5 },
  { month: "Feb", Laptops: 30, Monitors: 15, Phones: 8 },
  { month: "Mar", Laptops: 50, Monitors: 25, Phones: 12 },
  { month: "Apr", Laptops: 40, Monitors: 20, Phones: 10 },
  { month: "May", Laptops: 60, Monitors: 30, Phones: 15 },
];

const AssetLineChart = () => {
  return (
    <div style={{ width: "100%", height: 300 }}>
      <ResponsiveContainer>
        <LineChart data={requestData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="Laptops"
            stroke="#4c53d7"
            activeDot={{ r: 6 }}
          />
          <Line
            type="monotone"
            dataKey="Monitors"
            stroke="#61abcb"
            activeDot={{ r: 6 }}
          />
          <Line
            type="monotone"
            dataKey="Phones"
            stroke="#a5cfec"
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AssetLineChart;
