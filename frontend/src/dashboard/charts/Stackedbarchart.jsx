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

const departmentAssetData = [
  { department: "IT", Laptops: 40, Scanners: 5, Desktops: 30 },
  { department: "HR", Laptops: 20, Scanners: 2, Desktops: 15 },
  { department: "Finance", Laptops: 25, Scanners: 3, Desktops: 20 },
  { department: "Sales", Laptops: 35, Scanners: 4, Desktops: 10 },
];

const DepartmentAssetStackedBarChart = () => {
  return (
    <div style={{ width: "100%", height: 300 }}>
      <ResponsiveContainer>
        <BarChart
          data={departmentAssetData}
          margin={{ top: 20, right: 15, left: 0, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="department" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Legend />
          <Bar dataKey="Laptops" stackId="a" fill="#4c53d7" /> 
          <Bar dataKey="Scanners" stackId="a" fill="#6ca0dc" />
          <Bar dataKey="Desktops" stackId="a" fill="#9ac9ea" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DepartmentAssetStackedBarChart;
