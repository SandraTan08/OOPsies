'use client'

import { useState, useEffect, useRef } from 'react'
import { Bar, Line } from 'react-chartjs-2'
import { useSession } from 'next-auth/react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useRouter } from 'next/navigation';

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
interface SidebarProps {
  role: string | null; // Make role nullable
}

import { CSVLink } from 'react-csv'
import { ShoppingCart, BarChart, Search, Download, ReceiptText } from 'lucide-react'

export default function Dashboard() {
  const [transactionsData, setTransactionsData] = useState<any[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<any[]>([]);
  const [minValue, setMinValue] = useState('');
  const [maxValue, setMaxValue] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: string } | null>(null);
  const [viewType, setViewType] = useState<string>('monthly');
  const [saleTypeFilter, setSaleTypeFilter] = useState<string>('');
  const [platformFilter, setPlatformFilter] = useState<string>('');
  const [availableYears, setAvailableYears] = useState<number[]>([]);
  const [customerIdFilter, setCustomerIdFilter] = useState<string>('');
  const [productFilter, setProductFilter] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 25;
  const { data: session } = useSession();
  const role = session?.account?.role || '';
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;


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

  const customerDataRef = useRef<any>({
    labels: ['Gold', 'Silver', 'Bronze'],
    datasets: [{
      label: 'Customer Segments',
      data: [0, 0, 0],
      backgroundColor: [
        'rgba(255, 215, 0, 0.6)',
        'rgba(192, 192, 192, 0.6)',
        'rgba(205, 127, 50, 0.6)',
      ],
    }],
  });
  const [customerData, setCustomerData] = useState(customerDataRef.current);

  const [startMonth, setStartMonth] = useState<string>('Jan');
  const [endMonth, setEndMonth] = useState<string>('Dec');
  const [startYear, setStartYear] = useState<number | 'all'>('all');
  const [endYear, setEndYear] = useState<number | 'all'>('all');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);
  // const { data: session, status } = useSession();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);


  const totalSales = filteredTransactions.reduce((sum, transaction) => sum + transaction.value, 0).toFixed(2);
  const averageOrderValue = filteredTransactions.length > 0
    ? (parseFloat(totalSales) / filteredTransactions.length).toFixed(2)
    : 0;
  const totaltransactions = filteredTransactions.length;
  const totalQuantitybyProduct = filteredTransactions.reduce((acc, transaction) => {
    if (!acc[transaction.product]) {
      acc[transaction.product] = 0;
    }
    acc[transaction.product] += transaction.quantity;
    return acc;
  }, {});

  const processSalesData = (transactions, viewType) => {
    const salesByPeriod = {};

    transactions.forEach(transaction => {
      const date = new Date(transaction.date);
      let period;

      if (viewType === 'quarterly') {
        const quarter = `Q${Math.floor(date.getMonth() / 3) + 1}`;
        const year = date.getFullYear();
        period = `${quarter} ${year}`;
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

  const handleSort = (key) => {
    let direction = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });

    const sortedTransactions = [...filteredTransactions].sort((a, b) => {
      if (a[key] < b[key]) {
        return direction === 'ascending' ? -1 : 1;
      }
      if (a[key] > b[key]) {
        return direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });
    setFilteredTransactions(sortedTransactions);
  };


  const renderSortIcon = (key: string) => {
    if (!sortConfig || sortConfig.key !== key) {
      return '↕';
    }
    return sortConfig.direction === 'ascending' ? '▲' : '▼';
  };


  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentTransactions = filteredTransactions.slice(startIndex, endIndex);
  const [filterApplied, setFilterApplied] = useState(false);

  const handleApplyFilter = () => {
    setFilterApplied(true);
    setCurrentPage(1);
    setTimeout(() => {
      setFilterApplied(false);
    }, 3000);
  }


  const filterTransactionsByRange = (transactions) => {
    return transactions.filter(transaction => {
      const date = new Date(transaction.date);
      const month = date.toLocaleString('default', { month: 'short' });
      const year = date.getFullYear();

      const startMonthIndex = new Date(`${startMonth} 1, 2000`).getMonth();
      const endMonthIndex = new Date(`${endMonth} 1, 2000`).getMonth();

      const transactionMonthIndex = date.getMonth();

      return (
        (startYear === 'all' || year >= startYear) &&
        (endYear === 'all' || year <= endYear) &&
        transactionMonthIndex >= startMonthIndex &&
        transactionMonthIndex <= endMonthIndex
      );
    });
  };

  useEffect(() => {
    async function fetchProductDeets() {
      try {
        const res = await fetch(`${backendUrl}product`);
        if (!res.ok) throw new Error('Failed to fetch product data');
        const data = await res.json();

        // mapping the data to create a list of objects that map productId to productName
        const productdeets = data.map(product => ({
          id: product.productId,
          name: product.productName
        }));

        // console.log(productdeets);

        return productdeets;
      } catch (error) {
        console.error('Error fetching product data:', error);
      }
    }

    async function fetchAvailableYears() {
      try {
        const res = await fetch(`${backendUrl}purchaseHistory`);
        if (!res.ok) throw new Error('Failed to fetch data');
        const data = await res.json();

        // Extract unique years from the data
        const years = Array.from(
          new Set(data.map((transaction: any) => new Date(transaction.saleDate).getFullYear()))
        ).sort((a, b) => a - b); // Sort the years in ascending order
        setAvailableYears(years);
      } catch (error) {
        console.error('Error fetching available years:', error);
      }
    }

    fetchAvailableYears();

    async function fetchSalesData() {
      try {
        // Fetch product details first
        const productDeets = await fetchProductDeets();

        const res = await fetch(`${backendUrl}purchaseHistory`);
        if (!res.ok) throw new Error('Failed to fetch sales data');
        const data = await res.json();

        // Create a product map for quick lookups
        const productMap = new Map(productDeets.map(product => [product.id, product.name]));

        // Map transactions and replace productId with productName
        const transactions = data.map((purchase: any) => ({
          id: purchase.purchaseId,
          customerId: purchase.customerId.toString(),
          saleType: purchase.saleType,
          platform: purchase.digital,
          product: productMap.get(purchase.productId) || `Product ${purchase.productId}`, // use product name, fallback to ID if not found
          value: purchase.totalPrice,
          quantity: purchase.quantity,
          date: purchase.saleDate,
        }));

        setTransactionsData(transactions);
        const filteredRangeTransactions = filterTransactionsByRange(transactions);
        setFilteredTransactions(filteredRangeTransactions);

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

    async function fetchCustomerData() {
      try {
        const res = await fetch(`${backendUrl}customers`);
        if (!res.ok) throw new Error('Failed to fetch customer data');
        const data = await res.json();

        const segmentsCount = { gold: 0, silver: 0, bronze: 0 };
        data.forEach((customer: any) => {
          if (customer.tier === "G") {
            segmentsCount.gold += 1;
          } else if (customer.tier === "S") {
            segmentsCount.silver += 1;
          } else if (customer.tier === "B") {
            segmentsCount.bronze += 1;
          }
        });

        // console.log('Segments Count:', segmentsCount);

        customerDataRef.current = {
          labels: ['Gold', 'Silver', 'Bronze'],
          datasets: [{
            label: 'Customer Segment',
            data: [segmentsCount.gold, segmentsCount.silver, segmentsCount.bronze],
            backgroundColor: [
              'rgba(255, 215, 0, 0.6)',
              'rgba(192, 192, 192, 0.6)',
              'rgba(205, 127, 50, 0.6)',
            ],
          }],
        };
        setCustomerData(customerDataRef.current);
        // console.log('Updated Customer Data State:', customerDataRef.current);
      } catch (error) {
        console.error('Error fetching customer data:', error);
      }
    }

    if (session === undefined) return; // Wait for session to load

    if (!session) {
      router.push('/');
      console.log('Session is missing, redirecting to login');
      return;
    }

    if (session?.account?.role === 'Admin') {
      router.push('/account');
      console.log(session);
      return;
    }

    console.log('Session:', session);  // Log session details
    fetchProductDeets();
    fetchSalesData();
    fetchCustomerData();
  }, [viewType, startMonth, endMonth, startYear, endYear, session, router]);

  const handleFilter = (e) => {
    e.preventDefault();

    let filtered = transactionsData;

    if (saleTypeFilter) {
      filtered = filtered.filter(transaction => transaction.saleType === saleTypeFilter);
    }

    if (platformFilter) {
      filtered = filtered.filter(transaction => transaction.platform === platformFilter);
    }

    if (customerIdFilter) {
      filtered = filtered.filter(transaction => transaction.customerId === customerIdFilter);
    }

    if (productFilter) {
      filtered = filtered.filter(transaction => transaction.product.toLowerCase().includes(productFilter.toLowerCase()));

    }
    if (minValue) {
      filtered = filtered.filter(transaction => transaction.value >= parseFloat(minValue));
    }

    if (maxValue) {
      filtered = filtered.filter(transaction => transaction.value <= parseFloat(maxValue));
    }

    const filteredRangeTransactions = filterTransactionsByRange(filtered);
    setFilteredTransactions(filteredRangeTransactions);
  };

  if (session === undefined) {
    return <div>Loading...</div>; // You can show a loading spinner or message
  }

  // if (session?.account?.role === 'Admin') {
  //   // Redirect to a different page if the user is an admin
  //   window.location.href = '/account'; 
  // }

  if (!session) {
    window.location.href = '/';
    console.log('Session is missing, redirecting to login');
    return null;
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="flex flex-col flex-1">


        <main className="flex-1  bg-gray-100">

          <div className="py-6">

            <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
              <h1 className="text-2xl font-semibold text-gray-900 pb-5">Welcome, {session.account.accountUserName}</h1>
            </div>

            <div className="px-4 mx-auto max-w-7xl sm:px-6 md:px-8">
              {/* Month and Year Range Filter */}
              <div className="flex space-x-4 p-4 bg-white rounded-lg shadow">
                <select
                  value={startYear}
                  onChange={(e) => setStartYear(e.target.value === 'all' ? 'all' : parseInt(e.target.value))}
                  className="px-4 py-2 bg-white border border-gray-300 rounded text-gray-500"
                >
                  <option value="all">All Years</option>
                  {availableYears.map((year) => (
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
                <p> to </p>
                <select
                  value={endYear}
                  onChange={(e) => setEndYear(e.target.value === 'all' ? 'all' : parseInt(e.target.value))}
                  className="px-4 py-2 bg-white border border-gray-300 rounded text-gray-500"
                >
                  <option value="all">All Years</option>
                  {availableYears.map((year) => (
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

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">

                  {/* Total Sales Card */}
                  <div className="bg-white rounded-lg shadow">
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
                  <div className="bg-white rounded-lg shadow">
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

                  {/* Total Transactions Card */}
                  <div className="bg-white rounded-lg shadow">
                    <div className="p-5">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <ReceiptText className="w-6 h-6 text-gray-400" />
                        </div>
                        <div className="ml-5 w-0 flex-1">
                          <dl>
                            <dt className="text-sm font-medium text-gray-500 truncate">Total Number of Transactions</dt>
                            <dd className="flex items-baseline">
                              <div className="text-2xl font-semibold text-gray-900">{totaltransactions}</div>
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


                {role === 'Marketing' ? (
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-1">

                    <div className="p-4 bg-white rounded-lg shadow ">
                      <h2 className="text-lg font-medium text-gray-900">Customer Segments</h2>
                      <div className="mt-4">
                        <Line data={customerData} options={{ responsive: true }} />
                      </div>
                      {/* <p className="mt-4 text-sm text-red-600">
                        *Click "Customers" in the sidebar to update Customer Segments.
                      </p> */}
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <div className="p-4 bg-white rounded-lg shadow" >
                      <h2 className="text-lg font-medium text-gray-900">Sales Overview</h2>

                      <div className="mt-4 flex justify-between">
                        <button
                          className={`px-4 py-2 ${viewType === 'monthly' ? 'bg-gray-700' : 'hover:bg-gray-700 bg-gray-200'} text-white rounded`}
                          onClick={() => setViewType('monthly')}
                        >
                          Monthly
                        </button>
                        <button
                          className={`px-4 py-2 ${viewType === 'quarterly' ? 'bg-gray-700' : 'hover:bg-gray-700 bg-gray-200'} text-white rounded`}
                          onClick={() => setViewType('quarterly')}
                        >
                          Quarterly
                        </button>
                        <button
                          className={`px-4 py-2 ${viewType === 'yearly' ? 'bg-gray-700' : 'hover:bg-gray-700 bg-gray-200'} text-white rounded`}
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
                      {/* <p className="mt-4 text-sm text-red-600">
                        *Click "Customers" in the sidebar to update Customer Segments.
                      </p> */}
                    </div>
                  </div>

                )}




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
                      <option value="Direct - B2B">Direct - B2B</option>
                      <option value="Direct - B2C">Direct - B2C</option>
                      <option value="Marketing">Marketing</option>
                      <option value="Consignment">Consignment</option>
                      <option value="Wholesaler">Wholesaler</option>
                      <option value="Others">Others</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="platform" className="block text-sm font-medium text-black">Platform</label>
                    <select
                      id="platform"
                      name="platform"
                      value={platformFilter}
                      onChange={(e) => setPlatformFilter(e.target.value)}
                      className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-500"
                    >
                      <option value="">All</option>
                      <option value="Online - Website">Online (Website)</option>
                      <option value="Offline">Offline</option>
                      <option value="Others">Others</option>
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
                    <label htmlFor="productId" className="block text-sm font-medium text-black">Product Name</label>
                    <input
                      type="text"
                      id="productId"
                      name="productId"
                      value={productFilter}
                      onChange={(e) => setProductFilter(e.target.value)}
                      placeholder="e.g., Chilli oil"
                      className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-500"
                    />
                  </div>

                  {/* New Min and Max Value Filters */}
                  <div>
                    <label htmlFor="minValue" className="block text-sm font-medium text-black">Min Value ($)</label>
                    <input
                      type="number"
                      id="minValue"
                      name="minValue"
                      value={minValue}
                      onChange={(e) => setMinValue(e.target.value)}
                      placeholder="e.g., 10"
                      className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-500"
                    />
                  </div>

                  <div>
                    <label htmlFor="maxValue" className="block text-sm font-medium text-black">Max Value ($)</label>
                    <input
                      type="number"
                      id="maxValue"
                      name="maxValue"
                      value={maxValue}
                      onChange={(e) => setMaxValue(e.target.value)}
                      placeholder="e.g., 100"
                      className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-500"
                    />
                  </div>
                </div>

                <div className="mt-6">
                  <button
                    type="submit"
                    onClick={handleApplyFilter}
                    className="px-4 py-2 text-white bg-gray-700 hover:bg-gray-500 rounded-md "
                  >
                    Apply Filter

                  </button>
                  {filterApplied && (
                    <p className="mt-2 text-green-500">Filter applied</p>
                  )}
                </div>
              </form>

              {/* Filtered Transactions Table */}
              <div className="mt-8 flex flex-col space-y-4">
                {/* Scrollable Table with Padding and Rounded Sides */}
                <div className="p-4 bg-white rounded-lg shadow">
                  <div className="flex justify-between items-center pb-4">
                    <h3 className="text-lg font-medium text-gray-900">Sales Transactions</h3>
                    {/* Export CSV Button */}
                    <CSVLink
                      data={filteredTransactions}  // Use the filtered transactions for export
                      filename="transactions.csv"
                      className="inline-flex items-center px-4 py-2 text-xs font-medium text-white hover:bg-gray-500 bg-gray-700 border border-transparent rounded-md shadow-sm  focus:outline-none focus:ring-2 focus:ring-offset-2"
                    >
                      Export CSV
                    </CSVLink>
                  </div>
                  <div className="overflow-auto max-h-[500px] rounded-lg">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-700 sticky top-0 z-10 text-white font-bold rounded-t-lg">
                        <tr>
                          <th
                            className="px-4 py-4 text-sm tracking-wider text-left uppercase bg-gray-700 text-white"
                            onClick={() => handleSort('id')}
                          >
                            Transaction ID {renderSortIcon('id')}
                          </th>
                          <th
                            className="px-4 py-4 text-sm tracking-wider text-left uppercase bg-gray-700 text-white"
                            onClick={() => handleSort('customerId')}
                          >
                            Customer ID {renderSortIcon('customerId')}
                          </th>
                          <th
                            className="px-4 py-4 text-sm tracking-wider text-left uppercase bg-gray-700 text-white"
                            onClick={() => handleSort('saleType')}
                          >
                            Sale Type {renderSortIcon('saleType')}
                          </th>
                          <th
                            className="px-4 py-4 text-sm tracking-wider text-left uppercase bg-gray-700 text-white"
                            onClick={() => handleSort('platform')}
                          >
                            Platform {renderSortIcon('platform')}
                          </th>
                          <th
                            className="px-4 py-4 text-sm tracking-wider text-left uppercase bg-gray-700 text-white"
                            onClick={() => handleSort('product')}
                          >
                            Product {renderSortIcon('product')}
                          </th>
                          <th
                            className="px-4 py-4 text-sm tracking-wider text-left uppercase bg-gray-700 text-white"
                            onClick={() => handleSort('value')}
                          >
                            Value ($) {renderSortIcon('value')}
                          </th>
                          <th
                            className="px-4 py-4 text-sm tracking-wider text-left uppercase bg-gray-700 text-white"
                            onClick={() => handleSort('quantity')}
                          >
                            Quantity {renderSortIcon('quantity')}
                          </th>
                          <th
                            className="px-4 py-4 text-sm tracking-wider text-left uppercase bg-gray-700 text-white"
                            onClick={() => handleSort('date')}
                          >
                            Date {renderSortIcon('date')}
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {currentTransactions.map((transaction) => (
                          <tr key={transaction.id} className="hover:bg-gray-100">
                            <td className="px-4 py-2 text-sm text-gray-900">{transaction.id}</td>
                            <td className="px-4 py-2 text-sm text-gray-500">{transaction.customerId}</td>
                            <td className="px-4 py-2 text-sm text-gray-500">{transaction.saleType}</td>
                            <td className="px-4 py-2 text-sm text-gray-500">{transaction.platform}</td>
                            <td className="px-4 py-2 text-sm text-gray-500">{transaction.product}</td>
                            <td className="px-4 py-2 text-sm text-gray-500">{transaction.value.toFixed(2)}</td>
                            <td className="px-4 py-2 text-sm text-gray-500">{transaction.quantity}</td>
                            <td className="px-4 py-2 text-sm text-gray-500">
                              {new Date(transaction.date).toLocaleDateString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {/* Fixed Pagination Section */}
                  <div className="flex flex-col items-center space-y-4 pt-4">
                    {/* Navigation Buttons */}
                    <div className="flex justify-center items-center space-x-4">
                      <button
                        onClick={() => setCurrentPage(1)}
                        disabled={currentPage === 1}
                        className="w-24 px-2 py-1 bg-gray-700 hover:bg-gray-500 text-white rounded disabled:opacity-50"
                      >
                        First
                      </button>

                      <button
                        onClick={() => setCurrentPage(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="w-24 px-2 py-1 bg-gray-700 hover:bg-gray-500 text-white rounded disabled:opacity-50"
                      >
                        Previous
                      </button>

                      <span className="text-black w-28 text-center">
                        Page {currentPage} of {totalPages}
                      </span>

                      <button
                        onClick={() => setCurrentPage(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="w-24 px-2 py-1 bg-gray-700 hover:bg-gray-500 text-white rounded disabled:opacity-50"
                      >
                        Next
                      </button>

                      <button
                        onClick={() => setCurrentPage(totalPages)}
                        disabled={currentPage === totalPages}
                        className="w-24 px-2 py-1 bg-gray-700 hover:bg-gray-500 text-white rounded disabled:opacity-50"
                      >
                        Last
                      </button>
                    </div>

                    {/* Page Jump Input with Go Button */}
                    <div className="flex items-center space-x-2">
                      <label htmlFor="pageInput" className="text-sm font-medium text-gray-700">
                        Jump to page:
                      </label>
                      <input
                        id="pageInput"
                        type="number"
                        min="1"
                        max={totalPages}
                        placeholder="1"
                        className="w-16 px-2 py-1 border border-gray-300 rounded text-center"
                      />
                      <button
                        onClick={() => {
                          const pageInput = document.getElementById('pageInput').value; // Access input value
                          const page = Math.max(1, Math.min(totalPages, Number(pageInput))); // Validate page range
                          setCurrentPage(page);
                        }}
                        className="px-4 py-1 bg-gray-700 hover:bg-gray-500 text-white rounded"
                      >
                        Go
                      </button>
                    </div>
                  </div>
                </div>

              </div>


              {/* total qty sold by product table */}
              <div className="mt-8 p-4 bg-white rounded-lg shadow">
                <h3 className="text-lg font-medium text-gray-900 pb-4">Total Quantity Sold by Product</h3>
                <div className="relative max-h-96 overflow-y-auto rounded-lg">
                  <table className="w-full divide-y divide-gray-200">
                    <thead className="bg-gray-700">
                      <tr>
                        <th
                          className="sticky top-0 px-6 py-4 text-sm font-lg tracking-wider text-left uppercase text-white bg-gray-700"
                        >
                          Product
                        </th>
                        <th
                          className="sticky top-0 px-6 py-4 text-sm font-lg tracking-wider text-left uppercase text-white bg-gray-700"
                        >
                          Total Quantity Sold
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {Object.entries(totalQuantitybyProduct).map(([product, quantity], index) => (
                        <tr
                          key={product}
                          className={`hover:bg-gray-100 ${index === Object.entries(totalQuantitybyProduct).length - 1 ? 'rounded-b-lg' : ''
                            }`}
                        >
                          <td className="px-6 py-4 text-sm font-medium text-gray-900">{product}</td>
                          <td className="px-6 py-4 text-sm text-gray-500">{quantity}</td>
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
