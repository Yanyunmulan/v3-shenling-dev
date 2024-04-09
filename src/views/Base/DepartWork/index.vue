<script setup>
import { ref, onMounted, watch } from 'vue'
import DepartTree from '../components/DepartTree.vue'
import { getBusinessHallScopeAPI, postBusinessHallScopeAPI } from '@/services/businessHall'
import { message } from 'ant-design-vue'

let map = null

const scopedData = ref({}) // 作业范围数据
const searchName = ref('') // 搜索
const currentEdit = ref(false) // 当前处于编辑模式
const currentDraw = ref(false) // 当前处于绘制模式

const overLayList = {} // 存储浮层的集合
// 选中节点
const selectNode = async (id) => {
  const { data } = await getBusinessHallScopeAPI(id, 1)
  scopedData.value = data

  if (scopedData.value.polygon?.length) {
    if (overLayList[id]) {
      // 存储 图像和marker
      // overLayList[id].polygon
      return
    }
    overLayList[id] = {} // 存储当前节点的图形
    let currentPoint = new window.BMapGL.Point(
      scopedData.value.polygon[0].longitude,
      scopedData.value.polygon[0].latitude,
    )
    map.centerAndZoom(currentPoint, 12) // 设置中心点
    // 根据经纬度生成所有的点
    const points = scopedData.value.polygon.map(
      (item) => new window.BMapGL.Point(item.longitude, item.latitude),
    )
    // 根据所有的点绘制多边形
    var polygon = new window.BMapGL.Polygon(points, {
      strokeStyle: 'dashed',
      strokeColor: '#e49e99',
      strokeWeight: 2,
      strokeOpacity: 0.5,
      fillColor: '#edcbc7',
    })
    // 添加多边形
    map.addOverlay(polygon)
    let markers = points.map((item, index) => {
      // 创建多个标注
      let mk = new window.BMapGL.Marker(item, {
        enableDragging: true,
      })
      mk.addEventListener('dragend', () => {
        const newPoint = mk.getPosition()
        // 更新原来的数据 - 这里不需要响应式 因为存储的时候 数据已变化
        scopedData.value.polygon.splice(index, 1, {
          latitude: newPoint.lat,
          longitude: newPoint.lng,
        })

        points.splice(index, 1, newPoint) // 替换原有的节点
        polygon.setPath(points) // 重新设置路径
      })
      mk.hide() // 标注默认隐藏
      map.addOverlay(mk)
      return mk
    })
    overLayList[id].polygon = polygon
    overLayList[id].markers = markers
  }
}
// 初始化地图

const initMap = () => {
  map = new window.BMapGL.Map('mapContainer')
  map.enableScrollWheelZoom(true)
  // var point = new window.BMapGL.Point(116.404, 39.915)
  // map.centerAndZoom(point, 15)
}
// 删除所有点
const delPoints = () => {
  message.error('不支持删除电子围栏')
}
// 监听搜索关键字
watch(searchName, (value) => {
  if (value && map) {
    var local = new window.BMapGL.LocalSearch(map, {
      renderOptions: { map: map },
    })
    local.search(value)
  }
})
// 监听绘制属性
watch([currentDraw, currentEdit], (values) => {
  // 绘制点
  overLayList[scopedData.value.bid]?.markers?.forEach((item) => {
    if (values.every((item) => item)) {
      item.show()
    } else {
      item.hide()
    }
  })
})
// 提交内容
const btnSubmit = async () => {
  if (currentDraw.value) {
    message.warn('请先结束绘制')
    return
  }
  await postBusinessHallScopeAPI(scopedData.value)
  message.success('更新范围成功')
}
onMounted(() => {
  initMap()
})
</script>
<template>
  <div class="main-container">
    <depart-tree @select-node="selectNode"></depart-tree>
    <div class="right">
      <div class="title">
        <span>作业范围</span>
        <div v-if="currentEdit">
          <a-space>
            <a-button type="primary" @click="btnSubmit">提交</a-button>
            <a-button @click="currentEdit = false">取消</a-button>
          </a-space>
        </div>
        <a-button v-else type="primary" @click="currentEdit = true">编辑</a-button>
      </div>
      <div class="content">
        <div class="search">
          <a-form inline :labelCol="{ span: 3 }">
            <a-form-item label="地区关键词：">
              <a-input
                v-model:value="searchName"
                style="width: 200px"
                placeholder="请输入地区关键词"
              ></a-input>
            </a-form-item>
          </a-form>
          <div v-if="!currentDraw && currentEdit" style="padding-left: 20px; padding-bottom: 10px">
            <a-space>
              <a-button type="primary" @click="currentDraw = true">开始绘制</a-button>
            </a-space>
          </div>
          <div v-if="currentDraw && currentEdit" style="padding-left: 20px; padding-bottom: 10px">
            <a-space>
              <a-button type="primary" @click="currentDraw = false">完成绘制</a-button>
              <a-button @click="delPoints">删除围栏</a-button>
            </a-space>
          </div>
        </div>
        <div class="map-container" id="mapContainer">
          <!-- 地图 -->
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.main-container {
  display: flex;
  padding: 10px;
  .right {
    flex: 1;
    .title {
      background-color: #f8faff;
      padding: 20px;
      color: #2a2929;
      font-weight: 700;
      font-size: 16px;
      display: flex;
      justify-content: space-between;
    }
    .content {
      background-color: #fff;
      height: 500px;
      .search {
        padding-top: 20px;
      }
      .map-container {
        padding: 20px;
        height: 100%;
      }
    }
  }
}
</style>
