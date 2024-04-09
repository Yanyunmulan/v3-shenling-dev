<script setup>
import { ref } from 'vue'
import AppSideBarMenu from './AppSideBarMenu.vue'
const collapsed = ref(false)
</script>

<template>
  <a-layout-sider
    class="sidebar"
    theme="light"
    v-model:collapsed="collapsed"
    collapsible
    :trigger="null"
  >
    <h2 class="logo">
      <RouterLink to="/">
        <img
          class="logo-img"
          src="@/assets/logo.png"
          alt="神领TMS管理系统"
          title="神领TMS管理系统"
        />
      </RouterLink>
    </h2>
    <AppSideBarMenu />
  </a-layout-sider>
</template>

<style scoped lang="scss">
.sidebar {
  overflow: auto;
  height: 100vh;
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  z-index: 1;
}
.logo {
  height: 150px;
  display: flex;
  justify-content: center;
  align-items: center;

  &-img {
    width: 152px;
    height: 113px;
  }
}
</style>
