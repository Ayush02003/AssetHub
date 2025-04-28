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
import axios from "axios";
import { useEffect, useState } from "react";
import dayjs from "dayjs";

const groupByMonthAndType = (requests) => {
  const monthlyData = {};

  requests.forEach((req) => {
    const month = dayjs(req.createdAt).format("MMM");
    const type = req.assetType || "";

    if (!monthlyData[month]) {
      monthlyData[month] = {};
    }

    if (!monthlyData[month][type]) {                             
      monthlyData[month][type] = 0; 
    }

    monthlyData[month][type]++;
  });

  return Object.entries(monthlyData).map(([month, types]) => ({
    month,
    ...types,
  }));
};
                                            
const AssetLineChart = () => {
  const [requestData, setRequestData] = useState([]);
  const [assetTypes, setAssetTypes] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("/api/requests");
        const formattedData = groupByMonthAndType(res.data.data);
        setRequestData(formattedData);

        const types = new Set();
        res.data.data.forEach((req) => {
          types.add(req.assetType || req.type);
        });
        setAssetTypes(Array.from(types));
      } catch (error) {
        console.error("Error fetching asset request data", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div style={{ width: "100%", height: 300 }}>
      <ResponsiveContainer>
        <LineChart data={requestData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Legend />

          {assetTypes.map((type) => (
            <Line
              key={type}
              type="monotone"
              dataKey={type}
              stroke={getColorByType(type)}
              activeDot={{ r: 6 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

const getColorByType = (type) => {
  const colors = {                                
    Laptop: "#4c53d7",
    Monitor: "#61abcb",
    Scanner: "#a5cfec",
  };
  return colors[type] || "#000000";           
};

export default AssetLineChart;
