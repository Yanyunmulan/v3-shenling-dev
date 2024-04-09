import { request } from '@/utils/request'
/**
 * 运单相关 + 运输任务
 */

/**
 * 统计运单
 */
export const getTransportManagerCountAPI = () => {
  return request('/transport-order-manager/count')
}

/**
 * 获取运单分页数据
 * @param {object} data
 */
export const postTransportManagerPageAPI = (data) => {
  return request('/transport-order-manager/page', 'POST', data)
}

/**
 * 获取运单详情
 * @param {string} id 运单id
 */
export const getTransportManagerByIdAPI = (id) => {
  return request(`/transport-order-manager/${id}`)
}

/**
 * 手动调整 发车前调整车次 车辆 司机
 * @param {string} id 运输任务id
 */
export const putTransportManagerAdjustByIdAPI = (id) => {
  return request(`/transport-task-manager/adjust/${id}`, 'PUT')
}

/**
 * 空车取消运输任务
 * @param {string} id 运输任务id
 */
export const putTransportManagerCancelByIdAPI = (id) => {
  return request(`/transport-task-manager/cancel/${id}`, 'PUT')
}

/**
 * 统计运输任务
 */
export const getTransportTaskManagerCountAPI = () => {
  return request('/transport-task-manager/count')
}

/**
 * 获取运输任务分页数据
 * @param {object} data
 */
export const postTransportTaskManagerPageAPI = (data) => {
  return request('/transport-task-manager/page', 'POST', data)
}

/**
 * 获取运输任务坐标
 * @param {string} id
 */
export const getTransportTaskManagerPointByIdAPI = (id) => {
  return request(`/transport-task-manager/point/${id}`)
}

/**
 * 获取运输任务详情
 * @param {string} id
 */
export const getTransportTaskManagerByIdAPI = (id) => {
  return request(`/transport-task-manager/${id}`)
}
