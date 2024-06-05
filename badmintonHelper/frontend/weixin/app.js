// app.js 项目的入口文件
// 整个小程序只有一个 App 实例，是全部页面共享的。

App({
  // 启动时钩子：
  onLaunch() {
    // 判断用户是否登录，或者登录是否过期（微信端）：
    wx.checkSession({
      success: () => { 
        this.globalData.loginInfo = wx.getStorageSync('loginInfo') || null;
      },
      fail: (err) => {
        // session_key 已经失效，需要重新执行登录流程
        this.globalData.loginInfo = null;
        wx.setStorageSync('token', '');
        wx.setStorageSync('loginInfo', '');
      }
    })
  },

  // 全局注册的数据与方法：
  // 页面或模块通过 getApp 方法获取到全局唯一的 App 实例，从而获取到globalData1:
  globalData: {
    loginInfo: null,
    tabBarIndex: 0,
    navigateBackParam: null,
    changeTabBarIndex(index) {
      this.tabBarIndex = index;
    }
  }
})
