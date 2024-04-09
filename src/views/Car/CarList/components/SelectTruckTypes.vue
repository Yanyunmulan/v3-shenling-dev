<script setup>
import { inject } from 'vue'

// 用于 v-model:value 双向绑定
defineProps(['value', 'disabled'])
const emit = defineEmits(['update:value'])

// 车辆类型，获取父页面的数据
const truckTypes = inject('truckTypes')
const isLoadingTruckTypes = inject('isLoadingTruckTypes')
</script>

<template>
  <a-select
    :value="value"
    @update:value="emit('update:value', $event)"
    allow-clear
    placeholder="请选择"
    :loading="isLoadingTruckTypes"
    :disabled="disabled"
  >
    <!-- 下拉框加载中状态 -->
    <template v-if="isLoadingTruckTypes" #notFoundContent>
      <a-spin size="small" />
    </template>
    <!-- 下拉框数据 -->
    <a-select-option v-for="item in truckTypes" :key="item.id" :value="item.id">
      {{ item.name }}
    </a-select-option>
  </a-select>
</template>
