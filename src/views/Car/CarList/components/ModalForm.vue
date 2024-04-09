<script setup>
// 新增车辆
import { ref } from 'vue'
import { postTruckAPI } from '@/services/truck'
import SelectTruckTypes from './SelectTruckTypes.vue'

// 是否打开模态框-用于双向绑定
defineProps(['open'])
const emit = defineEmits(['update:open', 'ok'])

// 表单组件实例
const formRef = ref()

// 表单字段
const formState = ref({
  /** 车牌号码 */
  licensePlate: undefined,
  /** 车辆类型id */
  truckTypeId: undefined,
  /** GPS设备ID */
  deviceGpsId: undefined,
})

// 确定
const onOk = async () => {
  try {
    await formRef.value.validateFields()
    // 新增车辆
    await postTruckAPI(formState.value)
    // 重置表单字段
    formRef.value.resetFields()
    // 关闭模态框
    emit('update:open', false)
    // 通知父组件，刷新表格数据
    emit('ok')
  } catch {
    //
  }
}

// 取消
const onCancel = () => {
  // 重置表单字段
  formRef.value.resetFields()
}
</script>

<template>
  <!-- 模块框嵌套表单 -->
  <a-modal
    :open="open"
    @update:open="emit('update:open', $event)"
    title="新增车辆"
    @ok="onOk"
    @cancel="onCancel"
  >
    <a-form ref="formRef" :model="formState" :labelCol="{ span: 5 }">
      <a-form-item
        label="车牌号码"
        name="licensePlate"
        required
        :rules="[
          {
            pattern: /^[\u4e00-\u9fa5]{1}[A-Z]{1}[A-Z_0-9]{5}$/,
            message: '车牌号码格式不正确',
          },
        ]"
      >
        <a-input
          v-model:value="formState.licensePlate"
          placeholder="请输入车牌号码"
          :maxlength="7"
        />
      </a-form-item>
      <a-form-item label="车辆类型" name="truckTypeId" required>
        <SelectTruckTypes v-model:value="formState.truckTypeId" />
      </a-form-item>
      <a-form-item label="GPS设备ID" name="deviceGpsId" required>
        <a-input v-model:value="formState.deviceGpsId" placeholder="请输入GPS设备ID" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>
