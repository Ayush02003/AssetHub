import { useState } from "react";
import "../../css/home.css";
import DonutChart from "../charts/donutchart";
import BarChart  from "../charts/barchart";
import AssetLineChart from "../charts/Assetlinechart";
import StackedBarChart from "../charts/Stackedbarchart";
import ChartTable from "../charts/Charttable";
const AdminDashboard = () => {
  const [selectedAsset, setSelectedAsset] = useState("Laptops");

  return (
    <div className="gen_dashboard">
      <div className="upper-div">
        <div className="card">
          <div className="icon">
            <i className="fa fa-box"></i>
          </div>
          <div className="info">
            <p>100</p>
            <span className="count-tag">Total Assets</span>
          </div>
        </div>
        <div className="card">
          <div className="icon">
            <i className="fa fa-users"></i>
          </div>
          <div className="info">
            <p>35</p>
            <span className="count-tag">Total Users</span>
          </div>
        </div>
        <div className="card">
          <div className="icon">
            <i className="fa fa-check-circle"></i>
          </div>
          <div className="info">
            <p>60</p>
            <span className="count-tag">Allocated</span>
          </div>
        </div>
        <div className="card">
          <div className="icon">
            <i className="fa fa-times-circle"></i>
          </div>
          <div className="info">
            <p>40</p>
            <span className="count-tag">Unallocated</span>
          </div>
        </div>
      </div>

      <div className="charts">
        <div className="chart piechart">
          <div className="data">
            <p>Asset Allocation Status</p>
            <select
              value={selectedAsset}
              onChange={(e) => setSelectedAsset(e.target.value)}
            >
              <option value="Laptops">Laptops</option>
              <option value="Monitors">Monitors</option>
              <option value="Phones">Phones</option>
              <option value="Desktops">Desktops</option>
            </select>
          </div>
          <DonutChart assetType={selectedAsset} />
        </div>

        <div className="chart linechart">
          <p>Monthly Asset Requests</p>
          <AssetLineChart />
        </div>

        <div className="chart barchart">
        <p>Monthly Maintenance & Lost Requests</p>
          <BarChart /></div>

        <div className="chart stackedchart">
        <p>Department-wise Asset Allocation</p>
          <StackedBarChart/>
        </div>

        <div className="chart table-data">
          <ChartTable/>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
