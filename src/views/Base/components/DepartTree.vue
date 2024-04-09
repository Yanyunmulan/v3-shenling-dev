<script setup>
import { getBusinessHallTreeAPI } from '@/services/businessHall'
import { ref, onMounted } from 'vue'

const emits = defineEmits(['selectNode'])
const selectedKeys = ref([]) // 要选中的节点
const expandedKeys = ref([]) // 要展开的节点
const treeData = ref([]) // 树形数据
// 切换树节点
const selectChange = async (_, { node }) => {
  emits('selectNode', node.id)
}
const getFirstNode = (arr) => {
  let data = null
  let returnArr = []
  let index = 0
  while (index < arr.length) {
    returnArr.push(arr[index].id)
    if (index === 0 && arr[index]?.children?.length) {
      const { node, keys } = getFirstNode(arr[index].children)
      data = node
      returnArr.push(...keys)
    } else {
      data = arr[index]
    }
    break
  }
  return { node: data, keys: returnArr }
}
// 获取左侧树数据
const getRequestTree = async () => {
  const { data } = await getBusinessHallTreeAPI()
  if (typeof data === 'string') {
    treeData.value = JSON.parse(data)
    // 选中某个节点
    const { node, keys } = getFirstNode(treeData.value)
    expandedKeys.value = keys
    selectedKeys.value = [node.id]
    emits('selectNode', node.id)
  }
}
onMounted(async () => {
  getRequestTree()
})
</script>
<template>
  <div class="left">
    <a-tree
      :show-line="true"
      :show-icon="false"
      :tree-data="treeData"
      :fieldNames="{ title: 'name', key: 'id' }"
      v-model:expandedKeys="expandedKeys"
      v-model:selectedKeys="selectedKeys"
      @select="selectChange"
    ></a-tree>
  </div>
</template>
<style scoped>
.left {
  width: 220px;
  overflow-x: auto;
  min-height: 600px;
  background-color: #fff;
  margin-right: 20px;
  padding: 10px;
}
</style>
