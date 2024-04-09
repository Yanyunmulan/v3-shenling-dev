import { request } from '@/utils/request'
/**
 * 运费管理
 */

/**
 * 获取运费模板列表
 * **/
export function getCarriagesAPI() {
  return request(`/carriages`)
}

/**
 * 新增/修改运费模板
 * **/
export function postCarriagesAPI(data) {
  return request(`/carriages`, 'POST', data)
}

/**
 * 删除模板
 * **/
/**
 * 新增或者修改
 * **/
export function deleteCarriagesAPI(id) {
  return request(`/carriages/${id}`, 'DELETE')
}
