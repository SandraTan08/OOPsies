// src/app/customerProfile/[customerId]/page.tsx
import React from 'react';
import CustomerProfile from '@/components/customerProfile'; // Adjust path as needed

const CustomerProfilePage = ({ params }: { params: { customerId: string } }) => {
  const { customerId } = params; // Accessing params directly

  if (!customerId) {
    return <div>No customer ID provided</div>;
  }

  return (
    <CustomerProfile customerId={parseInt(customerId)} />
  );
};

export default CustomerProfilePage; // Ensure this export exists
