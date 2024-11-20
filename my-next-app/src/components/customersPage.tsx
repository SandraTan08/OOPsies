"use client";
import React, { useState, useEffect } from 'react';
import './CustomerList.css'; // Import the CSS file
import Header from "@/components/header";
import Link from 'next/link';

interface Customer {
  customerId: number;
  zipCode: number;
  tier: string;
  totalSpent?: number;
}

const CustomerList: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filteredTiers, setFilteredTiers] = useState<string[]>(["G", "B", "S"]); // Default to show all
  const [arrangeByTopSpending, setArrangeByTopSpending] = useState<boolean>(false);

  // Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 30; // Increase the items per page to 50
  const [searchTerm, setSearchTerm] = useState<string>(''); // State to handle search input for customerId

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/v1/customers');
        if (!response.ok) {
          throw new Error('Failed to fetch customers');
        }
        const customerData = await response.json();

        // Fetch total spent for each customer
        const customersWithSpent = await Promise.all(
          customerData.map(async (customer: Customer) => {
            const totalSpent = await fetchTotalSpent(customer.customerId);
            return { ...customer, totalSpent };
          })
        );

        setCustomers(customersWithSpent);

        // Save customer data to local storage
        localStorage.setItem('customerData', JSON.stringify(customersWithSpent));
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    const savedData = localStorage.getItem('customerData');
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      setCustomers(parsedData);
      setLoading(false);
    } else {
      fetchCustomers();
    }
  }, []);

  const fetchTotalSpent = async (customerId: number): Promise<number> => {
    try {
      const response = await fetch(`http://localhost:8080/api/v1/purchaseHistory/byCustomer?customerId=${customerId}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch purchase history for customer ID ${customerId}`);
      }
      const purchaseHistory = await response.json();
      return purchaseHistory.reduce((total: number, purchase: { totalPrice: number }) => total + purchase.totalPrice, 0);
    } catch (err: any) {
      console.error(err.message);
      return 0;
    }
  };

  const filteredCustomers = customers
    .filter(customer => filteredTiers.includes(customer.tier))
    .filter(customer => customer.customerId.toString().includes(searchTerm)) // Search filter by customerId
    .sort((a, b) => arrangeByTopSpending ? (b.totalSpent || 0) - (a.totalSpent || 0) : 0);

  // Paginate the customers
  const indexOfLastCustomer = currentPage * itemsPerPage;
  const indexOfFirstCustomer = indexOfLastCustomer - itemsPerPage;
  const currentCustomers = filteredCustomers.slice(indexOfFirstCustomer, indexOfLastCustomer);

  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);

  const handleTierChange = (tier: string) => {
    setFilteredTiers(prev => {
      setCurrentPage(1)
      if (prev.includes(tier)) {
        return prev.filter(t => t !== tier);
      } else {
        return [...prev, tier];
      }
    });
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const tierDisplayNames: { [key: string]: string } = {
    G: "Gold",
    S: "Silver",
    B: "Bronze",
  };

  if (loading) {
    return <div className="loading">Loading customers...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="customer-profile">
        <h1 className="text-2xl font-bold mb-4">Customer List</h1>

        {/* Search Bar for Customer ID */}
        <div className="search-bar mb-4 p-4 bg-white rounded shadow-md">
          <h3 className="text-lg font-semibold">Search by Customer ID:</h3>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Enter Customer ID"
            className="w-full p-2 mt-2 border border-gray-300 rounded"
          />

        </div>

        {/* Filter UI */}
        <div className="filter mb-4 p-4 bg-white rounded shadow-md">
          <h3 className="text-lg font-semibold">Filter by Tier:</h3>
          <div className="flex space-x-4 mt-2">
            {["G", "B", "S"].map(tier => (
              <label key={tier} className="flex items-center">
                <input
                  type="checkbox"
                  checked={filteredTiers.includes(tier)}
                  onChange={() => handleTierChange(tier)}
                  className="mr-2"
                />
                <span className="text-gray-700">{tierDisplayNames[tier]}</span>
              </label>
            ))}
          </div>

          {/* Arrange by Top Spending checkbox */}
          <div className="mt-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={arrangeByTopSpending}
                onChange={() => setArrangeByTopSpending(prev => !prev)}
                className="mr-2"
              />
              <span className="text-gray-700">Arrange by Top Spending</span>
            </label>
          </div>
        </div>

        {currentCustomers.length > 0 ? (
          <table className="min-w-full mt-4 divide-y divide-gray-200 bg-white rounded-lg shadow overflow-hidden">
            <thead className="sticky top-0 z-10 bg-gray-900 text-white rounded-t-lg">
              <tr>
                <th className="px-6 py-3 text-sm font-medium tracking-wider text-left uppercase" style={{ backgroundColor: '#374151', color: 'white' }}>
                  Customer ID
                </th>
                <th className="px-6 py-3 text-sm font-medium tracking-wider text-left uppercase" style={{ backgroundColor: '#374151', color: 'white' }}>
                  Zip Code
                </th>
                <th className="px-6 py-3 text-sm font-medium tracking-wider text-left uppercase" style={{ backgroundColor: '#374151', color: 'white' }}>
                  Tier
                </th>
                <th className="px-6 py-3 text-sm font-medium tracking-wider text-left uppercase" style={{ backgroundColor: '#374151', color: 'white' }}>
                  Amount Spent
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {currentCustomers.map((customer, index) => (
                <tr
                  key={customer.customerId}
                  className={`hover:bg-gray-100 ${index === currentCustomers.length - 1 ? 'rounded-b-lg' : ''
                    }`}
                >
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    <Link href={`/customerprofile/${customer.customerId}`}>
                      <span className="text-blue-600 underline hover:text-blue-800">
                        {customer.customerId}
                      </span>
                    </Link>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{customer.zipCode}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {tierDisplayNames[customer.tier]}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    ${customer.totalSpent?.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

        ) : (
          <p>No customers available for the selected tier(s) or search query.</p>
        )}

        {/* Pagination controls */}
        <div className="pagination mt-4">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-500 disabled:bg-gray-200 text-white"
          >
            Previous
          </button>
          <span className="mx-4">{`Page ${currentPage} of ${totalPages}`}</span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-500 disabled:bg-gray-200 text-white"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomerList;
