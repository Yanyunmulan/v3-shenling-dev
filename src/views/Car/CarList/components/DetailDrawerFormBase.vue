<script setup>
import { getTruckByIdAPI, putTruckByIdAPI } from '@/services/truck'
import { ref, onMounted } from 'vue'
import fallbackImage from '@/assets/fallback.png'
import { message } from 'ant-design-vue'
import { baseURL } from '@/utils/request'
import { useAccountStore } from '@/stores'
import SelectTruckTypes from './SelectTruckTypes.vue'

const props = defineProps({
  /** 车辆id */
  truckId: {
    type: String,
    required: true,
  },
})

// 回单详情
const detail = ref({
  /** 车辆编号 */
  id: undefined,
  /** 车牌号码 */
  licensePlate: undefined,
  /** 车型名称 */
  truckTypeName: undefined,
  /** 车辆体积 */
  allowableVolume: undefined,
  /** 车辆载重 */
  allowableLoad: undefined,
  /** GPSID */
  deviceGpsId: undefined,
  /** 图片信息 */
  picture: undefined,
})

// 是否显示 loading
const isLoging = ref(false)
// 是否处于编辑状态
const isEdit = ref(false)

// 获取车辆基本信息
const getDetail = async () => {
  // 打开抽屉时，显示 loading
  isLoging.value = true
  // 获取回单详情
  const res = await getTruckByIdAPI(props.truckId)
  // 关闭 loading
  isLoging.value = false
  // 绑定数据
  detail.value = res.data
  // 绑定图片信息
  const [pic1, pic2] = res.data?.picture?.split(',') || []
  // 绑定正面照信息
  detailPicture1.value = pic1 ? [{ uid: pic1, url: pic1 }] : []
  // 绑定侧面照信息
  detailPicture2.value = pic2 ? [{ uid: pic2, url: pic2 }] : []
}

onMounted(() => {
  getDetail()
})

const tempdetail = ref({})
// 点击编辑按钮
const onEdit = () => {
  isEdit.value = true
  // 复制一份数据，用于取消编辑时恢复数据
  tempdetail.value = { ...detail.value }
}

const formRef = ref()
const onEditCancel = () => {
  isEdit.value = false
  // 恢复数据
  detail.value = tempdetail.value
  // 重置移除表单项的校验结果
  formRef.value.clearValidate()
}

// 提交编辑表单
const onFinish = async () => {
  // 提取关键参数
  const { id, ...data } = detail.value
  // 将图片信息转换成字符串，符合后端要求
  data.picture = [...detailPicture1.value, ...detailPicture2.value]
    .map((item) => (item.url ? item.url : item.response?.data))
    .filter((item) => item)
    .join(',')
  // 提交编辑基本信息表单，后端无返回值
  await putTruckByIdAPI(id, data)
  // 更新回单详情图片信息
  detail.value.picture = data.picture
  // 编辑完成标记
  isEdit.value = false
  // 编辑成功提示
  message.success('保存成功')
}

// 正面照
const detailPicture1 = ref([])
// 侧面照
const detailPicture2 = ref([])
// Upload 上传组件的属性
const uploadProps = {
  // 隐藏 Upload 组件的预览图标
  showUploadList: { showPreviewIcon: false },
  maxCount: 1,
  // 照片墙
  listType: 'picture-card',
  // 限制文件类型
  accept: '.png,.jpeg,.jpg',
  // 上传的地址
  action: `${baseURL}/files/imageUpload`,
  // 设置上传的请求头部，携带 token
  headers: {
    Authorization: useAccountStore().token,
  },
}
</script>

