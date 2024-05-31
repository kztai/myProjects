const { getActivityDetail, delActivityDetail, applyActivity, cancelApplyActivity } = require("../../api/activity/index");
const { activityStatus, refundTicketMap, chargingMethodMap, applyStatusMap } = require("../../utils/map");
const { ActivityStatusEnum, ApplyStatusEnum } = require("../../utils/enum");
const { themeColor, successColor, infoColor } = require('../../common/js/color');
const eventBus = require('../../common/js/eventBus');

let activityId = null;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    infoColor,
    successColor,
    themeColor,
    ApplyStatusEnum,
    ActivityStatusEnum,
    chargingMethodMap,
    refundTicketMap,
    activityStatus,
    payType: '0',
    loginIsHidden: true,
    selectedProtocol: false,
    hidePayDialog: true,
    hideConfirmDialog: true,
    activityDetail: {},
    vipPay: {
      custom: true,
    },
    delActivityBox: {
      custom: false,
      title: '取消活动',
      content: '取消活动后不可恢复，是否继续？',
      confirmText: '确定',
      cancelText: '取消',
      showConfirmBtn: true,
      showCancelBtn: true,
    },
    myId: null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // this.setData({
    //   activityDetail: {
    //     activityId: 1,
    //     title: "ss羽毛球活动",
    //     date: "2024-02-12",
    //     time: "12:00",
    //     addressData: {
    //       latitude: 26.15021,
    //       longitude: 119.13139,
    //       name: "福州市闽侯县人民政府",
    //       address: "福建省福州市闽侯县交通路2号"
    //     },
    //     organizerId: '11',
    //     organizerName: 'kzt',
    //     organizerAvatarUrl: "../../image/废弃/jd618.png",
    //     maxApply: 12,
    //     curApply: 11,
    //     malePay: 24,
    //     femalePay: 20,
    //     alternate: 1,
    //     browse: 333,
    //     browsePerson: 101,
    //     fieldNum: "7, 8",
    //     status: 1,  //0已结束，1进行中, 2已取消
    //     refundTicket: 0,  // 退坑方式0,1,2,3,4
    //     chargingMethod: 0,  //0,1 付款方式
    //     supplement: '根据人数来6-8人转',
    //     applyStatus: 2,  //0已报名，1候补报名，2未报名
    //     avatarList: [
    //       { path: "../../image/废弃/jd618.png" },
    //       { path: "../../image/废弃/jd618.png" },
    //       { path: "../../image/废弃/jd618.png" },
    //       { path: "../../image/废弃/jd618.png" },
    //       { path: "../../image/废弃/jd618.png" },
    //     ],
    //   }
    // })

    //options可以接收到导航传递来的参数
    activityId = options.activityId
    this.init();
  },

  init() {
    const appInstance = getApp();
    getActivityDetail(activityId).then((res) => {
      this.setData({
        myId: appInstance.globalData.loginInfo.userId,  //设置登录者id
        activityDetail: res
      })
    }).catch((err) => {
      wx.showToast({
        title: '失败：' + err.errMsg,
        icon: 'none',
        duration: 3000
      });
    });
  },

  /**
   * 活动报名、候补报名
   */
  activityApply() {
    // 调接口进行报名，并tips提示报名成功：
    const appInstance = getApp();
    applyActivity({ userInfo: appInstance.globalData.loginInfo, activityId }).then((res) => {
      this.init()
      wx.showToast({
        title: '报名成功！',
        icon: 'success',
        duration: 3000
      });
    }).catch((err) => {
      wx.showToast({
        title: '失败：' + err.errMsg,
        icon: 'none',
        duration: 3000
      });
    })
  },

  // 退坑：
  activityRefundTicket() {
    // 调接口进行退坑，并tips提示退坑成功：
    const appInstance = getApp();
    cancelApplyActivity({ userInfo: appInstance.globalData.loginInfo, activityId }).then((res) => {
      this.init()
      wx.showToast({
        title: '退坑成功！',
        icon: 'success',
        duration: 3000
      });
    }).catch((err) => {
      wx.showToast({
        title: '失败：' + err.errMsg,
        icon: 'none',
        duration: 3000
      });
    })
  },

  // 跳转到首页、实力、帮助、分享页面：
  navigateChange(e) {
    const index = Number(e.currentTarget.dataset.index);
    if (index === 0) {
      wx.switchTab({
        url: '/pages/homepage/homepage',
      })
    } else {
      let url = "";
      switch (index) {
        case 1:
          url = '/pages/level/level'
          break;
        case 2:
          url = '/pages/level/level'
          break;
        case 3:
          url = '/pages/level/level'
          break;
      }
      wx.navigateTo({ url })
    }

  },

  openActivityAddress() {
    wx.openLocation(this.data.activityDetail.addressData)
  },

  // 显示浏览信息界面（需先开通VIP）：
  showBrowseInfo() {
    // 判断是否已开通VIP：
    this.setData({
      hidePayDialog: false
    });
    this.fadeIn()
  },

  payPriceChange(e) {
    this.setData({
      payType: e.detail.value
    })
  },

  protocolSelectChange(e) {
    if (e.detail.value.length > 0) {
      this.setData({
        selectedProtocol: true
      })
    } else {
      this.setData({
        selectedProtocol: false
      })
    }
  },

  payHandler() {
    if (this.data.selectedProtocol) {
      console.log(this.data.payType);
      // 判断是否已登录：
      const appInstance = getApp();
      if (appInstance.globalData.isLogin) {
        // 跳转到支付界面：
        this.vipPay()
      } else {
        // 先登录，跳转到登录界面：
        wx.navigateTo({
          url: '/pages/login/login',
        })
        // this.setData({
        //   loginIsHidden: false
        // });
      }
    } else {
      // 显示提示
      wx.showToast({
        title: '请先勾选付费特权协议',
        icon: 'none',
        duration: 3000
      });
    }
  },

  onMorePrivilege() {
    // 跳转到更多特权界面：
    wx.navigateTo({
      url: '/pages/vipPrivilege/vipPrivilege',
    })
  },
  onProtocolPage() {
    // 跳转到特权协议界面：
    wx.navigateTo({
      url: '/pages/vipProtocol/vipProtocol',
    })
  },

  // loginSuccess(e) {
  //   console.log(e.detail);
  //   // 开启支付界面：
  //   this.vipPay()
  // },

  vipPay() { },

  // loginError(e) {
  //   this.setData({
  //     loginIsHidden: true
  //   })
  // },

  toApplyList() {
    wx.navigateTo({
      url: '/pages/applyList/applyList',
    })
  },

  showUserInfo() {
    wx.navigateTo({
      url: '/pages/userInfo/userInfo?userId=' + this.data.activityDetail.organizerId,
    })
  },

  cancelActivityConfirm() {
    this.setData({
      hideConfirmDialog: false
    })
  },

  cancelActivity() {
    this.setData({
      activityDetail: { ...this.data.activityDetail, status: ActivityStatusEnum.Cancel }
    })
    // 调接口删除活动数据：
    delActivityDetail(activityId).then((res) => {
      this.setData({
        activityDetail: { ...this.data.activityDetail, status: ActivityStatusEnum.Cancel }
      })
    }).catch((err) => {
      wx.showToast({
        title: '失败：' + err.errMsg,
        icon: 'none',
        duration: 3000
      });
    })
  },

  modifyActivity() {
    wx.navigateTo({
      url: '/pages/create/createActivity/createActivity?activityId=' + activityId,
      success: () => {
        // 使用事件总线传递活动详情数据：
        eventBus.emit('sendActivityDetail', this.data.activityDetail);
      },
    });
  },
})