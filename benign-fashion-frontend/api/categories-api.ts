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
    body: data, // Pass object directly
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
  data: Partial<GetCategory>
) {
  console.log('Calling updateCategory API', categoryId, data)
  return fetchApi<GetCategory>({
    url: `api/categories/update/${categoryId}`,
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `${token}`,
    },
    body: data, // <-- pass object directly, do NOT stringify
  })
}




export async function deleteCategory(token: string, categoryId: number) {
  return fetchApi({
    url: `api/categories/delete/${categoryId}`,
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
}
