import router from '@/router'
import { useAccountStore } from '@/stores/modules/account'
import { usePermissionStore } from './stores/modules/permission'

// 登录页 404白名单
const whiteList = ['/login', '/404']
// 全局的前置导航守卫
router.beforeEach(async (to, from, next) => {
  const { token } = useAccountStore()
  const permissionStore = usePermissionStore()
  // 如果有 token
  if (token) {
    if (to.path === '/login') {
      next('/')
    } else {
      if (!permissionStore.permissionRoutes?.length) {
        const routes = await permissionStore.getPermissionRoute() // 获取路由
        routes.forEach((item) => router.addRoute(item))
        return next(to.path)
      }
      next()
    }
  } else {
    // 没有 token 且不在白名单中，跳转到登录页
    if (!whiteList.includes(to.path)) {
      next('/login')
    } else {
      next()
    }
  }
})
