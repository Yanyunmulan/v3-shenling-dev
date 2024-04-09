<script setup>
import { reactive, ref } from 'vue'
import { UserOutlined, LockOutlined, SafetyOutlined } from '@ant-design/icons-vue'
import { getCaptchaAPI, postLoginAPI } from '@/services/auth'
import { v4 as randomUuid } from 'uuid'
import { useAccountStore } from '@/stores'
import { message } from 'ant-design-vue'
import { useRouter } from 'vue-router'

defineOptions({
  name: 'LoginPage',
})

// 随机生成验证码 id
const randomId = randomUuid()
// 验证码图片地址
const codeImageUrl = ref('')

// 获取验证码
const getCodeImage = async () => {
  // 发送请求获取，后端返回 Buffer 类型的图片
  const res = await getCaptchaAPI(randomId)
  // 将 Buffer 类型的图片转换为 Blob 类型
  const blob = new Blob([res], { type: 'image/png' })
  // 将 Blob 类型的图片转换为 URL 地址
  codeImageUrl.value = URL.createObjectURL(blob)
}

getCodeImage()

// 登录表单数据
const formState = reactive({
  // 通过 .env.development.local 获取用户名和密码
  // 注意 .env.development.local 文件不会被 git 提交
  account: import.meta.env.VITE_APP_ACCOUNT, // 用户名
  password: import.meta.env.VITE_APP_PASSWORD, // 密码
  code: '',
  key: randomId,
})

// 用户信息仓库
const accountStore = useAccountStore()
// 路由实例
const router = useRouter()
// 登录按钮 loading
const isLoginLoading = ref(false)
// 提交登录表单
const onFinish = async () => {
  // 请求开始前，显示登录按钮 loading，防止重复点击(节流)
  isLoginLoading.value = true
  try {
    // 发送登录请求
    const { data, code, msg } = await postLoginAPI(formState)
    // 请求结束，取消登录按钮 loading
    isLoginLoading.value = false
    // 登录失败，提示错误信息
    if (code !== 200) {
      // 重新获取验证码
      getCodeImage()
      // 提示错误信息
      return message.error(msg)
    }
    // 登录成功，保存 token 和用户信息
    accountStore.setToken(data.token)
    accountStore.setUser(data.user)
    // 成功提示并跳转到首页
    message.success('登录成功')
    router.push('/')
  } catch (error) {
    // 请求结束，取消登录按钮 loading
    isLoginLoading.value = false
    // 未知错误，提示错误信息
    message.error('登录失败')
    getCodeImage()
  }
}
</script>

<template>
  <div class="container">
    <video class="video" src="@/assets/video.mp4" autoplay loop muted></video>
    <div class="shadow-card">
      <a-form :model="formState" name="normal_login" class="login-form" @finish="onFinish">
        <div class="logo">
          <img src="@/assets/logo1.png" alt="神领物流" title="神领物流" />
        </div>
        <a-form-item name="account" :rules="[{ required: true, message: '请输入用户名' }]">
          <a-input size="large" v-model:value="formState.account">
            <template #prefix>
              <UserOutlined class="site-form-item-icon" />
            </template>
          </a-input>
        </a-form-item>

        <a-form-item name="password" :rules="[{ required: true, message: '请输入密码' }]">
          <a-input-password size="large" v-model:value="formState.password" autocomplete>
            <template #prefix>
              <LockOutlined class="site-form-item-icon" />
            </template>
          </a-input-password>
        </a-form-item>

        <a-form-item name="code" :rules="[{ required: true, message: '请输入验证码' }]">
          <a-input size="large" v-model:value="formState.code" autocomplete="off">
            <template #prefix>
              <SafetyOutlined class="site-form-item-icon" />
            </template>
            <template #suffix>
              <img
                v-if="codeImageUrl"
                :src="codeImageUrl"
                alt="获取验证码"
                class="code-image"
                @click="getCodeImage"
              />
              <a-skeleton-button v-else active />
            </template>
          </a-input>
        </a-form-item>

        <a-form-item>
          <a-button :loading="isLoginLoading" block size="large" type="primary" html-type="submit">
            登录
          </a-button>
        </a-form-item>
      </a-form>
    </div>
    <p class="login-footer">
      <span>江苏传智播客教育科技股份有限公司</span>
      <span>版权所有Copyright 2006-2022 All Rights Reserved</span>
      <span>苏ICP备16007882号-11</span>
    </p>
  </div>
</template>

<style scoped lang="scss">
.container {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}

.shadow-card {
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.3);
  display: flex;
  justify-content: center;
  align-items: center;
  .login-form {
    margin-top: -50px;
    width: 450px;
    padding: 36px 40px;
    background-color: #fff;
    border-radius: 10px;

    .logo {
      text-align: center;
      img {
        width: 196px;
        height: 54px;
        margin-bottom: 40px;
      }
    }
  }
  .code-image {
    height: 32px;
  }
}

.video {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.login-footer {
  font-size: 14px;
  color: #fff;
  text-align: center;
  position: absolute;
  bottom: 20px;
  left: 0;
  right: 0;
  span {
    margin: 0 10px;
  }
}
</style>
