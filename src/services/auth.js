import { request } from '@/utils/request'
/**
 * 鉴权服务
 */

/**
 * 验证码-登录的验证码
 * @param {string} key
 */
export const getCaptchaAPI = (key) => {
  return request(`/captcha`, 'GET', { key }, 'arraybuffer')
}

/**
 * 登录
 * @param {object} data
 */
export const postLoginAPI = (data) => {
  return request(`/login`, 'POST', data)
}

/**
 * 查询用户可用的所有菜单
 */
export const getMenusAPI = () => {
  return request(`/menus`)
}

/**
 * 获取权限路由 - Mock
 * @param {*} data
 */
export const getRouterAPI = (data) => {
  return request(location.origin + `/api/getPermission`, 'GET', data)
}
