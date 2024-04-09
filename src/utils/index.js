// 获取 assets 静态资源
const getAsssetsPath = (path) => {
  return new URL(`../assets/${path}`, import.meta.url).href
}

// 导出
export { getAsssetsPath }
