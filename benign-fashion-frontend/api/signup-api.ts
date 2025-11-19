import { fetchApi } from '@/utils/http'
import { RegisterRequest, RegisterResponse } from '@/utils/type'

// ✅ Function to call the register API
export async function registerUser(credentials: RegisterRequest) {
  return fetchApi<RegisterResponse>({
    url: 'api/auth/register',
    method: 'POST',
    body: credentials,
    headers: {
      'Content-Type': 'application/json',
    },
  })
}
