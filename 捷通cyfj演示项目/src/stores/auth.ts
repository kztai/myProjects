import { ref, nextTick } from 'vue'
import { useRouter } from 'vue-router/composables'
import { defineStore } from 'pinia'
import { loginApi } from '@/apis/auth'
import type { ILoginReq, IUser } from '@/apis/auth/type'
import { setAccessToken } from '@/utils/auth'

export const useAuth = defineStore('auth', () => {
  const user = ref<IUser>()
  const router = useRouter()

  const login = async(params: ILoginReq) => {
    loginApi(params).then(res => {
      user.value = res
      setAccessToken(res.token, 1)
      router.replace('/dashboard')
    })
  }

  const logout = async() => {
    // TODO:
    router.replace('/login')
    nextTick(() => {
      user.value = undefined
    })
  }

  return {
    user,
    login,
    logout,
  }
})
