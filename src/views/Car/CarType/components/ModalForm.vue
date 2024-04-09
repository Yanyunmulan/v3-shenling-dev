<script setup>
// 新增车辆
import { ref, watch } from 'vue'
import { getTruckTypeByIdAPI, postTruckTypeAPI, putTruckTypeByIdAPI } from '@/services/truckType'
import { message } from 'ant-design-vue'

// 是否打开模态框-用于双向绑定
const props = defineProps(['open', 'id'])
const emit = defineEmits(['update:open', 'ok'])

// 表单组件实例
const formRef = ref()

// 表单字段
const formState = ref({
  /** 车辆类型名称 */
  name: undefined,
  /** 应载重量 */
  allowableLoad: undefined,
  /** 应载体积 */
  allowableVolume: undefined,
  /** 长 */
  measureLong: 0.0,
  /** 宽 */
  measureWidth: 0.0,
  /** 高 */
  measureHigh: 0.0,
})

// 确定
const onOk = async () => {
  try {
    await formRef.value.validateFields()
    // 是否有 id
    if (props.id) {
      // 编辑车型
      await putTruckTypeByIdAPI(props.id, formState.value)
    } else {
      // 新增车型
      await postTruckTypeAPI(formState.value)
    }
    // 重置表单字段
    formRef.value.resetFields()
    // 关闭模态框
    emit('update:open', false)
    // 通知父组件，刷新表格数据
    emit('ok')
  } catch {
    message.error('车辆类型不能重复')
  }
}

// 取消
const onCancel = () => {
  // 重置表单字段
  formRef.value.resetFields()
}

// 获取车型详情
const getDetail = async (id) => {
  const res = await getTruckTypeByIdAPI(id)
  formState.value = res.data
}

watch(
  () => [props.id, props.open],
  ([id]) => {
    if (id) {
      getDetail(id)
    } else {
      formRef.value?.resetFields()
    }
  },
  {
    immediate: true,
  },
)
</script>

<template>
  <a-modal
    :open="open"
    @update:open="emit('update:open', $event)"
    :title="id ? '编辑车型' + id : '新增车型'"
    @ok="onOk"
    @cancel="onCancel"
  >
    <a-form ref="formRef" :model="formState" :labelCol="{ span: 5 }">
      <a-form-item label="车辆类型" name="name" required>
        <a-input v-model:value="formState.name" placeholder="请输入车辆类型" />
      </a-form-item>
      <a-form-item label="应载重量" name="allowableLoad" required>
        <a-input v-model:value="formState.allowableLoad" placeholder="请输入应载重量" suffix="吨" />
      </a-form-item>
      <a-form-item label="应载体积" name="allowableVolume" required>
        <a-input
          v-model:value="formState.allowableVolume"
          placeholder="请输入应载体积"
          suffix="立方"
        />
      </a-form-item>
      <a-form-item label="长" name="measureLong">
        <a-input v-model:value="formState.measureLong" placeholder="请输入长" suffix="米" />
      </a-form-item>
      <a-form-item label="宽" name="measureWidth">
        <a-input v-model:value="formState.measureWidth" placeholder="请输入宽" suffix="米" />
      </a-form-item>
      <a-form-item label="高" name="measureHigh">
        <a-input v-model:value="formState.measureHigh" placeholder="请输入高" suffix="米" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>
