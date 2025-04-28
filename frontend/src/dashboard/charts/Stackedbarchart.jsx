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
import axios from "axios";
import { useEffect, useState } from "react";

const DepartmentAssetStackedBarChart = () => {
  const [Allocation, setAllocation] = useState([]);
  const [assetTypes, setAssetTypes] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("/api/getDeptAllocation/");
        const trends = res.data.alloc;

        const transformedData = Object.entries(trends).map(([dept, types]) => ({
          department: dept,
          ...types,
        }));

        const allAssetTypes = new Set();
        transformedData.forEach((data) => {
          Object.keys(data).forEach((key) => {
            if (key !== "department") {
              allAssetTypes.add(key);
            }
          });                         
        });                       
                                      
        setAssetTypes(Array.from(allAssetTypes)); 
        setAllocation(transformedData);
      } catch (error) {
        console.error("Failed to fetch issues", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div style={{ width: "100%", height: 300 }}>
      <ResponsiveContainer>
        <BarChart
          data={Allocation}
          margin={{ top: 20, right: 15, left: 0, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="department" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Legend />

          {assetTypes.map((type) => (
            <Bar
              key={type}
              dataKey={type}
              stackId="a"
              fill={
                type === "Laptop"
                  ? "#4c53d7"
                  : type === "Scanner"
                  ? "#6ca0dc" 
                  : "#7c53d7"
              }
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DepartmentAssetStackedBarChart;
