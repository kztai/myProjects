/// <reference types="vite/client" />

import 'vue-router'
import type { Component } from 'vue'

interface ImportMetaEnv {
  // website title
  readonly VITE_APP_TITLE: string

  // 更多环境变量...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

declare module 'vue-router' {
  interface RouteMeta {
    title?: string
    // aside 是否包含
    asideMenu?: boolean
    asideIcon?: Component
    // 是否展示面包屑
    breadcrumb?: boolean
  }
}
