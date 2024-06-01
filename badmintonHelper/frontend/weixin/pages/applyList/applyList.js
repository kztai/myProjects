const { themeColor } = require('../../common/js/color');
const { getApplyInfoList } = require("../../api/activity/index");
const { GenderEnum } = require("../../utils/enum");

let allApplyInfo = {};

Page({

  /**
   * 页面的初始数据
   */
  data: {
    GenderEnum,
    themeColor,
    myId: null,
    selected: 0,  //0已报名，1候补报名，2退坑
    isRefresh: false,
    applyTypeList: [
      {tab: '报名', applyNum: 0},
      {tab: '候补', applyNum: 0},
      {tab: '退坑', applyNum: 0},
    ],
    applyList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const appInstance = getApp();
    // 调用接口，获取报名者信息：
    getApplyInfoList(options.activityId).then((res) => {
      allApplyInfo = res
      this.setData({
        myId: appInstance.globalData.loginInfo.userId,  //设置登录者id
        applyList: allApplyInfo.applied,
        applyTypeList: [
          {tab: '报名', applyNum: allApplyInfo.applied.length},
          {tab: '候补', applyNum: allApplyInfo.alternatedApplied.length},
          {tab: '退坑', applyNum: allApplyInfo.notApplied.length},
        ]
      });
      // res = {
      //   applied: [
      //     {
      //       userId: 111,
      //       name: 'kztttt'
      //     },
      //   ],
      //   alternatedApplied: [
      //     {
      //       userId: 111,
      //       name: 'kztttt'
      //     },
      //   ],
      //   notApplied: [
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
      url: '/pages/userInfo/userInfo?userId=' + param.userid,
      success(res) { },
      fail(err) { },
      complete() { }
    })
  },


  changeApplyType(e) {
    const data = e.currentTarget.dataset;
    // 切换tab高亮，同时切换下方列表数据：
    switch (data.index) {
      case 0:
        this.setData({
          selected: data.index,
          applyList: allApplyInfo.applied
        });
        break;
      case 1:
        this.setData({
          selected: data.index,
          applyList: allApplyInfo.alternatedApplied
        });
        break;
      case 2:
        this.setData({
          selected: data.index,
          applyList: allApplyInfo.notApplied
        });
        break;
    }
  },
})