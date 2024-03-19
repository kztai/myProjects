// app.js 项目的入口文件
// 整个小程序只有一个 App 实例，是全部页面共享的。

App({
  // 启动时钩子：
  onLaunch() {
    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
  },

  // 显示时钩子（启动或者从后台进入前台）：
  onShow (options) {
    // Do something when show.
  },

   // 隐藏时钩子（从前台进入后台）：
  onHide () {
    // Do something when hide.
  },

  // 页面加载错误时钩子：
  onError (msg) {
    console.log(msg)
  },

  // 全局注册的数据与方法：
  globalData: {
    userInfo: {name: 'kzt', id: 1},
    func(data) {
      console.log(data);
    }
  }
})
