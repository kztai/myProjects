const { wxLogout } = require("../../api/login/index");
const { getUserInfo } = require("../../api/user/index");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    isLogin: false,
    navigateBackParam: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    this.init();
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

    // 监听上一页返回到当前页后，需要刷新登录信息：
    const pages = getCurrentPages()
    const currPage = pages[pages.length - 1]  // 当前页
    console.log(currPage.data)  // data中会含有 navigateBackParam
    if (currPage.data.navigateBackParam === 'success') {
      this.setData({
        navigateBackParam: null
      });
      this.init();
    }
  },

  init(callback) {
    const appInstance = getApp();
    const isLogin = !!appInstance.globalData.loginInfo;
    if (isLogin) {
      const userId = appInstance.globalData.loginInfo.userId;
      this.setData({
        isLogin: true
      });
      getUserInfo(userId).then((res) => {
        this.setData({
          userInfo: res
        });
      }).catch((err) => {
        wx.showToast({
          title: '获取登录信息失败：' + err.errMsg,
          icon: 'none',
          duration: 3000
        });
      }).finally(() => {
        callback && callback()
      })
    } else {
      this.setData({
        isLogin: false,
        userInfo: {
          userId: '',
          nickName: '待登录',
          realName: '',
          phone: '',
          gender: 0,
          level: null,
          avatarUrl: '',
          singleSession: 0,
          singleWinRate: '0%',
          doubleSession: 0,
          doubleWinRate: '0%',
          singleRefereeSession: 0,
          doubleRefereeSession: 0,
        }
      });
      callback && callback()
    }
  },

  login() {
    wx.navigateTo({ url: '/pages/login/login' })
  },

  logout() {
    wxLogout().then(() => {
      const appInstance = getApp();
      appInstance.globalData.loginInfo = null;
      wx.setStorageSync('token', '');
      wx.setStorageSync('loginInfo', '');
      wx.showToast({
        title: '登出成功！',
        icon: 'none',
        duration: 3000
      });
      this.init();
    }).catch((err) => {
      wx.showToast({
        title: err.errMsg,
        icon: 'none',
        duration: 3000
      });
    })
  },

  itemClick(e) {
    const index = Number(e.currentTarget.dataset.index);
    let url = "";
    switch (index) {
      case 1:
        url = '/pages/myActivity/myActivity'
        break;
      case 2:
        url = '/pages/level/level'
        break;
      case 3:
        url = '/pages/guide/guide'
        break;
      case 4:
        url = '/pages/level/level'
        break;
    }
    wx.navigateTo({ url })
  },

   /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {
    this.init(() => {
      // 下拉的loading状态需要手动关闭：
      wx.stopPullDownRefresh();
    });
  }
})