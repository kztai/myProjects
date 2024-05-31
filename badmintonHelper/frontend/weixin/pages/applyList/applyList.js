const { themeColor } = require('../../common/js/color');
const { getApplyInfo } = require("../../api/activity/index");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    themeColor,
    applyNum: 4,
    selected: 0,
    isRefresh: false,
    applyTypeList: ['报名', '候补', '退坑'],
    allApplyInfo: {},
    applyList: [
      {
        userId: 111,
        name: 'kztttt',
        avatar: '../../image/废弃/jd618.png',
        applyTime: '03-09 12:23',
        sex: '男',
        level: 0,  // -1~10 ：-1表示未自评
      },
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // 调用接口，获取报名者信息：
    getApplyInfo().then((res) => {
      this.setData({
        allApplyInfo: res
      });
      // res = {
      //   entered: [
      //     {
      //       userId: 111,
      //       name: 'kztttt'
      //     },
      //   ],
      //   alternate: [
      //     {
      //       userId: 111,
      //       name: 'kztttt'
      //     },
      //   ],
      //   exited: [
      //     {
      //       userId: 111,
      //       name: 'kztttt'
      //     },
      //   ]
      // }
    }).catch((err) => {
      wx.showToast({
        title: '获取报名信息失败：' + err.errMsg,
        icon: 'none',
        duration: 3000
      });
    })
  },


  refreshActivityList() {
    // scroll-view组件关闭下拉刷新状态的方式：
    this.setData({
      isRefresh: true
    })
    setTimeout(() => {
      this.setData({
        isRefresh: false
      })
    }, 1000)
  },

  // 结束下拉刷新时触发：
  stopRefreshActivityList() {
    console.log(222);
  },

  showUserInfo(e) {
    const param = e.currentTarget.dataset;
    wx.navigateTo({
      url: '/pages/userInfo/userInfo?userId=' + param.userId,
      success(res) { },
      fail(err) { },
      complete() { }
    })
  },


  changeApplyType(e) {
    const data = e.currentTarget.dataset
    this.setData({
      selected: data.index
    });
    // 同时切换下方列表数据：
  },
})