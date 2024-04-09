import { defineStore } from 'pinia'
import Cookies from 'js-cookie'
import { ref } from 'vue'

export const useAccountStore = defineStore(
  'account',
  () => {
    // state
    const token = ref(Cookies.get('TOKEN'))
    const tokenExpire = ref(Cookies.get('TOKEN_EXPIRE', 0))
    const user = ref({})
    const role = ref('admin')

    const setToken = (payload) => {
      token.value = payload.token
      tokenExpire.value = payload.expire
      Cookies.set('TOKEN', payload.token)
      Cookies.set('TOKEN_EXPIRE', payload.expire)
    }

    const setUser = (payload) => {
      user.value = payload
    }

    const logout = () => {
      setToken({})
      setUser({})
    }

    // return
    return {
      token,
      tokenExpire,
      setToken,
      user,
      setUser,
      logout,
      role,
    }
  },
  {
    persist: true,
  },
)
