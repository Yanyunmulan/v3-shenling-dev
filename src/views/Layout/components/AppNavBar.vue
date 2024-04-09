<script setup>
import { useRoute, useRouter } from 'vue-router'
import { useAccountStore } from '@/stores/modules/account'
import { Modal } from 'ant-design-vue'
import { usePermissionStore } from '@/stores/modules/permission'
import { storeToRefs } from 'pinia'
import { resetRouter } from '@/router'

const accountStore = useAccountStore()
const permissionStore = usePermissionStore()
const { currentRole } = storeToRefs(permissionStore)
const router = useRouter()
const route = useRoute()

const onLogout = () => {
  // 退出之前要二次确认
  Modal.confirm({
    title: '提示',
    content: '您确认要退出该系统吗？',
    onOk() {
      // 清空本地存储8
      resetRouter() // 重置路由
      accountStore.logout()
      // 跳转到登录页 replace 替换
      router.replace('/login')
    },
  })
}
// 切换当前角色
const changeCurrentRole = () => {
  permissionStore.setCurrentRole() // 切换角色
  window.location.reload()
}
</script>

<template>
  <a-layout-header class="header">
    <div class="navbar">
      <h3 class="title">{{ route.meta?.title }}</h3>
      <a-dropdown>
        <a class="ant-dropdown-link" @click.prevent>
          <span class="user-name">{{ accountStore.user?.account }}</span>
          <a-avatar class="my-avatar">{{ accountStore.user?.account?.charAt(0) }}</a-avatar>
        </a>
        <template #overlay>
          <a-menu>
            <a-menu-item>
              <a @click="changeCurrentRole" href="javascript:;"
                >切换到{{ currentRole === 'admin' ? 'employee' : 'admin' }}</a
              >
            </a-menu-item>
            <a-menu-item>
              <a @click="onLogout" href="javascript:;">退出登录</a>
            </a-menu-item>
          </a-menu>
        </template>
      </a-dropdown>
    </div>
  </a-layout-header>
</template>

<style scoped lang="scss">
.header {
  background-color: #f4f4f4;
  height: 60px;
  padding: 0 20px;
  position: fixed;
  left: 200px;
  right: 0;
  top: 0;
  z-index: 11;
}
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.title {
  font-size: 16px;
}

.my-avatar {
  color: #f56a00;
  background-color: #fde3cf;
  cursor: pointer;
}

.user-name {
  margin-right: 8px;
}

.my-select {
  .item {
    cursor: pointer;
  }
  .item:last-child {
    margin-bottom: 0;
  }
}
</style>
