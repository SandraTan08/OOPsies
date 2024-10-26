'use client'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  LayoutGrid, 
  Users, 
  ShoppingCart, 
  BarChart, 
  Menu,
  Search,
  Bell,
  User,
  Edit2,
  Plus,
  Edit,
  Trash2,
  X
} from 'lucide-react'
import { useSession, signIn, signOut } from 'next-auth/react';
import Header from "@/components/header";
import { useState, useEffect, useRef } from 'react'

const initialAccounts = []

export default function AccountManagement() {
  const [accounts, setAccounts] = useState(initialAccounts)
  const [newAccount, setNewAccount] = useState({ accountId: '', userName: '', email: '', role: '' })
  const [editingAccount, setEditingAccount] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [modalContent, setModalContent] = useState(null)
  const [notification, setNotification] = useState(null)
  const inputRef = useRef(null)

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/v1/account')
        if (response.ok) {
          const data = await response.json()
          setAccounts(data)
        } else {
          throw new Error('Failed to fetch accounts')
        }
      } catch (error) {
        console.error('Error fetching accounts:', error)
        setNotification({ type: 'error', message: 'Error fetching accounts' })
      }
    }

    fetchAccounts()
  }, [])

  useEffect(() => {
    if (editingAccount) {
      setModalContent({
        title: 'Edit Account',
        message: (
          <form className="space-y-4">
            <div>
              <label htmlFor="edit-user-name" className="block text-sm font-medium text-gray-700 mb-1">
                User Name
              </label>
              <input
                ref={inputRef}
                type="text"
                name="edit-user-name"
                id="edit-user-name"
                value={editingAccount.accountUserName}
                onChange={(e) =>
                  setEditingAccount((prev) => ({ ...prev, accountUserName: e.target.value }))}
                className="w-full px-3 py-2 text-gray-700 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label htmlFor="edit-email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                name="edit-email"
                id="edit-email"
                value={editingAccount.accountEmail}
                onChange={(e) =>
                  setEditingAccount((prev) => ({ ...prev, accountEmail: e.target.value }))}
                className="w-full px-3 py-2 text-gray-700 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label htmlFor="edit-role" className="block text-sm font-medium text-gray-700 mb-1">
                Role
              </label>
              <input
                type="text"
                name="edit-role"
                id="edit-role"
                value={editingAccount.role}
                onChange={(e) =>
                  setEditingAccount((prev) => ({ ...prev, role: e.target.value }))}
                className="w-full px-3 py-2 text-gray-700 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </form>
        ),
        action: handleUpdateAccount,
      })
      setShowModal(true)
    }
  }, [editingAccount])

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
              setAccounts((prevAccounts) => [...prevAccounts, createdAccount])
              setNewAccount({ accountId: '', userName: '', email: '', role: '' })
              setNotification({ type: 'success', message: 'Account created successfully' })
            } else {
              throw new Error('Failed to create account')
            }
          } catch (error) {
            console.error('Error:', error)
            setNotification({ type: 'error', message: 'Error creating account' })
          } finally {
            setShowModal(false)
          }
        },
      })
      setShowModal(true)
    }
  }

  const handleEditAccount = (account) => {
    setEditingAccount(account)
  }

  const handleUpdateAccount = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/v1/account/${editingAccount.accountId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingAccount),
      })

      if (response.ok) {
        const updatedAccount = await response.json()
        setAccounts(
          accounts.map((acc) =>
            acc.accountId === updatedAccount.accountId ? updatedAccount : acc
          )
        )
        setNotification({ type: 'success', message: 'Account updated successfully' })
      } else {
        throw new Error('Failed to update account')
      }
    } catch (error) {
      console.error('Error updating account:', error)
      setNotification({ type: 'error', message: 'An error occurred while updating the account' })
    } finally {
      setEditingAccount(null)
      setShowModal(false)
    }
  }

  const handleDeleteAccount = (account) => {
    setModalContent({
      title: 'Confirm Account Deletion',
      message: `Are you sure you want to delete the account for ${account.accountUserName}?`,
      action: async () => {
        try {
          const response = await fetch(`http://localhost:8080/api/v1/account/${account.accountId}`, {
            method: 'DELETE',
          })

          if (response.ok) {
            setAccounts(accounts.filter(acc => acc.accountId !== account.accountId))
            setNotification({ type: 'success', message: 'Account deleted successfully' })
          } else if (response.status === 404) {
            setNotification({ type: 'error', message: 'Account not found' })
          } else {
            setNotification({ type: 'error', message: 'Failed to delete account' })
          }
        } catch (error) {
          console.error('Error deleting account:', error)
          setNotification({ type: 'error', message: 'An error occurred while deleting the account' })
        } finally {
          setShowModal(false)
        }
      },
    })
    setShowModal(true)
  }

  const { data: session, status } = useSession();

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (!session) {
    window.location.href = '/';
    return null;
  }

  const Modal = ({ title, onClose, children }) => (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-auto bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">{title}</h2>
        <div>{children}</div>
        <div className="flex justify-end space-x-4 mt-4">
          <button
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            onClick={modalContent.action}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  )

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <header className="flex items-center justify-between px-4 py-4 bg-white border-b border-gray-200 sm:px-6">
        <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl">Account Management</h1>
        <div className="flex items-center">
          <div className="relative mr-2 sm:mr-4">
            <input
              type="text"
              placeholder="Search..."
              className="w-full px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 sm:w-64"
            />
            <Search className="absolute top-2.5 right-3 w-5 h-5 text-gray-400" />
          </div>
          <button className="p-1 text-gray-400 rounded-full hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <Bell className="w-6 h-6" />
          </button>
          <button className="p-1 ml-2 text-gray-400 rounded-full hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:ml-3">
            <User className="w-6 h-6" />
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-4 sm:p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="p-4 sm:p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Create New Account</h2>
              <form onSubmit={handleCreateAccount} className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      id="email"
                      value={newAccount.email}
                      onChange={(e) => setNewAccount({ ...newAccount, email: e.target.value })}
                      className="w-full px-3 py-2 text-gray-700 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                      Role
                    </label>
                    <select
                      name="role"
                      id="role"
                      value={newAccount.role}
                      onChange={(e) => setNewAccount({ ...newAccount, role: e.target.value })}
                      className="w-full px-3 py-2 text-gray-700 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select Role</option>
                      <option value="Admin">Admin</option>
                      <option value="Marketing">Marketing</option>
                      <option value="Sales">Sales</option>
                    </select>
                  </div>
                </div>
                <button
                  type="submit"
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <Plus className="mr-2" /> Create Account
                </button>
              </form>
            </div>

            <div className="overflow-x-auto border-t border-gray-200">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sm:px-6">Account ID</th>
                    <th className="px-4  py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sm:px-6">User Name</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sm:px-6">Email</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sm:px-6">Role</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sm:px-6">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {accounts.map((account) => (
                    <tr key={account.accountId}>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 sm:px-6">{account.accountId}</td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 sm:px-6">{account.accountUserName}</td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 sm:px-6">{account.accountEmail}</td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 sm:px-6">{account.role}</td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium space-x-2 sm:px-6">
                        <button
                          onClick={() => handleEditAccount(account)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Edit2 className="w-5 h-5 inline" />
                        </button>
                        <button
                          onClick={() => handleDeleteAccount(account)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="w-5 h-5 inline" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {showModal && modalContent && (
          <Modal title={modalContent.title} onClose={() => setShowModal(false)}>
            {typeof modalContent.message === 'string' ? <p>{modalContent.message}</p> : modalContent.message}
          </Modal>
        )}

        {notification && (
          <div className={`mt-4 p-4 text-sm rounded-md ${notification.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
            {notification.message}
          </div>
        )}
      </main>
    </div>
  )
}