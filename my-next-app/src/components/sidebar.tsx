"use client";

import { useState } from 'react';
import { LayoutGrid, Users, ShoppingCart, BarChart, LogOut, Menu, X } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import downloadImage from '../img/logo.png'


interface SidebarProps {
  role: string;
}

export default function Sidebar({ role }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <div>
      {/* Hamburger Menu Button */}
      <div className="bg-transparent">
      <button
        className="md:hidden p-4 text-gray-400 "
        onClick={toggleSidebar}
        aria-label="Toggle Sidebar"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>
    </div>

      {/* Sidebar */}
      <aside
  className={`fixed inset-y-0 left-0 z-20 transform ${
    isOpen ? 'translate-x-0' : '-translate-x-full'
  } md:translate-x-0 md:relative md:flex md:flex-shrink-0 h-screen w-48 bg-green-950 transition-transform duration-300 ease-in-out`}
>
  <div className="flex flex-col h-full bg-green-950 outline-none border-none">
    <div className="flex pl-12 bg-green-950 border-none">
      <Image className="pt-5" src={downloadImage} alt="Timperio Logo" width={100} height={100} />
    </div>
    <div className="flex items-center h-16 px-4 bg-green-950">
      <h1 className="text-lg font-semibold text-white pl-5">Timperio CRM</h1>
    </div>
    <div className="flex flex-col flex-1 overflow-y-auto bg-green-950">
      <nav className="flex-1 px-2 py-4 space-y-1">
        <Link href="/dashboard" className="flex items-center px-2 py-2 pl-7 text-sm font-medium text-gray-300 hover:bg-gray-700 rounded-md group">
          <LayoutGrid className="w-6 h-6 mr-3 text-gray-400 group-hover:text-gray-300" />
          Dashboard
        </Link>
        <Link href="/customers" className="flex items-center px-2 py-2 pl-7 text-sm font-medium text-gray-300 rounded-md hover:bg-gray-700 hover:text-white group">
          <Users className="w-6 h-6 mr-3 text-gray-400 group-hover:text-gray-300" />
          Customers
        </Link>
        {role !== 'Sales' && (
          <Link href="/newsletter" className="flex items-center px-2 py-2 pl-7 text-sm font-medium text-gray-300 rounded-md hover:bg-gray-700 hover:text-white group">
            <ShoppingCart className="w-6 h-6 mr-3 text-gray-400 group-hover:text-gray-300" />
            Newsletter
          </Link>
        )}
        {role === 'Admin' && (
          <Link href="/account" className="flex items-center px-2 py-2 pl-7 text-sm font-medium text-gray-300 rounded-md hover:bg-gray-700 hover:text-white group">
            <BarChart className="w-6 h-6 mr-3 text-gray-400 group-hover:text-gray-300" />
            Account
          </Link>
        )}
        <Link href="/" className="flex items-center px-2 py-2 text-sm pl-7 font-medium text-gray-300 rounded-md hover:bg-gray-700 hover:text-white group">
          <LogOut className="w-6 h-6 mr-3 text-gray-400 group-hover:text-gray-300" />
          Sign Out
        </Link>
      </nav>
    </div>
  </div>
</aside>


      {/* Overlay to close sidebar when clicked outside */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-10 md:hidden"
          onClick={toggleSidebar}
        ></div>
      )}
    </div>
  );
}
