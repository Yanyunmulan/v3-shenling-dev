<script setup>
// 国际化 https://www.antdv.com/docs/vue/i18n-cn
import zhCN from 'ant-design-vue/es/locale/zh_CN'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
dayjs.locale('zh-cn')

// 定制主题 https://www.antdv.com/docs/vue/customize-theme-cn
const theme = {
  token: {
    colorPrimary: '#e15536',
  },
}
</script>

<template>
  <a-config-provider :theme="theme" :locale="zhCN">
    <RouterView />
  </a-config-provider>
</template>

<style scoped>
/*  */
</style>
