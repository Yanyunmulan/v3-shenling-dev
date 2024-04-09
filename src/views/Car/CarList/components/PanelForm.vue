<script setup>
import { onMounted, reactive, ref } from 'vue'
import SelectTruckTypes from './SelectTruckTypes.vue'

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
  /** 车牌号码 */
  licensePlate: undefined,
  /** 车辆类型id */
  truckTypeId: undefined,
  /** 状态 */
  workStatus: undefined,
  /** 页码 */
  page: 1,
  /** 页面大小 */
  pageSize: 10,
})
</script>

<template>
  <a-form
    ref="formRef"
    label-align="right"
    :model="formState"
    :labelCol="{ span: 5 }"
    @finish="onFinish"
    layout="inline"
  >
    <a-row :gutter="24" style="width: 100%">
      <a-col :span="8">
        <a-form-item :name="'truckTypeId'" :label="'车辆类型'">
          <!-- 使用封装的车辆类型下拉框 -->
          <SelectTruckTypes v-model:value="formState.truckTypeId" />
        </a-form-item>
      </a-col>
      <a-col :span="8">
        <a-form-item :name="'licensePlate'" :label="'车牌号码'">
          <a-input
            allow-clear
            v-model:value="formState.licensePlate"
            placeholder="请输入车牌号码"
          />
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
