"use client";

import { useSession } from 'next-auth/react';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
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
import './customerProfile.css';

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
  tier: string;
}

interface CustomerProfileProps {
  customerId: number;
  role: string;
}

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

const CustomerProfile: React.FC<CustomerProfileProps> = ({ customerId }) => {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [purchaseHistory, setPurchaseHistory] = useState<Purchase[]>([]);
  const [topProducts, setTopProducts] = useState<{ productName: string; quantity: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cumulativeTotal, setCumulativeTotal] = useState<number>(0);
  const { data: session } = useSession();
  const role = session?.account?.role || '';

  useEffect(() => {
    const fetchCustomerData = async () => {
      try {
        const customerResponse = await fetch(`${backendUrl}customers/byCustomer?customerId=${customerId}`);
        if (!customerResponse.ok) {
          throw new Error('Failed to fetch customer data');
        }
        const customerData = await customerResponse.json();
        setCustomer({ zipCode: customerData.zipCode, tier: customerData.tier });

        const purchaseResponse = await fetch(`${backendUrl}purchaseHistory/byCustomer?customerId=${customerId}`);
        if (!purchaseResponse.ok) {
          throw new Error('Failed to fetch purchase history');
        }
        const purchaseData = await purchaseResponse.json();

        const productIds = Array.from(new Set(purchaseData.map((purchase: Purchase) => purchase.productId)));
        const productResponses = await Promise.all(
          productIds.map(async (productId) => {
            const productResponse = await fetch(`${backendUrl}product/byProduct?productId=${productId}`);
            return productResponse.ok ? productResponse.json() : { productId, productName: "N/A" };
          })
        );

        const productsMap = Object.fromEntries(productResponses.map((productData: any) => [productData.productId, productData.productName]));

        const purchasesWithProductDetails = purchaseData.map((purchase: Purchase) => ({
          ...purchase,
          productName: productsMap[purchase.productId] || "N/A",
        }));

        setPurchaseHistory(purchasesWithProductDetails);

        const totalPrice = purchasesWithProductDetails.reduce((acc: number, purchase: Purchase) => acc + purchase.totalPrice, 0);
        setCumulativeTotal(totalPrice);

        // Calculate top 3 most purchased items
        const productQuantities: Record<string, number> = {};
        purchasesWithProductDetails.forEach(purchase => {
          if (purchase.productName) {
            productQuantities[purchase.productName] = (productQuantities[purchase.productName] || 0) + purchase.quantity;
          }
        });

        const sortedTopProducts = Object.entries(productQuantities)
          .map(([productName, quantity]) => ({ productName, quantity }))
          .sort((a, b) => b.quantity - a.quantity)
          .slice(0, 3);

        setTopProducts(sortedTopProducts);

      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomerData();
  }, [customerId]);



  const tierMap: Record<string, string> = {
    G: "Gold",
    S: "Silver",
    B: "Bronze",
  };

  const tier = customer ? tierMap[customer.tier] : "N/A";

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <div className="customer-profile">
      <h1 className="profile-header">
        <span className="profile-left">
          Customer Profile for User ID: <span className="customer-id">{customerId}</span>
        </span>
        <span className={`tier-badge ${tier.toLowerCase() === 'gold'
            ? 'bg-yellow-500 text-yellow-900'
            : tier.toLowerCase() === 'silver'
              ? 'bg-gray-300 text-gray-700'
              : tier.toLowerCase() === 'bronze'
                ? 'bg-amber-800 text-amber-200'
                : 'bg-gray-100 text-gray-500'
          } px-2 py-1 rounded-full text-sm font-medium`}>{tier}</span>
      </h1>

      {customer && (
        <div className="customer-details">
          <p><strong>Zipcode:</strong> {customer.zipCode}</p>
          <p><strong>Most Purchased Products:</strong></p>
          <ul>
            {topProducts.map((product, index) => (
              <li key={index}>
                {product.productName} - {product.quantity} purchased
              </li>
            ))}
          </ul>
        </div>
      )}

      <Link href="/customers">
        <button className="back-button" style={{ backgroundColor: '#374151', color: 'white' }}>
          Back to Customers
        </button>
      </Link>

      {role === 'Marketing' && (
        <Link href={`/newsletter/${customerId}`}>
          <button className="back-button" style={{ backgroundColor: '#374151', color: 'white' }}>
            Contact me
          </button>
        </Link>
      )}

      <h2>Purchase History</h2>
      {purchaseHistory.length > 0 ? (
        <table id="purchase-history">
          <thead>
            <tr>
              <th style={{ backgroundColor: '#374151', color: 'white' }}>Purchase ID</th>
              <th style={{ backgroundColor: '#374151', color: 'white' }}>Product Name</th>
              <th style={{ backgroundColor: '#374151', color: 'white' }}>Quantity</th>
              <th style={{ backgroundColor: '#374151', color: 'white' }}>Sale Type</th>
              <th style={{ backgroundColor: '#374151', color: 'white' }}>Digital</th>
              <th style={{ backgroundColor: '#374151', color: 'white' }}>Total Price</th>
              <th style={{ backgroundColor: '#374151', color: 'white' }}>Purchase Date</th>
            </tr>
          </thead>
          <tbody>
            {purchaseHistory.map(purchase => (
              <tr key={purchase.purchaseId}>
                <td>{purchase.purchaseId}</td>
                <td>{purchase.productName}</td>
                <td>{purchase.quantity}</td>
                <td>{purchase.saleType}</td>
                <td>{purchase.digital}</td>
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
