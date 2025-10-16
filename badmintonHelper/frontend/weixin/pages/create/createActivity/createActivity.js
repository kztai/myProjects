const { refundTicketMap, chargingMethodMap, activityFieldMap, activityDetailMap } = require("../../../utils/map");
const { addActivityDetail, modifyActivityDetail } = require("../../../api/activity/index");
const eventBus = require('../../../common/js/eventBus');

let isEdit = false;
const defaultForm = {
  [activityFieldMap.title]: null,
  [activityFieldMap.date]: '2024-01-01',
  [activityFieldMap.time]: '00:00',
  [activityFieldMap.addressData]: null,
  [activityFieldMap.fieldNum]: null,
  [activityFieldMap.maxApply]: null,
  [activityFieldMap.chargingMethod]: 0,
  [activityFieldMap.malePay]: null,
  [activityFieldMap.femalePay]: null,
  [activityFieldMap.refundTicket]: 0,
  [activityFieldMap.supplement]: null,
};

Page({
  data: {
    activityFieldMap,
    refundTicketList: Object.values(refundTicketMap),
    applyPayList: Object.values(chargingMethodMap),
    // applyPayList: ['多退少补', '报名时收取', '报名后按人收取', '报名后AA收款', '会员已包含', '免费参与', '自行付费'],
    formData: { ...defaultForm },
    requiredItems: [activityFieldMap.title, activityFieldMap.addressData, activityFieldMap.fieldNum, activityFieldMap.maxApply, activityFieldMap.malePay, activityFieldMap.femalePay],
  },

  onLoad(option) {
    if(option.activityId) isEdit = true;
    // 订阅 'sendActivityDetail' 事件，当需要修改活动内容时，会触发：
    eventBus.on('sendActivityDetail', (activityDetail) => {
      this.setData({
        formData: { ...activityDetail },
      })
    });
  },

  formSubmit(e) {
    // 必填项不能为空，找出未填的：
    const emptyItem = this.data.requiredItems.find((item) => !this.data.formData[item]);
    // 存在必填项未填：
    if (emptyItem) {
      wx.showToast({
        title: '请填写' + activityDetailMap[emptyItem],
        icon: 'none',
        duration: 3000
      });
    } else {
      // 调接口存储活动数据，后端返回活动id：
      const api = isEdit ? modifyActivityDetail : addActivityDetail;

      // 拼接上自己的信息：
      const appInstance = getApp();
      this.data.formData[activityFieldMap.organizerId] = appInstance.globalData.loginInfo && appInstance.globalData.loginInfo.userId
      this.data.formData[activityFieldMap.organizerName] = appInstance.globalData.loginInfo && appInstance.globalData.loginInfo.nickName
      this.data.formData[activityFieldMap.organizerAvatarUrl] = appInstance.globalData.loginInfo && appInstance.globalData.loginInfo.avatarUrl
      api(this.data.formData).then((arrActivityId) => {
        // 跳转到活动详情界面：
        wx.navigateTo({
          url: '/pages/activityDetail/activityDetail?activityId=' + arrActivityId[0],
        })
      }).catch((err) => {
        wx.showToast({
          title: '失败：' + err.errMsg,
          icon: 'none',
          duration: 3000
        });
      })
    }
  },

  formReset(e) {
    this.setData({
      formData: { ...defaultForm },
    })
  },

  formChange(e) {
    const itemName = e.currentTarget.dataset.itemname;
    const value = e.detail.value;
    this.data.formData[itemName] = value
    this.setData({
      formData: this.data.formData
    });
  },

  showMap() {
    // 打开地图，用户选择一个地址：
    wx.chooseLocation({
      latitude: this.data.formData[activityFieldMap.addressData] && this.data.formData[activityFieldMap.addressData].latitude,
      longitude: this.data.formData[activityFieldMap.addressData] && this.data.formData[activityFieldMap.addressData].longitude,
      success: (res) => {
        this.data.formData[activityFieldMap.addressData] = res
        this.setData({
          formData: this.data.formData
        });
      }
    })
  }
})