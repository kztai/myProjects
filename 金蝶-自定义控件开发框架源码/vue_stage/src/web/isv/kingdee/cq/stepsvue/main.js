// 在main.js上通过import引入Vue库和自己写的Vue组件库
import Vue from 'vue';
import Steps from './components/steps.vue';
import eventBus from '../../../../../../util/eventBus'

/**
 * Vue实例在setHtml方法中声明，初始化执行init的时候就能够创建
 * 声明Vue实例对象时，在其挂载完毕的生命周期里声明一个订阅，用于订阅update方法中发布的消息，从而更新实例数据
 * update方法中，发布一个消息，让Vue实例接收消息，更新数据
 * 在Vue实例的destroyed中，结束订阅
 * 注意loadFile中index.css的引入路径，因为webpack打包后将其放在了css文件夹里，所以路径是./css/index.css
 */
(function (KDApi) {
  function MyComponent (model) {
    this._setModel(model)
  }

  MyComponent.prototype = {
    _setModel: function (model) {
      this.model = model
    },
    init: function (props) {
      console.log('-----init', this.model.style, props)
      setHtml(this.model, props)
    },
    update: function (props) {
      console.log('-----update', this.model, props)
      eventBus.pub(this.model, 'update', props)
    },
    destoryed: function () {
      console.log('-----destoryed', this.model)
    }
  }

  const setHtml = (model, props) => {
    KDApi.loadFile('./css/index.css', model, () => {
      const { invoke, dom } = model
      const { data } = props
      const activeI = data ? data.avtiveIndex : -1
      new Vue({
        el: dom,
        template: '<Steps :invoke="invoke" :activeInd="activeIndex" :model="model" :getLangMsg="getLangMsg" />',
        components: {
          Steps
        },
        data: {
          activeIndex: activeI,
          model: model
        },
        mounted () {
          const self = this
          this.updateSub = eventBus.sub(model, 'update', (props) => {
            const { data } = props
            self.activeIndex = data ? data.activeIndex : -1
          })
        },
        destroyed () {
          eventBus.unsub(this.updateSub)
        },
        methods: {
          invoke: (eventName, args) => {
            invoke(eventName, args)
          },
          getLangMsg: (key) => {
            return KDApi.getLangMsg(model, key)
          }
        }
      })
    })
  }

  // 注册自定义组件
  KDApi.register('stepsVue', MyComponent, {
    isMulLang: true
})
})(window.KDApi)
