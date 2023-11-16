<template>
  <div
    class="header"
    :style="{
      left: layoutStore.asideWidth
    }"
  >
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item
        v-for="item in layoutStore.breadcrumbList"
        :key="item.path"
        :to="{ path: item.path }"
      >{{ item.meta.title }}</el-breadcrumb-item>
    </el-breadcrumb>
    <el-dropdown @command="handleCommand">
      <div class="user-profile">
        <el-avatar size="small" :src="authStore.user?.avatar"></el-avatar>
        <span class="username">{{ authStore.user?.nickName ?? 'nick name' }}</span>
      </div>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item :command="Command.Profile">个人主页</el-dropdown-item>
        <el-dropdown-item :command="Command.Edit">修改信息</el-dropdown-item>
        <el-dropdown-item :command="Command.Logout">退出登录</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>

<script lang="ts" setup>
import { useClassicalLayout } from '@/stores/classicalLayout'
import { useAuth } from '@/stores/auth'

const layoutStore = useClassicalLayout()
const authStore = useAuth()

enum Command {
  Profile = 1,
  Edit,
  Logout,
}

function handleCommand(cmd: Command) {
  switch (cmd) {
    case Command.Logout:
      authStore.logout()
      break
    default:
      break
  }
}

</script>

<style scoped lang="scss">
@import "./variables.scss";

.header {
  position: absolute;
  top: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: $header-height;
  padding: 0 24px 8px;
  transition: $common-transition;

  .user-profile {
    display: flex;
    align-items: center;

    .username {
      margin-left: 8px;
      font-size: 14px;
    }
  }
}
</style>
