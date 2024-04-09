import {
  HomeOutlined,
  PartitionOutlined,
  SettingOutlined,
  TeamOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  PoweroffOutlined,
  LockOutlined,
  UserOutlined,
  BarChartOutlined,
  UsergroupDeleteOutlined,
  SendOutlined,
  ScheduleOutlined,
  CarOutlined,
  RightOutlined,
  PlusOutlined,
  UploadOutlined,
} from '@ant-design/icons-vue'

// 以上图标都需要全局注册
const icons = [
  HomeOutlined,
  PartitionOutlined,
  SettingOutlined,
  TeamOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  PoweroffOutlined,
  LockOutlined,
  UserOutlined,
  BarChartOutlined,
  UsergroupDeleteOutlined,
  SendOutlined,
  ScheduleOutlined,
  CarOutlined,
  RightOutlined,
  PlusOutlined,
  UploadOutlined,
]

export default {
  install(app) {
    // 全局注册引入的所有图标
    icons.forEach((item) => app.component(item.displayName, item))
  },
}
