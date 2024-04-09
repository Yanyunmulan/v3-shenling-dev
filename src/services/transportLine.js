import { request } from '@/utils/request'
/**
 * 线路管理 + 车次管理
 */

/**
 * 添加线路
 * @param {object} data
 */
export const postTransportLineAPI = (data) => {
  return request('/transportLine', 'POST', data)
}

/**
 * 获取线路分页数据
 * @param {object} data
 */
export const postTransportLinePageAPI = (data) => {
  return request('/transportLine/page', 'POST', data)
}

/**
 * 获取线路详情
 * @param {string} id 线路id
 */
export const getTransportLineByIdAPI = (id) => {
  return request(`/transportLine/${id}`)
}

/**
 * 更新线路
 * @param {string} id 路线id
 * @param {*} data
 */
export const putTransportLineByIdAPI = (id, data) => {
  return request(`/transportLine/${id}`, 'PUT', data)
}

/**
 * 删除线路
 * @param {*} id 线路id
 */
export const deleteTransportLineByIdAPI = (id) => {
  return request(`/transportLine/${id}`, 'DELETE')
}

/**
 * 获取车次列表
 * @param {object} params
 */
export const getTransportLineTripsAPI = (params) => {
  return request(`/transportLine/trips`, 'GET', params)
}

/**
 * 添加车次
 * @param {object} data
 */
export const postTransportLineTripsAPI = (data) => {
  return request(`/transportLine/trips`, 'POST', data)
}

/**
 * 获取车次-车辆绑定关系
 * @param {object} params
 */
export const getTransportLineTripsTruckDriversAPI = (params) => {
  return request(`/transportLine/trips/truckDrivers`, 'GET', params)
}

/**
 * 获取车次详情
 * @param {string} id 车次id
 */
export const getTransportLineTripsByIdAPI = (id) => {
  return request(`/transportLine/trips/${id}`)
}

/**
 * 更新车次
 * @param {string} id 车次id
 * @param {*} data
 */
export const putTransportLineTripsByIdAPI = (id, data) => {
  return request(`/transportLine/trips/${id}`, 'PUT', data)
}

/**
 * 删除车次
 * @param {string} id 车次id
 */
export const deleteTransportLineTripsByIdAPI = (id) => {
  return request(`/transportLine/trips/${id}`, 'DELETE')
}

/**
 * 车次-安排车辆
 * @description 车次-安排车辆 不涉及司机的安排 司机会根据【司机车辆绑定关系】和排班情况调度决定
 * @param {string} id
 * @param {object} data
 */
export const postTransportLineTripsTruckDriversAPI = (id, data) => {
  return request(`/transportLine/trips/${id}/truckDrivers`, 'POST', data)
}
