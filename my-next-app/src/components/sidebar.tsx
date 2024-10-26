import { LayoutGrid, Users, ShoppingCart, BarChart } from 'lucide-react';
import Link from 'next/link';

interface SidebarProps {
  role: string; // Keep only the role prop
}

export default function Sidebar({ role }: SidebarProps) {
  return (
    <aside className="hidden md:flex md:flex-shrink-0 bg-gray-800">
      <div className="flex flex-col w-64">
        <div className="flex items-center h-16 px-4 bg-gray-900">
          <h1 className="text-lg font-semibold text-white">Timperio CRM</h1>
        </div>
        <div className="flex flex-col flex-1 overflow-y-auto bg-gray-800">
          <nav className="flex-1 px-2 py-4 space-y-1">
            {/* Navigation Links */}
            <Link href="/dashboard" className="flex items-center px-2 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 rounded-md group">
              <LayoutGrid className="w-6 h-6 mr-3 text-gray-400 group-hover:text-gray-300" />
              Dashboard
            </Link>
            <Link href="/customers" className="flex items-center px-2 py-2 text-sm font-medium text-gray-300 rounded-md hover:bg-gray-700 hover:text-white group">
              <Users className="w-6 h-6 mr-3 text-gray-400 group-hover:text-gray-300" />
              Customers
            </Link>
            {/* sales team shouldn't be able to access newsletter */}
            {role !== 'Sales' && (
              <Link href="/newsletter" className="flex items-center px-2 py-2 text-sm font-medium text-gray-300 rounded-md hover:bg-gray-700 hover:text-white group">
                <ShoppingCart className="w-6 h-6 mr-3 text-gray-400 group-hover:text-gray-300" />
                Newsletter
              </Link>
            )}
            {/* Conditionally render the Account link based on the role */}
            {role === 'Admin' && (
              <Link href="/account" className="flex items-center px-2 py-2 text-sm font-medium text-gray-300 rounded-md hover:bg-gray-700 hover:text-white group">
                <BarChart className="w-6 h-6 mr-3 text-gray-400 group-hover:text-gray-300" />
                Account
              </Link>
            )}
          </nav>
        </div>
      </div>
    </aside>
  );
}
