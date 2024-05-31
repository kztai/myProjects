const { getUserInfo } = require("../../api/user/index");

Page({
  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {
      id: '11',
      name: 'kzt',
      realName: '',
      phone: '138xxxxxxxx',
      sex: '男',
      level: 2,
      avatar: '../../image/废弃/jd618.png',
      activityTotal: {
        singleSession: 12,
        singleWinRate: '57%',
        doubleSession: 12,
        doubleWinRate: '57%',
        singleRefereeSession: 123,
        doubleRefereeSession: 24,
      }
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const userId = options.userId
    console.log(userId);
    getUserInfo(userId).then((res) => {
      this.setData({
        // userInfo: res
        userInfo: {
          id: '11',
          name: 'kzt',
          realName: '',
          phone: '138xxxxxxxx',
          sex: '男',
          level: 2,
          avatar: '../../image/废弃/jd618.png',
          activityTotal: {
            singleSession: 12,
            singleWinRate: '57%',
            doubleSession: 12,
            doubleWinRate: '57%',
            singleRefereeSession: 123,
            doubleRefereeSession: 24,
          }
        }
      })
    }).catch((err) => {
      wx.showToast({
        title: '失败：' + err.errMsg,
        icon: 'none',
        duration: 3000
      });
    })
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

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})