"use client";

import React, { useState, useEffect } from 'react';
import './CustomerList.css'; // Import the CSS file

interface Customer {
  customerId: number;
  zipCode: number;
  // Add other relevant fields as necessary
}

const CustomerList: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/v1/customers');
        if (!response.ok) {
          throw new Error('Failed to fetch customers');
        }
        const customerData = await response.json();
        setCustomers(customerData);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  if (loading) {
    return <div className="loading">Loading customers...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <div className="customer-profile">
      <h1>Customer List</h1>
      {customers.length > 0 ? (
        <table id="purchase-history">
          <thead>
            <tr>
              <th>Customer ID</th>
              <th>Zip Code</th>
              {/* Add other headers as necessary */}
            </tr>
          </thead>
          <tbody>
            {customers.map(customer => (
              <tr key={customer.customerId}>
                <td>
                  <a href={`http://localhost:3001/customerprofile/${customer.customerId}`} target="_blank" rel="noopener noreferrer">
                    {customer.customerId}
                  </a>
                </td>
                <td>{customer.zipCode}</td>
                {/* Add other fields as necessary */}
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No customers available.</p>
      )}
    </div>
  );
};

export default CustomerList;
