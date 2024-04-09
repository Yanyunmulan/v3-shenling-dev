import { request } from '@/utils/request'
/**
 * 网点管理
 */

/**
 * 根据机构查询快递员
 * @param {string} agencyId 机构ID
 */
export const getBusinessHallCourierFindByAgencyIdAPI = (agencyId) => {
  return request(`/business-hall/courier/findByAgencyId/${agencyId}`)
}

/**
 * 获取快递员分页数据
 * @param {object} params
 */
export const getBusinessHallCourierPageAPI = (params) => {
  return request(`/business-hall/courier/page`, 'GET', params)
}

/**
 * 获取快递员详情
 * @param {string} id 快递员id
 */
export const getBusinessHallCourierAPI = (id) => {
  return request(`/business-hall/courier/${id}`)
}

/**
 * 保存业务范围
 * @param {object} data
 */
export const postBusinessHallScopeAPI = (data) => {
  return request(`/business-hall/scope`, 'POST', data)
}

/**
 * 获取业务范围
 * @param {string} id
 * @param {number} type type -类型，1-机构，2-快递员
 */
export const getBusinessHallScopeAPI = (id, type) => {
  return request(`/business-hall/scope/${id}/${type}`)
}

/**
 * 删除作业范围
 * @param {string} id
 * @param {number} type type -类型，1-机构，2-快递员
 */
export const deleteBusinessHallScopeAPI = (id, type) => {
  return request(`/business-hall/scope/${id}/${type}`, 'DELETE')
}

/**
 * 获取树状机构信息
 */
export const getBusinessHallTreeAPI = () => {
  return request('/business-hall/tree')
}

/**
 * 获取员工分页数据
 * @param {object} params
 */
export const getBusinessHallUserPageAPI = (params) => {
  return request('/business-hall/user/page', 'GET', params)
}

// 必需
/**
 * 获取员工详情
 * @param {string} id 员工id
 */
export const getBusinessHallUserByIdAPI = (id) => {
  return request(`/business-hall/user/${id}`)
}

/**
 * 获取机构详情
 * @param {string} id 机构id
 */
export const getBusinessHallByIdAPI = (id) => {
  return request(`/business-hall/${id}`)
}
