const { wxLoginApi } = require("../../api/login/index");
Page({
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  },

  loginHandle() {
    // 先获取用户信息：
    wx.getUserProfile({
      desc: "用于用户登录小程序。",
      success: (res1) => {
        // 登录
        wx.login({
          success: res => {
            // 发送 res.code 到后台，服务端会调微信接口，换取 openId, sessionKey, unionId，服务端再对这些数据进一步处理，返回token给客户端：
            wxLoginApi({ code: res.code, userInfo: res1.userInfo }).then((res) => {
              //用户token存储在本地storage：
              wx.setStorageSync('token', res.token);
              wx.setStorageSync('loginInfo', res.userInfo);

              // 修改全局的登录状态：
              const appInstance = getApp();
              appInstance.globalData.isLogin = true
              appInstance.globalData.loginInfo = res.userInfo
              wx.navigateBack({
                delta: '1',   //选填，默认为1
                success() {
                  wx.showToast({
                    title: '授权登录成功！',
                    icon: 'success',
                    duration: 3000,
                  });
                }
              });
            }).catch((error) => {
              wx.navigateBack({
                delta: '1',   //选填，默认为1
                success() {
                  wx.showToast({
                    title: '登录失败！' + error.errMsg,
                    icon: 'none',
                    duration: 3000,
                  });
                }
              });
            })
          }
        })
      }
    })
  },
})