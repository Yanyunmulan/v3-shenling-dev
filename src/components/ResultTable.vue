<script setup>
defineProps({
  dataSource: {
    type: Object,
    required: true,
  },
  columns: {
    type: Object,
    required: true,
  },
  loading: Boolean,
  page: Number,
  pageSize: Number,
  total: Number,
})

const emit = defineEmits(['change'])

// 表格发生变化
const change = (...rest) => {
  // 传递给外部
  emit('change', ...rest)
}
</script>

<template>
  <!-- 表格部分 -->
  <a-table
    size="small"
    :dataSource="dataSource"
    :columns="columns"
    :loading="loading"
    @change="change"
    :pagination="{
      position: ['bottomCenter'],
      size: 'default',
      current: page,
      pageSize: pageSize,
      total: total,
      showSizeChanger: true,
      showQuickJumper: true,
    }"
  >
    <template #bodyCell="data">
      <!-- 具名作用域插槽: https://cn.vuejs.org/guide/components/slots.html#named-scoped-slots -->
      <slot name="bodyCell" v-bind="data"></slot>
    </template>
  </a-table>
</template>

<style scoped></style>
