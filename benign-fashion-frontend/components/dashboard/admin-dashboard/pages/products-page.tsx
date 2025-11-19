'use client'

import React, { useCallback, useEffect, useState } from 'react'
import Image from 'next/image'
import { useAtom } from 'jotai'
import { GetCategory, GetProduct } from '@/utils/type'
import {
  createProduct,
  CreateProductForm,
  fetchProducts,
} from '@/api/product-api'
import { tokenAtom, useInitializeUser } from '@/utils/user'
import { fetchCategories } from '@/api/categories-api'

const ProductsPage = () => {
  useInitializeUser()
  const [token] = useAtom(tokenAtom)
  const [products, setProducts] = useState<GetProduct[]>([])
  const [categories, setCategories] = useState<GetCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState<CreateProductForm>({
    name: '',
    description: '',
    price: 0,
    stock: 0,
    categoryId: 0,
    isActive: true,
  })
  const [creating, setCreating] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [categoryError, setCategoryError] = useState<string | null>(null)
  const [preview, setPreview] = useState<string | null>(null)

  const [search, setSearch] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(5)

  // Fetch products
  const getProducts = useCallback(async () => {
    try {
      setLoading(true)
      const response = await fetchProducts(token)
      setProducts(response.data ?? [])
    } catch (err: any) {
      setError(err.message || 'Failed to fetch products')
    } finally {
      setLoading(false)
    }
  }, [token])

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
    getProducts()
    getCategories()
  }, [token, getProducts, getCategories])

  // Input changes
  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === 'price' || name === 'stock' || name === 'categoryId'
          ? Number(value)
          : value,
    }))
    if (name === 'categoryId' && Number(value) !== 0) {
      setCategoryError(null)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFormData((prev) => ({ ...prev, image: file }))
      setPreview(URL.createObjectURL(file))
    }
  }

  // Submit product
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!token) return

    // ✅ Category validation
    if (!formData.categoryId || formData.categoryId === 0) {
      setCategoryError('Category is required')
      return
    }

    try {
      setCreating(true)
      setFormError(null)
      await createProduct(token, formData)
      setShowForm(false)
      setPreview(null)
      setFormData({
        name: '',
        description: '',
        price: 0,
        stock: 0,
        categoryId: 0,
        isActive: true,
      })
      getProducts()
    } catch (err: any) {
      setFormError(err.message || 'Failed to create product')
    } finally {
      setCreating(false)
    }
  }

  if (loading) return <p>Loading products...</p>
  if (error) return <p className="text-red-500">{error}</p>

  // Filtered & paginated products
  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  )
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage)
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const getCategoryName = (id: number) => {
    const category = categories.find((c) => c.id === id)
    return category ? category.name : 'Unknown'
  }

  return (
    <section className="p-4">
      <div className="flex justify-between items-center mb-6 flex-wrap gap-2">
        <h1 className="text-2xl font-semibold">Manage Products</h1>
        <div className="flex gap-2 flex-wrap">
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setCurrentPage(1)
            }}
            className="border px-3 py-2 rounded"
          />
          <button
            onClick={() => setShowForm(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Add Product
          </button>
        </div>
      </div>

      {/* Products Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 border">No</th>
              <th className="px-4 py-2 border">Image</th>
              <th className="px-4 py-2 border">Name</th>
              <th className="px-4 py-2 border">Description</th>
              <th className="px-4 py-2 border">Price</th>
              <th className="px-4 py-2 border">Stock</th>
              <th className="px-4 py-2 border">Category</th>
            </tr>
          </thead>
          <tbody>
            {paginatedProducts.map((product, index) => (
              <tr key={product.id} className="text-center border-b">
                <td className="px-4 py-2 border">
                  {(currentPage - 1) * itemsPerPage + index + 1}
                </td>
                <td className="px-4 py-2 border">
                  <div className="w-20 h-20 relative mx-auto">
                    <Image
                      src={product.url}
                      alt={product.name}
                      fill
                      className="object-cover rounded"
                    />
                  </div>
                </td>
                <td className="px-4 py-2 border">{product.name}</td>
                <td className="px-4 py-2 border">{product.description}</td>
                <td className="px-4 py-2 border">
                  ৳{product.price.toFixed(2)}
                </td>
                <td className="px-4 py-2 border">{product.stock}</td>
                <td className="px-4 py-2 border">
                  {getCategoryName(product.categoryId)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4 flex-wrap gap-2">
        <div>
          <label>
            Items per page:{' '}
            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value))
                setCurrentPage(1)
              }}
              className="border px-2 py-1 rounded"
            >
              {[5, 10, 20, 50].map((num) => (
                <option key={num} value={num}>
                  {num}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Prev
          </button>
          <span className="px-3 py-1 border rounded">
            {currentPage} / {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>

      {/* Popup Form */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded w-full max-w-md relative h-[95vh] overflow-y-auto">
            <button
              onClick={() => setShowForm(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
            <h2 className="text-xl font-semibold mb-4">Create Product</h2>
            {formError && <p className="text-red-500 mb-2">{formError}</p>}
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label htmlFor="name" className="block mb-1 font-medium">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full border px-3 py-2 rounded"
                />
              </div>

              <div>
                <label htmlFor="description" className="block mb-1 font-medium">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  className="w-full border px-3 py-2 rounded"
                />
              </div>

              <div>
                <label htmlFor="price" className="block mb-1 font-medium">
                  Price
                </label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  required
                  className="w-full border px-3 py-2 rounded"
                />
              </div>

              <div>
                <label htmlFor="stock" className="block mb-1 font-medium">
                  Stock
                </label>
                <input
                  type="number"
                  id="stock"
                  name="stock"
                  value={formData.stock}
                  onChange={handleInputChange}
                  required
                  className="w-full border px-3 py-2 rounded"
                />
              </div>

              <div>
                <label htmlFor="categoryId" className="block mb-1 font-medium">
                  Category
                </label>
                <select
                  id="categoryId"
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleInputChange}
                  required
                  className={`w-full border px-3 py-2 rounded ${
                    categoryError ? 'border-red-500' : ''
                  }`}
                >
                  <option value={0}>Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
                {categoryError && (
                  <p className="text-red-500 text-sm mt-1">{categoryError}</p>
                )}
              </div>

              <div>
                <label htmlFor="image" className="block mb-1 font-medium">
                  Product Image
                </label>
                <input
                  type="file"
                  id="image"
                  accept="image/*"
                  onChange={handleFileChange}
                  required
                  className="w-full border px-3 py-2 rounded"
                />
              </div>

              {preview && (
                <div className="w-32 h-32 relative mt-2">
                  <Image
                    src={preview}
                    alt="Preview"
                    fill
                    className="object-cover rounded"
                  />
                </div>
              )}

              <div className="flex justify-end gap-2 mt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false)
                    setPreview(null)
                    setCategoryError(null)
                  }}
                  className="px-4 py-2 border rounded hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  {creating ? 'Creating...' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  )
}

export default ProductsPage
