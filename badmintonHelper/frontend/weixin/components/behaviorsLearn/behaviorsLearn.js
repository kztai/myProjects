var myBehavior = require('./myBehaviors.js')

Component({
  // 1、同名字段的覆盖和组合规则，参考：https://developers.weixin.qq.com/miniprogram/dev/framework/custom-component/behaviors.html
  behaviors: [myBehavior],

  lifetimes: {
    created() {
      this.sharedMethod()
    }
  }
})