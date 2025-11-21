import { fetchApi } from '@/utils/http'
import { CreateCategoryType, GetCategoryType } from '@/utils/type'

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
  categoryId: number,
  data: Partial<GetCategoryType>
) {
  return fetchApi<GetCategoryType>({
    url: `api/categories/update/${categoryId}`,
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `${token}`,
    },
    body: data,
  })
}