<template>
  <!-- loging 时显示骨架屏 -->
  <a-skeleton v-if="isLoging" active />
  <a-form
    v-else
    ref="formRef"
    :labelCol="{ span: 3 }"
    label-align="right"
    :model="detail"
    @finish="onFinish"
  >
    <a-form-item label="车辆编号" :name="'id'" required>
      <a-input v-model:value="detail.id" disabled />
    </a-form-item>
    <a-form-item
      label="车牌号码"
      :name="'licensePlate'"
      required
      :rules="[
        {
          pattern: /^[\u4e00-\u9fa5]{1}[A-Z]{1}[A-Z_0-9]{5,6}$/,
          message: '车牌号码格式不正确',
        },
      ]"
    >
      <a-input v-model:value="detail.licensePlate" :disabled="!isEdit" />
    </a-form-item>
    <a-form-item label="车辆类型" :name="'truckTypeId'" required>
      <!-- 使用封装的车辆类型下拉框 -->
      <SelectTruckTypes v-model:value="detail.truckTypeId" :disabled="!isEdit" />
    </a-form-item>
    <a-form-item
      label="车辆体积"
      :name="'allowableVolume'"
      required
      :rules="[
        {
          // 请输入车辆载重，只保留两位小数
          pattern: /^([1-9]\d*|0)(\.\d{1,2})?$/,
          message: '请输入车辆体积，只保留两位小数',
        },
      ]"
    >
      <a-input v-model:value="detail.allowableVolume" :disabled="!isEdit" suffix="m³" />
    </a-form-item>
    <a-form-item
      label="车辆载重"
      :name="'allowableLoad'"
      required
      :rules="[
        {
          // 请输入车辆载重，只保留两位小数
          pattern: /^([1-9]\d*|0)(\.\d{1,2})?$/,
          message: '请输入车辆载重，只保留两位小数',
        },
      ]"
    >
      <a-input v-model:value="detail.allowableLoad" :disabled="!isEdit" suffix="吨" />
    </a-form-item>
    <a-form-item
      label="GPSID"
      :name="'deviceGpsId'"
      required
      :rules="[
        {
          pattern: /^\d*$/,
          message: 'GPSID输入有误，请重新输入',
        },
      ]"
    >
      <a-input v-model:value="detail.deviceGpsId" :disabled="!isEdit" />
    </a-form-item>
    <a-form-item label="图片信息">
      <!-- 最多上传2张照片，当上传照片数到达限制后，上传按钮消失。 -->
      <!-- 非编辑状态：图片预览 -->
      <template v-if="!isEdit">
        <a-image-preview-group v-if="detail.picture">
          <a-image
            v-for="item in detail.picture?.split(',')"
            :key="item"
            class="image"
            :width="100"
            :height="100"
            :src="item"
            :fallback="fallbackImage"
          />
        </a-image-preview-group>
        <span v-else style="margin-left: 10px">无</span>
      </template>
      <!-- 编辑状态：照片墙 -->
      <template v-else>
        <div class="picture-card">
          <!-- 正面照 -->
          <a-upload v-model:file-list="detailPicture1" v-bind="uploadProps">
            <template v-if="detailPicture1.length === 0">
              <img class="car-example-image" src="@/assets/car-example1.png" />
              <div class="car-example-text">
                <UploadOutlined />
                <div>上传正面照</div>
              </div>
            </template>
          </a-upload>
          <!-- 侧面照 -->
          <a-upload
            v-if="detailPicture1.length"
            v-model:file-list="detailPicture2"
            v-bind="uploadProps"
          >
            <template v-if="detailPicture2.length === 0">
              <img class="car-example-image" src="@/assets/car-example2.png" />
              <div class="car-example-text">
                <UploadOutlined />
                <div>上传侧面照</div>
              </div>
            </template>
          </a-upload>
        </div>
        <a-typography-text type="secondary">
          注：图片大小不超过5M；最多上传2张；仅能上传 PNG JPEG JPG类型图片；
          <br />
          建议上传400*300尺寸的图片；
        </a-typography-text>
      </template>
    </a-form-item>
    <!-- 表单提交 -->
    <a-form-item v-show="isEdit" :wrapper-col="{ offset: 3 }">
      <a-space>
        <a-button type="primary" html-type="submit">保存</a-button>
        <a-button @click="onEditCancel"> 取消 </a-button>
      </a-space>
    </a-form-item>
    <!-- 编辑入口 -->
    <a-form-item v-show="!isEdit" :wrapper-col="{ offset: 3 }">
      <a-button type="primary" @click="onEdit"> 编辑 </a-button>
    </a-form-item>
  </a-form>
</template>

<style scoped lang="scss">
.picture-card {
  display: flex;
  .ant-upload-wrapper {
    width: auto;
  }
}

.car-example {
  &-image {
    width: 100px;
    height: 100px;
    position: absolute;
    object-fit: contain;
    z-index: 1;
    opacity: 0.5;
  }
  &-text {
    position: relative;
    z-index: 2;
    font-weight: bold;
    background-color: rgba(255, 255, 255, 0.5);
  }
}

// 日期选择器
.ant-picker {
  width: 100%;
}

// 输入框禁用状态
.ant-input-disabled,

// 输入框后缀禁用状态
.ant-input-affix-wrapper-disabled,
.ant-input-affix-wrapper-disabled :deep(.ant-input-disabled),
// 日期选择框禁用状态
.ant-picker-disabled,
.ant-picker-disabled :deep(.ant-picker-input > input),
// 下拉框禁用状态
.ant-select-disabled,
.ant-select-disabled :deep(.ant-select-selector) {
  background-color: #fff !important;
  border-style: none !important;
  color: #222 !important;
  cursor: text !important;
}

// 输入框后缀禁用状态
.ant-input-affix-wrapper-disabled :deep(.ant-input-disabled) {
  width: 50px;
}

// 下拉框禁用状态 - 隐藏下拉箭头
.ant-select-disabled :deep(.ant-select-arrow),
.ant-picker-disabled :deep(.ant-picker-suffix) {
  display: none;
}
</style>
