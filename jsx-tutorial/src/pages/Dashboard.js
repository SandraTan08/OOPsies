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

const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

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
    <div className="container-fluid bg-light py-4">
      <h1 className="display-4 mb-4">CRM Dashboard</h1>
      
      <div className="row mb-4">
        <div className="col-md-6 mb-4">
          <div className="card shadow-sm">
            <div className="card-header bg-white">
              <h5 className="card-title mb-0">Overall Sales Metrics</h5>
            </div>
            <div className="card-body">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="sales" fill="#007bff" />
                  <Bar dataKey="avg" fill="#28a745" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="col-md-6 mb-4">
          <div className="card shadow-sm">
            <div className="card-header bg-white">
              <h5 className="card-title mb-0">Customer Segments</h5>
            </div>
            <div className="card-body">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={customerSegments}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
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

      <div className="card shadow-sm mb-4">
        <div className="card-header bg-white">
          <h5 className="card-title mb-0">Transaction Table</h5>
        </div>
        <div className="card-body">
          <div className="row mb-3">
            <div className="col-md-2 mb-2">
              <input
                className="form-control"
                placeholder="Customer ID"
                name="customerId"
                value={filters.customerId}
                onChange={handleFilterChange}
              />
            </div>
            <div className="col-md-2 mb-2">
              <input
                className="form-control"
                placeholder="Sale Type"
                name="saleType"
                value={filters.saleType}
                onChange={handleFilterChange}
              />
            </div>
            <div className="col-md-2 mb-2">
              <input
                className="form-control"
                placeholder="Product"
                name="product"
                value={filters.product}
                onChange={handleFilterChange}
              />
            </div>
            <div className="col-md-2 mb-2">
              <input
                className="form-control"
                placeholder="Value"
                name="value"
                value={filters.value}
                onChange={handleFilterChange}
              />
            </div>
            <div className="col-md-2 mb-2">
              <input
                className="form-control"
                type="date"
                name="date"
                value={filters.date}
                onChange={handleFilterChange}
              />
            </div>
            <div className="col-md-2 mb-2">
              <button className="btn btn-primary w-100" onClick={exportToCSV}>Export to CSV</button>
            </div>
          </div>

          <div className="table-responsive">
            <table className="table table-striped table-hover">
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
  );
}