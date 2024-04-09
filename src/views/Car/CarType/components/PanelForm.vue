<script setup>
import { onMounted } from 'vue'
import { reactive, ref } from 'vue'
const formRef = ref()

// 表单数据
const formState = reactive({
  /** 车型编号 id */
  id: undefined,
  /** 应载重量 */
  allowableLoad: undefined,
  /** 应载体积 */
  allowableVolume: undefined,
  /** 车辆类型 */
  name: undefined,
})

// 应载重量 - 下拉框数据
const allowableLoadOptions = [
  {
    value: 'RANGE_LEVEL_1',
    name: '<1.8（吨）',
  },
  {
    value: 'RANGE_LEVEL_2',
    name: '1.8-6（吨）',
  },
  {
    value: 'RANGE_LEVEL_3',
    name: '6-14（吨）',
  },
  {
    value: 'RANGE_LEVEL_4',
    name: '14-30（吨）',
  },
  {
    value: 'RANGE_LEVEL_5',
    name: '30-50（吨）',
  },
  {
    value: 'RANGE_LEVEL_6',
    name: '50-100（吨）',
  },
  {
    value: 'RANGE_LEVEL_7',
    name: '100>（吨）',
  },
]

// 应载体积 - 下拉框数据
const allowableVolumeOptions = [
  {
    value: 'RANGE_LEVEL_1',
    name: '<3（m³）',
  },
  {
    value: 'RANGE_LEVEL_2',
    name: '3-5（m³）',
  },
  {
    value: 'RANGE_LEVEL_3',
    name: '5-10（m³）',
  },
  {
    value: 'RANGE_LEVEL_4',
    name: '10-15（m³）',
  },
  {
    value: 'RANGE_LEVEL_5',
    name: '15-30（m³）',
  },
  {
    value: 'RANGE_LEVEL_6',
    name: '30-50（m³）',
  },
  {
    value: 'RANGE_LEVEL_7',
    name: '50-80（m³）',
  },
  {
    value: 'RANGE_LEVEL_8',
    name: '80-150（m³）',
  },
  {
    value: 'RANGE_LEVEL_9',
    name: '150>（m³）',
  },
]

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
</script>

<template>
  <a-form ref="formRef" :model="formState" @finish="onFinish">
    <a-row :gutter="24">
      <a-col :span="8">
        <a-form-item label="车型编号" :name="'id'">
          <a-input allow-clear v-model:value="formState.id" placeholder="请输入车型编号"></a-input>
        </a-form-item>
      </a-col>
      <a-col :span="8">
        <a-form-item label="应载重量" :name="'allowableLoad'">
          <a-select v-model:value="formState.allowableLoad" allowClear placeholder="请选择应载重量">
            <a-select-option
              v-for="item in allowableLoadOptions"
              :key="item.value"
              :value="item.value"
            >
              {{ item.name }}
            </a-select-option>
          </a-select>
        </a-form-item>
      </a-col>
      <a-col :span="8">
        <a-form-item label="应载体积" :name="'allowableVolume'">
          <a-select
            v-model:value="formState.allowableVolume"
            allowClear
            placeholder="请选择应载体积"
          >
            <a-select-option
              v-for="item in allowableVolumeOptions"
              :key="item.value"
              :value="item.value"
            >
              {{ item.name }}
            </a-select-option>
          </a-select>
        </a-form-item>
      </a-col>
      <a-col :span="8">
        <a-form-item label="车辆类型" :name="'name'">
          <a-input
            allow-clear
            v-model:value="formState.name"
            placeholder="请输入车型编号"
          ></a-input>
        </a-form-item>
      </a-col>
      <a-col :span="8">
        <a-space>
          <a-button type="primary" html-type="submit">搜索</a-button>
          <a-button @click="onReset">重置</a-button>
        </a-space>
      </a-col>
    </a-row>
  </a-form>
</template>
