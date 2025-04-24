// import React, { useState } from "react";
import {
  PieChart,
  Pie,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";

const assetDataMap = {
  Laptops: [
    { name: "Allocated", value: 120 },
    { name: "In Stock", value: 50 },
    { name: "Under Maintenance", value: 20 },
    { name: "Lost", value: 10 },
  ],
  Monitors: [
    { name: "Allocated", value: 200 },
    { name: "In Stock", value: 100 },
    { name: "Under Maintenance", value: 40 },
    { name: "Lost", value: 20 },
  ],
  Phones: [
    { name: "Allocated", value: 50 },
    { name: "In Stock", value: 70 },
    { name: "Under Maintenance", value: 10 },
    { name: "Lost", value: 5 },
  ],
  Desktops: [
    { name: "Allocated", value: 300 },
    { name: "In Stock", value: 80 },
    { name: "Under Maintenance", value: 30 },
    { name: "Lost", value: 25 },
  ],
};

const COLORS = ["#4c53d7", "#7079eb", "#61abcb", "#a5cfec"];

const AssetPieChart = ({ assetType }) => {
  const chartData = assetDataMap[assetType] || [];
  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          dataKey="value"
          isAnimationActive={true}
          data={chartData}
          cx="50%"
          cy="45%"
          innerRadius={85}
          outerRadius={120}
        >
          {chartData.map((_, index) => (
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
            // padding: "10px",
            color: "#000",
          }}
          
        />

        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
};

const DonutChart = ({assetType}) => {

  return (
      <AssetPieChart assetType={assetType} />
    
  );
};

export default DonutChart;
