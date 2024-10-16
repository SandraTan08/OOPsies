// components/Header.tsx
'use client'

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useState } from 'react'
import { Search } from 'lucide-react'
import { useSession, signOut } from 'next-auth/react';

export default function Header() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  const { data: session, status } = useSession();

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  return (
    <header className="flex items-center justify-between px-4 py-4 bg-white border-b border-gray-200 sm:px-6 lg:px-8">
      <div className="flex items-center">
        <div className="relative">
          <input
            type="text"
            placeholder="Search..."
            className="w-64 px-4 py-2 text-sm text-gray-700 placeholder-gray-400 bg-gray-100 border border-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <Search className="absolute top-2.5 right-3 w-5 h-5 text-gray-400" />
        </div>
      </div>
      <button
        onClick={toggleDropdown}
        className="flex items-center max-w-xs text-sm bg-black rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        id="user-menu"
        aria-expanded={dropdownOpen}
        aria-haspopup="true"
      >
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <span className="sr-only">Open user menu</span>
      </button>

      {dropdownOpen && (
        <div
          className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="user-menu"
        >
          <div className="py-1" role="none">
            <a
              href="#"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              role="menuitem"
            >
              Profile
            </a>
            <a
              href="#"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              role="menuitem"
            >
              Settings
            </a>
            <button
              onClick={() => signOut({ callbackUrl: '/' })}
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              role="menuitem"
            >
              Sign Out
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
