<template>
  <div class="login">
    <div class="panel-item panel-left"></div>
    <div class="panel-item panel-right">
      <el-form
        class="login-form"
        ref="form"
        :model="formData"
      >
        <h2 class="login-form--title">欢迎登录</h2>
        <el-form-item prop="username">
          <el-input
            v-model="formData.username"
            placeholder="请输入用户名"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="formData.password"
            placeholder="请输入用户名"
            show-password
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item prop="captcha">
          <el-col :span="12">
            <el-input
              v-model="formData.captcha"
              placeholder="请输入4位验证码"
              clearable
            ></el-input>
          </el-col>
          <el-col :span="12" style="padding-left: 20px;">
            <img class="captcha-img" />
          </el-col>
        </el-form-item>
        <el-form-item class="login-form--confirm">
          <el-button style="width: 100%;" type="primary" @click="login">登 录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useAuth } from '@/stores/auth'
import type { ILoginReq } from '@/apis/auth/type'

const authStore = useAuth()

const formData = ref<ILoginReq>({
  username: 'admin',
  password: '123456',
  captcha: 'qwer',
})

const loginLoading = ref(false)
function login() {
  loginLoading.value = true
  authStore.login(formData.value).finally(() => {
    loginLoading.value = false
  })
}

</script>

<style lang="scss" scoped>
.login {
  display: flex;
  flex-direction: row;
  align-items: stretch;
  width: 100vw;
  min-width: 700px;
  height: 100vh;
  min-height: 600px;

  .panel-item {
    flex: 1;
  }

  .panel-left {
    background-color: aliceblue;
    background-image: url("@/assets/images/login_left_bg.png");
    background-size: cover;
  }

  .panel-right {
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #fff;

    .login-form {
      width: 344px;
      padding: 40px 32px 78px;
      border-radius: 4px;
      box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 10%);

      .login-form--title {
        margin-bottom: 32px;
        font-size: 20px;
        font-weight: 500;
        text-align: center;
      }

      .login-form--confirm {
        margin-top: 50px;
      }

      .captcha-img {
        width: 100%;
        height: 40px;
        background-color: #f5f7fa;
        border-radius: 2px;
      }
    }
  }
}
</style>
