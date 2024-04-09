import { request } from '@/utils/request'
/**
 * 货物类型
 */

/**
 * 添加货物类型
 * @param {object} data
 */
export const postGoodsTypeAPI = (data) => {
  return request('/goodsType', 'POST', data)
}

/**
 * 获取货物类型分页数据
 * @param {object} params
 */
export const getGoodsTypePageAPI = (params) => {
  return request('/goodsType/page', 'GET', params)
}

/**
 * 获取货物类型信息列表
 */
export const getGoodsTypeSimpleAPI = () => {
  return request('/goodsType/simple')
}

/**
 * 获取货物类型详情
 * @param {string} id 货物类型id
 */
export const getGoodsTypeByIdAPI = (id) => {
  return request(`/goodsType/${id}`)
}

/**
 * 更新货物类型
 * @param {string} id 货物类型id
 * @param {object} data
 */
export const putGoodsTypeByIdAPI = (id, data) => {
  return request(`/goodsType/${id}`, 'PUT', data)
}

/**
 * 删除货物类型
 * @param {string} id 货物类型id
 */
export const deleteGoodsTypeByIdAPI = (id) => {
  return request(`/goodsType/${id}`, 'DELETE')
}
