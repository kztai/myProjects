const { themeColor } = require('../common/js/color');

const createList = [
  { "text": "活动", "iconPath": "../image/create/活动.png", "index": 0 },
  { "text": "比赛", "iconPath": "../image/create/比赛.png", "index": 1 },
  { "text": "俱乐部", "iconPath": "../image/create/俱乐部.png", "index": 2 },
]

Component({
  data: {
    isHiddenMask: true,
    selected: 0,
    color: "#7A7E83",
    selectedColor: themeColor,
    createList,
    "list": [
      {
        "pagePath": "/pages/homepage/homepage",
        "text": "首页",
        "iconPath": "../image/homepage/homepage.png",
        "selectedIconPath": "../image/homepage/homepage_active.png"
      },
      {
        "pagePath": "/pages/homepage/homepage",
        "type": "wrap",
        "text": "发起",
        "iconPath": "../image/create/create.png",
        "selectedIconPath": "../image/create/create.png"
      },
      {
        "pagePath": "/pages/me/me",
        "text": "我的",
        "iconPath": "../image/me/me.png",
        "selectedIconPath": "../image/me/me_active.png"
      }
    ]
  },
  attached() {
  },
  methods: {
    switchTab(e) {
      const data = e.currentTarget.dataset

      if (data.type === 'wrap') {  // 不跳转，弹出遮罩层
        this.setData({
          isHiddenMask: false
        })
      } else { // 跳转
        // 通过 getApp 方法获取到全局唯一的 App 实例，然后修改tabbar索引：
        const appInstance = getApp()
        appInstance.globalData.changeTabBarIndex(data.index)
        const url = data.path
        wx.switchTab({ url })
      }
    },

    hiddenMask() {
      this.setData({
        isHiddenMask: true
      })
    },

    createHandle(e) {
      const data = e.currentTarget.dataset;
      switch (data.index) {
        case 0:
          this.createActivity();
          break;
        case 1:
          this.createRace();
          break;
        case 2:
          this.createClub();
          break;
      }
    },
    createActivity() {
      // 跳转到创建活动页面：
      wx.navigateTo({
        url: '/pages/create/createActivity/createActivity',
      })
    },
    createRace() {
      wx.showToast({
        title: '暂不支持创建比赛',
        icon: 'none',
        duration: 3000
      });
    },
    createClub() {
      wx.showToast({
        title: '暂不支持创建俱乐部',
        icon: 'none',
        duration: 3000
      });
    },
  }
})

module.exports = {
  createList
};