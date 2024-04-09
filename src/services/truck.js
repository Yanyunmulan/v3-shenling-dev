import { request } from '@/utils/request'
/**
 * 车辆管理
 */

/**
 * 获取绑定司机
 * @param {string} truckId 车辆id
 */
export const getBindingDriversAPI = (truckId) => {
  return request(`/bindingDrivers/${truckId}`)
}

/**
 * 统计车辆
 */
export const getTruckCountAPI = () => {
  return request('/count')
}

/**
 * 删除车辆
 * @param {string} id 车辆id
 */
export const deleteTruckByIdAPI = (id) => {
  return request(`/del/${id}`, 'DELETE')
}

/**
 * 停用车辆
 * @param {string} id 车辆id
 */
export const putTruckDisableByIdAPI = (id) => {
  return request(`/disable/${id}`, 'PUT')
}

/**
 * 启用车辆
 * @description 车辆启用需满足以下条件：
 * @description 1. 车辆信息(包括基本信息和行驶证信息)已完善,
 * @description 2. 绑定司机>=2, 且有排班
 * @param {string} id 车辆id
 */
export const putTruckEnableByIdAPI = (id) => {
  return request(`/enable/${id}`, 'PUT')
}

/**
 * 添加车辆
 * @param {object} data
 */
export const postTruckAPI = (data) => {
  return request('/truck', 'POST', data)
}

/**
 * 获取车辆分页数据
 * @param {object} data
 */
export const getTruckPageAPI = (data) => {
  return request('/truck/page', 'GET', data)
}

/**
 * 车辆绑定司机
 * @param {object} data
 */
export const postTruckDriversAPI = (data) => {
  return request('/truck/truckDrivers', 'POST', data)
}

/**
 * 获取车辆详情
 * @param {string} id
 */
export const getTruckByIdAPI = (id) => {
  return request(`/truck/${id}`)
}

/**
 * 更新车辆信息
 * @param {string} id
 */
export const putTruckByIdAPI = (id, data) => {
  return request(`/truck/${id}`, 'PUT', data)
}

/**
 * 获取车辆行驶证详情
 * @param {string} id
 */
export const getTruckLicenseByIdAPI = (id) => {
  return request(`/truck/${id}/license`)
}

/**
 * 保存车辆行驶证信息
 * @param {string} id
 * @param {object} data
 */
export const postTruckLicenseByIdAPI = (id, data) => {
  return request(`/truck/${id}/license`, 'POST', data)
}

/**
 * 获取车辆车次信息
 * @param {string} id 车辆id
 */
export const getTruckTransportTripsByIdAPI = (id) => {
  return request(`/truck/${id}/transportTrips`)
}

/**
 * 获取未绑定车辆的司机
 */
export const getUnBindingDriversAPI = () => {
  return request('/unBindingDrivers')
}

/**
 * 获取已经停用的车辆
 */
export const getUnWorkingTrucksAPI = () => {
  return request('/unWorkingTrucks')
}

/**
 * 获取已经启用的车辆
 */
export const getWorkingTrucksAPI = () => {
  return request('/workingTrucks')
}
