<script setup>
import { onMounted, reactive, ref, watch } from 'vue'
import dayjs from 'dayjs'
import { getBusinessHallTreeAPI } from '@/services/businessHall'

defineProps({
  /** 页码 */
  page: {
    type: Number,
    default: 1,
  },
  /** 页容量 */
  pageSize: {
    type: Number,
    default: 10,
  },
})

const emit = defineEmits(['init', 'finish', 'reset', 'update:page', 'update:pageSize'])
// 点击搜索按钮
const onFinish = async () => {
  // 重置页码
  emit('update:page', 1)
  // 重新获取数据
  emit('finish', formState)
}

// 表单初始化
onMounted(() => {
  emit('init', formState)
})

// 重置表单
const onReset = async () => {
  // 重置页码和页容量
  emit('update:page', 1)
  emit('update:pageSize', 10)
  // 重置表单后，重新获取数据
  await formRef.value.resetFields()
  emit('reset', formState)
}

const formRef = ref()

const formState = reactive({
  /** 运输任务id */
  transportTaskId: undefined,
  /** 起始机构id */
  startAgencyId: undefined,
  /** 结束机构id */
  endAgencyId: undefined,
  /** 开始回车时间 */
  intoStorageStartTime: undefined,
  /** 结束回车时间 */
  intoStorageEndTime: undefined,
  /** 车辆是否可用 */
  isAvailable: undefined,
  /** 页码 */
  page: 1,
  /** 页面大小 */
  pageSize: 10,
  // 回车时间组件使用
  intoStorageTime: [],
})

// 车辆是否可用
const carStatus = [
  { id: 0, name: '全部', isAvailable: null },
  { id: 1, name: '可用', isAvailable: true },
  { id: 2, name: '不可用', isAvailable: false },
]

// 预设时间范围
const rangePresets = ref([
  { label: '最近 7 天', value: [dayjs().add(-7, 'd'), dayjs()] },
  { label: '最近 14 天', value: [dayjs().add(-14, 'd'), dayjs()] },
  { label: '最近 30 天', value: [dayjs().add(-30, 'd'), dayjs()] },
  { label: '最近 90 天', value: [dayjs().add(-90, 'd'), dayjs()] },
])

// 树形机构信息
const treeData = ref([])
const getTreeData = async () => {
  const res = await getBusinessHallTreeAPI()

  // 递归写法处理成组件所需的树形结构
  function mapChildren({ name, id, children }) {
    const item = { label: name, value: id }
    if (children) {
      item.children = children.map(mapChildren)
    }
    return item
  }
  // 保存树形结构数据用于组件展示
  treeData.value = JSON.parse(res.data).map(mapChildren)
}

onMounted(() => {
  getTreeData()
})

// 监听回车时间组件的值变化，处理成后端所需的参数格式
watch(
  () => formState.intoStorageTime,
  (value) => {
    formState.intoStorageStartTime = value[0]?.format('YYYY-MM-DD HH:mm:ss')
    formState.intoStorageEndTime = value[1]?.format('YYYY-MM-DD HH:mm:ss')
  },
)
</script>

<template>
  <a-form
    ref="formRef"
    label-align="right"
    :model="formState"
    :labelCol="{ span: 5 }"
    @finish="onFinish"
  >
    <a-row :gutter="24">
      <a-col :span="8">
        <a-form-item :name="'transportTaskId'" :label="'运输任务编号'">
          <a-input
            allow-clear
            v-model:value="formState.transportTaskId"
            placeholder="请输入运输任务编号"
          />
        </a-form-item>
      </a-col>
      <a-col :span="8">
        <a-form-item :name="'startAgencyId'" :label="'起始地机构'">
          <a-tree-select
            v-model:value="formState.startAgencyId"
            :tree-data="treeData"
            placeholder="请选择起始地机构"
            show-search
            allow-clear
            tree-default-expand-all
            tree-node-filter-prop="label"
          />
        </a-form-item>
      </a-col>
      <a-col :span="8">
        <a-form-item :name="'endAgencyId'" :label="'目的地机构'">
          <a-tree-select
            v-model:value="formState.endAgencyId"
            :tree-data="treeData"
            placeholder="请选择目的地机构"
            show-search
            allow-clear
            tree-default-expand-all
            tree-node-filter-prop="label"
          />
        </a-form-item>
      </a-col>
      <a-col :span="8">
        <a-form-item :name="'intoStorageTime'" :label="'回车时间'">
          <a-range-picker
            v-model:value="formState.intoStorageTime"
            allow-clear
            show-time
            format="YYYY-MM-DD HH:mm:ss"
            :presets="rangePresets"
          />
        </a-form-item>
      </a-col>
      <a-col :span="8">
        <a-form-item :name="'isAvailable'" :label="'车辆是否可用'">
          <a-select v-model:value="formState.isAvailable" allow-clear placeholder="请选择">
            <a-select-option v-for="item in carStatus" :key="item.id" :value="item.isAvailable">
              {{ item.name }}
            </a-select-option>
          </a-select>
        </a-form-item>
      </a-col>
    </a-row>
    <a-row justify="center">
      <a-space>
        <a-button type="primary" html-type="submit">搜索</a-button>
        <a-button @click="onReset">重置</a-button>
      </a-space>
    </a-row>
  </a-form>
</template>
