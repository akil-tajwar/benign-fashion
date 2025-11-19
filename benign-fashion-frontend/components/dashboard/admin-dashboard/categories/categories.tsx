'use client'

import type React from 'react'
import { useCallback, useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Plus } from 'lucide-react'
import type { CreateCategoryType, GetCategoryType } from '@/utils/type'
import { createCategory, fetchCategories } from '@/utils/api'
import { tokenAtom, useInitializeUser, userDataAtom } from '@/utils/user'
import { useAtom } from 'jotai'
import { useRouter } from 'next/navigation'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Popup } from '@/utils/popup'

const Categories = () => {
  useInitializeUser()
  const [userData] = useAtom(userDataAtom)
  const [token] = useAtom(tokenAtom)

  const router = useRouter()

  // State for dialog visibility
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isPopupOpen, setIsPopupOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // State for form data
  const [formData, setFormData] = useState<CreateCategoryType>({
    name: '',
    categoryType: 'men',
    isCategoryHead: false,
  })

  // State for table data
  const [categories, setCategories] = useState<GetCategoryType[]>([])

  const fetchCategoriesData = useCallback(async () => {
    if (!token) return
    setIsLoading(true)
    try {
      const response = await fetchCategories(token)
      console.log('🚀 ~ fetchCategories ~ response:', response)
      if (response?.error?.status === 401) {
        return
      } else {
        setCategories(response.data ?? [])
      }
    } catch (error) {
      console.error('Error fetching categories:', error)
    } finally {
      setIsLoading(false)
    }
  }, [token])

  // Fetch categories on component mount
  useEffect(() => {
    fetchCategoriesData()
  }, [fetchCategoriesData])

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target

    if (type === 'checkbox') {
      setFormData((prev) => ({
        ...prev,
        [name]: checked,
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }))
    }
  }

  const resetForm = useCallback(() => {
    setFormData({
      name: '',
      categoryType: 'men',
      isCategoryHead: false,
    })
    setIsPopupOpen(false)
  }, [])

  // Handle form submission
  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()

      try {
        const payload: CreateCategoryType = {
          name: formData.name,
          categoryType: formData.categoryType,
          isCategoryHead: formData.isCategoryHead,
        }

        await createCategory(token, payload)

        // Refresh the categories list
        fetchCategoriesData()

        // Reset form and close dialog
        resetForm()
      } catch (error) {
        console.error('Error creating category:', error)
      }
    },
    [formData, token, fetchCategoriesData, resetForm]
  )

  return (
    <div className="p-6 space-y-6">
      {/* Header with title and add button */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2 mb-4">
          <div className="bg-blue-400 p-2 rounded-md">
            <Plus className="bg-blue-400" />
          </div>
          <h2 className="text-lg font-semibold">Categories</h2>
        </div>
        <Button
          className="bg-blue-400 hover:bg-blue-500 text-black"
          onClick={() => setIsPopupOpen(true)}
        >
          Add Category
        </Button>
      </div>

      {/* Table for category data */}
      <div className="rounded-md border">
        <Table>
          <TableHeader className="bg-blue-100">
            <TableRow>
              <TableHead>Sl No</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Category Type</TableHead>
              <TableHead>Category Head</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-4">
                  Loading categories...
                </TableCell>
              </TableRow>
            ) : categories.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-4">
                  No categories found
                </TableCell>
              </TableRow>
            ) : (
              categories.map((category, index) => (
                <TableRow key={category.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{category.name}</TableCell>
                  <TableCell>{category.categoryType}</TableCell>
                  <TableCell>
                    {category.isCategoryHead ? (
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">
                        Yes
                      </span>
                    ) : (
                      <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm">
                        No
                      </span>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Dialog with form */}
      <Popup
        isOpen={isPopupOpen}
        onClose={resetForm}
        title="Add Category"
        size="sm:max-w-lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Category Name*</Label>
              <Input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter category name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="categoryType">Category Type</Label>
              <Select
                name="categoryType"
                value={formData.categoryType.toString()}
                onValueChange={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    categoryType: value as 'men' | 'kids',
                  }))
                }
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select an asset" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="men">Men</SelectItem>
                  <SelectItem value="kids">Kids</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <Checkbox
                id="isCategoryHead"
                name="isCategoryHead"
                checked={formData.isCategoryHead}
                onCheckedChange={(checked) =>
                  setFormData((prev) => ({
                    ...prev,
                    isCategoryHead: checked as boolean,
                  }))
                }
              />
              <Label htmlFor="isCategoryHead" className="cursor-pointer">
                Is Category Head
              </Label>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={resetForm}>
              Cancel
            </Button>
            <Button type="submit">Save Category</Button>
          </DialogFooter>
        </form>
      </Popup>
      {/* <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Category</DialogTitle>
            <DialogDescription>
              Create a new category for your system
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog> */}
    </div>
  )
}

export default Categories
