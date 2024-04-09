import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getRouterAPI } from '@/services/auth'
import { asyncRoutes } from '@/router'

export const usePermissionStore = defineStore(
  'permission',
  () => {
    // state currentRole admin / employee
    const currentRole = ref('admin')
    const permissionRoutes = ref([])
    const setCurrentRole = () => {
      currentRole.value = currentRole.value === 'admin' ? 'employee' : 'admin'
    }
    const getPermissionRoute = async () => {
      // 发送请求，获取权限路由表
      const { data: menus } = await getRouterAPI({ role: currentRole.value })

      console.log('🟢 menus', menus)

      const routes = []
      menus.forEach((item) => {
        const filterRoute = asyncRoutes.find((route) => route.name === item.name)
        // 找到匹配
        if (filterRoute) {
          let children = []
          if (item.children?.length) {
            item.children.forEach((childItem) => {
              // 找到符合的第二级的路由
              const secondRoute = filterRoute.children.find(
                (childRoute) => childRoute.name === childItem,
              )
              children.push(secondRoute)
            })
          }
          filterRoute.children = children
          routes.push(filterRoute)
        }
        permissionRoutes.value = routes
      })

      console.log('🔴 routes', routes)
      return permissionRoutes.value
    }
    // return
    return {
      permissionRoutes,
      currentRole,
      setCurrentRole,
      getPermissionRoute,
    }
  },
  {
    persist: {
      paths: ['currentRole'],
    },
  },
)
