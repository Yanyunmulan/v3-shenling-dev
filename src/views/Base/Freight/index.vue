<script setup>
import { ref, onMounted, computed } from 'vue'
import { getCarriagesAPI, postCarriagesAPI, deleteCarriagesAPI } from '@/services/carriages'
import { message, Modal } from 'ant-design-vue'

const columns = [
  {
    title: '模板类型',
    dataIndex: 'templateType',
    align: 'center',
  },
  {
    title: '运送类型',
    dataIndex: 'transportType',
    align: 'center',
  },
  {
    title: '关联城市',
    dataIndex: 'associatedCityList',
    align: 'center',
  },
  {
    title: '首重',
    dataIndex: 'firstWeight',
    align: 'center',
  },
  {
    title: '续重',
    dataIndex: 'continuousWeight',
    align: 'center',
  },
  {
    title: '轻抛系数',
    dataIndex: 'lightThrowingCoefficient',
    align: 'center',
  },
  {
    title: '操作',
    dataIndex: 'operate',
  },
]
const dataSource = ref([])
const formRef = ref(null)
const showModal = ref(false)
const formData = ref({
  firstWeight: 0,
  continuousWeight: 0,
  lightThrowingCoefficient: 0,
})
const getCarriage = async () => {
  const { data } = await getCarriagesAPI()
  dataSource.value = data
}
const enumCity = {
  1: '全国',
  2: '京津冀',
  3: '江浙沪',
  4: '川渝',
  5: '黑吉辽',
}
const templateType = {
  1: '同城寄',
  2: '省内寄',
  3: '经济区互寄',
  4: '跨省',
}
const transportType = {
  1: '普快',
  2: '特快',
}
// 获取城市的列表
const getCityContent = (arr) => {
  return arr.map((item) => enumCity[item]).join(',')
}
const getTransContent = (value, type) => {
  if (type === 'template') {
    return templateType[value]
  } else if (type === 'transport') {
    return transportType[value]
  }
}

const showTitle = computed(() => {
  return formData.value.id ? '编辑模板' : '新增模板'
})
// 提交表单
const btnSubmit = async () => {
  await formRef.value?.validate()
  await postCarriagesAPI(formData.value)
  message.success(`${formData.value.id ? '更新' : '新增'}成功`)
  formRef.value?.resetFields()
  formData.value = {
    firstWeight: 0,
    continuousWeight: 0,
    lightThrowingCoefficient: 0,
  }
  getCarriage() // 重新拉取数据
  btnCancel()
}
const btnEditRow = (row) => {
  formData.value = { ...row }
  showModal.value = true
}
// 取消编辑
const btnCancel = () => {
  formRef.value?.resetFields()
  showModal.value = false
}
// 删除行
const btnDel = (id) => {
  if (id) {
    Modal.confirm({
      title: '确认删除该数据吗',
      async onOk() {
        await deleteCarriagesAPI(id)
        message.success('删除成功')
        getCarriage()
      },
    })
  }
}
onMounted(() => {
  getCarriage()
})
</script>
<template>
  <div class="container">
    <div class="add-row">
      <a-button type="primary" @click="showModal = true">添加模板</a-button>
    </div>
    <a-table :columns="columns" :data-source="dataSource" :pagination="false" bordered>
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'templateType'">
          <span>{{ getTransContent(record.templateType, 'template') }}</span>
        </template>
        <template v-if="column.dataIndex === 'transportType'">
          <span>{{ getTransContent(record.transportType, 'transport') }}</span>
        </template>
        <template v-if="column.dataIndex === 'associatedCityList'">
          <span>{{ getCityContent(record.associatedCityList) }}</span>
        </template>
        <template v-if="column.dataIndex === 'operate'">
          <a-button primary type="link" @click="btnEditRow(record)">编辑</a-button>
          <span style="color: #ccc">|</span>
          <a-button danger type="link" @click="btnDel(record.id)">删除</a-button>
        </template>
      </template>
    </a-table>
  </div>
  <a-modal v-model:open="showModal" :title="showTitle" closable :footer="null" @cancel="btnCancel">
    <a-form ref="formRef" :label-col="{ span: 4 }" :model="formData">
      <a-form-item
        label="模板类型"
        name="templateType"
        :rules="[{ required: true, message: '模板类型不能为空' }]"
      >
        <a-select
          placeholder="请选择模板类型"
          v-model:value="formData.templateType"
          :options="
            Object.keys(templateType).map((key) => ({ label: templateType[key], value: +key }))
          "
        >
        </a-select>
      </a-form-item>
      <a-form-item
        label="运送类型"
        name="transportType"
        :rules="[{ required: true, message: '运送类型不能为空' }]"
      >
        <a-select
          placeholder="请选择运送类型"
          v-model:value="formData.transportType"
          :options="
            Object.keys(transportType).map((key) => ({
              label: transportType[key],
              value: +key,
            }))
          "
        >
        </a-select>
      </a-form-item>
      <a-form-item
        label="关联城市"
        name="associatedCityList"
        :rules="[
          {
            type: 'array',
            required: true,
            message: '关联城市不能为空',
            trigger: 'change',
          },
        ]"
      >
        <a-checkbox-group
          v-model:value="formData.associatedCityList"
          :options="Object.keys(enumCity).map((key) => ({ label: enumCity[key], value: key }))"
        >
        </a-checkbox-group>
      </a-form-item>
      <a-form-item
        label="首重价格"
        name="firstWeight"
        :rules="[
          { required: true, message: '首重价格不能为空' },
          {
            type: 'number',
            max: 999.9,
            min: 1,
            message: '首重价格必须大于1小于等于999.9',
          },
        ]"
      >
        <a-input-number
          style="width: 100%"
          :controls="false"
          placeholder="请输入首重价格"
          :formatter="(value) => parseFloat(value).toFixed(2)"
          v-model:value="formData.firstWeight"
        >
          <template #addonAfter>元</template>
        </a-input-number>
      </a-form-item>
      <a-form-item
        label="续重价格"
        name="continuousWeight"
        :rules="[
          { required: true, message: '续重价格不能为空' },
          {
            type: 'number',
            max: 999.9,
            min: 1,
            message: '续重价格必须大于1小于等于999.9',
          },
        ]"
      >
        <a-input-number
          :controls="false"
          style="width: 100%"
          placeholder="请输入续重价格"
          :formatter="(value) => parseFloat(value).toFixed(2)"
          v-model:value="formData.continuousWeight"
        >
          <template #addonAfter>元</template>
        </a-input-number>
      </a-form-item>
      <a-form-item
        label="轻抛系数"
        name="lightThrowingCoefficient"
        :rules="[
          { required: true, message: '轻抛系数不能为空' },
          {
            type: 'number',
            min: 1,
            message: '轻抛系数必须大于1',
          },
        ]"
      >
        <a-input-number
          :controls="false"
          placeholder="请输入轻抛系数"
          style="width: 100%"
          :parser="(value) => parseInt(value)"
          v-model:value="formData.lightThrowingCoefficient"
        ></a-input-number>
      </a-form-item>
      <a-form-item>
        <a-row justify="center">
          <a-space>
            <a-button type="primary" @click="btnSubmit">确认</a-button>
            <a-button @click="btnCancel">取消</a-button>
          </a-space>
        </a-row>
      </a-form-item>
    </a-form>
  </a-modal>
</template>
<style scoped lang="scss">
.container {
  width: 100%;
  min-height: 400px;
  padding: 20px;
  background-color: #fff;
  .add-row {
    margin: 20px 0;
  }
}
</style>
