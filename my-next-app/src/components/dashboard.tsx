'use client'

import { useState, useEffect } from 'react'
import { Bar, Line } from 'react-chartjs-2'
import { useSession, signIn, signOut } from 'next-auth/react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"


import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  LineElement,
  PointElement,
  Tooltip,
  Legend,
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
)
import { CSVLink } from 'react-csv'
import { ShoppingCart, BarChart, Search, Download } from 'lucide-react'



const customerData = {
  labels: ['High Value', 'Medium Value', 'Low Value'],
  datasets: [
    {
      label: 'Customer Segments',
      data: [30, 50, 20],
      backgroundColor: [
        'rgba(255, 99, 132, 0.6)',
        'rgba(54, 162, 235, 0.6)',
        'rgba(255, 206, 86, 0.6)',
      ],
    },
  ],
}

export default function Dashboard() {
  const [transactionsData, setTransactionsData] = useState<any[]>([]);  // All transactions
  const [filteredTransactions, setFilteredTransactions] = useState<any[]>([]);  // Filtered transactions to display
  const [saleTypeFilter, setSaleTypeFilter] = useState<string>('');  // State for sale type filter
  const [customerIdFilter, setCustomerIdFilter] = useState<string>(''); // state for customer ID filter
  const [productIdFilter, setProductIdFilter] = useState<string>(''); // state for Product ID filter
  const [salesData, setSalesData] = useState<any>({
    labels: [],
    datasets: [
      {
        label: 'Sales',
        data: [],
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
    ],
  });

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  // Calculate total sales and average order value
  const totalSales = transactionsData.reduce((sum, transaction) => sum + transaction.value, 0).toFixed(2);
  const averageOrderValue = transactionsData.length > 0 ? (parseFloat(totalSales) / transactionsData.length).toFixed(2) : 0;

  // Process sales data for the chart
  const processSalesData = (transactions) => {
    const salesByMonth = {};

    transactions.forEach(transaction => {
      const date = new Date(transaction.date);
      const month = date.toLocaleString('default', { month: 'short' }); // e.g., 'Jan', 'Feb'
      const year = date.getFullYear();
      const monthYear = `${month} ${year}`;

      // Initialize if not already in the salesByMonth object
      if (!salesByMonth[monthYear]) {
        salesByMonth[monthYear] = 0;
      }

      salesByMonth[monthYear] += transaction.value;
    });

    return {
      labels: Object.keys(salesByMonth),
      data: Object.values(salesByMonth),
    };
  };

  // Fetch transactions data (mock or API call)
  useEffect(() => {
    async function fetchSalesData() {
      try {
        const res = await fetch('http://localhost:8080/api/v1/purchaseHistory');
        if (!res.ok) throw new Error('Failed to fetch sales data');
        const data = await res.json();

        const transactions = data.map((purchase: any) => ({
          id: purchase.purchaseId,
          customerId: purchase.customerId.toString(),
          saleType: purchase.saleType === 1 ? 'Online' : 'In-store',
          product: `Product ${purchase.productId}`,
          value: purchase.totalPrice,
          date: purchase.saleDate,
        }));

        setTransactionsData(transactions);
        setFilteredTransactions(transactions);  // Initially show all transactions

        // Process sales data for the chart
        const { labels, data: salesChartData } = processSalesData(transactions);
        setSalesData({
          labels,
          datasets: [{
            label: 'Sales',
            data: salesChartData,
            backgroundColor: 'rgba(75, 192, 192, 0.6)',
          }],
        });
      } catch (error) {
        console.error('Error fetching sales data:', error);
      }
    }

    fetchSalesData();
  }, []);

  // Handle filter form submission
  const handleFilter = (e) => {
    e.preventDefault();

    let filtered = transactionsData;

    // Apply filters based on sale type, customer ID, and product ID
    if (saleTypeFilter) {
      filtered = filtered.filter(transaction => transaction.saleType === saleTypeFilter);
    }

    if (customerIdFilter) {
      filtered = filtered.filter(transaction => transaction.customerId === customerIdFilter);
    }

    if (productIdFilter) {
      filtered = filtered.filter(transaction => transaction.product === productIdFilter);
    }

    setFilteredTransactions(filtered);
  };

  const { data: session, status } = useSession();

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (!session) {
    return (
      <div>
        <h1>You are not logged in</h1>
        <button onClick={() => signIn()}>Sign In</button>
      </div>
    );
  }



  return (
    
    <div className="flex h-screen bg-gray-100">
      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <header className="flex items-center justify-between px-4 py-4 bg-white border-b border-gray-200 sm:px-6 lg:px-8">
          <div className="flex items-center">
            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                className="w-64 px-4 py-2 text-sm text-gray-700 placeholder-gray-400 bg-gray-100 border border-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <Search className="absolute top-2.5 right-3 w-5 h-5 text-gray-400" />
            </div>
          </div>
            <button
                onClick={toggleDropdown}
                className="flex items-center max-w-xs text-sm bg-black rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                id="user-menu"
                aria-expanded={dropdownOpen}
                aria-haspopup="true"
              >
                <Avatar>
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <span className="sr-only">Open user menu</span>
              </button>
          
        </header>
      <div>
        
      {/* Dropdown Menu */}
      {dropdownOpen && (
        <div
          className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="user-menu"
        >
          <div className="py-1" role="none">
            <a
              href="#"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              role="menuitem"
            >
              Profile
            </a>
            <a
              href="#"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              role="menuitem"
            >
              Settings
            </a>
            <button
              onClick={() => signOut({ callbackUrl: '/' })}
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              role="menuitem"
            >
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>

        {/* Dashboard content */}
        <main className="flex-1 overflow-y-auto bg-gray-100">
          <div className="py-6">
            <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
              <h1 className="text-2xl font-semibold text-gray-900">Welcome, {session.account.accountUserName} </h1>
            </div>
            <div className="px-4 mx-auto max-w-7xl sm:px-6 md:px-8">

              {/* Sales metrics */}
              <div className="mt-8">
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  <div className="overflow-hidden bg-white rounded-lg shadow">
                    <div className="p-5">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <ShoppingCart className="w-6 h-6 text-gray-400" />
                        </div>
                        <div className="ml-5 w-0 flex-1">
                          <dl>
                            <dt className="text-sm font-medium text-gray-500 truncate">Total Sales</dt>
                            <dd className="flex items-baseline">
                              <div className="text-2xl font-semibold text-gray-900">${totalSales}</div>
                            </dd>
                          </dl>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="overflow-hidden bg-white rounded-lg shadow">
                    <div className="p-5">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <BarChart className="w-6 h-6 text-gray-400" />
                        </div>
                        <div className="ml-5 w-0 flex-1">
                          <dl>
                            <dt className="text-sm font-medium text-gray-500 truncate">Average Order Value</dt>
                            <dd className="flex items-baseline">
                              <div className="text-2xl font-semibold text-gray-900">${averageOrderValue}</div>
                            </dd>
                          </dl>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Add more metric cards as needed */}
                </div>
              </div>

              {/* Charts */}
              <div className="mt-8">
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div className="p-4 bg-white rounded-lg shadow" >
                    <h2 className="text-lg font-medium text-gray-900">Sales Overview</h2>
                    <div className="mt-4">
                      <Bar data={salesData} options={{ responsive: true }} />
                    </div>
                  </div>
                  <div className="p-4 bg-white rounded-lg shadow ">
                    <h2 className="text-lg font-medium text-gray-900">Customer Segments</h2>
                    <div className="mt-4">
                      <Line data={customerData} options={{ responsive: true }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Filter Form */}
              <form className="mt-8 p-4 bg-white rounded-lg shadow" onSubmit={handleFilter}>
                <h3 className="text-lg font-medium text-gray-900">Filter Sales Transactions</h3>
                <div className="grid grid-cols-1 gap-4 mt-4 sm:grid-cols-2 lg:grid-cols-3">
                  <div>
                    <label htmlFor="saleType" className="block text-sm font-medium text-black-700">Sale Type</label>
                    <select
                      id="saleType"
                      name="saleType"
                      value={saleTypeFilter}
                      onChange={(e) => setSaleTypeFilter(e.target.value)}
                      className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    >
                      <option value="">All</option>
                      <option value="Online">Online</option>
                      <option value="In-store">In-store</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="customerId" className="block text-sm font-medium text-black-700">Customer ID</label>
                    <input
                      type="text"
                      id="customerId"
                      name="customerId"
                      value={customerIdFilter}
                      onChange={(e) => setCustomerIdFilter(e.target.value)}
                      placeholder="e.g., 12345"
                      className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>

                  <div>
                    <label htmlFor="productId" className="block text-sm font-medium text-black-700">Product ID</label>
                    <input
                      type="text"
                      id="productId"
                      name="productId"
                      value={productIdFilter}
                      onChange={(e) => setProductIdFilter(e.target.value)}
                      placeholder="e.g., Product 1"
                      className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>
                </div>

                <div className="mt-6">
                  <button
                    type="submit"
                    className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
                  >
                    Apply Filter
                  </button>
                </div>
              </form>

              {/* Filtered Transactions Table */}
              <div className="mt-8 p-4 bg-white rounded-lg shadow">
                <h3 className="text-lg font-medium text-gray-900">Sales Transactions</h3>
                <table className="min-w-full mt-4 divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Transaction ID</th>
                      <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Customer ID</th>
                      <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Sale Type</th>
                      <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Product</th>
                      <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Value ($)</th>
                      <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredTransactions.map((transaction) => (
                      <tr key={transaction.id}>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">{transaction.id}</td>
                        <td className="px-6 py-4 text-sm text-gray-500">{transaction.customerId}</td>
                        <td className="px-6 py-4 text-sm text-gray-500">{transaction.saleType}</td>
                        <td className="px-6 py-4 text-sm text-gray-500">{transaction.product}</td>
                        <td className="px-6 py-4 text-sm text-gray-500">{transaction.value.toFixed(2)}</td>
                        <td className="px-6 py-4 text-sm text-gray-500">{new Date(transaction.date).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
