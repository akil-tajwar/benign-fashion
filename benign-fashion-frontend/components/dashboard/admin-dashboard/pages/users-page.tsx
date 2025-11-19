'use client'

import React, { useCallback, useEffect, useState } from 'react'
import { getUsers } from '@/api/users-api'
import { Users } from '@/utils/type'


interface UsersPageProps {
  token: string
}

const UsersPage: React.FC<UsersPageProps> = ({ token }) => {
  const [users, setUsers] = useState<Users[]>([])
  const [filteredUsers, setFilteredUsers] = useState<Users[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const rowsPerPage = 7


   // ✅ useCallback function for fetching users
  const fetchUsers = useCallback(async () => {
    try {
      const res = await getUsers(token)
      setUsers(res.data || [])
      setFilteredUsers(res.data || [])
      console.log(res.data || [])
    } catch (error) {
      console.error('Failed to fetch users:', error)
    } finally {
      setLoading(false)
    }
  }, [token]) // only re-created when token changes

  // ✅ call useCallback inside useEffect
  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  // Handle search
  useEffect(() => {
    const term = searchTerm.toLowerCase()
    const filtered = users.filter(
      (u) =>
        u.username.toLowerCase().includes(term) ||
        (u.fullName?.toLowerCase().includes(term) ?? false) ||
        (u.roleName?.toLowerCase().includes(term) ?? false) ||
        u.email.toLowerCase().includes(term)
    )
    setFilteredUsers(filtered)
    setCurrentPage(1) // reset to first page on search
  }, [searchTerm, users])

  // Pagination calculations
  const totalPages = Math.ceil(filteredUsers.length / rowsPerPage)
  const startIndex = (currentPage - 1) * rowsPerPage
  const currentUsers = filteredUsers.slice(startIndex, startIndex + rowsPerPage)

  return (
    <section className="p-6">
      <h1 className="text-3xl font-semibold mb-6 text-gray-800">
        👥 Manage Users
      </h1>

      {/* Search Bar */}
      <div className="mb-4 flex justify-end">
        <input
          type="text"
          placeholder="Search users..."
          className="border rounded-lg p-2 w-full md:w-1/3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="bg-white shadow-lg rounded-2xl overflow-hidden">
        {loading ? (
          <div className="p-6 text-center text-gray-500">Loading users...</div>
        ) : currentUsers.length === 0 ? (
          <div className="p-6 text-center text-gray-500">No users found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead className="bg-gray-100 text-gray-700 uppercase text-sm">
                <tr>
                  <th className="p-4 text-left">User</th>
                  <th className="p-4 text-left">Email</th>
                  <th className="p-4 text-left">Mobile</th>
                  <th className="p-4 text-left">Address</th>

                  <th className="p-4 text-left">Role</th>
                  <th className="p-4 text-left">Status</th>
                  <th className="p-4 text-left">Join Date</th>
                </tr>
              </thead>
              <tbody>
                {currentUsers.map((user, index) => (
                  <tr
                    key={user.userId}
                    className={`hover:bg-gray-50 ${
                      index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
                    }`}
                  >
                    <td className="p-4 flex items-center gap-3">
                      <div>
                        <p className="font-medium text-gray-800 capitalize">
                          {user.fullName || user.username}
                        </p>
                        <p className="text-sm text-gray-500">
                          @{user.username}
                        </p>
                      </div>
                    </td>
                    <td className="p-4 text-gray-700">{user.email}</td>
                    <td className="p-4 text-gray-700">{user.phone}</td>
                    <td className="p-4 text-gray-700">{user.street} {user.state} {user.city} {user.country}</td>
                    <td className="p-4">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          user.roleName?.toLowerCase() === 'admin'
                            ? 'bg-blue-100 text-blue-700'
                            : user.roleName?.toLowerCase() === 'user'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {user.roleName || 'User'}
                      </span>
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-3 py-1 text-sm font-semibold rounded-full ${
                          user.active
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {user.active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="p-4 text-gray-600 text-sm">
                      {user.createdAt
                        ? new Date(user.createdAt).toLocaleDateString()
                        : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 p-4 border-t">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 rounded border bg-white hover:bg-gray-100 disabled:opacity-50"
            >
              Prev
            </button>
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-3 py-1 rounded border hover:bg-indigo-100 ${
                  currentPage === i + 1 ? 'bg-indigo-500 text-white' : 'bg-white'
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 rounded border bg-white hover:bg-gray-100 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </section>
  )
}

export default UsersPage
