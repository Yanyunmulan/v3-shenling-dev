import { request } from '@/utils/request'
/**
 * 回车登记
 */

/**
 * 回车登记详情
 * @param {string} id
 */
export const getTruckReturnRegisterDetailByIdAPI = (id) => {
  return request(`/truck-return-register/detail/${id}`)
}

/**
 * 分页查询回车登记列表
 * @param {object} data
 */
export const postTruckReturnRegisterPageQueryAPI = (data) => {
  return request('/truck-return-register/pageQuery', 'POST', data)
}
