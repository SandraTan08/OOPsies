"use client";

import React, { useState, useEffect } from 'react';
import './CustomerList.css'; // Import the CSS file
import Header from "@/components/header";
import Link from 'next/link';

interface Customer {
  customerId: number;
  zipCode: number;
  tier: string; // Include the tier field
  totalSpent?: number; // New field to store the total spent amount
}

const CustomerList: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filteredTiers, setFilteredTiers] = useState<string[]>(["G", "B", "S"]); // Default to show all
  const [arrangeByTopSpending, setArrangeByTopSpending] = useState<boolean>(false); // State for spending filter

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/v1/customers');
        if (!response.ok) {
          throw new Error('Failed to fetch customers');
        }
        const customerData = await response.json();

        // Fetch the purchase history and calculate total spent for each customer
        const customersWithSpent = await Promise.all(
          customerData.map(async (customer: Customer) => {
            const totalSpent = await fetchTotalSpent(customer.customerId);
            return { ...customer, totalSpent };
          })
        );

        setCustomers(customersWithSpent);

        // Save customer data to local storage
        localStorage.setItem('customerData', JSON.stringify(customersWithSpent));

        // Update the customer tiers after fetching
        await updateCustomerTiers(customersWithSpent);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    // Check local storage for saved customer data
    const savedData = localStorage.getItem('customerData');
    if (savedData) {
      // If data is found in local storage, use it
      const parsedData = JSON.parse(savedData);
      setCustomers(parsedData);
      setLoading(false);
    } else {
      // If no saved data, fetch from the server
      fetchCustomers();
    }
  }, []);

  // Function to fetch the total spent for a customer
  const fetchTotalSpent = async (customerId: number): Promise<number> => {
    try {
      const response = await fetch(`http://localhost:8080/api/v1/purchaseHistory/byCustomer?customerId=${customerId}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch purchase history for customer ID ${customerId}`);
      }
      const purchaseHistory = await response.json();
      // Sum up the totalPrice values
      return purchaseHistory.reduce((total: number, purchase: { totalPrice: number }) => total + purchase.totalPrice, 0);
    } catch (err: any) {
      console.error(err.message);
      return 0; // Default to 0 if there was an error fetching
    }
  };

  const updateCustomerTiers = async (customers: Customer[]) => {
    const updatedIds = new Set<number>(); // To keep track of updated customer IDs

    for (const customer of customers) {
      if (!updatedIds.has(customer.customerId)) {
        try {
          const response = await fetch(`http://localhost:8080/api/v1/customers/customerTier?customerId=${customer.customerId}`, {
            method: 'PUT',
          });
          if (!response.ok) {
            throw new Error(`Failed to update tier for customer ID ${customer.customerId}`);
          }
          const updatedTier = await response.text();

          setCustomers(prevCustomers =>
            prevCustomers.map(c =>
              c.customerId === customer.customerId ? { ...c, tier: updatedTier } : c
            )
          );

          // Update local storage after changing customer data
          localStorage.setItem('customerData', JSON.stringify(
            prevCustomers.map(c =>
              c.customerId === customer.customerId ? { ...c, tier: updatedTier } : c
            )
          ));

          updatedIds.add(customer.customerId); // Mark this ID as updated
        } catch (err: any) {
          console.error(err.message);
        }
      }
    }
  };

  // Function to filter customers based on selected tiers
  const filteredCustomers = customers
    .filter(customer => filteredTiers.includes(customer.tier))
    .sort((a, b) => arrangeByTopSpending ? (b.totalSpent || 0) - (a.totalSpent || 0) : 0); // Sorting logic based on checkbox state

  // Function to handle tier filter change
  const handleTierChange = (tier: string) => {
    setFilteredTiers(prev => {
      if (prev.includes(tier)) {
        return prev.filter(t => t !== tier); // Remove tier if already included
      } else {
        return [...prev, tier]; // Add tier if not included
      }
    });
  };

  // Mapping of tier codes to display names
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

        {filteredCustomers.length > 0 ? (
          <table id="purchase-history" className="min-w-full bg-white rounded shadow">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b">Customer ID</th>
                <th className="py-2 px-4 border-b">Zip Code</th>
                <th className="py-2 px-4 border-b">Tier</th>
                <th className="py-2 px-4 border-b">Amount Spent</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.map(customer => (
                <tr key={customer.customerId} className="hover:bg-gray-100">
                  <td className="py-2 px-4 border-b">
                    <Link href={`/customerprofile/${customer.customerId}`}>
                      <span className="text-blue-600 underline hover:text-blue-800">
                        {customer.customerId}
                      </span>
                    </Link>
                  </td>
                  <td className="py-2 px-4 border-b">{customer.zipCode}</td>
                  <td className="py-2 px-4 border-b">{tierDisplayNames[customer.tier]}</td>
                  <td className="py-2 px-4 border-b">${customer.totalSpent?.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No customers available for the selected tier(s).</p>
        )}
      </div>
    </div>
  );
};

export default CustomerList;
