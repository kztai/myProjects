const { wxLogout } = require("../../api/login/index");

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    // 如需实现 tab 选中态，要在当前页面下，通过 getTabBar 接口获取组件实例，并调用 setData 更新选中态。
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      // 通过 getApp 方法获取到全局唯一的 App 实例，然后获取tabbar索引：
      const appInstance = getApp()
      const index = appInstance.globalData.tabBarIndex
      this.getTabBar().setData({
        selected: index
      })
    }
  },

  logout() {
    wxLogout().then(() => {
      const appInstance = getApp();
      appInstance.globalData.loginInfo = {};
      appInstance.globalData.isLogin = false;
      wx.setStorageSync('token', '');
      wx.setStorageSync('loginInfo', '');
      wx.showToast({
        title: '登出成功！',
        icon: 'none',
        duration: 3000
      });
    }).catch((err) => {
      wx.showToast({
        title: err.errMsg,
        icon: 'none',
        duration: 3000
      });
    })
  }
})