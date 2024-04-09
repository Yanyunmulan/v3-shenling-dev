<script setup>
import { ref } from 'vue'
import ResultTable from '@/components/ResultTable.vue'
import DetailDrawer from './DetailDrawer.vue'

const props = defineProps({
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

// 表格数据 - 头部
const columns = ref([
  {
    title: '序号',
    align: 'center',
    // 🚨注意：表格序号自动递增，分页后也不影响
    customRender: ({ index }) => (props.page - 1) * props.pageSize + index + 1,
  },
  {
    title: '车牌号码',
    dataIndex: 'licensePlate', // truckId
    key: 'licensePlate',
  },
  {
    title: '车辆类型',
    dataIndex: 'truckTypeName',
    key: 'truckTypeName',
  },
  {
    title: '司机数量',
    dataIndex: 'driverNum',
    key: 'driverNum',
    align: 'center',
  },
  {
    title: '车辆状态',
    dataIndex: 'workStatus',
    key: 'workStatus',
    align: 'center',
  },
  {
    title: 'GPS设备ID',
    dataIndex: 'deviceGpsId',
    key: 'deviceGpsId',
  },
  {
    title: '实载重量（T）',
    dataIndex: 'allowableLoad',
    key: 'allowableLoad',
    align: 'center',
  },
  {
    title: '实载体积（方）',
    dataIndex: 'allowableVolume',
    key: 'allowableVolume',
    align: 'center',
  },
  {
    title: '操作',
    key: 'operation',
    align: 'center',
    width: 300,
    customCell: (record) => record, // ? 设置单元格属性
  },
])

// 表格数据
const onChange = ({ current, pageSize }) => {
  // 更新页码和页容量
  emit('update:page', current)
  emit('update:pageSize', pageSize)
  // 触发父组件的 change 事件
  emit('change', { page: current, pageSize: pageSize })
}

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
    <template #bodyCell="{ column, text, record }">
      <!-- 车辆状态 -->
      <template v-if="column.dataIndex === 'workStatus'">
        <div class="table-column-status" :class="text ? 'can-use' : 'stop-use'">
          {{ text ? '可用' : '停用' }}
        </div>
      </template>
      <!-- 操作 -->
      <template v-if="column.key === 'operation'">
        <a-button size="small" type="link" @click="drawerRef.open(text.id)">查看详情</a-button>
        <a-divider type="vertical" />
        <a-button v-if="record.workStatus === 1" type="link" danger>停用</a-button>
        <a-button v-else type="link">启用</a-button>
        <a-divider type="vertical" />
        <a-button size="small" type="link">配置司机</a-button>
      </template>
    </template>
  </ResultTable>
  <!-- 详情抽屉 -->
  <DetailDrawer ref="drawerRef" @close="getData()" />
</template>
