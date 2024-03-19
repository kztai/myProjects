var myBehavior = require('./myBehaviors.js')

Page({
  behaviors: [myBehavior],

  /**
   * 生命周期函数--监听页面加载
   * options可以接收到导航传递来的参数
   */
  onLoad(options) {
    console.log(options);
    this.sharedMethod()
  },

})