// 父子组件传值学习：

Component({
  properties: {
    count: Number   // 1、子接收父传递的值
  },

  data: {

  },

  methods: {
    addCount() {
      this.setData({
        count: this.properties.count+1
      });
      // 2、子向父传值：
      this.triggerEvent('syncCount', {count: this.properties.count})
    }
  }
})