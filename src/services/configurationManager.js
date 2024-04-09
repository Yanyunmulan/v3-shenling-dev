import { request } from '@/utils/request'
/**
 * 成本配置 + 调度配置
 */

/**
 * 查询成本配置
 */
export const getCostConfigurationManagerAPI = () => {
  return request('/manager/cost-configuration-manager')
}

/**
 * 保存成本配置
 * @param {object} data
 */
export const postCostConfigurationManagerAPI = (data) => {
  return request('/manager/cost-configuration-manager', 'POST', data)
}

/**
 * 查询调度配置
 */
export const getDispatchConfigurationManagerAPI = () => {
  return request('/manager/dispatch-configuration-manager')
}

/**
 * 保存调度配置
 * @param {object} data
 */
export const postDispatchConfigurationManagerAPI = (data) => {
  return request('/manager/dispatch-configuration-manager', 'POST', data)
}
