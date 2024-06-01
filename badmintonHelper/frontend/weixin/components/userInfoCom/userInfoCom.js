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
    myId: null
  },

  lifetimes: {
    ready() {
      const appInstance = getApp();
      this.setData({
        myId: appInstance.globalData.loginInfo.userId,  //设置登录者id
      });
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {

  }
})