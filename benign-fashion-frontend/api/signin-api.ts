import { fetchApi } from '@/utils/http'
import { SignInRequest, SignInResponse } from '@/utils/type'



// ✅ Function to call the login API
export async function signIn(credentials: SignInRequest ) {
  return fetchApi<SignInResponse
  >({
    url: 'api/auth/login',
    method: 'POST',
    body: credentials,
    headers: {
      'Content-Type': 'application/json',
     
    },
  })
}
