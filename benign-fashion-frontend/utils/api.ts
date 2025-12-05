import { fetchApi, fetchApiWithFile } from '@/utils/http'
import { CreateCategoryType, CreateProductType, GetCategoryType, GetProductType } from '@/utils/type'

// Create a new category
export async function createCategory(token: string, data: CreateCategoryType) {
  return fetchApi<CreateCategoryType>({
    url: 'api/categories/create',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `${token}`,
    },
    body: data,
  })
}

//get all Categories api
export async function fetchCategories(token: string) {
  return fetchApi<GetCategoryType[]>({
    url: 'api/categories/get',
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `${token}`,
    },
  })
}

// Update Category API
export async function updateCategory(
  token: string,
  id: number,
  data: Partial<GetCategoryType>
) {
  return fetchApi<GetCategoryType>({
    url: `api/categories/update/${id}`,
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `${token}`,
    },
    body: data,
  })
}

// Create a new product
export async function createProduct(token: string, formData: FormData) {
  return fetchApiWithFile<CreateProductType>({
    url: 'api/products/create',
    method: 'POST',
    headers: {
      Authorization: `${token}`,
    },
    body: formData, // Pass FormData directly
  })
}

//get all products api
export async function fetchProducts(token: string) {
  return fetchApi<GetProductType[]>({
    url: 'api/products/get',
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `${token}`,
    },
  })
}

// Update product API
export async function updateProduct(token: string, id: number, formData: FormData) {
  return fetchApiWithFile<CreateProductType>({
    url: `api/products/update/${id}`,
    method: 'PUT',
    headers: {
      Authorization: `${token}`,
    },
    body: formData,
  })
}

//get product by id api
export async function fetchProductById(token: string, id: number) {
  return fetchApi<GetProductType>({
    url: `api/products/get/${id}`,
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `${token}`,
    },
  })
}