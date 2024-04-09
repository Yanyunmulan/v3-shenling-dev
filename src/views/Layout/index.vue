<script setup>
import AppNavBar from './components/AppNavBar.vue'
import AppSideBar from './components/AppSideBar.vue'
import AppFooter from './components/AppFooter.vue'
</script>

<template>
  <a-layout has-sider class="layout">
    <!-- 侧边栏 -->
    <AppSideBar />
    <a-layout class="main">
      <!-- 页头 -->
      <AppNavBar />
      <!-- 主体 -->
      <a-layout-content class="content">
        <!-- 路由组件 -->
        <RouterView />
      </a-layout-content>
      <!-- 页脚 -->
      <AppFooter />
    </a-layout>
  </a-layout>
</template>

<style scoped lang="scss">
.layout {
  min-height: 100vh;
}

.main {
  margin-left: 200px;
}

.content {
  background-color: #f4f4f4;
  padding: 20px;
  overflow-y: auto;
  margin-top: 60px;
}
</style>
