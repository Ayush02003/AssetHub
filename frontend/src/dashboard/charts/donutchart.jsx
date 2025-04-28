import {
  PieChart,
  Pie,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";
import PropTypes from "prop-types";

const COLORS = ["#4c53d7", "#7079eb", "#61abcb", "#a5cfec"];

const AssetPieChart = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          dataKey="value"
          isAnimationActive={true}
          data={data}
          cx="50%"
          cy="45%"
          innerRadius={85}
          outerRadius={120}
        >
          {data.map((_, index) => (
            <Cell
              key={`cell-${index}`}
              fill={COLORS[index % COLORS.length]}
            />
          ))}
        </Pie>
        <Tooltip
          cursor={{ fill: "transparent" }}
          wrapperStyle={{ pointerEvents: "auto" }}
          contentStyle={{
            border: "1px solid #ccc",
            borderRadius: "8px",
            fontSize: "12px",
            color: "#000",
          }}
        />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
};

AssetPieChart.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      value: PropTypes.number.isRequired,
    })
  ).isRequired,
};

const DonutChart = ({ assetType, assets }) => {
  const getStatusCount = (status) =>
    assets.filter(
      (a) =>
        a.type === assetType &&
        a.status?.toLowerCase() === status.toLowerCase()
    ).length;

  const chartData = [
    { name: "Allocated", value: getStatusCount("Assigned") },
    { name: "In Stock", value: getStatusCount("Not Assigned") },
    { name: "Under Maintenance", value: getStatusCount("Under_Maintenance") },
    { name: "Lost", value: getStatusCount("Asset Lost") },
  ];

  return <AssetPieChart data={chartData} />;
};

DonutChart.propTypes = {
  assetType: PropTypes.string.isRequired,
  assets: PropTypes.array.isRequired,
};

export default DonutChart;
