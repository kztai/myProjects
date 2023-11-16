<template>
  <page-content
    :left-drawer-width="leftDrawerWidth"
  >
    <div class="home">
      <el-button type="primary" @click="handleTest">primary</el-button>
      <el-button type="primary" disabled>primary</el-button>
      <el-button type="danger">danger</el-button>
      <el-button type="warning">warning</el-button>
      <el-button type="success">success</el-button>
      <el-button type="text">text</el-button>
      <el-tag type="info">测试</el-tag>
      <el-tag type="primary">测试</el-tag>
      <el-link type="success">测试</el-link>
      <el-tooltip></el-tooltip>
    </div>
    <div>
      <el-button @click="triggerLeftDrawer">切换左边 drawer</el-button>
    </div>
    <ul>
      <li v-for="item in 100" :key="item">测试滚动高度{{ item }}</li>
    </ul>
    <template #left>
      <div>this is left wrapper content</div>
    </template>
  </page-content>
</template>
<script setup lang="ts">
import { ref } from 'vue'

import request from '@/request'
import {
  Message,
} from 'element-ui'
const leftDrawerWidth = ref('0px')
function triggerLeftDrawer() {
  leftDrawerWidth.value = leftDrawerWidth.value === '0px' ? '300px' : '0px'
}
function handleTest() {
  request.get<{
    a: string
    b: string
  }>('/testApi').then(res => {
    console.log('res: ', res)
    Message.success('1')
  })
  request<{
    a: string
    b: string
  }>({
    url: '/testApi',
    method: 'get',
  }).then((res) => {
    console.log('res: ', res)
  })
}
</script>
<style lang="scss">
.home {
  // TODO:
}
</style>
