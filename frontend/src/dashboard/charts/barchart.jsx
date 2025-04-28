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
import axios from "axios";        
import { useEffect, useState } from "react";
import dayjs from "dayjs";

const getMonthIssues = (requests) => {
  const monthlyData = {};

  requests.forEach((req) => {
    const month = dayjs(req.createdAt).format("MMM");
    const type = req.type || "";

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

const RequestBarChart = () => {
  const [requestTrends, setRequestTrends] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("/api/issues/");
        const trends = getMonthIssues(res.data.data);
        setRequestTrends(trends);
        // console.log(trends); 
      } catch (error) {
        console.error("Failed to fetch issues", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div style={{ width: "100%", height: 300 }}>
      {requestTrends.length === 0 ? (
        <p>Loading chart data...</p>
      ) : (
        <ResponsiveContainer>
          <BarChart
            data={requestTrends}
            margin={{ top: 20, right: 10, left: 0, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis
              domain={[0, "dataMax + 5"]}
              allowDecimals={false}
              tickCount={6}
            />
            <Tooltip />
            <Legend />
            <Bar dataKey="maintenance" fill="#4c53d7" radius={[4, 4, 0, 0]} />
            <Bar dataKey="lost" fill="#f38181" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default RequestBarChart;
