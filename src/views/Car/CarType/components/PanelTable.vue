<script setup>
import ResultTable from '@/components/ResultTable.vue'
import { ref } from 'vue'
import { message, Modal } from 'ant-design-vue'
import { deleteTruckTypeByIdAPI } from '@/services/truckType'

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

// 表格列数据
const columns = ref([
  {
    title: '序号',
    key: 'index',
    align: 'center',
    // 🚨注意：表格序号自动递增，分页后也不影响
    customRender: ({ index }) => (props.page - 1) * props.pageSize + index + 1,
  },
  {
    title: '车型编号',
    dataIndex: 'id',
  },
  {
    title: '车辆类型',
    dataIndex: 'name',
  },
  {
    title: '车型数量',
    dataIndex: 'num',
  },
  {
    title: '应载重量（吨）',
    dataIndex: 'allowableLoad',
  },
  {
    title: '应载体积（立方米）',
    dataIndex: 'allowableVolume',
  },
  {
    title: '长（米）',
    dataIndex: 'measureLong',
  },
  {
    title: '宽（米）',
    dataIndex: 'measureWidth',
  },
  {
    title: '高（米）',
    dataIndex: 'measureHigh',
  },
  {
    title: '操作',
    key: 'operation',
    align: 'center',
    width: 200,
    customCell: (record) => record,
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

// 删除
const onDelete = (id) => {
  if (id) {
    Modal.confirm({
      title: '确认删除该数据吗',
      async onOk() {
        await deleteTruckTypeByIdAPI(id)
        message.success('删除成功')
      },
    })
  }
}

// 编辑
const onEdit = (id) => {
  emit('edit', id)
}
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
    <template #bodyCell="{ column, record }">
      <!-- 操作 -->
      <template v-if="column.key === 'operation'">
        <a-button type="link" @click="onEdit(record.id)">编辑</a-button>
        <a-divider type="vertical" />
        <a-button type="link" danger @click="onDelete(record.id)">删除</a-button>
      </template>
    </template>
  </ResultTable>
</template>
