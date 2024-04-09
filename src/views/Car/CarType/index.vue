<script setup>
import { ref, reactive } from 'vue'
import { getTruckTypePageAPI } from '@/services/truckType'
import PanelTable from './components/PanelTable.vue'
import PanelForm from './components/PanelForm.vue'
import ModalForm from './components/ModalForm.vue'

const isLoading = ref(false)
const dataSource = ref([])
const total = ref(0)
const params = reactive({
  page: 1,
  pageSize: 10,
})

// 获取数据
const getData = async (payload) => {
  // 合并参数
  Object.assign(params, payload)
  // 表格加载状态
  isLoading.value = true
  // 传递参数
  const res = await getTruckTypePageAPI(params)
  // 关闭表格加载状态
  isLoading.value = false
  // 保存列表数据，用于表格展示
  dataSource.value = res.data.items
  // 保存分页总数
  total.value = Number(res.data.counts)
}

// 新增/编辑车型
const isOpenModal = ref(false)
// 编辑车型id
const editId = ref('')
// 打开弹出层
const onOpenModal = (id) => {
  // 打开弹出层
  isOpenModal.value = true
  // 保存编辑车型id
  editId.value = id ? id : undefined
}
</script>

<template>
  <a-space direction="vertical" style="width: 100%">
    <a-card :bodyStyle="{ paddingBottom: 0 }">
      <!-- 表单部分 -->
      <PanelForm
        v-model:page="params.page"
        v-model:pageSize="params.pageSize"
        @init="getData"
        @finish="getData"
        @reset="getData"
      />
    </a-card>
    <a-card>
      <!-- 新增按钮 -->
      <a-button type="primary" @click="onOpenModal()" style="margin-bottom: 20px">
        新增车型
      </a-button>
      <!-- 弹出层 新增/编辑 -->
      <ModalForm v-model:open="isOpenModal" :id="editId" @ok="getData()" />
      <!-- 表格部分 -->
      <PanelTable
        :dataSource="dataSource"
        :loading="isLoading"
        :total="total"
        v-model:page="params.page"
        v-model:pageSize="params.pageSize"
        @change="getData"
        @edit="onOpenModal($event)"
      />
    </a-card>
  </a-space>
</template>
