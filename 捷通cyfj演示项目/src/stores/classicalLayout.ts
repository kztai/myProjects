import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import styleVars from '@/components/layouts/ClassicalLayout/variables.module.scss'
import { useRoute } from 'vue-router/composables'
import { findLast } from 'lodash'
import type { RouteRecord } from 'vue-router'

interface IStyles {
  commonPadding: string
  asideExpandWidth: string
  asideCollapseWidth: string
  headerHeight: string
}

export const useClassicalLayout = defineStore('classicalLayout', () => {
  const styles = styleVars as unknown as IStyles
  const route = useRoute()

  const asideDefaultIndex = findLast<RouteRecord>(route.matched, (item) => {
    return !!item.meta.asideMenu
  })?.path

  const asideCollapse = ref(false)

  const triggerAsideCollapse = (value: boolean) => {
    asideCollapse.value = value
  }

  const asideWidth = computed(() => !asideCollapse.value
    ? styles.asideExpandWidth
    : styles.asideCollapseWidth)

  const breadcrumbList = computed(() => route.matched.filter(item => item.meta.breadcrumb))

  return {
    asideCollapse,
    asideWidth,
    triggerAsideCollapse,
    asideDefaultIndex,
    breadcrumbList,
  }
})
