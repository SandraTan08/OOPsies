'use client'

import { useState } from 'react'
import { 
  LayoutGrid, 
  Users, 
  ShoppingCart, 
  BarChart, 
  Menu,
  Search,
  Bell,
  User,
  Plus,
  Edit,
  Trash2,
  X
} from 'lucide-react'

// Mock data for existing accounts
const initialAccounts = [
  { id: 1, userId: 'john.doe', email: 'john.doe@example.com' },
  { id: 2, userId: 'jane.smith', email: 'jane.smith@example.com' },
]

export default function AccountManagement() {
  const [accounts, setAccounts] = useState(initialAccounts)
  const [newAccount, setNewAccount] = useState({ userId: '', email: '' })
  const [editingAccount, setEditingAccount] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [modalContent, setModalContent] = useState({ title: '', message: '', action: null })
  const [notification, setNotification] = useState(null)

  const handleCreateAccount = (e) => {
    e.preventDefault()
    if (newAccount.userId && newAccount.email) {
      setShowModal(true)
      setModalContent({
        title: 'Confirm Account Creation',
        message: `Are you sure you want to create an account for ${newAccount.userId}?`,
        action: () => {
          const updatedAccounts = [...accounts, { ...newAccount, id: accounts.length + 1 }]
          setAccounts(updatedAccounts)
          setNewAccount({ userId: '', email: '' })
          setNotification({ type: 'success', message: 'Account created successfully' })
          setShowModal(false)
        }
      })
    }
  }

  const handleEditAccount = (account) => {
    setEditingAccount(account)
  }

  const handleUpdateAccount = (e) => {
    e.preventDefault()
    setShowModal(true)
    setModalContent({
      title: 'Confirm Account Update',
      message: `Are you sure you want to update the account for ${editingAccount.userId}?`,
      action: () => {
        const updatedAccounts = accounts.map(acc => 
          acc.id === editingAccount.id ? editingAccount : acc
        )
        setAccounts(updatedAccounts)
        setEditingAccount(null)
        setNotification({ type: 'success', message: 'Account updated successfully' })
        setShowModal(false)
      }
    })
  }

  const handleDeleteAccount = (account) => {
    setShowModal(true)
    setModalContent({
      title: 'Confirm Account Deletion',
      message: `Are you sure you want to delete the account for ${account.userId}?`,
      action: () => {
        const updatedAccounts = accounts.filter(acc => acc.id !== account.id)
        setAccounts(updatedAccounts)
        setNotification({ type: 'success', message: 'Account deleted successfully' })
        setShowModal(false)
      }
    })
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-64">
          <div className="flex items-center h-16 px-4 bg-gray-900">
            <h1 className="text-lg font-semibold text-white">Timperio CRM</h1>
          </div>
          <div className="flex flex-col flex-1 overflow-y-auto bg-gray-800">
            <nav className="flex-1 px-2 py-4 space-y-1">
              <a href="#" className="flex items-center px-2 py-2 text-sm font-medium text-gray-300 rounded-md hover:bg-gray-700 hover:text-white group">
                <LayoutGrid className="w-6 h-6 mr-3 text-gray-400 group-hover:text-gray-300" />
                Dashboard
              </a>
              <a href="#" className="flex items-center px-2 py-2 text-sm font-medium text-white bg-gray-900 rounded-md group">
                <Users className="w-6 h-6 mr-3 text-gray-300" />
                Account Management
              </a>
              <a href="#" className="flex items-center px-2 py-2 text-sm font-medium text-gray-300 rounded-md hover:bg-gray-700 hover:text-white group">
                <ShoppingCart className="w-6 h-6 mr-3 text-gray-400 group-hover:text-gray-300" />
                Sales
              </a>
              <a href="#" className="flex items-center px-2 py-2 text-sm font-medium text-gray-300 rounded-md hover:bg-gray-700 hover:text-white group">
                <BarChart className="w-6 h-6 mr-3 text-gray-400 group-hover:text-gray-300" />
                Reports
              </a>
            </nav>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Navbar */}
        <header className="flex items-center justify-between px-4 py-4 bg-white border-b border-gray-200 sm:px-6 lg:px-8">
          <button className="text-gray-500 md:hidden">
            <Menu className="w-6 h-6" />
          </button>
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
          <div className="flex items-center">
            <button className="p-1 text-gray-400 rounded-full hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <Bell className="w-6 h-6" />
            </button>
            <div className="relative ml-3">
              <div>
                <button className="flex items-center max-w-xs text-sm bg-white rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500" id="user-menu" aria-expanded="false" aria-haspopup="true">
                  <span className="sr-only">Open user menu</span>
                  <User className="w-8 h-8 rounded-full" />
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Account management content */}
        <main className="flex-1 overflow-y-auto bg-gray-100">
          <div className="py-6">
            <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
              <h1 className="text-2xl font-semibold text-gray-900">Account Management</h1>
            </div>
            <div className="px-4 mx-auto max-w-7xl sm:px-6 md:px-8">
              {/* Create new account form */}
              <div className="mt-8">
                <div className="md:grid md:grid-cols-3 md:gap-6">
                  <div className="md:col-span-1">
                    <h3 className="text-lg font-medium leading-6 text-gray-900">Create New Account</h3>
                    <p className="mt-1 text-sm text-gray-600">
                      Add a new user account to the system.
                    </p>
                  </div>
                  <div className="mt-5 md:mt-0 md:col-span-2">
                    <form onSubmit={handleCreateAccount}>
                      <div className="overflow-hidden shadow sm:rounded-md">
                        <div className="px-4 py-5 bg-white sm:p-6">
                          <div className="grid grid-cols-6 gap-6">
                            <div className="col-span-6 sm:col-span-3">
                              <label htmlFor="user-id" className="block text-sm font-medium text-gray-700">
                                User ID
                              </label>
                              <input
                                type="text"
                                name="user-id"
                                id="user-id"
                                value={newAccount.userId}
                                onChange={(e) => setNewAccount({ ...newAccount, userId: e.target.value })}
                                className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                              />
                            </div>
                            <div className="col-span-6 sm:col-span-3">
                              <label htmlFor="email-address" className="block text-sm font-medium text-gray-700">
                                Email address
                              </label>
                              <input
                                type="email"
                                name="email-address"
                                id="email-address"
                                value={newAccount.email}
                                onChange={(e) => setNewAccount({ ...newAccount, email: e.target.value })}
                                className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                              />
                            </div>
                          </div>
                        </div>
                        <div className="px-4 py-3 text-right bg-gray-50 sm:px-6">
                          <button
                            type="submit"
                            className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                          >
                            Create Account
                          </button>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>

              {/* Existing accounts table */}
              <div className="mt-8">
                <div className="sm:flex sm:items-center">
                  <div className="sm:flex-auto">
                    <h2 className="text-xl font-semibold text-gray-900">Existing Accounts</h2>
                    <p className="mt-2 text-sm text-gray-700">A list of all user accounts in the system.</p>
                  </div>
                </div>
                <div className="mt-8 overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                  <table className="min-w-full divide-y divide-gray-300">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">User ID</th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Email</th>
                        <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                          <span className="sr-only">Actions</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {accounts.map((account) => (
                        <tr key={account.id}>
                          <td className="py-4 pl-4 pr-3 text-sm font-medium text-gray-900 whitespace-nowrap sm:pl-6">{account.userId}</td>
                          <td className="px-3 py-4 text-sm text-gray-500 whitespace-nowrap">{account.email}</td>
                          <td className="relative py-4 pl-3 pr-4 text-sm font-medium text-right whitespace-nowrap sm:pr-6">
                            <button
                              onClick={() => handleEditAccount(account)}
                              className="text-blue-600 hover:text-blue-900 mr-4"
                            >
                              Edit<span className="sr-only">, {account.userId}</span>
                            </button>
                            <button
                              onClick={() => handleDeleteAccount(account)}
                              className="text-red-600 hover:text-red-900"
                            >
                              Delete<span className="sr-only">, {account.userId}</span>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Edit account modal */}
      {editingAccount && (
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block overflow-hidden text-left align-bottom transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="px-4 pt-5 pb-4 bg-white sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg font-medium leading-6 text-gray-900" id="modal-title">
                      Edit Account
                    </h3>
                    <div className="mt-2">
                      <form onSubmit={handleUpdateAccount}>
                        <div className="grid grid-cols-6 gap-6">
                          <div className="col-span-6 sm:col-span-3">
                            <label htmlFor="edit-user-id" className="block text-sm font-medium text-gray-700">
                              User ID
                            </label>
                            <input
                              type="text"
                              name="edit-user-id"
                              id="edit-user-id"
                              value={editingAccount.userId}
                              onChange={(e) => setEditingAccount({ ...editingAccount, userId: e.target.value })}
                              className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            />
                          </div>
                          <div className="col-span-6 sm:col-span-3">
                            <label htmlFor="edit-email-address" className="block text-sm font-medium text-gray-700">
                              Email address
                            </label>
                            <input
                              type="email"
                              name="edit-email-address"
                              id="edit-email-address"
                              value={editingAccount.email}
                              onChange={(e) => setEditingAccount({ ...editingAccount, email: e.target.value })}
                              className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            />
                          </div>
                        </div>
                        <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                          <button
                            type="submit"
                            className="inline-flex justify-center w-full px-4 py-2 text-base font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                          >
                            Update
                          </button>
                          <button
                            type="button"
                            className="inline-flex justify-center w-full px-4 py-2 mt-3 text-base font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:w-auto sm:text-sm"
                            onClick={() => setEditingAccount(null)}
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation modal */}
      {showModal && (
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block overflow-hidden text-left align-bottom transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="px-4 pt-5 pb-4 bg-white sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg font-medium leading-6 text-gray-900" id="modal-title">
                      {modalContent.title}
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        {modalContent.message}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="px-4 py-3 bg-gray-50 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="inline-flex justify-center w-full px-4 py-2 text-base font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={modalContent.action}
                >
                  Confirm
                </button>
                <button
                  type="button"
                  className="inline-flex justify-center w-full px-4 py-2 mt-3 text-base font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:w-auto sm:text-sm"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Notification */}
      {notification && (
        <div className="fixed inset-0 z-20 flex items-end justify-center px-4 py-6 pointer-events-none sm:p-6 sm:items-start sm:justify-end">
          <div className="w-full max-w-sm overflow-hidden bg-white rounded-lg shadow-lg pointer-events-auto ring-1 ring-black ring-opacity-5">
            <div className="p-4">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  {notification.type === 'success' ? (
                    <svg className="w-6 h-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  ) : (
                    <svg className="w-6 h-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  )}
                </div>
                <div className="ml-3 w-0 flex-1 pt-0.5">
                  <p className="text-sm font-medium text-gray-900">
                    {notification.message}
                  </p>
                </div>
                <div className="flex flex-shrink-0 ml-4">
                  <button
                    className="inline-flex text-gray-400 bg-white rounded-md hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    onClick={() => setNotification(null)}
                  >
                    <span className="sr-only">Close</span>
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}