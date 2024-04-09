import axios from 'axios'
import Cookies from 'js-cookie'
import { message } from 'ant-design-vue'
import { useAccountStore } from '@/stores/modules/account'

import router from '@/router'
// import whiteApiList from './whiteApi'

export const baseURL = import.meta.env.VITE_APP_BASE_URL

// 创建 axios 实例
// https://axios-http.com/zh/docs/instance
const instance = axios.create({
  // https://cn.vitejs.dev/guide/env-and-mode.html
  baseURL,
  timeout: 30 * 1000, // timeout
})

console.log(import.meta.env.MODE, '环境')

// axios 拦截器
// https://axios-http.com/zh/docs/interceptors
instance.interceptors.request.use(
  (config) => {
    const { token } = useAccountStore()
    if (token) {
      config.headers['Authorization'] = Cookies.get('TOKEN')
    }
    return config
  },
  (error) => {
    // 对请求错误做些什么
    return Promise.reject(error)
  },
)

instance.interceptors.response.use(
  (response) => {
    // 提取响应数据
    const data = response.data
    // 如果是下载文件(图片等)，直接返回数据
    if (data instanceof ArrayBuffer) {
      return data
    }
    // code 为非 200 是抛错 可结合自己业务进行修改
    const { code, msg } = data
    if (code !== 200) {
      message.error(msg)
      return Promise.reject(msg)
    }
    // 响应数据
    return data
  },
  (error) => {
    const response = error.response
    const status = response && response.status
    // 和后端约定的3种状态码会跳转登录????
    if ([400, 401, 403].includes(status)) {
      if (status === 400) {
        // message.warning('权限不足')
        // 根据后端返回的错误信息，做出相应的提示
        message.warning(response.data?.msg)
        return Promise.reject(error)
      } else if (status === 401) {
        message.warning('登录状态过期')
      }
      const { setToken } = useAccountStore()
      setToken({ token: null })
      router.push('/login')
      return Promise.reject(error)
    } else {
      return Promise.reject(error)
    }
  },
)

// 封装请求
export const request = (url, method = 'get', data, type) => {
  return instance({
    url,
    method,
    [method.toUpperCase() === 'GET' ? 'params' : 'data']: data,
    responseType: type,
  })
}
