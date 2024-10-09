'use client'

import { useState, useEffect } from 'react'
import { Bar, Line } from 'react-chartjs-2'
import { useSession, signIn, signOut } from 'next-auth/react';

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
import { 
  LayoutGrid, 
  Users, 
  ShoppingCart, 
  BarChart, 
  Menu,
  Search,
  Bell,
  User,
  ChevronDown,
  Download
} from 'lucide-react'

// Mock data (replace with actual data fetching logic)
const salesData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  datasets: [
    {
      label: 'Sales',
      data: [12, 19, 3, 5, 2, 3],
      backgroundColor: 'rgba(75, 192, 192, 0.6)',
    },
  ],
}



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

const transactionsData = [
  { id: 1, customerId: 'C001', saleType: 'Online', product: 'Widget A', value: 100, date: '2023-06-01' },
  { id: 2, customerId: 'C002', saleType: 'In-store', product: 'Widget B', value: 200, date: '2023-06-02' },
  { id: 3, customerId: 'C003', saleType: 'Online', product: 'Widget C', value: 150, date: '2023-06-03' },
  // Add more mock data as needed
]

interface Sale {
  Sale_Date: string;
  Total_Price: number;
}


export default function Dashboard() {

  const [salesData, setSalesData] = useState({
    labels: [] as string[],
    datasets: [
      {
        label: 'Sales',
        data: [] as number[],
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
    ],
  })

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [filteredTransactions, setFilteredTransactions] = useState(transactionsData)

  const totalSales = transactionsData.reduce((sum, transaction) => sum + transaction.value, 0)
  const averageOrderValue = totalSales / transactionsData.length

  const handleFilter = (e) => {
    e.preventDefault()
    // Implement filtering logic here
    // Update filteredTransactions state based on filter criteria
  }

  useEffect(() => {
    // Fetch sales data from the API
    // async function fetchSalesData() {
    //   const res = await fetch('/api/sales')
    //   const data: Sale[] = await res.json()
      
    //   const monthlyData = data.reduce<Record<string, number>>((acc, sale) => {
    //   const month = new Date(sale.Sale_Date).toLocaleString('default', { month: 'short' });

    //   const totalPrice = typeof sale.Total_Price === 'string' ? parseFloat(sale.Total_Price) : sale.Total_Price;
  
    //     if (!acc[month]) {
    //       acc[month] = 0;  // Initialize if month doesn't exist in accumulator
    //     }
  
    //     acc[month] += totalPrice;  // Add the Total_Price for the current sale
    //     return acc;
    //   }, {});
  
    //   // Extract the labels (months) and the data (total sales for each month)
    //   const labels = Object.keys(monthlyData);  // Months like ['Jan', 'Feb', 'Mar', ...]
    //   const sales = Object.values(monthlyData);  // Aggregated totals for each month

    //   console.log(labels,sales)
    //   // Update salesData state
    //   setSalesData({
    //     labels: labels,
    //     datasets: [
    //       {
    //         label: 'Sales',
    //         data: sales,
    //         backgroundColor: 'rgba(75, 192, 192, 0.6)',
    //       },
    //     ],
    //   })
    // }

    // fetchSalesData()
  }, [])

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
      {/* Sidebar */}

      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        
        {/* Navbar */}
        <header className="flex items-center justify-between px-4 py-4 bg-white border-b border-gray-200 sm:px-6 lg:px-8">
          <button
            className="text-gray-500 md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <Menu className="w-6 h-6" />
          </button>
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
          <div className="flex items-center">
            <button className="p-1 text-gray-400 rounded-full hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <Bell className="w-6 h-6" />
            </button>
            <div className="relative ml-3">
            <div className="relative inline-block text-left">
      {/* User Menu Button */}
      <button
        onClick={toggleDropdown}
        className="flex items-center max-w-xs text-sm bg-white rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        id="user-menu"
        aria-expanded={dropdownOpen}
        aria-haspopup="true"
      >
        <span className="sr-only">Open user menu</span>
        <User className="w-8 h-8 rounded-full" /> {/* User Icon */}
      </button>

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

            </div>
          </div>
        </header>

        {/* Dashboard content */}
        <main className="flex-1 overflow-y-auto bg-gray-100">
          <div className="py-6">
            <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
              <h1 className="text-2xl font-semibold text-gray-900">Welcome, {session.user.role} </h1>
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
                              <div className="text-2xl font-semibold text-gray-900">${averageOrderValue.toFixed(2)}</div>
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

              {/* Transactions table */}
              <div className="mt-8">
                <div className="sm:flex sm:items-center">
                  <div className="sm:flex-auto">
                    <h2 className="text-lg font-medium text-gray-900">Transactions</h2>
                  </div>
                  <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
                    <CSVLink
                      data={filteredTransactions}
                      filename="transactions.csv"
                      className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Export CSV
                    </CSVLink>
                  </div>
                </div>
                <div className="mt-4">
                  <form onSubmit={handleFilter} className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <input
                      type="text"
                      placeholder="Customer ID"
                      className="block w-full px-3 py-2 placeholder-gray-400 border border-gray-300 rounded-md shadow-sm appearance-none focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                    <select className="block w-full px-3 py-2 placeholder-gray-400 border border-gray-300 rounded-md shadow-sm appearance-none focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                      <option value="">Sale Type</option>
                      <option value="Online">Online</option>
                      <option value="In-store">In-store</option>
                    </select>
                    <input
                      type="text"
                      placeholder="Product"
                      className="block w-full px-3 py-2 placeholder-gray-400 border border-gray-300 rounded-md shadow-sm appearance-none focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                    <button
                      type="submit"
                      className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Filter
                    </button>
                  </form>
                </div>
                <div className="mt-4 overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                  <table className="min-w-full divide-y divide-gray-300">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Customer ID</th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Sale Type</th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Product</th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Value</th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Date</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredTransactions.map((transaction) => (
                        <tr key={transaction.id}>
                          <td className="py-4 pl-4 pr-3 text-sm font-medium text-gray-900 whitespace-nowrap sm:pl-6">{transaction.customerId}</td>
                          <td className="px-3 py-4 text-sm text-gray-500 whitespace-nowrap">{transaction.saleType}</td>
                          <td className="px-3 py-4 text-sm text-gray-500 whitespace-nowrap">{transaction.product}</td>
                          <td className="px-3 py-4 text-sm text-gray-500 whitespace-nowrap">${transaction.value}</td>
                          <td className="px-3 py-4 text-sm text-gray-500 whitespace-nowrap">{transaction.date}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}