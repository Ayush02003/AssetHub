
const getStatusIcon = (type) => {
  switch (type) {
    case "Maintenance":
      return <i className="fas fa-wrench icon maintenance"></i>;
    case "Lost":
      return <i className="fas fa-exclamation-triangle icon lost"></i>;
    case "Allocation":
      return <i className="fas fa-wrench icon maintenance"></i>;
    case "Peniding":
      return <i className="fas fa-exclamation-triangle icon lost"></i>;

    default:
      return null;
  }
};

const tableData = [
  {
    id: 1,
    type: "Maintenance",
    asset: "Laptop",
    department: "IT",
    date: "2025-04-20",
  },
  {
    id: 2,
    type: "Lost",
    asset: "Scanner",
    department: "HR",
    date: "2025-04-19",
  },
  {
    id: 3,
    type: "Allocation",
    asset: "Phone",
    department: "Support",
    date: "2025-04-18",
  },
];

const ChartTable = () => {
  return (
    <div className="chart-table">
      <div className="table-header">
        <h3>Recent Requests</h3>
        <hr />
      </div>
      <table>
        <thead>
          <tr>
            <th>Type</th>
            <th>Asset</th>
            <th>Department</th>
            <th>Date</th>
            <th>View</th>
          </tr>
        </thead>
        <tbody>
          {tableData.map((item) => (
            <tr key={item.id}>
              <td className="type">
                {getStatusIcon(item.type)}
                {item.type}
              </td>
              <td>{item.asset}</td>
              <td>{item.department}</td>
              <td>{item.date}</td>
              <td>
                <i className="fa fa-user"></i>
                <i className="fa fa-laptop"></i>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ChartTable;
