// 导航学习：

Page({
  // 1、使用switchTab来跳转到指定tabbar页面：
  switchTab() {
    wx.switchTab({
      url: '/pages/baseLearn/baseLearn',
      success(res) { },
      fail(err) { },
      complete() { }
    })
  },

  // 2、使用navigateTo来跳转到非tabbar页面：
  navigateTo() {
    wx.navigateTo({
      url: '/pages/behaviorsLearn/behaviorsLearn',
      success(res) { },
      fail(err) { },
      complete() { }
    })
  },

  // 3、使用navigateBack实现回退功能：
  navigateBack() {
    wx.navigateBack({
      delta: '1',   //选填，默认为1
      success(res) { },
      fail(err) { },
      complete() { }
    })
  },

  // 3、编程式导航传参测试（只能导航到非tabBar页面时使用）：
  // 接收时到目标页面的onLoad钩子中获取
  navigateToPara() {
    wx.navigateTo({
      url: '/pages/behaviorsLearn/behaviorsLearn?name=kzt&age=111',
      success(res) { },
      fail(err) { },
      complete() { }
    })
  }
})