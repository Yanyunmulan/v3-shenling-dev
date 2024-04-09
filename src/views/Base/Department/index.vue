<script setup>
import { ref, onMounted, watch, reactive, computed } from 'vue'
import { message } from 'ant-design-vue'
import DepartTree from '../components/DepartTree.vue'
import { getBusinessHallByIdAPI, getBusinessHallUserPageAPI } from '@/services/businessHall'
import { getAreasChildrenAPI } from '@/services/common'

const currentEdit = ref(false) // 当前是否是编辑模式
const currentData = ref({
  province: {},
  city: {},
  county: {},
}) // 切换数据
const tableData = ref([]) // 表格数据
const provinceData = ref([]) // 省数据
const cityData = ref([]) // 市数据
const countryData = ref([]) // 区数据

const pageParams = reactive({
  page: 1,
  pageSize: 10,
  total: 0,
})
// 列信息
const columns = [
  {
    title: '序号',
    dataIndex: 'index',
    align: 'center',
  },
  {
    title: '员工编号',
    dataIndex: 'userId',
    align: 'center',
  },
  {
    title: '员工姓名',
    dataIndex: 'name',
    align: 'center',
  },
  {
    title: '手机号',
    dataIndex: 'mobile',
    align: 'center',
  },
  {
    title: '所属机构',
    dataIndex: 'agency',
    align: 'center',
  },
  {
    title: '系统账户',
    dataIndex: 'account',
    align: 'center',
  },
  {
    title: '系统角色',
    dataIndex: 'stationName',
    align: 'center',
  },
  {
    title: '账号状态',
    dataIndex: 'status',
    align: 'center',
  },
]

const pagination = computed(() => {
  // 判断是否只有一页
  return pageParams.total <= pageParams.pageSize
    ? false
    : {
        current: pageParams.page,
        pageSize: pageParams.pageSize,
        total: pageParams.total,
        onChange: (page) => {
          pageParams.page = page
          getUserPage() // 重新拉取数据
        },
      }
})

// 获取城市列表
const getAreaChildren = async (parentId) => {
  const { data } = await getAreasChildrenAPI(parentId)
  return data
}
// 获取表格数据
const getUserPage = async () => {
  const {
    data: { counts, items },
  } = await getBusinessHallUserPageAPI({ ...pageParams, agencyId: currentData.value.id })
  tableData.value = items
  pageParams.total = counts
}
// 编辑或者保存
const btnEditOrSave = async () => {
  if (currentEdit.value) {
    // 如果是保存
    try {
      throw new Error('接口未实现编辑，做到这一步就OK')
    } catch (error) {
      message.error(error.message)
    }
  }
  currentEdit.value = !currentEdit.value
}
// 切换树节点
const selectChange = async (id) => {
  if (id !== currentData.value.id) {
    await getTreeDetail(id) // 获取最新的数据
    pageParams.page = 1
    getUserPage()
  }
}
// 切换省份时出发
const changeProvince = (value) => {
  if (value) {
    getCityData(value)
  }
  // 选择了省份 处理
  currentData.value = {
    ...currentData.value,
    city: {},
    county: {},
  }
}

// 切换城市时出发
const changeCity = (value) => {
  if (value) {
    getCountryData(value)
  }
  // 选择了省份 处理
  currentData.value = {
    ...currentData.value,
    county: {},
  }
}

// 获取机构详情数据

