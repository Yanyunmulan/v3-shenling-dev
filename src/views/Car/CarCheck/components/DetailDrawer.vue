<script setup>
import { getTruckReturnRegisterDetailByIdAPI } from '@/services/truckReturnRegister'
import { ref } from 'vue'
import fallbackImage from '@/assets/fallback.png'

// 是否打开抽屉
const isOpenDrawer = ref(false)
// 回单详情
const detail = ref()
// 打开回单-获取回单详情
const onOpenDrawer = async (id) => {
  // 打开抽屉
  isOpenDrawer.value = true
  // 获取回单详情
  const res = await getTruckReturnRegisterDetailByIdAPI(id)
  // 绑定数据
  detail.value = res.data
}

// 关闭抽屉-清空回单详情
const onCloseDrawer = () => {
  detail.value = undefined
}

defineExpose({
  onOpenDrawer,
})
</script>

<template>
  <a-drawer
    v-model:open="isOpenDrawer"
    root-class-name="detail-drawer"
    title="查看回单"
    placement="right"
    size="large"
    @after-open-change="onCloseDrawer"
  >
    <a-space direction="vertical" v-if="detail">
      <a-card class="drawer-card" title="基本信息">
        <div class="list">
          <div class="item">
            <span class="title">任务编号：</span>
            <span class="text">{{ detail.id }}</span>
          </div>
          <div class="item">
            <span class="title">车牌号码：</span>
            <span class="text">{{ detail.licensePlate }}</span>
          </div>
          <div class="item">
            <span class="title">起始地机构：</span>
            <span class="text">{{ detail.startAgencyName }}</span>
          </div>
          <div class="item">
            <span class="title">目的地机构：</span>
            <span class="text">{{ detail.endAgencyName }}</span>
          </div>
          <div class="item">
            <span class="title">出车时间：</span>
            <span class="text">{{ detail.outStorageTime }}</span>
          </div>
          <div class="item">
            <span class="title">回车时间：</span>
            <span class="text">{{ detail.intoStorageTime }}</span>
          </div>
          <div class="item">
            <span class="title">司机：</span>
            <span class="text">{{ detail.driverName }}</span>
          </div>
        </div>
      </a-card>
      <a-card class="drawer-card" title="故障信息">
        <div class="list">
          <div class="item">
            <span class="title">车辆故障：</span>
            <span class="text">{{ detail.isFault ? '是' : '否' }}</span>
          </div>
          <div class="item">
            <span class="title">是否可用：</span>
            <span class="text">{{ detail.isAvailable ? '是' : '否' }}</span>
          </div>
          <div class="item">
            <span class="title">故障类型：</span>
            <span class="text">{{ detail.faultType || '无' }}</span>
          </div>
          <div class="item">
            <span class="title">故障图片：</span>
            <a-image
              :width="100"
              :height="100"
              v-if="detail.faultImages"
              :src="detail.faultImages"
              :fallback="fallbackImage"
            />
            <span class="text" v-else>无</span>
          </div>
        </div>
      </a-card>
      <a-card class="drawer-card" title="违章信息">
        <div class="list">
          <div class="item">
            <span class="title">车辆违章：</span>
            <span class="text">{{ detail.isBreakRules ? '是' : '否' }}</span>
          </div>
          <div class="item">
            <span class="title">违章类型：</span>
            <span class="text">{{ detail.breakRulesType || '无' }}</span>
          </div>
          <div class="item">
            <span class="title">罚款金额：</span>
            <span class="text">{{ detail.penaltyAmount || 0 }} 元</span>
          </div>
          <div class="item">
            <span class="title">扣分：</span>
            <span class="text">{{ detail.deductPoints || 0 }} 分</span>
          </div>
        </div>
      </a-card>
      <a-card class="drawer-card" title="事故信息">
        <div class="list">
          <div class="item">
            <span class="title">车辆事故：</span>
            <span class="text">{{ detail.isAccident ? '是' : '否' }}</span>
          </div>
          <div class="item">
            <span class="title">事故类型：</span>
            <span class="text">{{ detail.accidentType || '无' }}</span>
          </div>
          <div class="item">
            <span class="title">事故图片：</span>
            <a-image
              :width="100"
              :height="100"
              v-if="detail.accidentImages"
              :src="detail.accidentImages"
              :fallback="fallbackImage"
            />
            <span class="text" v-else>无</span>
          </div>
        </div>
      </a-card>
    </a-space>
    <a-skeleton active v-else />
  </a-drawer>
</template>

<style scoped lang="scss">
.detail-drawer {
  .drawer-card {
    // 样式覆盖
    :deep(.ant-card-head) {
      background-color: #f4f4f4;
    }
  }

  .list {
    display: flex;
    flex-wrap: wrap;

    .item {
      display: flex;
      width: 50%;
      line-height: 2;
      .title {
        width: 30%;
        text-align: right;
        font-weight: bold;
      }
      .text {
        color: #666;
      }
    }
  }
}
</style>
