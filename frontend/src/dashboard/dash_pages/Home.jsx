import { useEffect, useState } from "react";
import "../../css/home.css";
import DonutChart from "../charts/donutchart";
import BarChart from "../charts/barchart";
import AssetLineChart from "../charts/Assetlinechart";
import StackedBarChart from "../charts/Stackedbarchart";
import ChartTable from "../charts/Charttable";

import useAssetStore from "../../zustand/useAssetStore.js";
import useUserStore from "../../zustand/useUserStore.js";
import axios from "axios";

const AdminDashboard = () => {
  const { fetchAssets, assets } = useAssetStore();
  const { fetchUsers, users } = useUserStore();
  const [asset_types, setassetType] = useState([]);
  const [dept, setDepartments] = useState([]);
  const [selectedAsset, setSelectedAsset] = useState("Laptop");
  useEffect(() => {
    fetchAssets();
    fetchUsers()
    const fetchAssetType = async () => {
      try {
        const res1 = await axios.get("/api/company/get_assetType");
        setassetType(res1.data.assetTypes);
        const res2 = await axios.get("/api/company/get_dept");
        setDepartments(res2.data.dept);
      } catch (error) {
        console.log(error)
      }
    };
  fetchAssetType();
  }, []);
  return (
    <div className="gen_dashboard">
      <div className="upper-div">
        <div className="card">
          <div className="icon">
            <i className="fa fa-box"></i>
          </div>
          <div className="info">
            <p>{assets.length}</p>
            <span className="count-tag">Total Assets</span>
          </div>
        </div>
        <div className="card">
          <div className="icon">
            <i className="fa fa-users"></i>
          </div>
          <div className="info">
            <p>{users.length}</p>
            <span className="count-tag">Total Users</span>
          </div>
        </div>
        <div className="card">
          <div className="icon">
          <i className="fa fa-cubes"></i>

          </div>
          <div className="info">
            <p>{asset_types.length}</p>
            <span className="count-tag">Total Asset Type</span>
          </div>
        </div>
        <div className="card">
          <div className="icon">
          <i className="fa-solid fa-building-user"></i>
          </div>
          <div className="info">
            <p>{dept.length}</p>
            <span className="count-tag">Total Departments</span>
          </div>
        </div>
      </div>

      <div className="charts">
        <div className="chart piechart">
          <div className="data">
            <p>Asset Status</p>
            <select
              value={selectedAsset}
              onChange={(e) => setSelectedAsset(e.target.value)}
            >
              {[...new Set(assets.map((asset) => asset.type))].map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
          <DonutChart assetType={selectedAsset} assets={assets} />
        </div>

        <div className="chart linechart">
          <p>Monthly Asset Requests</p>
          <AssetLineChart />
        </div>

        <div className="chart barchart">
          <p>Monthly Maintenance & Lost Requests</p>
          <BarChart />
        </div>

        <div className="chart stackedchart">
          <p>Department-wise Asset Allocation</p>
          <StackedBarChart />
        </div>

        <div className="chart table-data">
          <ChartTable />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
