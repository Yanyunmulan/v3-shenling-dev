import { createRouter, createWebHashHistory } from 'vue-router'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
NProgress.configure({
  showSpinner: false,
})

// 动态路由
import { usePermissionStore } from '@/stores/modules/permission'
import { constantRoutes } from './constantRoutes'
// import base from './modules/base'
// import car from './modules/car'
// import employee from './modules/employee'
// import business from './modules/business'
// import dispatch from './modules/dispatch'

// const asyncRoutes = [base, car, employee, business, dispatch]

// history 模式 createWebHistory()
// hash 模式 createWebHashHistory()
const router = createRouter({
  // 默认参数 '/' 路由的基础路由
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: constantRoutes,
})

router.beforeEach(() => {
  // 进度条开始
  NProgress.start()
})

// 全局的后置导航
router.afterEach((to) => {
  // 进度条结束
  NProgress.done()
  // 动态设置标题
  document.title = `${to.meta.title} - Vue3 - ${import.meta.env.VITE_APP_TITLE}`
})

// 登出路由 重置
export const resetRouter = () => {
  const permissionStore = usePermissionStore()
  permissionStore.permissionRoutes?.forEach((item) => router.removeRoute(item))
}

export default router
export * from './constantRoutes'
export * from './asyncRoutes'
