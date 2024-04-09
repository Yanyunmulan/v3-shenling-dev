import { request } from '@/utils/request'
/**
 * 车型管理
 */

/**
 * 添加车辆类型
 * @param {object} data
 */
export const postTruckTypeAPI = (data) => {
  return request('/truckType', 'POST', data)
}

/**
 * 获取车辆类型分页数据
 * @param {object} data
 */
export const getTruckTypePageAPI = (data) => {
  return request('/truckType/page', 'GET', data)
}

/**
 * 获取车辆类型信息列表
 */
export const getTruckTypeSimpleAPI = () => {
  return request('/truckType/simple')
}

/**
 * 获取车辆类型详情
 * @param {string} id
 */
export const getTruckTypeByIdAPI = (id) => {
  return request(`/truckType/${id}`)
}

/**
 * 更新车辆类型
 * @param {string} id
 * @param {object} data
 */
export const putTruckTypeByIdAPI = (id, data) => {
  return request(`/truckType/${id}`, 'PUT', data)
}

/**
 * 删除车辆类型
 * @param {string} id
 */
export const deleteTruckTypeByIdAPI = (id) => {
  return request(`/truckType/${id}`, 'DELETE')
}
