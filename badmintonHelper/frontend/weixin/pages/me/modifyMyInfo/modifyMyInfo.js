const { genderMap, levelMap, userFieldMap } = require("../../../utils/map");
const { getAllInfo, modifyAllInfo } = require("../../../api/user/index");

Page({
  data: {
    levelList: Object.values(levelMap),
    genderList: Object.values(genderMap),
    userFieldMap,
    formData: {},
    hideAvatarWrap: true
  },

  onLoad() {
    const appInstance = getApp();
    const userId = appInstance.globalData.loginInfo.userId;
    getAllInfo(userId).then((userInfo) => {
      this.setData({
        formData: userInfo
      })
    }).catch((err) => {
      wx.showToast({
        title: '失败：' + err.errMsg,
        icon: 'none',
        duration: 3000
      });
    })
  },

  formSubmit(e) {
    // 存在必填项未填：
    if (!this.data.formData[userFieldMap.nickName]) {
      wx.showToast({
        title: '请填写昵称',
        icon: 'none',
        duration: 3000
      });
    } else {
      modifyAllInfo(this.data.formData).then(() => {
        // 修改本地以及storage的用户数据：
        const appInstance = getApp();
        appInstance.globalData.loginInfo = this.data.formData;
        wx.setStorageSync('loginInfo', this.data.formData);

        // 跳转到上一页：
        // 设置返回上一页的参数：
        const pages = getCurrentPages()
        const prevPage = pages[pages.length - 2] // 上一页
        // 调用上一个页面的setData 方法，将数据存储
        prevPage.setData({
          navigateBackParam: 'success'
        });
        wx.navigateBack({
          delta: '1',   //选填，默认为1
          success() {
            wx.showToast({
              title: '修改成功！',
              icon: 'success',
              duration: 3000,
            });
          }
        });
      }).catch((err) => {
        wx.showToast({
          title: '失败：' + err.errMsg,
          icon: 'none',
          duration: 3000
        });
      })
    }
  },

  formChange(e) {
    const itemName = e.currentTarget.dataset.itemname;

    if (itemName === userFieldMap.avatarUrl) {
      // 显示遮罩：
      this.setData({
        hideAvatarWrap: false
      })
      return;
    }

    const value = e.detail.value;
    this.data.formData[itemName] = value
    this.setData({
      formData: this.data.formData
    });
  },

  changeTypeClick(e) {
    const index = e.currentTarget.dataset.index;
    switch (index) {
      case '1':
        this.useWxAvatar()
        break;
      case '2':
        this.useCustomAvatar('album')
        break;
      case '3':
        this.useCustomAvatar('camera')
        break;
      case '4':
        break;
    };

    this.setData({
      hideAvatarWrap: true
    })
  },

  useWxAvatar() {
    const appInstance = getApp();
    const avatarUrl = appInstance.globalData.loginInfo.avatarUrl;
    this.data.formData[userFieldMap.avatarUrl] = avatarUrl;
    this.setData({
      formData: this.data.formData
    });
  },

  useCustomAvatar(sourceType) {
    wx.chooseMedia({
      count: 1,  //最多可以选择的文件个数
      mediaType: ['image'],  //image：只能拍摄图片或从相册选择图片、video：只能拍摄视频或从相册选择视频、mix：可同时选择图片和视频
      sourceType: [sourceType],  //来源。album：从相册选择、 camera：使用相机拍摄
      sizeType: ['compressed'], //是否压缩所选文件。 'original', 'compressed'
      success: (res) => {
        this.data.formData[userFieldMap.avatarUrl] = res.tempFiles[0].tempFilePath;
        this.setData({
          formData: this.data.formData
        });
      }
    })
  }

})