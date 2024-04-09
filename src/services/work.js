import { request } from '@/utils/request'
/**
 * 工作模式 + 工作排班
 */

/**
 * 新增工作模式
 * @param {object} data
 */
export const postWorkPatternsAPI = (data) => {
  return request('/work-patterns', 'POST', data)
}

/**
 * 修改工作模式
 * @param {object} data
 */
export const putWorkPatternsByIdAPI = (data) => {
  return request(`/work-patterns`, 'PUT', data)
}

/**
 * 工作模式列表查询
 */
export const getWorkPatternsAllAPI = () => {
  return request(`/work-patterns/all`)
}

/**
 * 工作模式分页查询
 * @param {object} params
 */
export const getWorkPatternsPageAPI = (params) => {
  return request(`/work-patterns/page`, 'GET', params)
}

/**
 * 根据工作模式id获取工作模式详情
 * @param {string} id 工作模式id
 */
export const getWorkPatternsByIdAPI = (id) => {
  return request(`/work-patterns/${id}`)
}

/**
 * 工作模式删除
 * @param {string} id 工作模式id
 */
export const deleteWorkPatternsByIdAPI = (id) => {
  return request(`/work-patterns/${id}`, 'DELETE')
}

/**
 * 分页查询排班
 * @param {object} params
 */
export const getWorkSchedulingsPageAPI = (params) => {
  return request(`/work-schedulings`, 'GET', params)
}

/**
 * 批量关联排班
 * @param {object} data
 */
export const postWorkSchedulingsAPI = (data) => {
  return request(`/work-schedulings`, 'POST', data)
}

/**
 * 人工调整排班
 * @param {object} data
 */
export const putWorkSchedulingsAPI = (data) => {
  return request(`/work-schedulings`, 'PUT', data)
}

/**
 * 下载排班模板
 */
export const getWorkSchedulingsDownExcelTemplateAPI = () => {
  return request(`/work-schedulings/downExcelTemplate`)
}

/**
 * 导入排班
 * @param {object} data
 */
export const postWorkSchedulingsUploadExcelAPI = (data) => {
  return request(`/work-schedulings/uploadExcel`, 'POST', data)
}

/**
 * 删除排班
 * @param {string} id 排班id
 * @param {string} operator 操作人
 */
export const deleteWorkSchedulingsByIdAPI = (id, operator) => {
  return request(`/work-schedulings/${id}/${operator}`, 'DELETE')
}
