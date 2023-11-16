<template>
  <div class="classical-layout">
    <Aside />
    <Header />
    <div
      class="classical-layout--content"
      :style="{
        left: layoutStore.asideWidth
      }"
    >
      <router-view></router-view>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useClassicalLayout } from '@/stores/classicalLayout'

const layoutStore = useClassicalLayout()
</script>

<style scoped lang="scss">
@import "./variables.scss";

.classical-layout {
  position: relative;
  width: 100vw;
  height: 100vh;
  background-color: #f5f7f8;

  &--content {
    position: absolute;
    top: $header-height;
    right: 0;
    bottom: 0;
    transition: $common-transition;
  }
}
</style>
