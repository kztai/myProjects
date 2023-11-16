<template>
  <div class="knowledge-detail">
    this is knowledge detail page.
    <p>detail id: {{ id }}</p>
  </div>
</template>

<script lang="ts" setup>
import { useRoute } from 'vue-router/composables'

const route = useRoute()
const id = route.params.id as string

</script>

<style scoped lang="scss">
.knowledge-detail {
  // TODO:
}
</style>
