const { createList } = require('../../custom-tab-bar/index');
const { themeColor } =  require('../../common/js/color');

Page({
  /**
   * 页面的初始数据
   */
  data: {
    badmintonList: createList,
    selectedColor: themeColor,
    selected: 0
  },

  onShow() {
    // 如需实现 tab 选中态，要在当前页面下，通过 getTabBar 接口获取组件实例，并调用 setData 更新选中态。
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
       // 通过 getApp 方法获取到全局唯一的 App 实例，然后获取tabbar索引：
       const appInstance = getApp()
       const index = appInstance.globalData.tabBarIndex
       this.getTabBar().setData({
         selected: index
       })
    }
  },

  changeBadmintonType(e) {
    const data = e.currentTarget.dataset
    console.log(data.index)

    this.setData({
      selected: data.index
    })
  },

})