const getTreeDetail = async (id) => {
  const hide = message.loading('加载中', 0) // 打开loading
  const { data } = await getBusinessHallByIdAPI(id)
  currentData.value = {
    ...data,
    province: data.province || {},
    city: data.city || {},
    county: data.county || {},
  }
  hide()
}
// 获取省份数据
const getProvinceData = async () => {
  provinceData.value = await getAreaChildren() // 首先获取省市区
}
// 获取城市数据
const getCityData = async (parentId) => {
  cityData.value = await getAreaChildren(parentId) // 首先获取省市区
}
// 获取区域数据
const getCountryData = async (parentId) => {
  countryData.value = await getAreaChildren(parentId) // 首先获取省市区
}
watch(
  () => currentData.value?.province?.id,
  (value) => {
    value && getCityData(value)
  },
)
watch(
  () => currentData.value?.city?.id,
  (value) => {
    value && getCountryData(value)
  },
)
onMounted(() => {
  getProvinceData()
})
</script>
<template>
  <div class="main-container">
    <depart-tree @selectNode="selectChange"></depart-tree>
    <div class="right">
      <div class="top">
        <div class="title">机构信息</div>
        <div class="form">
          <!-- 表单内容 -->
          <a-form :model="currentData">
            <a-row justify="space-around">
              <a-col :span="7">
                <a-form-item name="id" label="机构编号">
                  <a-input disabled v-model:value="currentData.id"></a-input>
                </a-form-item>
              </a-col>
              <a-col :span="7">
                <a-form-item name="name" label="机构名称">
                  <a-input v-model:value="currentData.name" disabled></a-input>
                </a-form-item>
              </a-col>
              <a-col :span="7">
                <a-form-item name="type" label="机构类型">
                  <a-select v-model:value="currentData.type" disabled>
                    <a-select-option :value="1">一级转运</a-select-option>
                    <a-select-option :value="2">一级转运</a-select-option>
                    <a-select-option :value="3">营业部网点</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
            </a-row>
            <a-form-item label="机构地址">
              <a-row justify="space-around">
                <a-col :span="7">
                  <a-select
                    v-model:value="currentData.province.id"
                    :disabled="!currentEdit"
                    @change="changeProvince"
                    placeholder="请选择省份"
                    :options="provinceData"
                    :fieldNames="{ label: 'name', value: 'id' }"
                  >
                  </a-select>
                </a-col>
                <a-col :span="7">
                  <a-select
                    :fieldNames="{ label: 'name', value: 'id' }"
                    v-model:value="currentData.city.id"
                    :disabled="!currentEdit"
                    placeholder="请选择市"
                    @change="changeCity"
                    :options="cityData"
                  >
                  </a-select>
                </a-col>
                <a-col :span="7">
                  <a-select
                    :fieldNames="{ label: 'name', value: 'id' }"
                    v-model:value="currentData.county.id"
                    placeholder="请选择地区"
                    :disabled="!currentEdit"
                    :options="countryData"
                  >
                  </a-select>
                </a-col>
              </a-row>
            </a-form-item>
            <a-row justify="space-around">
              <a-col :span="7">
                <a-form-item label="详细地址" name="address">
                  <a-input :disabled="!currentEdit" v-model:value="currentData.address"></a-input>
                </a-form-item>
              </a-col>
              <a-col :span="7">
                <a-form-item name="longitude" label="经度">
                  <a-input v-model:value="currentData.longitude" disabled></a-input>
                </a-form-item>
              </a-col>
              <a-col :span="7">
                <a-form-item ame="latitude" label="纬度">
                  <a-input disabled v-model:value="currentData.latitude"></a-input>
                </a-form-item>
              </a-col>
            </a-row>
            <a-row justify="start">
              <a-col :span="7">
                <a-form-item name="managerName" label="机构负责人">
                  <a-input
                    v-model:value="currentData.managerName"
                    :disabled="!currentEdit"
                  ></a-input>
                </a-form-item>
              </a-col>
              <a-col :span="7" :offset="1">
                <a-form-item name="phone" label="机构电话">
                  <a-input v-model:value="currentData.phone" :disabled="!currentEdit"></a-input>
                </a-form-item>
              </a-col>
            </a-row>
          </a-form>
          <a-row justify="center">
            <a-col>
              <a-button @click="btnEditOrSave" type="primary"
                >{{ currentEdit ? '保存' : '编辑' }}
              </a-button>
            </a-col>
          </a-row>
        </div>
      </div>

      <div class="bottom">
        <div class="title">员工信息</div>
        <div class="table">
          <a-table :columns="columns" :dataSource="tableData" :pagination="pagination" bordered>
            <template #bodyCell="{ column, record, index }">
              <!-- 序号 -->
              <template v-if="column.dataIndex === 'index'">
                <span>{{ index + (pageParams.page - 1) * pageParams.pageSize + 1 }}</span>
              </template>
              <!-- 所属机构 -->
              <template v-if="column.dataIndex === 'agency'">
                <span>{{ record.agency.name }}</span>
              </template>
              <!-- 状态 -->
              <template v-if="column.dataIndex === 'status'">
                <span v-if="record.status === 1" class="normal">正常</span>
                <span v-if="record.status === 0" class="rest">休息</span>
              </template>
            </template>
          </a-table>
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.main-container {
  display: flex;
  padding: 10px;
  .left {
    width: 220px;
    overflow-x: auto;
    min-height: 600px;
    background-color: #fff;
    margin-right: 20px;
    padding: 10px;
  }
  .right {
    flex: 1;
    .top,
    .bottom {
      background-color: #fff;
      width: 100%;
      margin: 20px 0;
      min-height: 200px;
      .title {
        background-color: #fafafa;
        padding: 20px;
        color: #2a2929;
        font-weight: 700;
        font-size: 16px;
      }
      .form,
      .table {
        margin: 14px 20px;
        padding: 20px;
      }
    }
    .top {
      margin: 0;
    }
  }
  .normal,
  .rest {
    &::before {
      content: '';
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background-color: #1dc779;
      display: inline-block;
      margin-right: 5px;
    }
  }
  .rest {
    &::before {
      background-color: #eb5656;
    }
  }
}
</style>
