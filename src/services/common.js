import { request } from '@/utils/request'
/**
 * 公共服务
 */

/**
 * 工作台 - 查询一条数据(获取工作台数据)
 */
export const getWorkspaceAPI = () => {
  return request(`/workspace`)
}

/**
 * 行政机构 - 根据父id获取地址信息
 * @param {string} parentId 父级id
 */
export const getAreasChildrenAPI = (parentId) => {
  return request(`/areas/children`, 'GET', { parentId })
}
