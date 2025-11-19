


// 'use client'

// import React, { useCallback, useEffect, useState } from 'react'
// import { useAtom } from 'jotai'
// import { tokenAtom, useInitializeUser } from '@/utils/user'
// import { deleteCategory, fetchCategories, updateCategory } from '@/api/categories-api'
// import { GetCategory } from '@/utils/type'

// const CategoriesPage = () => {
//   useInitializeUser()
//   const [token] = useAtom(tokenAtom)
//   const [categories, setCategories] = useState<GetCategory[]>([])
//   const [loading, setLoading] = useState(false)

//   const [editingCategory, setEditingCategory] = useState<GetCategory | null>(null)
//   const [editName, setEditName] = useState('')

//   const getCategories = useCallback(async () => {
//     try {
//       setLoading(true)
//       const response = await fetchCategories(token)
//       setCategories(response.data ?? [])
//     } catch (err: any) {
//       console.error(err)
//     } finally {
//       setLoading(false)
//     }
//   }, [token])

//   useEffect(() => {
//     getCategories()
//   }, [getCategories])

//   const handleEditClick = (category: GetCategory) => {
//     setEditingCategory(category)
//     setEditName(category.name)
//   }

//   const handleUpdateCategory = async () => {
//     if (!editingCategory) return

//     try {
//       setLoading(true)
//       await updateCategory(token, editingCategory.id, { name: editName })
//       setEditingCategory(null)
//       setEditName('')
//       getCategories()
//     } catch (err) {
//       console.error('Error updating category:', err)
//     } finally {
//       setLoading(false)
//     }
//   }

//   const handleDeleteCategory = async (categoryId: number) => {
//     if (!confirm('Are you sure you want to delete this category?')) return

//     try {
//       setLoading(true)
//       await deleteCategory(token, categoryId)
//       getCategories()
//     } catch (err) {
//       console.error(err)
//     } finally {
//       setLoading(false)
//     }
//   }

//   return (
//     <section className="p-6">
//       <h1 className="text-2xl font-semibold mb-6">Manage Categories</h1>
//       <div className="bg-white rounded-lg shadow p-6">
//         <p className="mb-4 text-gray-600">Add, edit, or delete product categories.</p>

//         {loading ? (
//           <p className="text-gray-500">Loading categories...</p>
//         ) : categories.length === 0 ? (
//           <p className="text-gray-500">No categories found.</p>
//         ) : (
//           <div className="overflow-x-auto">
//             <table className="min-w-full border border-gray-200 divide-y divide-gray-200">
//               <thead className="bg-gray-100">
//                 <tr>
//                   <th className="px-6 py-3 text-left text-gray-700 font-medium uppercase text-sm">
//                     ID
//                   </th>
//                   <th className="px-6 py-3 text-left text-gray-700 font-medium uppercase text-sm">
//                     Name
//                   </th>
//                   <th className="px-6 py-3 text-right text-gray-700 font-medium uppercase text-sm">
//                     Actions
//                   </th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {categories.map((category) => (
//                   <tr key={category.id} className="hover:bg-gray-50 transition">
//                     <td className="px-6 py-4 text-gray-700">{category.id}</td>
//                     <td className="px-6 py-4 text-gray-800 font-medium">{category.name}</td>
//                     <td className="px-6 py-4 text-right space-x-2">
//                       <button
//                         className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
//                         onClick={() => handleEditClick(category)}
//                       >
//                         Edit
//                       </button>
//                       <button
//                         className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
//                         onClick={() => handleDeleteCategory(category.id)}
//                       >
//                         Delete
//                       </button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>

//       {/* Edit Modal */}
//       {editingCategory && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
//           <div className="bg-white p-6 rounded w-full max-w-md relative shadow-lg">
//             <h2 className="text-xl font-semibold mb-4">Edit Category</h2>
//             <input
//               type="text"
//               className="w-full p-3 border rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
//               value={editName}
//               onChange={(e) => setEditName(e.target.value)}
//             />
//             <div className="flex justify-end space-x-3">
//               <button
//                 className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition"
//                 onClick={() => setEditingCategory(null)}
//               >
//                 Cancel
//               </button>
//               <button
//                 className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
//                 onClick={handleUpdateCategory}
//               >
//                 Save
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </section>
//   )
// }

