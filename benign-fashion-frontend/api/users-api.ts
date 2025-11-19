import { fetchApi } from '@/utils/http'
import { Users } from '@/utils/type'

// ✅ Function to fetch all users
export async function getUsers(token: string) {
  return fetchApi<Users[]>({
    url: 'api/auth/users',
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `${token}`,
    },
  })
}

// ✅ Function to fetch a user by userId
export async function getUserByIdApi(token: string, userId: number) {
  return fetchApi<Users>({
    url: `api/auth/users-by-userId/${userId}`, // API endpoint
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `${token}`,
    },
  })
}

// ✅ Update User by userId
export async function updateUserApi(
  token: string,
  userId: number,
  data: Partial<any> // allow partial updates
) 
{
  return fetchApi<Users>({
    url: `api/auth/users/${userId}`, // endpoint
    method: 'PUT', // update method
    headers: {
      'Content-Type': 'application/json',
      Authorization: `${token}`,
    },
    body: data, // send updated fields
  })
}
