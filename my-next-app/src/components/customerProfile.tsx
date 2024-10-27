// src/components/customerProfile.tsx
"use client";

import React, { useState, useEffect } from 'react';
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
} from 'chart.js';
import './customerProfile.css'; // Import your CSS

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

// Define types for the customer and purchase data
interface Purchase {
  purchaseId: number;        
  saleDate: string;          
  saleType: number;          
  digital: number;           
  customerId: number;        
  shippingMethod: string;     
  productId: number;         
  quantity: number;          
  totalPrice: number;        
  productName?: string;      
}

interface Customer {
  zipCode: number;
}

interface CustomerProfileProps {
  customerId: number; 
  role: string; // Include the role prop
}

const CustomerProfile: React.FC<CustomerProfileProps> = ({ customerId, role }) => {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [purchaseHistory, setPurchaseHistory] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cumulativeTotal, setCumulativeTotal] = useState<number>(0);

  useEffect(() => {
    const fetchCustomerData = async () => {
      try {
        const customerResponse = await fetch(`http://localhost:8080/api/v1/customers/byCustomer?customerId=${customerId}`);
        if (!customerResponse.ok) {
          throw new Error('Failed to fetch customer data');
        }
        const customerData = await customerResponse.json();
        setCustomer({ zipCode: customerData.zipCode });

        const purchaseResponse = await fetch(`http://localhost:8080/api/v1/purchaseHistory/byCustomer?customerId=${customerId}`);
        if (!purchaseResponse.ok) {
          throw new Error('Failed to fetch purchase history');
        }
        const purchaseData = await purchaseResponse.json();

        const productIds = Array.from(new Set(purchaseData.map((purchase: Purchase) => purchase.productId)));
        const productResponses = await Promise.all(
          productIds.map(async (productId) => {
            const productResponse = await fetch(`http://localhost:8080/api/v1/product/byProduct?productId=${productId}`);
            return productResponse.ok ? productResponse.json() : { productId, productName: "N/A" };
          })
        );

        const productsMap = Object.fromEntries(productResponses.map((productData: any) => [productData.productId, productData.productName]));

        const purchasesWithProductDetails = purchaseData.map((purchase: Purchase) => ({
          ...purchase,
          productName: productsMap[purchase.productId] || "N/A", 
        }));

        setPurchaseHistory(purchasesWithProductDetails);

        const totalPrice = purchasesWithProductDetails.reduce((acc: number, purchase: Purchase) => {
          return acc + purchase.totalPrice;
        }, 0);
        setCumulativeTotal(totalPrice);

      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomerData();
  }, [customerId]);

  const getTier = (total: number): string => {
    if (total > 3000) return "Gold";
    if (total > 1000) return "Silver";
    return "Bronze";
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  const tier = getTier(cumulativeTotal); 

  const handleRedirect = () => {
    window.location.href = 'http://localhost:3000/newsletter';
  };

  const handleBack = () => {
    window.location.href = 'http://localhost:3000/customers'; // Redirect to the customers page
  };

  return (
    <div className="customer-profile">
      <h1 className="profile-header">
        Customer Profile for User ID: <span>{customerId}</span>
        <span className="tier-badge">{tier}</span>
        {role === "Marketing" && (
          <button 
            onClick={handleRedirect} // Redirect to newsletter page
            className="contact-button"
          >
            Contact Me
          </button>
        )}
      </h1>
      {customer && (
        <div className="customer-details">
          <p><strong>Zipcode:</strong> {customer.zipCode}</p>
        </div>
      )}

      <button 
        onClick={handleBack} // Redirect to customers page
        className="back-button"
      >
        Back to Customers
      </button>

      <h2>Purchase History</h2>
      {purchaseHistory.length > 0 ? (
        <table id="purchase-history">
          <thead>
            <tr>
              <th>Purchase ID</th>
              <th>Product Name</th>
              <th>Quantity</th>
              <th>Total Price</th>
              <th>Purchase Date</th>
            </tr>
          </thead>
          <tbody>
            {purchaseHistory.map(purchase => (
              <tr key={purchase.purchaseId}>
                <td>{purchase.purchaseId}</td>
                <td>{purchase.productName}</td>
                <td>{purchase.quantity}</td>
                <td>${purchase.totalPrice.toFixed(2)}</td>
                <td>{purchase.saleDate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No purchase history available for this customer.</p>
      )}

      <h3>Cumulative Total Price: ${cumulativeTotal.toFixed(2)}</h3>
    </div>
  );
};

export default CustomerProfile;
