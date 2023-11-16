import '@/assets/styles/override.scss'
import 'element-ui/lib/theme-chalk/message-box.css'
import 'element-ui/lib/theme-chalk/message.css'
import 'element-ui/lib/theme-chalk/notification.css'

import Vue from 'vue'
import { PiniaVuePlugin, createPinia } from 'pinia'
import VueRouter from 'vue-router'

import { addAxiosUnhandledRejectionEvent } from '@/request/interceptor/response/error'

import router from './router'
import App from './App.vue'

Vue.use(PiniaVuePlugin)
Vue.use(VueRouter)
addAxiosUnhandledRejectionEvent()
new Vue({
  el: '#app',
  // @ts-expect-error
  router,
  pinia: createPinia(),
  render: (h) => h(App),
})
