import React, { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

// Mock data (replace with actual data in a real application)
const salesData = [
  { name: 'Jan', sales: 4000, avg: 2400 },
  { name: 'Feb', sales: 3000, avg: 1398 },
  { name: 'Mar', sales: 2000, avg: 9800 },
  { name: 'Apr', sales: 2780, avg: 3908 },
  { name: 'May', sales: 1890, avg: 4800 },
  { name: 'Jun', sales: 2390, avg: 3800 },
];

const customerSegments = [
  { name: 'High Value', value: 400 },
  { name: 'Medium Value', value: 300 },
  { name: 'Low Value', value: 300 },
];

const transactionData = [
  { id: 1, customerId: 'C001', saleType: 'Online', product: 'Widget A', value: 100, date: '2023-06-01' },
  { id: 2, customerId: 'C002', saleType: 'In-store', product: 'Widget B', value: 200, date: '2023-06-02' },
  // Add more transaction data as needed
];

const COLORS = ['#3498db', '#2ecc71', '#f1c40f', '#e74c3c'];

export default function Dashboard() {
  const [filters, setFilters] = useState({
    customerId: '',
    saleType: '',
    product: '',
    value: '',
    date: '',
  });

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const filteredTransactions = transactionData.filter((transaction) => {
    return Object.entries(filters).every(([key, value]) => {
      if (!value) return true;
      return transaction[key].toString().toLowerCase().includes(value.toLowerCase());
    });
  });

  const exportToCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + Object.keys(filteredTransactions[0]).join(",") + "\n"
      + filteredTransactions.map(row => Object.values(row).join(",")).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "transactions.csv");
    document.body.appendChild(link);
    link.click();
  };

  return (
    <div className="dashboard">
      <nav className="navbar">
        <div className="container">
          <a className="navbar-brand" href="#">CRM Dashboard</a>
        </div>
      </nav>
      
      <div className="container dashboard-content">
        <div className="row g-4 mb-4">
          <div className="col-md-6">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Overall Sales Metrics</h5>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={salesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="sales" fill="#3498db" />
                    <Bar dataKey="avg" fill="#2ecc71" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="col-md-6">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Customer Segments</h5>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={customerSegments}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {customerSegments.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>

        <div className="card mb-4">
          <div className="card-body">
            <h5 className="card-title">Transaction Table</h5>
            <div className="row g-3 mb-4">
              <div className="col-md-2">
                <input
                  className="form-control"
                  placeholder="Customer ID"
                  name="customerId"
                  value={filters.customerId}
                  onChange={handleFilterChange}
                />
              </div>
              <div className="col-md-2">
                <input
                  className="form-control"
                  placeholder="Sale Type"
                  name="saleType"
                  value={filters.saleType}
                  onChange={handleFilterChange}
                />
              </div>
              <div className="col-md-2">
                <input
                  className="form-control"
                  placeholder="Product"
                  name="product"
                  value={filters.product}
                  onChange={handleFilterChange}
                />
              </div>
              <div className="col-md-2">
                <input
                  className="form-control"
                  placeholder="Value"
                  name="value"
                  value={filters.value}
                  onChange={handleFilterChange}
                />
              </div>
              <div className="col-md-2">
                <input
                  className="form-control"
                  type="date"
                  name="date"
                  value={filters.date}
                  onChange={handleFilterChange}
                />
              </div>
              <div className="col-md-2">
                <button className="btn btn-primary w-100" onClick={exportToCSV}>Export to CSV</button>
              </div>
            </div>

            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Customer ID</th>
                    <th>Sale Type</th>
                    <th>Product</th>
                    <th>Value</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTransactions.map((transaction) => (
                    <tr key={transaction.id}>
                      <td>{transaction.id}</td>
                      <td>{transaction.customerId}</td>
                      <td>{transaction.saleType}</td>
                      <td>{transaction.product}</td>
                      <td>${transaction.value}</td>
                      <td>{transaction.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .dashboard {
          background-color: #f8f9fa;
          min-height: 100vh;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }

        .navbar {
          background-color: #34495e;
          padding: 1rem 0;
        }

        .navbar-brand {
          color: #ecf0f1;
          font-size: 1.5rem;
          font-weight: bold;
        }

        .dashboard-content {
          padding: 2rem 0;
        }

        .card {
          border: none;
          border-radius: 10px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
        }

        .card:hover {
          transform: translateY(-5px);
          box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
        }

        .card-title {
          color: #2c3e50;
          font-weight: bold;
          margin-bottom: 1.5rem;
        }

        .form-control {
          border-radius: 20px;
          border: 1px solid #bdc3c7;
          padding: 0.5rem 1rem;
        }

        .form-control:focus {
          box-shadow: 0 0 0 0.2rem rgba(52, 152, 219, 0.25);
          border-color: #3498db;
        }

        .btn-primary {
          background-color: #3498db;
          border-color: #3498db;
          border-radius: 20px;
          padding: 0.5rem 1rem;
          font-weight: bold;
          transition: all 0.3s ease;
        }

        .btn-primary:hover {
          background-color: #2980b9;
          border-color: #2980b9;
          transform: translateY(-2px);
        }

        .table {
          background-color: #ffffff;
          border-radius: 10px;
          overflow: hidden;
        }

        .table thead th {
          background-color: #34495e;
          color: #ecf0f1;
          font-weight: bold;
          text-transform: uppercase;
          font-size: 0.9rem;
          padding: 1rem;
        }

        .table tbody tr:nth-child(even) {
          background-color: #f8f9fa;
        }

        .table tbody tr:hover {
          background-color: #e8f4fd;
        }

        .table td {
          padding: 1rem;
          vertical-align: middle;
        }
      `}</style>
    </div>
  );
}