<script setup>
import { postTruckReturnRegisterPageQueryAPI } from '@/services/truckReturnRegister'
import { reactive, ref, onMounted } from 'vue'
import PanelForm from './components/PanelForm.vue'
import PanelTable from './components/PanelTable.vue'

// 回车登记
defineOptions({
  name: 'CarCheckPage',
})

const isLoading = ref(false)
const dataSource = ref([])
const total = ref(0)
const params = reactive({
  page: 1,
  pageSize: 10,
})

// 获取数据
const getData = async (payload) => {
  // 合并参数
  Object.assign(params, payload)
  // 表格加载状态
  isLoading.value = true
  // 剔除掉掉后端不需要的参数(intoStorageTime)
  delete params.intoStorageTime
  // 传递参数
  const res = await postTruckReturnRegisterPageQueryAPI(params)
  // 关闭表格加载状态
  isLoading.value = false
  // 保存列表数据，用于表格展示
  dataSource.value = res.data.items
  // 保存分页总数
  total.value = Number(res.data.counts)
}

onMounted(() => {
  getData()
})
</script>

<template>
  <a-space style="width: 100%" direction="vertical">
    <a-card>
      <!-- 表单部分 -->
      <PanelForm
        v-model:page="params.page"
        v-model:pageSize="params.pageSize"
        @init="getData"
        @finish="getData"
        @reset="getData"
      />
    </a-card>
    <a-card>
      <!-- 表格部分 -->
      <PanelTable
        :dataSource="dataSource"
        :loading="isLoading"
        :total="total"
        v-model:page="params.page"
        v-model:pageSize="params.pageSize"
        @change="getData"
      />
    </a-card>
  </a-space>
</template>
