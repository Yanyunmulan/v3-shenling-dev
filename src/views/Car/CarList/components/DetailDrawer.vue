<script setup>
import { ref } from 'vue'
import DetailDrawerFormBase from './DetailDrawerFormBase.vue'
import DetailDrawerFormLicense from './DetailDrawerFormLicense.vue'

// 是否打开抽屉
const isOpenDrawer = ref(false)
// 车辆 id
const truckId = ref('')
// 当前激活的 tab
const activeKey = ref('1')
// 打开回单-获取回单详情
const onOpenDrawer = async (id) => {
  // 打开抽屉
  isOpenDrawer.value = true
  // 保存车辆id，传递给子组件
  truckId.value = id
  // 重置 activeKey
  activeKey.value = '1'
  // 重置 tab 点击状态
  isTabClick.value = false
}

// 关闭抽屉-清空回单详情
const onCloseDrawer = () => {
  emit('close')
}

const emit = defineEmits(['open', 'close'])

defineExpose({
  open: onOpenDrawer,
  close: onCloseDrawer,
})

// 切换 tab 时，才获取行驶证信息
const isTabClick = ref(false)
</script>

<template>
  <div class="">
    <a-drawer
      v-model:open="isOpenDrawer"
      root-class-name="detail-drawer"
      title="车辆详情"
      placement="right"
      size="large"
      @close="onCloseDrawer"
    >
      <!-- 数据加载完毕显示 tabs -->
      <a-tabs v-model:activeKey="activeKey" @change="isTabClick = true">
        <a-tab-pane key="1" tab="基本信息">
          <!-- 添加 key 用于是否销毁组件 -->
          <DetailDrawerFormBase :key="truckId" :truckId="truckId" />
        </a-tab-pane>
        <a-tab-pane key="2" tab="行驶证信息" force-render>
          <DetailDrawerFormLicense v-if="isTabClick" :key="truckId" :truckId="truckId" />
        </a-tab-pane>
      </a-tabs>
    </a-drawer>
  </div>
</template>
