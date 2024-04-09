<script setup>
import { getTruckCountAPI, getTruckPageAPI } from '@/services/truck'
import { getTruckTypeSimpleAPI } from '@/services/truckType'
import { reactive, ref, watch, provide, onMounted } from 'vue'
import PanelForm from './components/PanelForm.vue'
import PanelTable from './components/PanelTable.vue'
import ModalForm from './components/ModalForm.vue'

// 回车登记
defineOptions({
  name: 'CarList',
})

const isLoading = ref(false)
const dataSource = ref([])
const total = ref(0)
const params = reactive({
  page: 1,
  pageSize: 10,
  workStatus: undefined,
})

// 获取表格数据
const getData = async (payload) => {
  // 合并参数
  Object.assign(params, payload)
  // 表格加载状态
  isLoading.value = true
  // 传递参数
  const res = await getTruckPageAPI(params)
  // 关闭表格加载状态
  isLoading.value = false
  // 保存列表数据，用于表格展示
  dataSource.value = res.data.items
  // 保存分页总数
  total.value = Number(res.data.counts)
}

onMounted(() => {
  // 获取表格数据
  getData()
})

// 获取车辆类型数据 - 下拉框
const truckTypes = ref([])
const isLoadingTruckTypes = ref(false)
const getTruckTypeData = async () => {
  isLoadingTruckTypes.value = true
  const res = await getTruckTypeSimpleAPI()
  isLoadingTruckTypes.value = false
  truckTypes.value = res.data
}
onMounted(() => {
  // 获取车辆类型数据 - 下拉框
  getTruckTypeData()
})

// 依赖注入，方便子组件调用
provide('truckTypes', truckTypes)
provide('isLoadingTruckTypes', isLoadingTruckTypes)

// 获取统计车辆 - 按钮组
const truckCount = ref({})
const getTruckCountData = async () => {
  const res = await getTruckCountAPI()
  truckCount.value = res.data
}

onMounted(() => {
  // 获取统计车辆 - 按钮组
  getTruckCountData()
})

// 监听按钮组状态，切换状态后，重新获取数据
watch(
  () => params.workStatus,
  () => {
    // 重置页码
    params.page = 1
    // 重置页码后，重新获取数据
    getData()
  },
)

// 是否打开模态框
const isOpenModal = ref(false)
</script>

<template>
  <a-space direction="vertical" style="width: 100%">
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
    <!-- 按钮组 -->
    <a-card class="radio-card">
      <a-radio-group v-model:value="params.workStatus" button-style="solid" size="large">
        <a-radio-button :value="undefined">
          全部 {{ Number(truckCount[1]) + Number(truckCount[0]) || 0 }}
        </a-radio-button>
        <a-radio-button :value="1">可用 {{ truckCount[1] || 0 }}</a-radio-button>
        <a-radio-button :value="0">停用 {{ truckCount[0] || 0 }}</a-radio-button>
      </a-radio-group>
    </a-card>
    <a-card>
      <!-- 打开模态框 -->
      <a-button type="primary" @click="isOpenModal = true" style="margin-bottom: 20px">
        新增车辆
      </a-button>
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
    <!-- 模态框表单 -->
    <ModalForm v-model:open="isOpenModal" @ok="getData()" />
  </a-space>
</template>

<style scoped lang="scss">
.radio-card {
  // 重置卡片样式
  :deep(.ant-card-body) {
    padding: 0;
  }
  // 重置按钮组样式
  :deep(.ant-radio-button-wrapper) {
    width: 120px;
    font-size: 14px;
    text-align: center;
    border-radius: 0;
    border: 0;
    // 隐藏中间分割线
    &::before {
      display: none;
    }
  }
}
</style>
