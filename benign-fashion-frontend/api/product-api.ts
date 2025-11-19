
import { fetchApi } from "@/utils/http"
import {  GetProduct } from "@/utils/type"


export async function fetchApiCreate<T>({
  url,
  method,
  headers = {},
  body,
}: {
  url: string
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  headers?: HeadersInit
  body?: any
}): Promise<T> {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL 
  const isFormData = body instanceof FormData

  const finalHeaders = isFormData
    ? headers // Do NOT set Content-Type for FormData
    : { "Content-Type": "application/json", ...headers }

  const response = await fetch(`${baseUrl}/${url}`, {
    method,
    headers: finalHeaders,
    body: isFormData ? body : JSON.stringify(body),
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(errorText || "Request failed")
  }

  return response.json()
}



export type CreateProductForm = {
  name: string
  description: string
  price: number
  stock: number
  categoryId: number
  isActive: boolean
  image?: File
}

export async function createProduct(token: string, product: CreateProductForm) {
  const formData = new FormData()
  formData.append("name", product.name)
  formData.append("description", product.description)
  formData.append("price", String(product.price))
  formData.append("stock", String(product.stock))
  formData.append("categoryId", String(product.categoryId))
  formData.append("isActive", String(product.isActive))
  if (product.image) {
    formData.append("image", product.image)
  }

  return fetchApiCreate({
    url: "api/products/create",
    method: "POST",
    headers: { Authorization: `${token}` },
    body: formData,
  })
}



//get all products api
export async function fetchProducts(token: string) {
  return fetchApi<GetProduct[]>({
    url: "api/products/get",
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `${token}`,
    },
  })
}
