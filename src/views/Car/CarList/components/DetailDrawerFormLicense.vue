<script setup>
import { getTruckLicenseByIdAPI, postTruckLicenseByIdAPI } from '@/services/truck'
import { ref, onMounted } from 'vue'
import fallbackImage from '@/assets/fallback.png'
import { message } from 'ant-design-vue'
import { baseURL } from '@/utils/request'
import { useAccountStore } from '@/stores'
import dayjs from 'dayjs'

const props = defineProps({
  /** 车辆id */
  truckId: {
    type: String,
    required: true,
  },
})

// 详情数据
const detail = ref({
  /** 车辆识别代号 */
  transportCertificateNumber: undefined,
  /** 发动机号码 */
  engineNumber: undefined,
  /** 注册时间 */
  registrationDate: undefined,
  /** 有效期 */
  expirationDate: undefined,
  /** 检验有效期 */
  validityPeriod: undefined,
  /** 强制报废日期 */
  mandatoryScrap: undefined,
  /** 整备质量 */
  overallQuality: 1,
  /** 核定载质量 */
  allowableWeight: 1,
  /** 图片信息 */
  picture: undefined,
})

// 是否显示 loading
const isLoading = ref(false)
// 行驶证图片1
const detailPicture1 = ref([])
// 行驶证图片2
const detailPicture2 = ref([])
// 获取车辆基本信息
const getDetail = async () => {
  // 显示 loading
  isLoading.value = true
  // 获取回单详情
  const { data } = await getTruckLicenseByIdAPI(props.truckId)
  // 关闭 loading
  isLoading.value = false
  // 绑定日期信息
  const dateFields = ['registrationDate', 'expirationDate', 'validityPeriod', 'mandatoryScrap']
  dateFields.forEach((field) => {
    // 日期信息转换成 dayjs 对象，用于 antdv 的日期选择器
    data[field] = data[field] ? dayjs(data[field], 'YYYY-MM-DD') : data[field]
  })
  // 绑定数据
  detail.value = data
  // 绑定图片信息，用于 antdv 的上传组件
  const [pic1, pic2] = data?.picture?.split(',') || []
  detailPicture1.value = pic1 ? [{ uid: pic1, url: pic1 }] : []
  detailPicture2.value = pic2 ? [{ uid: pic2, url: pic2 }] : []
}

onMounted(() => {
  getDetail()
})

// 是否处于编辑状态
const isEdit = ref(false)
// 临时详情数据，用于取消编辑时恢复数据
const tempDetail = ref({})
// 点击编辑按钮
const onEdit = () => {
  // 进入编辑状态
  isEdit.value = true
  // 复制一份数据，用于取消编辑时恢复数据
  tempDetail.value = { ...detail.value }
}

// 表单 ref，用于重置表单项的校验结果
const formRef = ref()
// 取消编辑
const onEditCancel = () => {
  // 退出编辑状态
  isEdit.value = false
  // 恢复数据
  detail.value = tempDetail.value
  // 重置移除表单项的校验结果
  formRef.value.clearValidate()
}

// 提交编辑行驶证信息表单
const onFinish = async () => {
  // 提取关键参数，复制一份副本，避免修改原数据
  const { ...data } = detail.value
  // 将图片信息转换成字符串，符合后端要求
  data.picture = [...detailPicture1.value, ...detailPicture2.value]
    .map((item) => (item.url ? item.url : item.response?.data))
    .filter((item) => item)
    .join(',')
  // 将日期信息转换成字符串，符合后端要求
  data.registrationDate = detail.value.registrationDate.format('YYYY-MM-DD')
  data.expirationDate = detail.value.expirationDate.format('YYYY-MM-DD')
  data.validityPeriod = detail.value.validityPeriod.format('YYYY-MM-DD')
  data.mandatoryScrap = detail.value.mandatoryScrap.format('YYYY-MM-DD')
  // 提交编辑基本信息表单，后端无返回值
  await postTruckLicenseByIdAPI(props.truckId, data)
  // 更新回单详情图片信息
  detail.value.picture = data.picture
  // 编辑完成标记
  isEdit.value = false
  // 编辑成功提示
  message.success('保存成功')
}

// Upload 上传组件的属性
const uploadProps = {
  // 隐藏 Upload 组件的预览图标
  showUploadList: { showPreviewIcon: false },
  // 限制上传数量
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
  <a-skeleton v-if="isLoading" active />
  <a-form
    v-else
    ref="formRef"
    :labelCol="{ span: 4 }"
    label-align="right"
    :model="detail"
    @finish="onFinish"
  >
    <a-form-item
      label="车辆识别代号"
      :name="'transportCertificateNumber'"
      required
      :rules="[{ pattern: /^[A-HJ-NPR-Z0-9]{17}$/, message: '车辆识别代号格式有误' }]"
    >
      <a-input
        v-model:value="detail.transportCertificateNumber"
        :maxlength="17"
        :disabled="!isEdit"
        placeholder="请输入车辆识别代号，17位数字或字母，如：LGWFFCA53CB001941"
      />
    </a-form-item>
    <a-form-item
      label="发动机号码"
      :name="'engineNumber'"
      required
      :rules="[{ pattern: /^[A-Za-z0-9]+$/, message: '发动机号码格式有误' }]"
    >
      <a-input
        v-model:value="detail.engineNumber"
        :disabled="!isEdit"
        placeholder="请输入发动机号码"
      />
    </a-form-item>
    <a-form-item label="注册时间" :name="'registrationDate'" required>
      <a-date-picker v-model:value="detail.registrationDate" :disabled="!isEdit" />
    </a-form-item>
    <a-form-item label="有效期" :name="'expirationDate'" required>
      <a-date-picker v-model:value="detail.expirationDate" :disabled="!isEdit" />
    </a-form-item>
    <a-form-item label="检验有效期" :name="'validityPeriod'" required>
      <a-date-picker v-model:value="detail.validityPeriod" :disabled="!isEdit" />
    </a-form-item>
    <a-form-item label="强制报废日期" :name="'mandatoryScrap'" required>
      <a-date-picker v-model:value="detail.mandatoryScrap" :disabled="!isEdit" />
    </a-form-item>
    <a-form-item label="整备质量" :name="'overallQuality'" required>
      <a-input v-model:value="detail.overallQuality" :disabled="!isEdit" suffix="吨" />
    </a-form-item>
    <a-form-item label="核定载质量" :name="'allowableWeight'" required>
      <a-input v-model:value="detail.allowableWeight" :disabled="!isEdit" suffix="吨" />
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
              <img class="car-example-image" src="@/assets/license-example1.png" />
              <div class="car-example-text">
                <div>上传主页</div>
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
              <img class="car-example-image" src="@/assets/license-example2.png" />
              <div class="car-example-text">
                <div>上传副页</div>
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
