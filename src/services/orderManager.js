import { request } from '@/utils/request'
/**
 * 货品管理 + 订单管理
 */

/**
 * 获取货物列表
 * @param {object} params
 */
export const getOrderManagerCargoAPI = (params) => {
  return request('/order-manager/cargo', 'GET', params)
}

/**
 * 添加货物
 * @param {object} data
 */
export const postOrderManagerCargoAPI = (data) => {
  return request('/order-manager/cargo', 'POST', data)
}

/**
 * 更新货物信息
 * @param {string} id 货物id
 * @param {object} data
 */
export const putOrderManagerCargoAPI = (id, data) => {
  return request(`/order-manager/cargo/${id}`, 'PUT', data)
}

/**
 * 删除货物
 * @param {string} id 货物id
 */
export const deleteOrderManagerCargoAPI = (id) => {
  return request(`/order-manager/cargo/${id}`, 'DELETE')
}

/**
 * 获取订单分页数据
 * @param {object} data
 */
export const postOrderManagerOrderPageAPI = (data) => {
  return request('/order-manager/order/page', 'POST', data)
}

/**
 * 获取订单详情
 * @param {string} id 订单ID
 */
export const getOrderManagerOrderByIdAPI = (id) => {
  return request(`/order-manager/order/${id}`)
}

/**
 * 更新订单
 * @param {string} id 订单ID
 * @param {object} data
 */
export const putOrderManagerOrderByIdAPI = (id, data) => {
  return request(`/order-manager/order/${id}`, 'PUT', data)
}
