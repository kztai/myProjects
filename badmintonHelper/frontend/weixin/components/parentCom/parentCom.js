// 父子组件传值学习：

Component({
  data: {
    count: 0
  },

  lifetimes: {
    created() {
      // 2、通过 selectComponent(id或者class选择器) 获取子组件的实例，访问子组件的属性和方法：
      const child = this.selectComponent('.my-child');
      child.setData({
        count: child.properties.count+1
      })
    }
  },

  methods: {
    syncCount(e) {
      // 1、父组件使用 e.detail 接收子组件传的值：
      console.log(e.detail);
      this.setData({
        count: e.detail.count
      })
    }
  }
})