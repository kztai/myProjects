<template>
  <div
    class="aside"
    :style="{ width: layoutStore.asideWidth }"
  >
    <div class="aside-header">
      <a class="home" href="/">
        <img class="logo" src="@/assets/images/logo.png" alt="logo" srcset="">
        <h2 class="title" v-show="!layoutStore.asideCollapse">百川企业知识助理</h2>
      </a>
    </div>
    <div class="aside-menu">
      <el-scrollbar class="aside-menu-list-wrapper">
        <el-menu
          class="menu-list"
          :style="{ width: `calc(${layoutStore.asideWidth} - 48px)` }"
          :collapse="layoutStore.asideCollapse"
          :default-active="layoutStore.asideDefaultIndex"
          router
        >
          <template v-for="item in classicalLayoutRoutes">
            <template v-if="item.meta?.asideMenu">
              <el-submenu
                v-if="item.children?.length && item.children.some(i => i.meta?.asideMenu)"
                :index="item.path"
                :key="item.path"
              >
                <template slot="title">
                  <component class="menu-item--icon" :is="item.meta?.asideIcon"></component>
                  <span class="menu-item--title" slot="title">{{ item.meta?.title }}</span>
                </template>
                <template v-for="item2 in item.children">
                  <el-menu-item
                    v-if="item2.meta?.asideMenu"
                    :key="item2.path"
                    :index="item2.path"
                  >
                    <span slot="title" style="margin-left: 10px;">{{ item2.meta?.title }}</span>
                  </el-menu-item>
                </template>
              </el-submenu>
              <el-menu-item
                v-else
                :key="item.path"
                :index="item.path"
              >
                <component class="menu-item--icon" :is="item.meta?.asideIcon"></component>
                <span class="menu-item--title" slot="title">{{ item.meta?.title }}</span>
              </el-menu-item>
            </template>
          </template>
        </el-menu>
      </el-scrollbar>
      <div class="menu-handlers">
        <el-button
          class="trigger-aside--btn"
          type="text"
          @click="layoutStore.triggerAsideCollapse(!layoutStore.asideCollapse)"
        >
          <IconJtMenuFold />
        </el-button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { classicalLayoutRoutes } from '@/router'
import { useClassicalLayout } from '@/stores/classicalLayout'

const layoutStore = useClassicalLayout()
</script>

<style scoped lang="scss">
@import "./variables.scss";

.aside {
  position: absolute;
  height: 100%;
  padding: 0 24px 24px;
  transition: $common-transition;

  .aside-header {
    width: 100%;
    height: $header-height;
    padding-bottom: 8px;

    .home {
      display: flex;
      align-items: center;
      width: 100%;
      height: 100%;

      .logo {
        width: 30px;
        height: 30px;
        object-fit: contain;
        margin: 0 15px;
      }

      .title {
        font-size: 18px;
        font-weight: bold;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }

  .aside-menu {
    width: 100%;
    height: calc(100% - #{$header-height});
    overflow: hidden;
    background-color: #fff;
    border-radius: 8px;

    .aside-menu-list-wrapper {
      height: calc(100% - 50px);
    }

    .menu-list {
      border-right: none;

      .menu-item--icon {
        display: inline-block;
        font-size: 16px;
      }

      .menu-item--title {
        display: inline-block;
        margin-left: 10px;
        font-size: 14px;
      }
    }

    .menu-handlers {
      display: flex;
      align-items: center;
      width: 100%;
      height: 50px;
      padding: 0 20px;

      .trigger-aside--btn {
        transition: $common-transition;
      }
    }
  }
}
</style>
