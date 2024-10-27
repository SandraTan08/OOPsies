"use client";

import React, { useState, useEffect } from 'react';
import './CustomerList.css'; // Import the CSS file
import Header from "@/components/header";
import Link from 'next/link';

interface Customer {
  customerId: number;
  zipCode: number;
  tier: string; // Include the tier field
}

const CustomerList: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filteredTiers, setFilteredTiers] = useState<string[]>(["G", "B", "S"]); // Default to show all

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/v1/customers');
        if (!response.ok) {
          throw new Error('Failed to fetch customers');
        }
        const customerData = await response.json();
        setCustomers(customerData);

        // Update the customer tiers after fetching
        await updateCustomerTiers(customerData);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

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

          updatedIds.add(customer.customerId); // Mark this ID as updated
        } catch (err: any) {
          console.error(err.message);
        }
      }
    }
  };

  // Function to filter customers based on selected tiers
  const filteredCustomers = customers.filter(customer => filteredTiers.includes(customer.tier));

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

  // Inside the CustomerList component

return (
  <div className="min-h-screen bg-gray-100">
    <Header />
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
      </div>

      {filteredCustomers.length > 0 ? (
        <table id="purchase-history" className="min-w-full bg-white rounded shadow">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">Customer ID</th>
              <th className="py-2 px-4 border-b">Zip Code</th>
              <th className="py-2 px-4 border-b">Tier</th>
            </tr>
          </thead>
          <tbody>
            {filteredCustomers.map(customer => (
              <tr key={customer.customerId} className="hover:bg-gray-100">
                <td className="py-2 px-4 border-b">
                  <Link href={`/customerprofile/${customer.customerId}`}>
                    {customer.customerId}
                  </Link>
                </td>
                <td className="py-2 px-4 border-b">{customer.zipCode}</td>
                <td className="py-2 px-4 border-b">{tierDisplayNames[customer.tier]}</td>
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
