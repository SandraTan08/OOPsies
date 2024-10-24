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
  const [transactionsData, setTransactionsData] = useState<any[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<any[]>([]);
  const [viewType, setViewType] = useState<string>('monthly');
  const [saleTypeFilter, setSaleTypeFilter] = useState<string>('');
  const [customerIdFilter, setCustomerIdFilter] = useState<string>('');
  const [productIdFilter, setProductIdFilter] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 25;
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

  const [startMonth, setStartMonth] = useState<string>('Jan');
  const [endMonth, setEndMonth] = useState<string>('Dec');
  const [startYear, setStartYear] = useState<number | 'all'>('all'); // NEW: Added startYear state
  const [endYear, setEndYear] = useState<number | 'all'>('all'); // NEW: Added endYear state
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);
  

  // Calculate total sales and average order value
  const totalSales = filteredTransactions.reduce((sum, transaction) => sum + transaction.value, 0).toFixed(2);
  const averageOrderValue = filteredTransactions.length > 0 
    ? (parseFloat(totalSales) / filteredTransactions.length).toFixed(2) 
    : 0;

  // Process sales data for the chart
  const processSalesData = (transactions, viewType) => {
    const salesByPeriod = {};

    transactions.forEach(transaction => {
      const date = new Date(transaction.date);
      let period;

      if (viewType === 'weekly') {
        const week = `${date.getFullYear()}-W${Math.ceil((date.getDate() - 1) / 7)}`;
        period = week;
      } else if (viewType === 'monthly') {
        const month = date.toLocaleString('default', { month: 'short' });
        const year = date.getFullYear();
        period = `${month} ${year}`;
      } else if (viewType === 'yearly') {
        period = date.getFullYear();
      }

      if (!salesByPeriod[period]) {
        salesByPeriod[period] = 0;
      }

      salesByPeriod[period] += transaction.value;
    });

    return {
      labels: Object.keys(salesByPeriod),
      data: Object.values(salesByPeriod),
    };
  };

  // Calculate total pages
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);

  // Calculate the transactions for the current page
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentTransactions = filteredTransactions.slice(startIndex, endIndex);

  // NEW: Filter transactions by selected month and year range
  const filterTransactionsByRange = (transactions) => {
    return transactions.filter(transaction => {
      const date = new Date(transaction.date);
      const month = date.toLocaleString('default', { month: 'short' });
      const year = date.getFullYear();

      const startMonthIndex = new Date(`${startMonth} 1, 2000`).getMonth();
      const endMonthIndex = new Date(`${endMonth} 1, 2000`).getMonth();

      const transactionMonthIndex = date.getMonth();

      // Ensure the transaction is within the selected year and month range
      return (
        (startYear === 'all' || year >= startYear) &&
        (endYear === 'all' || year <= endYear) &&
        transactionMonthIndex >= startMonthIndex &&
        transactionMonthIndex <= endMonthIndex
      );
    });
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
        const filteredRangeTransactions = filterTransactionsByRange(transactions);
        setFilteredTransactions(filteredRangeTransactions);

        // Process sales data based on the current view type
        const { labels, data: salesChartData } = processSalesData(filteredRangeTransactions, viewType);
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
  }, [viewType, startMonth, endMonth, startYear, endYear]);

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

    const filteredRangeTransactions = filterTransactionsByRange(filtered);
    setFilteredTransactions(filteredRangeTransactions);
  };

  const { data: session, status } = useSession();
  

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (!session) {
    window.location.href = '/'; // Redirect to login page without extra params
    return null; // Render nothing during the redirect
  }




  return (
    <div className="flex h-screen bg-gray-100">
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

        <main className="flex-1 overflow-y-auto bg-gray-100">
          <div className="py-6">
            <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
              <h1 className="text-2xl font-semibold text-gray-900 pb-5">Welcome, {session.account.accountUserName}</h1>
            </div>

            <div className="px-4 mx-auto max-w-7xl sm:px-6 md:px-8">
              {/* Month and Year Range Filter */}
              <div className="flex space-x-4 p-4 overflow-hidden bg-white rounded-lg shadow">
                <select
                  value={startYear}
                  onChange={(e) => setStartYear(e.target.value === 'all' ? 'all' : parseInt(e.target.value))}
                  className="px-4 py-2 bg-white border border-gray-300 rounded text-gray-500"
                >
                  <option value="all">All Years</option>
                  {[2019, 2020, 2021, 2022, 2023, 2024].map((year) => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>

                <select
                  value={startMonth}
                  onChange={(e) => setStartMonth(e.target.value)}
                  className="px-4 py-2 bg-white border border-gray-300 rounded text-gray-500"
                >
                  {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((month) => (
                    <option key={month} value={month}>{month}</option>
                  ))}
                </select>

                <select
                  value={endYear}
                  onChange={(e) => setEndYear(e.target.value === 'all' ? 'all' : parseInt(e.target.value))}
                  className="px-4 py-2 bg-white border border-gray-300 rounded text-gray-500"
                >
                  <option value="all">All Years</option>
                  {[2019, 2020, 2021, 2022, 2023, 2024].map((year) => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>

                <select
                  value={endMonth}
                  onChange={(e) => setEndMonth(e.target.value)}
                  className="px-4 py-2 bg-white border border-gray-300 rounded text-gray-500"
                >
                  {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((month) => (
                    <option key={month} value={month}>{month}</option>
                  ))}
                </select>
              </div>

              {/* Sales metrics */}
              <div className="mt-8">
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  {/* Total Sales Card */}
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

                  {/* Average Order Value Card */}
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
                </div>
              </div>


              {/* Charts */}
              <div className="mt-8">
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div className="p-4 bg-white rounded-lg shadow" >
                    <h2 className="text-lg font-medium text-gray-900">Sales Overview</h2>

                    <div className="mt-4 flex justify-between">
                      <button
                        className={`px-4 py-2 ${viewType === 'weekly' ? 'bg-blue-600' : 'bg-gray-200'} text-white rounded`}
                        onClick={() => setViewType('weekly')}
                      >
                        Weekly
                      </button>
                      <button
                        className={`px-4 py-2 ${viewType === 'monthly' ? 'bg-blue-600' : 'bg-gray-200'} text-white rounded`}
                        onClick={() => setViewType('monthly')}
                      >
                        Monthly
                      </button>
                      <button
                        className={`px-4 py-2 ${viewType === 'yearly' ? 'bg-blue-600' : 'bg-gray-200'} text-white rounded`}
                        onClick={() => setViewType('yearly')}
                      >
                        Yearly
                      </button>
                    </div>

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
                    <label htmlFor="saleType" className="block text-sm font-medium text-black">Sale Type</label>
                    <select
                      id="saleType"
                      name="saleType"
                      value={saleTypeFilter}
                      onChange={(e) => setSaleTypeFilter(e.target.value)}
                      className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-500"
                    >
                      <option value="">All</option>
                      <option value="Online">Online</option>
                      <option value="In-store">In-store</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="customerId" className="block text-sm font-medium text-black">Customer ID</label>
                    <input
                      type="text"
                      id="customerId"
                      name="customerId"
                      value={customerIdFilter}
                      onChange={(e) => setCustomerIdFilter(e.target.value)}
                      placeholder="e.g., 12345"
                      className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-500"
                    />
                  </div>

                  <div>
                    <label htmlFor="productId" className="block text-sm font-medium text-black">Product ID</label>
                    <input
                      type="text"
                      id="productId"
                      name="productId"
                      value={productIdFilter}
                      onChange={(e) => setProductIdFilter(e.target.value)}
                      placeholder="e.g., Product 1"
                      className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-500"
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
                    {currentTransactions.map((transaction) => (
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
                  <div className="mt-4 flex justify-between">
                  </div>
                  <div className="mt-4 flex justify-between">
                    <button
                      onClick={() => setCurrentPage(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
                    >
                      Previous
                    </button>

                    <span>Page {currentPage} of {totalPages}</span>

                    <button
                      onClick={() => setCurrentPage(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
                    >
                      Next
                    </button>
                  </div>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