// export default CategoriesPage


'use client'

import React, { useCallback, useEffect, useState } from 'react'
import { useAtom } from 'jotai'
import { tokenAtom, useInitializeUser } from '@/utils/user'
import {
  deleteCategory,
  fetchCategories,
  updateCategory,
} from '@/api/categories-api'
import { GetCategory } from '@/utils/type'

// New API for creating category
import { createCategory } from '@/api/categories-api'

const CategoriesPage = () => {
  useInitializeUser()
  const [token] = useAtom(tokenAtom)
  const [categories, setCategories] = useState<GetCategory[]>([])
  const [loading, setLoading] = useState(false)

  // Edit modal state
  const [editingCategory, setEditingCategory] = useState<GetCategory | null>(null)
  const [editName, setEditName] = useState('')

  // Create category state
  const [newCategoryName, setNewCategoryName] = useState('')
  const [creating, setCreating] = useState(false)

  // Fetch categories
  const getCategories = useCallback(async () => {
    try {
      setLoading(true)
      const response = await fetchCategories(token)
      setCategories(response.data ?? [])
    } catch (err: any) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [token])

  useEffect(() => {
    getCategories()
  }, [getCategories])

  // Create category
  const handleCreateCategory = async () => {
    if (!newCategoryName.trim()) return alert('Category name is required!')

    try {
      setCreating(true)
      await createCategory(token, { name: newCategoryName })
      setNewCategoryName('')
      getCategories() // refresh list
    } catch (err) {
      console.error('Error creating category:', err)
    } finally {
      setCreating(false)
    }
  }

  // Edit handlers
  const handleEditClick = (category: GetCategory) => {
    setEditingCategory(category)
    setEditName(category.name)
  }

  const handleUpdateCategory = async () => {
    if (!editingCategory) return
    try {
      setLoading(true)
      await updateCategory(token, editingCategory.id, { name: editName })
      setEditingCategory(null)
      setEditName('')
      getCategories()
    } catch (err) {
      console.error('Error updating category:', err)
    } finally {
      setLoading(false)
    }
  }

  // Delete handler
  const handleDeleteCategory = async (categoryId: number) => {
    if (!confirm('Are you sure you want to delete this category?')) return
    try {
      setLoading(true)
      await deleteCategory(token, categoryId)
      getCategories()
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="p-6">
      <h1 className="text-2xl font-semibold mb-6">Manage Categories</h1>

      {/* Create Category */}
      <div className="bg-white rounded-lg shadow p-6 mb-6 flex items-center space-x-3">
        <input
          type="text"
          className="flex-1 p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="New category name"
          value={newCategoryName}
          onChange={(e) => setNewCategoryName(e.target.value)}
        />
        <button
          className="px-6 py-3 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
          onClick={handleCreateCategory}
          disabled={creating}
        >
          {creating ? 'Creating...' : 'Add Category'}
        </button>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <p className="mb-4 text-gray-600">Edit or delete existing categories.</p>

        {loading ? (
          <p className="text-gray-500">Loading categories...</p>
        ) : categories.length === 0 ? (
          <p className="text-gray-500">No categories found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-200 divide-y divide-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-gray-700 font-medium uppercase text-sm">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-gray-700 font-medium uppercase text-sm">
                    Name
                  </th>
                  <th className="px-6 py-3 text-right text-gray-700 font-medium uppercase text-sm">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {categories.map((category) => (
                  <tr key={category.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 text-gray-700">{category.id}</td>
                    <td className="px-6 py-4 text-gray-800 font-medium">{category.name}</td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                        onClick={() => handleEditClick(category)}
                      >
                        Edit
                      </button>
                      <button
                        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
                        onClick={() => handleDeleteCategory(category.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {editingCategory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded w-full max-w-md relative shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Edit Category</h2>
            <input
              type="text"
              className="w-full p-3 border rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
            />
            <div className="flex justify-end space-x-3">
              <button
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition"
                onClick={() => setEditingCategory(null)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                onClick={handleUpdateCategory}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

export default CategoriesPage
