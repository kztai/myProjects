<template>
  <div
    :class="['page-content', pageClass]"
    :style="{
      padding: pagePadding
    }"
  >
    <el-scrollbar
      :class="['content-box', contentClass]"
      :style="{
        backgroundColor: contentBgColor,
        padding: contentPadding
      }"
    >
      <slot></slot>
    </el-scrollbar>
    <div
      :class="['left-drawer', leftDrawerClass]"
      :style="{
        width: leftDrawerWidth,
      }"
    >
      <el-scrollbar style="width: 100%;height: 100%;">
        <slot name="left"></slot>
      </el-scrollbar>
    </div>
  </div>
</template>

<script lang="ts" setup>
defineProps({
  pageClass: String,
  pagePadding: {
    type: String,
    default: '0 0 24px 0',
  },
  contentClass: String,
  contentBgColor: {
    type: String,
    default: '#ffffff',
  },
  contentPadding: {
    type: String,
    default: '24px',
  },

  leftDrawerWidth: {
    type: String,
    default: '0px',
  },
  showLeftDrawer: Boolean,
  leftDrawerClass: String,
})

</script>

<style scoped lang="scss">
@import "./variables.scss";

.page-content {
  display: flex;
  height: calc(100vh - #{$header-height});

  .content-box {
    flex: 1;
    height: 100%;
    border-radius: 8px;
    transition: $common-transition;
  }

  .left-drawer {
    margin-left: 24px;
    background-color: #fff;
    border-radius: 8px;
  }
}
</style>
