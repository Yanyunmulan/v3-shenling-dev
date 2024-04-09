import { request } from '@/utils/request'
/**
 * 司机管理
 */

/**
 * 获取司机分页数据
 * @param {object} params
 */
export const getDriverPageAPI = (params) => {
  return request('/driver/page', 'GET', params)
}

/**
 * 司机安排车辆
 * @param {object} data
 */
export const postDriverTruckDriversAPI = (data) => {
  return request('/driver/truckDrivers', 'POST', data)
}

/**
 * 获取司机基本信息详情
 * @param {string} id 司机id
 */
export const getDriverByIdAPI = (id) => {
  return request(`/driver/${id}`)
}

/**
 * 保存司机信息
 * @param {string} id 司机id
 */
export const putDriverByIdAPI = (id, data) => {
  return request(`/driver/${id}`, 'PUT', data)
}

/**
 * 保存司机驾驶证信息
 * @param {object} data
 */
export const postDriverLicenseAPI = (data) => {
  return request('/driverLicense', 'POST', data)
}

/**
 * 获取司机驾驶证信息
 * @param {string} id 司机id
 */
export const getDriverLicenseByIdAPI = (id) => {
  return request(`/driverLicense/${id}`)
}
