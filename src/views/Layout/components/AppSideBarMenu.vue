<script lang="jsx">
import { defineComponent, computed, resolveComponent, h } from 'vue'
import { watch } from 'vue'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { usePermissionStore } from '@/stores/modules/permission'
import { constantRoutes } from '@/router'
export default defineComponent({
  name: 'SideBarItem',
  setup() {
    const router = useRouter() // 获取路由实例

    const openKeys = ref([]) // 默认展开的一级菜单
    const selectedKeys = ref([]) // 选中的二级菜单
    const permissionStore = usePermissionStore()

    // 监听路由变化，更新选中的菜单
    watch(
      () => router.currentRoute.value.path,
      () => {
        selectedKeys.value = [router.currentRoute.value?.path]
        openKeys.value = [router.currentRoute.value?.meta.parent]
      },
      { immediate: true },
    )

    // 计算属性-测算需要展示的路由的信息
    const routes = computed(() => {
      // 找出所有的hidden为false的路由
      return [...constantRoutes, ...permissionStore.permissionRoutes].filter((item) => !item.hidden)
    })

    const renderSubMenu = () => {
      function travel(_route, nodes = []) {
        if (_route) {
          _route.forEach((element) => {
            const { icon, title } = element.meta

            const node =
              element.children && element.children.length > 0 ? (
                // 一级菜单：渲染 标题 和 图标
                <a-sub-menu title={title} key={element.name} icon={h(resolveComponent(icon))}>
                  {/* 如果有子路由，递归渲染 */}
                  {travel(element.children)}
                </a-sub-menu>
              ) : (
                // 二级菜单：渲染 路由链接 和 标题
                <a-menu-item key={element.path}>
                  <router-link to={element.path}>{title}</router-link>
                </a-menu-item>
              )

            nodes.push(node)
          })
        }
        return nodes
      }
      return travel(routes.value)
    }

    return () => (
      <a-menu
        v-model:selectedKeys={selectedKeys.value}
        v-model:openKeys={openKeys.value}
        theme="light"
        mode="inline"
      >
        {renderSubMenu()}
      </a-menu>
    )
  },
})
</script>

<style lang="scss" scoped>
/*  */
</style>
