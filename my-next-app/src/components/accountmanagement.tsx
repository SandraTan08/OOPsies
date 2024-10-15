'use client'

import { useState } from 'react'
import { Menu, Search, Bell, User, Plus, Edit2, Trash2 } from 'lucide-react'

// Mock data for existing accounts
const initialAccounts = [
  { id: 1, userName: 'john.doe', email: 'john.doe@example.com', role: 'Admin' },
  { id: 2, userName: 'jane.smith', email: 'jane.smith@example.com', role: 'User' },
]

export default function AccountManagement() {
  const [accounts, setAccounts] = useState(initialAccounts)
  const [newAccount, setNewAccount] = useState({ accountId: '', userName: '', email: '', role: '' })
  const [editingAccount, setEditingAccount] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [modalContent, setModalContent] = useState(null)
  const [notification, setNotification] = useState(null)

  const handleCreateAccount = async (e) => {
    e.preventDefault()
    if (newAccount.accountId && newAccount.userName && newAccount.email && newAccount.role) {
      setModalContent({
        title: 'Confirm Account Creation',
        message: `Are you sure you want to create an account for ${newAccount.userName}?`,
        action: async () => {
          try {
            const response = await fetch('http://localhost:8080/api/v1/account/new_account', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                accountId: newAccount.accountId,
                accountUserName: newAccount.userName,
                password: "123456",
                accountEmail: newAccount.email,
                role: newAccount.role,
              }),
            })
            if (response.ok) {
              const createdAccount = await response.json()
              setAccounts([...accounts, createdAccount])
              setNewAccount({ accountId: '', userName: '', email: '', role: '' })
              setNotification({ type: 'success', message: 'Account created successfully' })
            } else {
              throw new Error('Failed to create account')
            }
          } catch (error) {
            console.error('Error:', error)
            setNotification({ type: 'error', message: 'Error creating account' })
          } finally {
            setModalContent(null)
          }
        },
      })
      setShowModal(true)
    }
  }

  const handleEditAccount = (account) => {
    setEditingAccount(account)
  }

  const handleUpdateAccount = (e) => {
    e.preventDefault()
    setModalContent({
      title: 'Confirm Account Update',
      message: `Are you sure you want to update the account for ${editingAccount.userName}?`,
      action: () => {
        const updatedAccounts = accounts.map(acc =>
          acc.id === editingAccount.id ? editingAccount : acc
        )
        setAccounts(updatedAccounts)
        setEditingAccount(null)
        setNotification({ type: 'success', message: 'Account updated successfully' })
        setModalContent(null)
      }
    })
    setShowModal(true)
  }

  const handleDeleteAccount = (account) => {
    setModalContent({
      title: 'Confirm Account Deletion',
      message: `Are you sure you want to delete the account for ${account.userName}?`,
      action: () => {
        const updatedAccounts = accounts.filter(acc => acc.id !== account.id)
        setAccounts(updatedAccounts)
        setNotification({ type: 'success', message: 'Account deleted successfully' })
        setModalContent(null)
      }
    })
    setShowModal(true)
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <div className="flex flex-col flex-1 overflow-hidden">
        <header className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200">
          <h1 className="text-2xl font-semibold text-gray-900">Account Management</h1>
          <div className="flex items-center">
            <div className="relative mr-4">
              <input
                type="text"
                placeholder="Search..."
                className="w-64 px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Search className="absolute top-2.5 right-3 w-5 h-5 text-gray-400" />
            </div>
            <button className="p-1 text-gray-400 rounded-full hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <Bell className="w-6 h-6" />
            </button>
            <button className="p-1 ml-3 text-gray-400 rounded-full hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <User className="w-6 h-6" />
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <div className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Create New Account</h2>
                <form onSubmit={handleCreateAccount} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="account-id" className="block text-sm font-medium text-gray-700 mb-1">
                        Account ID
                      </label>
                      <input
                        type="text"
                        name="account-id"
                        id="account-id"
                        value={newAccount.accountId}
                        onChange={(e) => setNewAccount({ ...newAccount, accountId: e.target.value })}
                        className="w-full px-3 py-2 text-gray-700 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label htmlFor="user-name" className="block text-sm font-medium text-gray-700 mb-1">
                        User Name
                      </label>
                      <input
                        type="text"
                        name="user-name"
                        id="user-name"
                        value={newAccount.userName}
                        onChange={(e) => setNewAccount({ ...newAccount, userName: e.target.value })}
                        className="w-full px-3 py-2 text-gray-700 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label htmlFor="email-address" className="block text-sm font-medium text-gray-700 mb-1">
                        Email address
                      </label>
                      <input
                        type="email"
                        name="email-address"
                        id="email-address"
                        value={newAccount.email}
                        onChange={(e) => setNewAccount({ ...newAccount, email: e.target.value })}
                        className="w-full px-3 py-2 text-gray-700 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                        Role
                      </label>
                      <input
                        type="text"
                        name="role"
                        id="role"
                        value={newAccount.role}
                        onChange={(e) => setNewAccount({ ...newAccount, role: e.target.value })}
                        className="w-full px-3 py-2 text-gray-700 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Create Account
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {notification && (
              <div className={`mt-4 p-4 rounded-md ${notification.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                {notification.message}
              </div>
            )}

            <div className="mt-8 bg-white rounded-2xl shadow-sm overflow-hidden">
              <div className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Existing Accounts</h2>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          User Name
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Email
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Role
                        </th>
                        <th scope="col" className="relative px-6 py-3">
                          <span className="sr-only">Actions</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {accounts.map((account) => (
                        <tr key={account.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{account.userName}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{account.email}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{account.role}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button
                              className="text-blue-600 hover:text-blue-900 mr-4"
                              onClick={() => handleEditAccount(account)}
                            >
                              <Edit2 className="w-5 h-5" />
                            </button>
                            <button
                              className="text-red-600 hover:text-red-900"
                              onClick={() => handleDeleteAccount(account)}
                            >
                              <Trash2 className="w-5 h-5" />
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

      {showModal && modalContent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-auto bg-black bg-opacity-50">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-96 max-w-[90%]">
            <h2 className="text-xl font-semibold mb-4">{modalContent.title}</h2>
            <p className="text-gray-600 mb-6">{modalContent.message}</p>
            <div className="flex justify-end space-x-4">
              <button
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                onClick={() => { setShowModal(false); setModalContent(null); }}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                onClick={async () => { 
                  await modalContent.action(); 
                  setShowModal(false);
                }}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}