'use client'

import { useState, useEffect, useRef } from 'react'
import { useSession } from 'next-auth/react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { LayoutGrid, Users, ShoppingCart, BarChart, Menu, Search, Bell, User, Edit2, Plus, Edit, Trash2, X } from 'lucide-react'

const initialAccounts = []

export default function AccountManagement() {
  const [accounts, setAccounts] = useState(initialAccounts)
  const [newAccount, setNewAccount] = useState({ accountId: '', userName: '', email: '', role: '', password: '' })
  const [editingAccount, setEditingAccount] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [modalContent, setModalContent] = useState(null)
  const [notification, setNotification] = useState(null)
  const [validationErrors, setValidationErrors] = useState({})
  const inputRef = useRef(null)

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null)
      }, 5000)

      return () => clearTimeout(timer)
    }
  }, [notification])

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
              <Label htmlFor="edit-user-name">User Name</Label>
              <Input
                ref={inputRef}
                type="text"
                id="edit-user-name"
                defaultValue={editingAccount.accountUserName}
                onBlur={(e) =>
                  setEditingAccount((prev) => ({
                    ...prev,
                    accountUserName: e.target.value,
                  }))
                }
              />
            </div>
            <div>
              <Label htmlFor="edit-email">Email</Label>
              <Input
                type="email"
                id="edit-email"
                defaultValue={editingAccount.accountEmail}
                onBlur={(e) =>
                  setEditingAccount((prev) => ({
                    ...prev,
                    accountEmail: e.target.value,
                  }))
                }
              />
            </div>
            {editingAccount.role !== 'Admin' && (
              <div>
                <Label htmlFor="edit-role">Role</Label>
                <select
                  id="edit-role"
                  defaultValue={editingAccount.role}
                  onBlur={(e) =>
                    setEditingAccount((prev) => ({
                      ...prev,
                      role: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 text-gray-700 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select a role</option>
                  <option value="Admin">Admin</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Sales">Sales</option>
                </select>
              </div>
            )}
            <div>
              <Label htmlFor="edit-password">Set Password</Label>
              <Input
                type="password"
                id="edit-password"
                defaultValue={editingAccount.password || ''}
                onBlur={(e) =>
                  setEditingAccount((prev) => ({
                    ...prev,
                    password: e.target.value,
                  }))
                }
                placeholder="Leave blank to keep current password"
              />
            </div>
          </form>
        ),
        action: handleUpdateAccount,
      });
      setShowModal(true);
    }
  }, [editingAccount]);

  const handleCreateAccount = async (e) => {
    e.preventDefault()
    const errors = {}
    if (!newAccount.accountId) errors.accountId = 'Account ID is required'
    if (!newAccount.userName) errors.userName = 'User Name is required'
    if (!newAccount.email) errors.email = 'Email is required'
    if (!newAccount.role) errors.role = 'Role is required'
    if (!newAccount.password) errors.password = 'Password is required'

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors)
      return
    }

    setValidationErrors({})
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
              password: newAccount.password,
              accountEmail: newAccount.email,
              role: newAccount.role,
            }),
          })
          if (response.ok) {
            const createdAccount = await response.json()
            setAccounts((prevAccounts) => [...prevAccounts, createdAccount])
            setNewAccount({ accountId: '', userName: '', email: '', role: '', password: '' })
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

  const handleEditAccount = (account) => {
    setEditingAccount({ ...account, password: '' })
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

  const { data: session, status } = useSession()

  if (status === 'loading') {
    return <div>Loading...</div>
  }

  if (!session) {
    window.location.href = '/'
    return null
  }

  const Modal = ({ title, onClose, children }) => (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-auto bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">{title}</h2>
        <div>{children}</div>
        <div className="flex justify-end space-x-4 mt-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={modalContent.action}>
            Confirm
          </Button>
        </div>
      </div>
    </div>
  )

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <main className="flex-1 overflow-y-auto p-4 sm:p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="p-4 sm:p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Create New Account</h2>
              <form onSubmit={handleCreateAccount} className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="account-id">Account ID</Label>
                    <Input
                      type="text"
                      id="account-id"
                      value={newAccount.accountId}
                      onChange={(e) => setNewAccount({ ...newAccount, accountId: e.target.value })}
                    />
                    {validationErrors.accountId && <p className="text-red-500 text-sm mt-1">{validationErrors.accountId}</p>}
                  </div>
                  <div>
                    <Label htmlFor="user-name">User Name</Label>
                    <Input
                      type="text"
                      id="user-name"
                      value={newAccount.userName}
                      onChange={(e) => setNewAccount({ ...newAccount, userName: e.target.value })}
                    />
                    {validationErrors.userName && <p className="text-red-500 text-sm mt-1">{validationErrors.userName}</p>}
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      type="email"
                      id="email"
                      value={newAccount.email}
                      onChange={(e) => setNewAccount({ ...newAccount, email: e.target.value })}
                    />
                    {validationErrors.email && <p className="text-red-500 text-sm mt-1">{validationErrors.email}</p>}
                  </div>
                  <div>
                    <Label htmlFor="role">Role</Label>
                    <select
                      id="role"
                      value={newAccount.role}
                      onChange={(e) => setNewAccount({ ...newAccount, role: e.target.value })}
                      className="w-full px-3 py-2 text-gray-700 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select a role</option>
                      <option value="Admin">Admin</option>
                      <option value="Marketing">Marketing</option>
                      <option value="Sales">Sales</option>
                    </select>
                    {validationErrors.role && <p className="text-red-500 text-sm mt-1">{validationErrors.role}</p>}
                  </div>
                  <div>
                    <Label htmlFor="password">Password</Label>
                    <Input
                      type="password"
                      id="password"
                      value={newAccount.password}
                      onChange={(e) => setNewAccount({ ...newAccount, password: e.target.value })}
                    />
                    {validationErrors.password && <p className="text-red-500 text-sm mt-1">{validationErrors.password}</p>}
                  </div>
                </div>
                <Button className="bg-gray-700 hover:bg-gray-500" type="submit">
                  <Plus className="mr-2" /> Create Account
                </Button>
              </form>
            </div>

            <div className="overflow-x-auto border-t border-gray-200">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sm:px-6">Account ID</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sm:px-6">User Name</th>
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
                      {(account.role !== 'Admin' || account.accountId === session.account.accountId) && (
                        <>
                          <Button variant="ghost" size="sm" onClick={() => handleEditAccount(account)}>
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          {account.role !== 'Admin' && (
                            <Button variant="ghost" size="sm" onClick={() => handleDeleteAccount(account)}>
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </>
                      )}
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
          <div className={`fixed bottom-4 right-4 mt-4 p-4 text-sm rounded-md ${
            notification.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
          }`}>
            {notification.message}
          </div>
        )}
      </main>
    </div>
  )
}