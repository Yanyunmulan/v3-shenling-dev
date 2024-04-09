<script setup>
import { ref } from 'vue'
import ResultTable from '@/components/ResultTable.vue'
import DetailDrawer from './DetailDrawer.vue'

defineProps({
  // 表格数据
  dataSource: {
    type: Array,
    default: () => [],
  },
  // 分页总数
  total: {
    type: Number,
    default: 0,
  },
  // 表格加载状态
  loading: {
    type: Boolean,
    default: false,
  },
  page: {
    type: Number,
    default: 1,
  },
  pageSize: {
    type: Number,
    default: 10,
  },
})

const emit = defineEmits(['change', 'update:page', 'update:pageSize', 'edit'])

// 表格数据
const onChange = ({ current, pageSize }) => {
  // 更新页码和页容量
  emit('update:page', current)
  emit('update:pageSize', pageSize)
  // 触发父组件的 change 事件
  emit('change', { page: current, pageSize: pageSize })
}

// 表格数据 - 头部
const columns = ref([
  {
    title: '运输任务编号',
    dataIndex: 'transportTaskId',
    key: 'transportTaskId',
    width: 180,
  },
  {
    title: '起始地机构',
    dataIndex: 'startAgencyName', // startAgencyId
    key: 'startAgencyName',
  },
  {
    title: '目的地机构',
    dataIndex: 'endAgencyName', // endAgencyId
    key: 'endAgencyName',
  },
  {
    title: '目的地机构',
    dataIndex: 'endAgencyName', // endAgencyId
    key: 'endAgencyName',
  },
  {
    title: '运单数量',
    dataIndex: 'transportOrderNumber',
    key: 'transportOrderNumber',
    align: 'center',
  },
  {
    title: '出车时间',
    dataIndex: 'outStorageTime',
    key: 'outStorageTime',
  },
  {
    title: '回车时间',
    dataIndex: 'intoStorageTime',
    key: 'intoStorageTime',
  },
  {
    title: '车牌号码',
    dataIndex: 'licensePlate', // truckId
    key: 'licensePlate',
  },
  {
    title: '车辆是否可用',
    dataIndex: 'isAvailable',
    key: 'isAvailable',
    align: 'center',
  },
  {
    title: '操作',
    key: 'operation',
    align: 'center',
    width: 100,
    customCell: (record) => record, // ? 设置单元格属性
  },
])

// 查看回单 - 抽屉组件实例
const drawerRef = ref()
</script>

<template>
  <ResultTable
    :columns="columns"
    :data-source="dataSource"
    :page="page"
    :page-size="pageSize"
    :loading="loading"
    :total="total"
    @change="onChange"
  >
    <!-- 具名作用域插槽 -->
    <template #bodyCell="{ column, text }">
      <!-- 车辆是否可用 -->
      <template v-if="column.dataIndex === 'isAvailable'">
        <div class="table-column-status" :class="text ? 'can-use' : 'stop-use'">
          {{ text ? '可用' : '不可用' }}
        </div>
      </template>
      <!-- 操作 -->
      <template v-if="column.key === 'operation'">
        <a-button @click="drawerRef.onOpenDrawer(text.id)" type="link">查看回单</a-button>
      </template>
    </template>
  </ResultTable>
  <!-- 查看回单详情 -->
  <DetailDrawer ref="drawerRef" />
</template>
