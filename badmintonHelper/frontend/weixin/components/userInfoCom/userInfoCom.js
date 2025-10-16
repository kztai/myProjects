const { themeColor, successColor } = require('../../common/js/color');

Component({

  /**
   * 组件的属性列表
   */
  properties: {
    userInfo: {
      type: Object,
      value: {},
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    themeColor,
    myId: null,
  },

  pageLifetimes: {
    // 页面显示时：
    show() {
      const appInstance = getApp();
      this.setData({
        myId: appInstance.globalData.loginInfo && appInstance.globalData.loginInfo.userId,  //设置登录者id
      });
    },
  },

  /**
   * 组件的方法列表
   */
  methods: {
    modifyMyInfo() {
      // 跳转到修改我的信息界面：
      wx.navigateTo({
        url: '/pages/me/modifyMyInfo/modifyMyInfo',
      })
    }
  }
})